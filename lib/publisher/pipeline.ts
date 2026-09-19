// lib/publisher/pipeline.ts
import { getNextReadyTopic, lockTopicForProcessing, updateTopicStatus } from '../sheets/topicQueue'
import { generateArticleWithGemini } from '../gemini/client'
import { runQualityGate } from '../quality/validator'
import {
  saveArticle,
  logGeneration,
  getTodayPublishCount,
  incrementTodayPublishCount,
} from '../db/articles'
import { ArticleRecord, TopicRow } from '../db/types'

export interface PublishResult {
  success: boolean
  action: 'PUBLISHED' | 'REVIEW_REQUIRED' | 'FAILED' | 'SKIPPED'
  topicId?: string
  articleSlug?: string
  articleUrl?: string
  reason?: string
  errors?: string[]
  warnings?: string[]
  dryRun?: boolean
}

/**
 * Gets the current date string in the target operational timezone (Asia/Kolkata by default).
 */
export function getOperationalDateKey(): string {
  const timezone = process.env.BLOG_TIMEZONE || 'Asia/Kolkata'
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: timezone,
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    })
    return formatter.format(new Date()) // e.g. "2026-09-19"
  } catch (err) {
    return new Date().toISOString().split('T')[0]
  }
}

/**
 * Main Editorial Publishing Pipeline:
 * Executes 1 topic -> Gemini generation -> Quality Gate -> Supabase -> Google Sheet.
 */
