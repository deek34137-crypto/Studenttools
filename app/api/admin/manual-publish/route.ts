// app/api/admin/manual-publish/route.ts
import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import { isAuthenticatedAdmin } from '@/lib/admin/auth'
import { detectDuplicates, computeContentHash } from '@/lib/quality/topicDetector'
import { saveArticle } from '@/lib/db/articles'
import { updateTopicStatus, getNextReadyTopic, getTopicQueueStats } from '@/lib/sheets/topicQueue'
import { getToolByRoute } from '@/data/tools'
import { ArticleRecord } from '@/lib/db/types'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  if (!isAuthenticatedAdmin()) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const {
      topicId,
      title,
      slug,
      excerpt,
      category,
      primaryKeyword,
      secondaryKeywords,
      content,
      relatedToolRoute,
      faq,
      author,
    } = body

    // 1. Basic validation
    if (!title || !slug || !content || !category || !primaryKeyword) {
      return NextResponse.json(
        { error: 'Missing required fields: Title, Slug, Category, Primary Keyword, and Content are required.' },
        { status: 400 }
      )
    }

    const cleanSlug = slug
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')

    if (!cleanSlug) {
      return NextResponse.json({ error: 'Invalid slug. Must contain alphanumeric characters.' }, { status: 400 })
    }

    // 2. Word count and structure check
    const wordCount = content.trim().split(/\s+/).length
    if (wordCount < 300) {
      return NextResponse.json(
        { error: `Article is too short (${wordCount} words). Minimum required is 300 words for quality indexing.` },
        { status: 400 }
      )
    }

    const h2Count = (content.match(/^##\s+.+/gm) || []).length
    if (h2Count < 2) {
      return NextResponse.json(
        { error: `Article must contain at least 2 major H2 headings ('## Heading'). Found ${h2Count}.` },
        { status: 400 }
      )
    }

    // 3. Related tool check
    let targetTool = getToolByRoute(relatedToolRoute)
    if (!targetTool && relatedToolRoute) {
      const normalizedRoute = relatedToolRoute.startsWith('/') ? relatedToolRoute : `/${relatedToolRoute}`
      targetTool = getToolByRoute(normalizedRoute)
    }

    // 4. Topic & Plagiarism Duplication Detection
    const duplicateCheck = await detectDuplicates({
      title,
      slug: cleanSlug,
      primaryKeyword,
      content,
    })

    if (duplicateCheck.isDuplicate) {
      return NextResponse.json(
        {
          error: duplicateCheck.reason || 'Duplicate topic or content detected.',
          duplicateCheck,
        },
        { status: 409 }
      )
    }

    // 5. Generate Article Record
    const contentHash = computeContentHash(title, content)
    const publishedAt = new Date().toISOString()
    const articleUrl = `https://studenttools.cyou/blog/${cleanSlug}`

    const secKeywordsList = Array.isArray(secondaryKeywords)
      ? secondaryKeywords
      : typeof secondaryKeywords === 'string'
      ? secondaryKeywords.split(',').map((s: string) => s.trim()).filter(Boolean)
      : []

    const formattedFaq = Array.isArray(faq)
      ? faq.filter((f: any) => f && f.question && f.answer)
      : []

    const articleRecord: ArticleRecord = {
      id: `art_${(topicId || 'manual').toLowerCase()}_${Date.now()}`,
      topic_id: topicId || 'MANUAL',
      slug: cleanSlug,
      title: title.trim(),
      excerpt: excerpt?.trim() || content.slice(0, 160).replace(/[#*`]/g, '').trim() + '...',
      content: content.trim(),
      category: category.trim(),
      topic_cluster: 'Educational Guides',
      article_type: 'Comprehensive Guide',
      search_intent: 'Informational',
      primary_keyword: primaryKeyword.trim(),
      secondary_keywords: secKeywordsList,
      meta_title: title.length <= 60 ? `${title} | StudentTools` : title,
      meta_description: excerpt?.trim() || content.slice(0, 150).replace(/[#*`]/g, '').trim(),
      created_at: publishedAt,
      published_at: publishedAt,
      updated_at: publishedAt,
      status: 'PUBLISHED',
      content_hash: contentHash,
      reading_time_minutes: Math.max(1, Math.ceil(wordCount / 200)),
      related_tools: targetTool
        ? [
            {
              name: targetTool.title,
              route: targetTool.route,
              description: targetTool.description,
            },
          ]
        : [],
      faq: formattedFaq,
    }

    // 6. Save to dynamic storage & Supabase
    await saveArticle(articleRecord)

    // 7. Permanently persist into data/publishedArticles.json on disk
    try {
      const publishedArticlesPath = path.resolve(process.cwd(), 'data/publishedArticles.json')
      let existingList: ArticleRecord[] = []
      if (fs.existsSync(publishedArticlesPath)) {
        existingList = JSON.parse(fs.readFileSync(publishedArticlesPath, 'utf-8'))
      }
      const existingIdx = existingList.findIndex((a) => a.slug === cleanSlug)
      if (existingIdx >= 0) {
        existingList[existingIdx] = articleRecord
      } else {
        existingList.push(articleRecord)
      }
      fs.writeFileSync(publishedArticlesPath, JSON.stringify(existingList, null, 2), 'utf-8')
    } catch (diskErr) {
      console.warn('Could not write to local publishedArticles.json (serverless read-only):', diskErr)
    }

    // 8. Update Topic Queue Status to PUBLISHED
    if (topicId && topicId !== 'MANUAL') {
      await updateTopicStatus(topicId, {
        status: 'PUBLISHED',
        published_url: articleUrl,
        published_at: publishedAt,
        content_hash: contentHash,
      })

      // Also persist status update into data/topicsDatabase.json on disk
      try {
        const topicsDbPath = path.resolve(process.cwd(), 'data/topicsDatabase.json')
        if (fs.existsSync(topicsDbPath)) {
          const allTopics = JSON.parse(fs.readFileSync(topicsDbPath, 'utf-8'))
          const tIdx = allTopics.findIndex((t: any) => t.topic_id === topicId)
          if (tIdx >= 0) {
            allTopics[tIdx].status = 'PUBLISHED'
            allTopics[tIdx].published_url = articleUrl
            allTopics[tIdx].published_at = publishedAt
            allTopics[tIdx].content_hash = contentHash
            fs.writeFileSync(topicsDbPath, JSON.stringify(allTopics, null, 2), 'utf-8')
          }
        }
      } catch (topicsErr) {
        console.warn('Could not update topicsDatabase.json on disk:', topicsErr)
      }
    }

    // 9. Fetch next topic in line and updated queue statistics
    const nextTopic = await getNextReadyTopic()
    const stats = await getTopicQueueStats()

    return NextResponse.json({
      success: true,
      message: `Article '${title}' successfully published!`,
      articleUrl,
      slug: cleanSlug,
      nextTopic,
      stats,
    })
  } catch (err: any) {
    console.error('Error in manual-publish API:', err)
    return NextResponse.json(
      { error: err.message || 'Internal server error while publishing article.' },
      { status: 500 }
    )
  }
}
