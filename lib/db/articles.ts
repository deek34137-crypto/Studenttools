// lib/db/articles.ts
import fs from 'fs'
import path from 'path'
import os from 'os'
import { getSupabase, isSupabaseConfigured } from './supabase'
import { ArticleRecord, GenerationLogRecord, PublishingLockRecord } from './types'

const isServerless = Boolean(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME)
const STORAGE_DIR = isServerless
  ? path.join(os.tmpdir(), 'studenttools_storage')
  : path.resolve(process.cwd(), 'data/storage')

const ARTICLES_FILE = path.join(STORAGE_DIR, 'articles.json')
const LOGS_FILE = path.join(STORAGE_DIR, 'generation_logs.json')
const LOCKS_FILE = path.join(STORAGE_DIR, 'publishing_locks.json')

// In-memory fallback if disk is completely read-only or unavailable
const memoryCache: Record<string, unknown> = {}

function ensureStorage() {
  try {
    if (!fs.existsSync(STORAGE_DIR)) {
      fs.mkdirSync(STORAGE_DIR, { recursive: true })
    }
  } catch (err) {
    // Ignore directory creation failure on strict read-only environments
  }
}

function readLocalJson<T>(filePath: string, fallback: T): T {
  try {
    if (memoryCache[filePath] !== undefined) {
      return memoryCache[filePath] as T
    }
    ensureStorage()
    if (!fs.existsSync(filePath)) {
      return fallback
    }
    const raw = fs.readFileSync(filePath, 'utf-8')
    const parsed = JSON.parse(raw) as T
    memoryCache[filePath] = parsed
    return parsed
  } catch (err) {
    return (memoryCache[filePath] as T) ?? fallback
  }
}

function writeLocalJson<T>(filePath: string, data: T) {
  memoryCache[filePath] = data
  try {
    ensureStorage()
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8')
  } catch (err) {
    // Memory cache holds the state even if disk write fails
  }
}

export async function getArticleBySlug(slug: string): Promise<ArticleRecord | null> {
  const supabase = getSupabase()

  if (supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .eq('status', 'PUBLISHED')
      .maybeSingle()

    if (error) {
      console.error('Supabase getArticleBySlug error:', error)
    } else if (data) {
      return data as ArticleRecord
    }
  }

  // Fallback to local storage
  const articles = readLocalJson<ArticleRecord[]>(ARTICLES_FILE, [])
  return articles.find((a) => a.slug === slug && a.status === 'PUBLISHED') || null
}

