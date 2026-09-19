// lib/quality/topicDetector.ts
import crypto from 'crypto'
import { getAllPublishedArticlesForSimilarity } from '../db/articles'
import fallbackTopicsData from '@/data/topicsDatabase.json'

export interface DuplicateCheckInput {
  title: string
  slug: string
  primaryKeyword: string
  content?: string
  excludeSlug?: string
}

export interface DuplicateCheckResult {
  isDuplicate: boolean
  similarityScore: number
  matchedTitle?: string
  matchedSlug?: string
  reason?: string
  checks: {
    slugCollision: boolean
    keywordCollision: boolean
    highTitleSimilarity: boolean
    contentHashMatch: boolean
    duplicateParagraph: boolean
  }
}

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
function createShingles(text: string, n: number = 2): Set<string> {
  const cleaned = text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  const words = cleaned.split(' ').filter(Boolean)
  const shingles = new Set<string>()

  if (words.length < n) {
    if (cleaned) shingles.add(cleaned)
    return shingles
  }

  for (let i = 0; i <= words.length - n; i++) {
    shingles.add(words.slice(i, i + n).join(' '))
  }
  return shingles
}

/**
 * Calculates Jaccard similarity coefficient between two texts: |A ∩ B| / |A ∪ B|.
 */
export function calculateJaccardSimilarity(textA: string, textB: string, n: number = 2): number {
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
 * Detects if a proposed topic/article is a duplicate of any existing published article or topic.
 */
export async function detectDuplicates(input: DuplicateCheckInput): Promise<DuplicateCheckResult> {
  const checks = {
    slugCollision: false,
    keywordCollision: false,
    highTitleSimilarity: false,
    contentHashMatch: false,
    duplicateParagraph: false,
  }

  const normalizedSlug = input.slug.toLowerCase().trim()
  const normalizedKeyword = input.primaryKeyword.toLowerCase().trim()
  const normalizedTitle = input.title.toLowerCase().trim()
  const contentHash = input.content ? computeContentHash(input.title, input.content) : ''

  // 1. Fetch published articles
  const publishedArticles = await getAllPublishedArticlesForSimilarity()

  // 2. Also inspect published topics from topics database
  const publishedTopics = (Array.isArray(fallbackTopicsData) ? fallbackTopicsData : []).filter(
    (t: any) => t.status === 'PUBLISHED'
  )

  let highestScore = 0
  let matchedTitle = ''
  let matchedSlug = ''
  let reason = ''

  // Check against published articles
  for (const existing of publishedArticles) {
    if (input.excludeSlug && existing.slug === input.excludeSlug) {
      continue
    }

    // Slug collision
    if (existing.slug.toLowerCase() === normalizedSlug) {
      checks.slugCollision = true
      return {
        isDuplicate: true,
        similarityScore: 1.0,
        matchedTitle: existing.title,
        matchedSlug: existing.slug,
        reason: `Slug collision: an article with URL slug '/blog/${existing.slug}' is already published.`,
        checks,
      }
    }

    // Exact content hash match
    if (contentHash && existing.content_hash && existing.content_hash === contentHash) {
      checks.contentHashMatch = true
      return {
        isDuplicate: true,
        similarityScore: 1.0,
        matchedTitle: existing.title,
        matchedSlug: existing.slug,
        reason: `Identical content detected: matching published article '${existing.title}'.`,
        checks,
      }
    }

    // Title similarity
    const titleSim = calculateJaccardSimilarity(normalizedTitle, existing.title.toLowerCase().trim(), 2)
    const kwSim = calculateJaccardSimilarity(
      normalizedKeyword,
      (existing.primary_keyword || '').toLowerCase().trim(),
      1
    )
    const compositeScore = titleSim * 0.7 + kwSim * 0.3

    if (compositeScore > highestScore) {
      highestScore = compositeScore
      matchedTitle = existing.title
      matchedSlug = existing.slug
    }

    // Exact primary keyword match with existing post
    if (
      normalizedKeyword &&
      existing.primary_keyword &&
      normalizedKeyword === existing.primary_keyword.toLowerCase().trim()
    ) {
      checks.keywordCollision = true
      highestScore = Math.max(highestScore, 0.85)
      matchedTitle = existing.title
      matchedSlug = existing.slug
      reason = `Primary keyword '${input.primaryKeyword}' is already targeted by published post '${existing.title}'.`
    }
  }

  // Check against published topics in database
  for (const topic of publishedTopics) {
    if (topic.published_url && topic.published_url.includes(normalizedSlug)) {
      checks.slugCollision = true
      return {
        isDuplicate: true,
        similarityScore: 1.0,
        matchedTitle: topic.topic,
        matchedSlug: normalizedSlug,
        reason: `Topic '${topic.topic}' has already been published.`,
        checks,
      }
    }

    const titleSim = calculateJaccardSimilarity(normalizedTitle, topic.topic.toLowerCase().trim(), 2)
    if (titleSim > highestScore) {
      highestScore = titleSim
      matchedTitle = topic.topic
      matchedSlug = topic.published_url || ''
    }
  }

  // Check duplicate paragraphs within the provided content
  if (input.content) {
    const paragraphs = input.content
      .replace(/^#{1,6}\s+.*$/gm, '') // Remove heading lines
      .split(/\n+/)
      .map((p) => p.replace(/\s+/g, ' ').trim().toLowerCase())
      .filter((p) => p.length > 60)

    const paraSet = new Set<string>()
    for (const p of paragraphs) {
      if (paraSet.has(p)) {
        checks.duplicateParagraph = true
        return {
          isDuplicate: true,
          similarityScore: 1.0,
          reason: 'Duplicate or repeated paragraph detected inside the article content.',
          checks,
        }
      }
      paraSet.add(p)
    }
  }

  // Threshold: composite similarity >= 0.70 is flagged as duplicate
  if (highestScore >= 0.70) {
    checks.highTitleSimilarity = true
    return {
      isDuplicate: true,
      similarityScore: Math.round(highestScore * 100) / 100,
      matchedTitle,
      matchedSlug,
      reason:
        reason ||
        `High topic similarity (${Math.round(highestScore * 100)}%) detected with published article: '${matchedTitle}'. Please choose a fresh topic angle.`,
      checks,
    }
  }

  return {
    isDuplicate: false,
    similarityScore: Math.round(highestScore * 100) / 100,
    checks,
  }
}
