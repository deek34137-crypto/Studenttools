-- lib/db/schema.sql
-- Production PostgreSQL schema for StudentTools.cyou Blog & Editorial System

-- 1. Articles Table
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  topic_cluster TEXT NOT NULL,
  article_type TEXT NOT NULL,
  search_intent TEXT NOT NULL,
  primary_keyword TEXT NOT NULL,
  secondary_keywords TEXT[] DEFAULT '{}',
  meta_title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'PUBLISHED' CHECK (status IN ('PUBLISHED', 'DRAFT', 'REVIEW_REQUIRED', 'ARCHIVED')),
  related_tools JSONB DEFAULT '[]'::jsonb,
  related_articles JSONB DEFAULT '[]'::jsonb,
  faq JSONB DEFAULT '[]'::jsonb,
  factual_claims JSONB DEFAULT '[]'::jsonb,
  verification_notes TEXT,
  content_hash TEXT NOT NULL UNIQUE,
  reading_time_minutes INTEGER DEFAULT 5,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  published_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for lightning-fast lookups
CREATE INDEX IF NOT EXISTS idx_articles_slug ON public.articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON public.articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_category ON public.articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_topic_id ON public.articles(topic_id);
CREATE INDEX IF NOT EXISTS idx_articles_content_hash ON public.articles(content_hash);

-- 2. Generation Logs Table
CREATE TABLE IF NOT EXISTS public.generation_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id TEXT NOT NULL,
  model TEXT NOT NULL,
  result TEXT NOT NULL CHECK (result IN ('SUCCESS', 'QUALITY_FAILED', 'API_ERROR', 'SKIPPED')),
  validation_result JSONB DEFAULT '{}'::jsonb,
  publication_result TEXT,
  error TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_generation_logs_topic_id ON public.generation_logs(topic_id);
CREATE INDEX IF NOT EXISTS idx_generation_logs_created_at ON public.generation_logs(created_at DESC);

-- 3. Daily Publishing Lock Table (Prevents double-publishing and concurrency collisions)
CREATE TABLE IF NOT EXISTS public.publishing_locks (
  lock_date DATE PRIMARY KEY,
  published_count INTEGER NOT NULL DEFAULT 0,
  locked_by TEXT NOT NULL,
  locked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.generation_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.publishing_locks ENABLE ROW LEVEL SECURITY;

-- Public can read PUBLISHED articles
CREATE POLICY "Public read published articles"
  ON public.articles
  FOR SELECT
  USING (status = 'PUBLISHED');

-- Service role has full permissions for pipeline and admin
CREATE POLICY "Service role full access articles"
  ON public.articles
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access logs"
  ON public.generation_logs
  TO service_role
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Service role full access locks"
  ON public.publishing_locks
  TO service_role
  USING (true)
  WITH CHECK (true);