export async function executeDailyPublishPipeline(options?: {
  dryRun?: boolean
  forceTopicId?: string
  allowManualOverride?: boolean
}): Promise<PublishResult> {
  const isDryRun = Boolean(options?.dryRun)
  const isManual = Boolean(options?.allowManualOverride)
  const dateKey = getOperationalDateKey()
  const dailyLimit = parseInt(process.env.BLOG_DAILY_LIMIT || '1', 10)

  // 1. Check Autopublish toggle (unless running manual test/dryRun)
  const autopublishEnabled = process.env.BLOG_AUTOPUBLISH_ENABLED === 'true'
  if (!autopublishEnabled && !isManual && !isDryRun) {
    return {
      success: true,
      action: 'SKIPPED',
      reason: 'BLOG_AUTOPUBLISH_ENABLED is set to false. Pipeline is in safe standby mode.',
    }
  }

  // 2. Daily Limit & Idempotency Check
  const todayCount = await getTodayPublishCount(dateKey)
  if (todayCount >= dailyLimit && !isManual && !isDryRun) {
    return {
      success: true,
      action: 'SKIPPED',
      reason: `Daily publication quota of ${dailyLimit} article(s) already fulfilled for date ${dateKey}.`,
    }
  }

  // 3. Select Topic
  let topic: TopicRow | null = null
  if (options?.forceTopicId) {
    const { getAllTopics } = await import('../sheets/topicQueue')
    const all = await getAllTopics()
    topic = all.find((t) => t.topic_id === options.forceTopicId) || null
  } else {
    topic = await getNextReadyTopic()
  }

  if (!topic) {
    return {
      success: true,
      action: 'SKIPPED',
      reason: 'No READY topics found in the queue.',
    }
  }

  const topicId = topic.topic_id

  // 4. Acquire Lock
  if (!isDryRun) {
    await lockTopicForProcessing(topicId)
  }

  // 5. Generate with Gemini
  const genResult = await generateArticleWithGemini(topic)

  if (!genResult.success) {
    const errorMsg = genResult.error || 'Gemini generation failure'
    if (!isDryRun) {
      await updateTopicStatus(topicId, {
        status: 'FAILED',
        error: errorMsg.slice(0, 300),
      })
      await logGeneration({
        id: crypto.randomUUID ? crypto.randomUUID() : `log_${Date.now()}`,
        topic_id: topicId,
        model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        result: 'API_ERROR',
        error: errorMsg,
        created_at: new Date().toISOString(),
      })
    }

    return {
      success: false,
      action: 'FAILED',
      topicId,
      reason: errorMsg,
      errors: [errorMsg],
      dryRun: isDryRun,
    }
  }

  const articleData = genResult.data

  // 6. Automated Content Quality Gate
  const quality = await runQualityGate(articleData, topic.related_tool_slug)

  if (!quality.passed) {
    const qualityErrors = quality.errors.join('; ')
    if (!isDryRun) {
      // Mark as REVIEW_REQUIRED for editorial/similarity issues
      await updateTopicStatus(topicId, {
        status: quality.status,
        error: qualityErrors.slice(0, 300),
        content_hash: quality.contentHash,
      })

      await logGeneration({
        id: crypto.randomUUID ? crypto.randomUUID() : `log_${Date.now()}`,
        topic_id: topicId,
        model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
        result: 'QUALITY_FAILED',
        validation_result: {
          errors: quality.errors,
          warnings: quality.warnings,
          similarityScore: quality.similarityScore,
          similarArticleSlug: quality.similarArticleSlug,
        },
        error: qualityErrors,
        created_at: new Date().toISOString(),
      })
    }

    return {
      success: false,
      action: quality.status,
      topicId,
      articleSlug: articleData.slug,
      reason: `Quality Gate failed: ${qualityErrors}`,
      errors: quality.errors,
      warnings: quality.warnings,
      dryRun: isDryRun,
    }
  }

  // 7. Assemble Complete Article Record
  const publishedAt = new Date().toISOString()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://studenttools.cyou'
  const publishedUrl = `${siteUrl}/blog/${articleData.slug}`

  // Estimate reading time (~200 words/min)
  const wordCount = articleData.content.split(/\s+/).length
  const readingTime = Math.max(2, Math.ceil(wordCount / 200))

  const articleRecord: ArticleRecord = {
    id: crypto.randomUUID ? crypto.randomUUID() : `art_${Date.now()}`,
    topic_id: topicId,
    title: articleData.title,
    slug: articleData.slug,
    excerpt: articleData.excerpt,
    content: articleData.content,
    category: articleData.category,
    topic_cluster: articleData.topicCluster,
    article_type: articleData.articleType,
    search_intent: topic.search_intent || 'Educational',
    primary_keyword: articleData.primaryKeyword,
    secondary_keywords: articleData.secondaryKeywords,
    meta_title: articleData.metaTitle,
    meta_description: articleData.metaDescription,
    status: 'PUBLISHED',
    related_tools: articleData.relatedTools,
    related_articles: articleData.relatedArticles,
    faq: articleData.faq,
    factual_claims: articleData.factualClaims,
    verification_notes: articleData.verificationNotes,
    content_hash: quality.contentHash,
    reading_time_minutes: readingTime,
    created_at: publishedAt,
    updated_at: publishedAt,
    published_at: publishedAt,
  }

  // If Dry-Run, return success without saving or updating Sheet
  if (isDryRun) {
    return {
      success: true,
      action: 'PUBLISHED',
      topicId,
      articleSlug: articleData.slug,
      articleUrl: publishedUrl,
      warnings: quality.warnings,
      dryRun: true,
    }
  }

  // 8. Persist to Database (Supabase/PostgreSQL)
  const saved = await saveArticle(articleRecord)
  if (!saved) {
    await updateTopicStatus(topicId, {
      status: 'FAILED',
      error: 'Database save failed.',
    })
    return {
      success: false,
      action: 'FAILED',
      topicId,
      reason: 'Failed to persist article in database.',
    }
  }

  // 9. Update Google Sheet
  await updateTopicStatus(topicId, {
    status: 'PUBLISHED',
    published_url: publishedUrl,
    published_at: publishedAt,
    content_hash: quality.contentHash,
    error: null,
  })

  // 10. Increment daily quota
  await incrementTodayPublishCount(dateKey, `cron_${topicId}`)

  // 11. Log Success
  await logGeneration({
    id: crypto.randomUUID ? crypto.randomUUID() : `log_${Date.now()}`,
    topic_id: topicId,
    model: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
    result: 'SUCCESS',
    publication_result: publishedUrl,
    created_at: publishedAt,
  })

  return {
    success: true,
    action: 'PUBLISHED',
    topicId,
    articleSlug: articleData.slug,
    articleUrl: publishedUrl,
    warnings: quality.warnings,
  }
}
