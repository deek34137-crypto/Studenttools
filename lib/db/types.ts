// lib/db/types.ts

export type TopicStatus =
  | 'READY'
  | 'PROCESSING'
  | 'PUBLISHED'
  | 'FAILED'
  | 'REVIEW_REQUIRED'
  | 'SKIPPED'

export interface TopicRow {
  topic_id: string
  topic: string
  category: string
  topic_cluster: string
  article_type: string
  search_intent: string
  primary_keyword: string
  secondary_keywords: string
  related_tool: string
  related_tool_slug: string
  content_angle: string
  evergreen: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW' | string
  status: TopicStatus
  published_url?: string | null
  published_at?: string | null
  error?: string | null
  content_hash?: string | null
}

export interface FaqItem {
  question: string
  answer: string
}

export interface RelatedToolRef {
  name: string
  route: string
  description?: string
  icon?: string
}

export interface ArticleRecord {
  id: string
  topic_id: string
  title: string
  slug: string
  excerpt: string
  content: string // Structured Markdown
  category: string
  topic_cluster: string
  article_type: string
  search_intent: string
  primary_keyword: string
  secondary_keywords: string[]
  meta_title: string
  meta_description: string
  status: 'PUBLISHED' | 'DRAFT' | 'REVIEW_REQUIRED' | 'ARCHIVED'
  related_tools: RelatedToolRef[]
  related_articles?: { title: string; slug: string; excerpt?: string }[]
  faq: FaqItem[]
  factual_claims?: string[]
  verification_notes?: string
  content_hash: string
  created_at: string
  updated_at: string
  published_at: string
  reading_time_minutes?: number
}

export interface GenerationLogRecord {
  id: string
  topic_id: string
  model: string
  result: 'SUCCESS' | 'QUALITY_FAILED' | 'API_ERROR' | 'SKIPPED'
  validation_result?: Record<string, unknown>
  publication_result?: string
  error?: string
  created_at: string
}

export interface PublishingLockRecord {
  lock_date: string // e.g. "2026-09-19"
  published_count: number
  locked_by: string
  locked_at: string
}