export async function listPublishedArticles(options?: {
  page?: number
  limit?: number
  category?: string
  search?: string
}): Promise<{ articles: ArticleRecord[]; total: number; page: number; totalPages: number }> {
  const page = Math.max(1, options?.page || 1)
  const limit = Math.max(1, Math.min(50, options?.limit || 12))
  const category = options?.category?.toLowerCase()
  const search = options?.search?.toLowerCase().trim()

  const supabase = getSupabase()

  if (supabase) {
    let query = supabase
      .from('articles')
      .select('*', { count: 'exact' })
      .eq('status', 'PUBLISHED')
      .order('published_at', { ascending: false })

    if (category && category !== 'all') {
      query = query.ilike('category', `%${category}%`)
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,excerpt.ilike.%${search}%,primary_keyword.ilike.%${search}%`)
    }

    const from = (page - 1) * limit
    const to = from + limit - 1
    const { data, count, error } = await query.range(from, to)

    if (!error && data) {
      const total = count || 0
      return {
        articles: data as ArticleRecord[],
        total,
        page,
        totalPages: Math.ceil(total / limit) || 1,
      }
    }
    console.error('Supabase listPublishedArticles error, falling back to local:', error)
  }

  // Local file fallback
  let all = readLocalJson<ArticleRecord[]>(ARTICLES_FILE, [])
  all = all.filter((a) => a.status === 'PUBLISHED')

  if (category && category !== 'all') {
    all = all.filter((a) => a.category.toLowerCase().includes(category))
  }

  if (search) {
    all = all.filter(
      (a) =>
        a.title.toLowerCase().includes(search) ||
        a.excerpt.toLowerCase().includes(search) ||
        a.primary_keyword.toLowerCase().includes(search)
    )
  }

  all.sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())

  const total = all.length
  const startIndex = (page - 1) * limit
  const paginated = all.slice(startIndex, startIndex + limit)

  return {
    articles: paginated,
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1,
  }
}

export async function getAllPublishedSlugs(): Promise<{ slug: string; published_at: string }[]> {
  const supabase = getSupabase()

  if (supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('slug, published_at')
      .eq('status', 'PUBLISHED')
      .order('published_at', { ascending: false })

    if (!error && data) {
      return data as { slug: string; published_at: string }[]
    }
  }

  const articles = readLocalJson<ArticleRecord[]>(ARTICLES_FILE, [])
  return articles
    .filter((a) => a.status === 'PUBLISHED')
    .map((a) => ({ slug: a.slug, published_at: a.published_at }))
}

export async function getArticlesByRelatedTool(
  toolSlug: string,
  limit: number = 4
): Promise<ArticleRecord[]> {
  const normalizedSlug = toolSlug.startsWith('/') ? toolSlug : `/${toolSlug}`
  const supabase = getSupabase()

  if (supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'PUBLISHED')
      .contains('related_tools', [{ route: normalizedSlug }])
      .limit(limit)

    if (!error && data && data.length > 0) {
      return data as ArticleRecord[]
    }
  }

  const articles = readLocalJson<ArticleRecord[]>(ARTICLES_FILE, [])
  return articles
    .filter(
      (a) =>
        a.status === 'PUBLISHED' &&
        Array.isArray(a.related_tools) &&
        a.related_tools.some((t) => t.route === normalizedSlug)
    )
    .slice(0, limit)
}

export async function saveArticle(article: ArticleRecord): Promise<boolean> {
  const supabase = getSupabase()

  if (supabase) {
    const { error } = await supabase.from('articles').upsert(article, { onConflict: 'slug' })
    if (error) {
      console.error('Supabase saveArticle error:', error)
      return false
    }
    return true
  }

  // Local file fallback
  const articles = readLocalJson<ArticleRecord[]>(ARTICLES_FILE, [])
  const existingIndex = articles.findIndex((a) => a.slug === article.slug || a.topic_id === article.topic_id)
  if (existingIndex >= 0) {
    articles[existingIndex] = article
  } else {
    articles.push(article)
  }
  writeLocalJson(ARTICLES_FILE, articles)
  return true
}

export async function logGeneration(log: GenerationLogRecord): Promise<void> {
  const supabase = getSupabase()

  if (supabase) {
    const { error } = await supabase.from('generation_logs').insert(log)
    if (error) {
      console.error('Supabase logGeneration error:', error)
    }
  }

  const logs = readLocalJson<GenerationLogRecord[]>(LOGS_FILE, [])
  logs.unshift(log)
  if (logs.length > 200) logs.pop() // keep recent 200 logs
  writeLocalJson(LOGS_FILE, logs)
}

export async function getGenerationLogs(limit: number = 25): Promise<GenerationLogRecord[]> {
  const supabase = getSupabase()

  if (supabase) {
    const { data, error } = await supabase
      .from('generation_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit)

    if (!error && data) {
      return data as GenerationLogRecord[]
    }
  }

  const logs = readLocalJson<GenerationLogRecord[]>(LOGS_FILE, [])
  return logs.slice(0, limit)
}

export async function getAllPublishedArticlesForSimilarity(): Promise<
  { id: string; title: string; slug: string; primary_keyword: string; content_hash: string }[]
> {
  const supabase = getSupabase()

  if (supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('id, title, slug, primary_keyword, content_hash')
      .eq('status', 'PUBLISHED')

    if (!error && data) {
      return data
    }
  }

  const articles = readLocalJson<ArticleRecord[]>(ARTICLES_FILE, [])
  return articles
    .filter((a) => a.status === 'PUBLISHED')
    .map((a) => ({
      id: a.id,
      title: a.title,
      slug: a.slug,
      primary_keyword: a.primary_keyword,
      content_hash: a.content_hash,
    }))
}

export async function getTodayPublishCount(dateKey: string): Promise<number> {
  const supabase = getSupabase()

  if (supabase) {
    const { data, error } = await supabase
      .from('publishing_locks')
      .select('published_count')
      .eq('lock_date', dateKey)
      .maybeSingle()

    if (!error && data) {
      return data.published_count || 0
    }
  }

  const locks = readLocalJson<Record<string, PublishingLockRecord>>(LOCKS_FILE, {})
  return locks[dateKey]?.published_count || 0
}

export async function incrementTodayPublishCount(dateKey: string, lockedBy: string): Promise<number> {
  const supabase = getSupabase()

  if (supabase) {
    const { data: existing } = await supabase
      .from('publishing_locks')
      .select('published_count')
      .eq('lock_date', dateKey)
      .maybeSingle()

    const newCount = (existing?.published_count || 0) + 1
    const { error } = await supabase.from('publishing_locks').upsert({
      lock_date: dateKey,
      published_count: newCount,
      locked_by: lockedBy,
      locked_at: new Date().toISOString(),
    })
    if (!error) return newCount
  }

  const locks = readLocalJson<Record<string, PublishingLockRecord>>(LOCKS_FILE, {})
  const current = locks[dateKey]
  const newCount = (current?.published_count || 0) + 1
  locks[dateKey] = {
    lock_date: dateKey,
    published_count: newCount,
    locked_by: lockedBy,
    locked_at: new Date().toISOString(),
  }
  writeLocalJson(LOCKS_FILE, locks)
  return newCount
}

export async function getArticleStats(): Promise<{
  totalPublished: number
  totalCategories: Record<string, number>
  latestPublished?: ArticleRecord | null
}> {
  const supabase = getSupabase()

  if (supabase) {
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('status', 'PUBLISHED')
      .order('published_at', { ascending: false })

    if (!error && data) {
      const categories: Record<string, number> = {}
      for (const item of data) {
        categories[item.category] = (categories[item.category] || 0) + 1
      }
      return {
        totalPublished: data.length,
        totalCategories: categories,
        latestPublished: (data[0] as ArticleRecord) || null,
      }
    }
  }

  const articles = readLocalJson<ArticleRecord[]>(ARTICLES_FILE, [])
  const published = articles.filter((a) => a.status === 'PUBLISHED')
  const categories: Record<string, number> = {}
  for (const item of published) {
    categories[item.category] = (categories[item.category] || 0) + 1
  }
  return {
    totalPublished: published.length,
    totalCategories: categories,
    latestPublished: published[0] || null,
  }
}
