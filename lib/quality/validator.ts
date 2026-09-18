// lib/quality/validator.ts
import crypto from 'crypto'
import { ArticleGeneratedData } from '../gemini/client'
import { getAllPublishedArticlesForSimilarity } from '../db/articles'
import { getToolByRoute } from '../../data/tools'

export interface QualityGateResult {
  passed: boolean
  status: 'PUBLISHED' | 'REVIEW_REQUIRED' | 'FAILED'
  errors: string[]
  warnings: string[]
  contentHash: string
  similarityScore?: number
  similarArticleSlug?: string
}

// Banned AI phrases and placeholder patterns
const BANNED_PATTERNS: RegExp[] = [
  /\bas an ai\b/i,
  /\bas a language model\b/i,
  /\bi cannot provide\b/i,
  /\b\[insert\b/i,
  /\b\[link\b/i,
  /\btodo\b/i,
  /\blorem ipsum\b/i,
  /in conclusion,\s+it is crucial/i,
  /in conclusion,\s+it is important/i,
  /<script\b/i,
  /<iframe\b/i,
]

/**
 * Computes deterministic SHA-256 hash of normalized content.
 */
export function computeContentHash(title: string, content: string): string {
  const normalized = `${title.toLowerCase().trim()} ${content.toLowerCase().replace(/\s+/g, ' ').trim()}`
  return crypto.createHash('sha256').update(normalized).digest('hex')
}

/**
 * Generates n-gram shingles from a string for Jaccard similarity.
 */
function createShingles(text: string, n: number = 3): Set<string> {
  const cleaned = text.toLowerCase().replace(/[^a-z0-9\s]/g, ' ').replace(/\s+/g, ' ').trim()
  const words = cleaned.split(' ')
  const shingles = new Set<string>()

  if (words.length < n) {
    shingles.add(cleaned)
    return shingles
  }

  for (let i = 0; i <= words.length - n; i++) {
    shingles.add(words.slice(i, i + n).join(' '))
  }
  return shingles
}

/**
 * Calculates Jaccard similarity coefficient between two sets: |A ∩ B| / |A ∪ B|.
 */
export function calculateJaccardSimilarity(textA: string, textB: string, n: number = 3): number {
  const setA = createShingles(textA, n)
  const setB = createShingles(textB, n)

  if (setA.size === 0 && setB.size === 0) return 1
  if (setA.size === 0 || setB.size === 0) return 0

  let intersectionCount = 0
  setA.forEach((item) => {
    if (setB.has(item)) {
      intersectionCount++
    }
  })

  const unionCount = setA.size + setB.size - intersectionCount
  return unionCount === 0 ? 0 : intersectionCount / unionCount
}

/**
 * Automated Content Quality Gate:
 * Evaluates Content, SEO, Internal Links, AI safety, Content Hash, and Shingle/Jaccard Similarity.
 */
export async function runQualityGate(
  article: ArticleGeneratedData,
  expectedToolSlug?: string
): Promise<QualityGateResult> {
  const errors: string[] = []
  const warnings: string[] = []
  const contentHash = computeContentHash(article.title, article.content)

  // 1. Content Checks
  const wordCount = article.content.trim().split(/\s+/).length
  if (wordCount < 400) {
    errors.push(`Content is too short (${wordCount} words). Minimum required is 400 words.`)
  } else if (wordCount > 3500) {
    warnings.push(`Content is quite long (${wordCount} words). Verify usefulness.`)
  }

  // Header structure (minimum 3 H2 sections)
  const h2Count = (article.content.match(/^##\s+.+/gm) || []).length
  if (h2Count < 3) {
    errors.push(`Article must contain at least 3 major sections (H2 '## '). Found ${h2Count}.`)
  }

  // Check for repeated paragraphs
  const paragraphs = article.content
    .split(/\n\s*\n/)
    .map((p) => p.trim().toLowerCase())
    .filter((p) => p.length > 80)
  const paraSet = new Set<string>()
  for (const p of paragraphs) {
    if (paraSet.has(p)) {
      errors.push('Identified duplicate or repeated paragraph in generated content.')
      break
    }
    paraSet.add(p)
  }

  // 2. AI Ban & Safety Checks
  const combinedText = `${article.title}\n${article.excerpt}\n${article.content}`
  for (const pattern of BANNED_PATTERNS) {
    if (pattern.test(combinedText)) {
      errors.push(`Content contains prohibited AI or placeholder pattern matching: ${pattern.toString()}`)
    }
  }

  // 3. SEO Checks
  if (article.title.length < 20 || article.title.length > 120) {
    errors.push(`Title length (${article.title.length} chars) is outside optimal 20-120 range.`)
  }

  if (article.metaTitle.length < 25 || article.metaTitle.length > 75) {
    errors.push(`Meta title length (${article.metaTitle.length} chars) is outside optimal 25-75 range.`)
  }

  if (article.metaDescription.length < 100 || article.metaDescription.length > 180) {
    errors.push(`Meta description length (${article.metaDescription.length} chars) is outside optimal 100-180 range.`)
  }

  // Slug check
  if (!/^[a-z0-9-]+$/.test(article.slug)) {
    errors.push(`Invalid slug format '${article.slug}'. Must be lowercase alphanumeric with hyphens.`)
  }

  // Primary keyword presence
  const normalizedKeyword = article.primaryKeyword.toLowerCase().trim()
  const titleLower = article.title.toLowerCase()
  const first150Words = article.content.split(/\s+/).slice(0, 150).join(' ').toLowerCase()

  if (!titleLower.includes(normalizedKeyword) && !first150Words.includes(normalizedKeyword)) {
    warnings.push(`Primary keyword '${article.primaryKeyword}' not prominently found in title or first 150 words.`)
  }

  // 4. Internal Link & Calculator Validation
  if (!article.relatedTools || article.relatedTools.length === 0) {
    errors.push('Article must link to at least one related StudentTools calculator.')
  } else {
    // Validate that at least the primary tool route exists in data/tools.ts
    const primaryTool = article.relatedTools[0]
    const route = primaryTool.route.startsWith('/') ? primaryTool.route : `/${primaryTool.route}`
    const verifiedTool = getToolByRoute(route)

    if (!verifiedTool) {
      errors.push(`Related tool route '${route}' does not exist in StudentTools calculator registry.`)
    }

    if (expectedToolSlug && !article.relatedTools.some((t) => t.route === expectedToolSlug)) {
      warnings.push(`Expected target tool '${expectedToolSlug}' was not the primary tool linked in article.`)
    }
  }

  // 5. FAQ Validation
  if (!article.faq || article.faq.length < 2) {
    errors.push('Article must contain at least 2 relevant FAQs.')
  }

  // 6. Duplicate & Shingle/Jaccard Similarity Gate
  const existingArticles = await getAllPublishedArticlesForSimilarity()
  let highestSimilarity = 0
  let mostSimilarSlug = ''

  for (const existing of existingArticles) {
    // Exact content hash match -> duplicate
    if (existing.content_hash === contentHash) {
      return {
        passed: false,
        status: 'REVIEW_REQUIRED',
        errors: [`Exact duplicate content hash detected with existing article '${existing.slug}'.`],
        warnings,
        contentHash,
        similarityScore: 1.0,
        similarArticleSlug: existing.slug,
      }
    }

    // Exact slug match -> collision
    if (existing.slug === article.slug) {
      errors.push(`Slug collision: an article with slug '${article.slug}' is already published.`)
    }

    // Calculate title and keyword similarity
    const titleSim = calculateJaccardSimilarity(article.title, existing.title, 2)
    const kwSim = calculateJaccardSimilarity(article.primaryKeyword, existing.primary_keyword, 1)

    const compositeScore = titleSim * 0.7 + kwSim * 0.3
    if (compositeScore > highestSimilarity) {
      highestSimilarity = compositeScore
      mostSimilarSlug = existing.slug
    }
  }

  // If similarity > 0.75, flag for REVIEW_REQUIRED
  if (highestSimilarity >= 0.75) {
    errors.push(
      `High similarity (${(highestSimilarity * 100).toFixed(1)}%) detected with existing article '${mostSimilarSlug}'. Flagged for editorial review.`
    )
    return {
      passed: false,
      status: 'REVIEW_REQUIRED',
      errors,
      warnings,
      contentHash,
      similarityScore: highestSimilarity,
      similarArticleSlug: mostSimilarSlug,
    }
  }

  // Status resolution
  if (errors.length > 0) {
    return {
      passed: false,
      status: 'REVIEW_REQUIRED', // Recoverable/editorial failure
      errors,
      warnings,
      contentHash,
      similarityScore: highestSimilarity,
    }
  }

  return {
    passed: true,
    status: 'PUBLISHED',
    errors: [],
    warnings,
    contentHash,
    similarityScore: highestSimilarity,
  }
}
