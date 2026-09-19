// components/admin/AdminDashboard.tsx
'use client'

import React, { useState } from 'react'
import {
  CheckCircle2,
  AlertTriangle,
  Clock,
  BookOpen,
  Layers,
  LogOut,
  ChevronRight,
  Copy,
  Check,
  Search,
  Send,
  Eye,
  Edit3,
  ExternalLink,
  Plus,
  Trash2,
  Sparkles,
} from 'lucide-react'
import { TopicRow, ArticleRecord } from '../../lib/db/types'
import { MarkdownContent } from '../MarkdownContent'

interface AvailableTool {
  title: string
  route: string
  category: string
  categoryName: string
}

interface AdminDashboardProps {
  initialStats: {
    total: number
    ready: number
    processing: number
    published: number
    reviewRequired: number
    failed: number
    skipped: number
    byCategory: Record<string, number>
  }
  nextTopic: TopicRow | null
  todayCount: number
  dateKey: string
  publishedArticles: ArticleRecord[]
  availableTools: AvailableTool[]
}

interface FaqItem {
  question: string
  answer: string
}

export function AdminDashboard({
  initialStats,
  nextTopic: initialNextTopic,
  todayCount: initialTodayCount,
  dateKey,
  publishedArticles: initialPublishedArticles,
  availableTools,
}: AdminDashboardProps) {
  const [stats, setStats] = useState(initialStats)
  const [nextTopic, setNextTopic] = useState<TopicRow | null>(initialNextTopic)
  const [todayCount, setTodayCount] = useState(initialTodayCount)
  const [publishedArticles, setPublishedArticles] = useState<ArticleRecord[]>(initialPublishedArticles)
  const [activeTab, setActiveTab] = useState<'write' | 'articles'>('write')

  // Copy Prompt Feedback
  const [copiedPrompt, setCopiedPrompt] = useState(false)

  // Form State
  const [topicId, setTopicId] = useState(initialNextTopic?.topic_id || 'ST002')
  const [title, setTitle] = useState(initialNextTopic?.topic || '')
  const [slug, setSlug] = useState(
    initialNextTopic?.topic
      ? initialNextTopic.topic
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-|-$/g, '')
      : ''
  )
  const [category, setCategory] = useState(initialNextTopic?.category || 'JEE')
  const [primaryKeyword, setPrimaryKeyword] = useState(initialNextTopic?.primary_keyword || '')
  const [secondaryKeywords, setSecondaryKeywords] = useState(initialNextTopic?.secondary_keywords || '')
  const [relatedToolRoute, setRelatedToolRoute] = useState(initialNextTopic?.related_tool_slug || '/jee/marks-calculator')
  const [excerpt, setExcerpt] = useState(initialNextTopic?.content_angle || '')
  const [content, setContent] = useState('')
  const [faqs, setFaqs] = useState<FaqItem[]>([
    { question: '', answer: '' },
    { question: '', answer: '' },
  ])
  const [author, setAuthor] = useState('StudentTools Editorial Team')

  // Preview & Duplicate Checks
  const [previewMode, setPreviewMode] = useState(false)
  const [checkingDuplicate, setCheckingDuplicate] = useState(false)
  const [duplicateResult, setDuplicateResult] = useState<{
    isDuplicate: boolean
    reason?: string
    similarityScore?: number
  } | null>(null)

  // Submission State
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitMessage, setSubmitMessage] = useState<{
    type: 'success' | 'error'
    text: string
    url?: string
  } | null>(null)

  function generateSlug(text: string) {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
  }

  function handleTitleChange(val: string) {
    setTitle(val)
    if (!slug || slug === generateSlug(title)) {
      setSlug(generateSlug(val))
    }
  }

  function loadTopicIntoForm(topic: TopicRow) {
    setTopicId(topic.topic_id)
    setTitle(topic.topic)
    setSlug(generateSlug(topic.topic))
    setCategory(topic.category || 'JEE')
    setPrimaryKeyword(topic.primary_keyword || '')
    setSecondaryKeywords(topic.secondary_keywords || '')
    setRelatedToolRoute(topic.related_tool_slug || '/jee/marks-calculator')
    setExcerpt(topic.content_angle || '')
    setDuplicateResult(null)
    setSubmitMessage(null)
    setActiveTab('write')
  }

  function handleCopyPrompt(topic: TopicRow) {
    const promptText = `Write a comprehensive, highly informative 1200-word blog article for Indian students on StudentTools.cyou.

Topic: ${topic.topic}
Target Category: ${topic.category}
Primary Keyword: ${topic.primary_keyword}
Secondary Keywords: ${topic.secondary_keywords}
Content Angle / Guidelines: ${topic.content_angle}
Related Calculator Tool: ${topic.related_tool} (URL: https://studenttools.cyou${topic.related_tool_slug})

Structure & Formatting Requirements:
1. At least 3 major sections with H2 headings (## Heading).
2. Include clean Markdown tables with | Column 1 | Column 2 | where relevant.
3. Realistic numerical examples, formulas, or cutoff benchmarks.
4. Naturally reference and link to the related calculator tool: [${topic.related_tool}](https://studenttools.cyou${topic.related_tool_slug}).
5. Provide 2-3 Frequently Asked Questions (FAQ) with answers at the end.
6. Highly engaging, professional, human tone. Do NOT include phrases like 'As an AI language model', 'In conclusion it is crucial', or placeholder text.`

    navigator.clipboard.writeText(promptText)
    setCopiedPrompt(true)
    setTimeout(() => setCopiedPrompt(false), 3000)
  }

  async function handleCheckDuplicate() {
    if (!title.trim() || !slug.trim()) {
      setDuplicateResult({
        isDuplicate: true,
        reason: 'Please enter at least a Title and Slug to check for duplicates.',
      })
      return
    }

    setCheckingDuplicate(true)
    setDuplicateResult(null)

    try {
      const res = await fetch('/api/admin/detect-duplicate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          slug,
          primaryKeyword,
          content: content || undefined,
        }),
      })

      const data = await res.json()
      if (res.ok) {
        setDuplicateResult({
          isDuplicate: data.isDuplicate,
          reason: data.reason,
          similarityScore: data.similarityScore,
        })
      } else {
        setDuplicateResult({
          isDuplicate: true,
          reason: data.error || 'Duplicate detection failed.',
        })
      }
    } catch (err: any) {
      setDuplicateResult({
        isDuplicate: true,
        reason: `Network error: ${err.message}`,
      })
    } finally {
      setCheckingDuplicate(false)
    }
  }

  async function handlePublish(e: React.FormEvent) {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitMessage(null)

    try {
      const validFaqs = faqs.filter((f) => f.question.trim() && f.answer.trim())

      const res = await fetch('/api/admin/manual-publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topicId,
          title,
          slug,
          excerpt,
          category,
          primaryKeyword,
          secondaryKeywords,
          content,
          relatedToolRoute,
          faq: validFaqs,
          author,
        }),
      })

      const data = await res.json()

      if (res.ok && data.success) {
        setSubmitMessage({
          type: 'success',
          text: `🎉 Successfully published! Post is live on StudentTools.`,
          url: data.articleUrl,
        })

        // Update stats and advance to next topic
        if (data.stats) setStats(data.stats)
        if (data.nextTopic) {
          setNextTopic(data.nextTopic)
          loadTopicIntoForm(data.nextTopic)
        } else {
          setNextTopic(null)
        }
        setTodayCount((prev) => prev + 1)

        // Clear content for fresh post
        setContent('')
      } else {
        setSubmitMessage({
          type: 'error',
          text: data.error || 'Failed to publish article.',
        })
      }
    } catch (err: any) {
      setSubmitMessage({
        type: 'error',
        text: `Server error: ${err.message}`,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    window.location.reload()
  }

  return (
    <div className="space-y-8">
      {/* Top Banner with Progress & Quotas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Progress Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Overall Progress</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.published}</span>
            <span className="text-slate-400 font-medium text-sm">/ {stats.total} topics done</span>
          </div>
          <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500"
              style={{ width: `${Math.max(1, (stats.published / stats.total) * 100)}%` }}
            />
          </div>
        </div>

        {/* Next Topic Spotlight */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Active Topic in Line</span>
            <Sparkles className="w-4 h-4 text-sky-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold text-sky-700">
              {nextTopic ? nextTopic.topic_id : 'All Done! 🎉'}
            </span>
          </div>
          <p className="text-xs text-slate-500 truncate">
            {nextTopic ? nextTopic.topic : 'All queue topics completed'}
          </p>
        </div>

        {/* Ready in Queue */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Topics Waiting</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{stats.ready}</span>
            <span className="text-slate-400 font-medium text-sm">READY</span>
          </div>
          <p className="text-xs text-slate-500">Curated SEO database</p>
        </div>

        {/* Published Today */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Published Today</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{todayCount}</span>
            <span className="text-slate-400 font-medium text-sm">articles</span>
          </div>
          <p className="text-xs text-slate-500">Date: {dateKey}</p>
        </div>
      </div>

      {/* Next Up Topic Spotlight Card */}
      {nextTopic && (
        <div className="bg-gradient-to-br from-sky-50/70 via-white to-indigo-50/40 rounded-2xl border border-sky-200/80 p-6 sm:p-7 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-600 text-white tracking-wide">
                CURRENT QUEUE TOPIC: {nextTopic.topic_id}
              </span>
              <span className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-white text-slate-700 border border-slate-200">
                {nextTopic.category} • {nextTopic.priority} PRIORITY
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleCopyPrompt(nextTopic)}
                className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-xs font-semibold shadow-2xs transition-colors"
              >
                {copiedPrompt ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-700">Copied Prompt for ChatGPT!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4 text-slate-500" />
                    <span>📋 Copy ChatGPT Prompt</span>
                  </>
                )}
              </button>
              <button
                onClick={() => loadTopicIntoForm(nextTopic)}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                <span>Fill in Post Form ↓</span>
              </button>
            </div>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">{nextTopic.topic}</h2>
            <p className="mt-1.5 text-sm text-slate-600 leading-relaxed">{nextTopic.content_angle}</p>
          </div>

          <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-500 border-t border-sky-100">
            <div>
              Primary Keyword: <strong className="text-slate-800">{nextTopic.primary_keyword}</strong>
            </div>
            {nextTopic.secondary_keywords && (
              <div>
                Secondary: <strong className="text-slate-800">{nextTopic.secondary_keywords}</strong>
              </div>
            )}
            <div>
              Target Tool:{' '}
              <span className="text-sky-700 font-semibold">
                {nextTopic.related_tool} ({nextTopic.related_tool_slug})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200">
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab('write')}
            className={`pb-3 text-sm font-bold transition-colors relative ${
              activeTab === 'write' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            ✍️ Publish New Post
            {activeTab === 'write' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />
            )}
          </button>
          <button
            onClick={() => setActiveTab('articles')}
            className={`pb-3 text-sm font-bold transition-colors relative ${
              activeTab === 'articles' ? 'text-sky-600' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            📚 Published Articles ({stats.published})
            {activeTab === 'articles' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-sky-600 rounded-full" />
            )}
          </button>
        </div>

        <button
          onClick={handleLogout}
          className="pb-3 inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-rose-600 transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Logout</span>
        </button>
      </div>

      {/* TAB 1: Write & Publish New Post Form */}
      {activeTab === 'write' && (
        <form onSubmit={handlePublish} className="space-y-6">
          {/* Status Message Alert */}
          {submitMessage && (
            <div
              className={`p-4 rounded-xl border text-sm flex items-start justify-between gap-4 ${
                submitMessage.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border-emerald-200'
                  : 'bg-rose-50 text-rose-900 border-rose-200'
              }`}
            >
              <div>
                <p className="font-semibold">{submitMessage.text}</p>
                {submitMessage.url && (
                  <a
                    href={submitMessage.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-xs font-bold underline hover:opacity-80"
                  >
                    View Published Article: {submitMessage.url} <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Form Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Post Metadata & Topic Info</h3>
                <p className="text-xs text-slate-500">
                  Pre-filled from current queue topic ({topicId}). You can customize any field.
                </p>
              </div>
              <span className="text-xs font-mono px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg">
                Topic ID: {topicId}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Title */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Article Title *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="e.g. How to Calculate Raw Score from JEE Main Response Sheet"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Slug */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  URL Slug (/blog/[slug]) *
                </label>
                <input
                  type="text"
                  required
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="how-to-calculate-jee-raw-score"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-mono focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  <option value="JEE">JEE & Competitive Exams</option>
                  <option value="Student">Student & Academic Tools</option>
                  <option value="Career">Career & Salary Tools</option>
                  <option value="Finance">Finance Calculators</option>
                  <option value="Calculators">Everyday Calculators</option>
                </select>
              </div>

              {/* Primary Keyword */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Primary Keyword (Target SEO) *
                </label>
                <input
                  type="text"
                  required
                  value={primaryKeyword}
                  onChange={(e) => setPrimaryKeyword(e.target.value)}
                  placeholder="e.g. how to calculate jee main raw score"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Related Tool */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Connected Calculator Tool *
                </label>
                <select
                  value={relatedToolRoute}
                  onChange={(e) => setRelatedToolRoute(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-white"
                >
                  {availableTools.map((t) => (
                    <option key={t.route} value={t.route}>
                      {t.title} ({t.route})
                    </option>
                  ))}
                </select>
              </div>

              {/* Secondary Keywords */}
              <div className="md:col-span-2 space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Secondary Keywords (Comma-separated)
                </label>
                <input
                  type="text"
                  value={secondaryKeywords}
                  onChange={(e) => setSecondaryKeywords(e.target.value)}
                  placeholder="e.g. jee response sheet, nta marks formula, response sheet download"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Excerpt / Meta Description */}
              <div className="md:col-span-2 space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Excerpt / Meta Description
                  </label>
                  <span className="text-xs text-slate-400">{excerpt.length} / 160 chars</span>
                </div>
                <textarea
                  rows={2}
                  value={excerpt}
                  onChange={(e) => setExcerpt(e.target.value)}
                  placeholder="Short 1-2 sentence summary shown on search results and article header..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>
            </div>

            {/* Markdown Body Content Editor */}
            <div className="space-y-3 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                    Article Content (Markdown) *
                  </label>
                  <p className="text-xs text-slate-400">
                    Paste your content from ChatGPT. Supports headings (`##`), tables (`| A | B |`), bullet points, and callouts.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400 font-medium">
                    {content.trim() ? content.trim().split(/\s+/).length : 0} words
                  </span>
                  <button
                    type="button"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{previewMode ? 'Back to Editor' : 'Live Preview'}</span>
                  </button>
                </div>
              </div>

              {previewMode ? (
                <div className="p-6 rounded-xl border border-slate-200 bg-slate-50/50 min-h-[350px]">
                  {content.trim() ? (
                    <MarkdownContent content={content} />
                  ) : (
                    <p className="text-xs text-slate-400 italic">No content entered yet. Switch back to Editor to paste your article.</p>
                  )}
                </div>
              ) : (
                <textarea
                  rows={14}
                  required
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder={`## Introduction to JEE Response Sheet Evaluation\n\nWhen the National Testing Agency releases provisional answer keys...\n\n| Section | Correct | Incorrect |\n|---|---|---|\n| Section A | +4 | -1 |\n\n## Step-by-Step Marks Calculation Formula\n...`}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 font-mono text-sm leading-relaxed focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              )}
            </div>

            {/* Dynamic FAQs Section */}
            <div className="space-y-4 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
                    Frequently Asked Questions (FAQs)
                  </h4>
                  <p className="text-xs text-slate-400">
                    Add 2 or more FAQs to generate FAQPage Google Schema for SEO rich snippets.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setFaqs([...faqs, { question: '', answer: '' }])}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add FAQ</span>
                </button>
              </div>

              <div className="space-y-3">
                {faqs.map((faq, index) => (
                  <div key={index} className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-500">FAQ #{index + 1}</span>
                      {faqs.length > 2 && (
                        <button
                          type="button"
                          onClick={() => setFaqs(faqs.filter((_, i) => i !== index))}
                          className="text-slate-400 hover:text-rose-600 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => {
                        const updated = [...faqs]
                        updated[index].question = e.target.value
                        setFaqs(updated)
                      }}
                      placeholder="e.g. When does NTA release the official response sheet?"
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                    />
                    <textarea
                      rows={2}
                      value={faq.answer}
                      onChange={(e) => {
                        const updated = [...faqs]
                        updated[index].answer = e.target.value
                        setFaqs(updated)
                      }}
                      placeholder="e.g. NTA typically releases response sheets 3 to 4 days after the final exam shift concludes..."
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Topic Detector Box */}
            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <button
                  type="button"
                  onClick={handleCheckDuplicate}
                  disabled={checkingDuplicate}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors disabled:opacity-50"
                >
                  <Search className={`w-3.5 h-3.5 ${checkingDuplicate ? 'animate-spin' : ''}`} />
                  <span>{checkingDuplicate ? 'Checking Database...' : '🔍 Check for Duplicates'}</span>
                </button>
                <p className="text-[11px] text-slate-400 mt-1">
                  Scans all 1,105 topics & published articles for title, slug, and keyword collisions.
                </p>
              </div>

              {duplicateResult && (
                <div
                  className={`px-4 py-2.5 rounded-xl border text-xs max-w-md ${
                    duplicateResult.isDuplicate
                      ? 'bg-rose-50 text-rose-800 border-rose-200'
                      : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                  }`}
                >
                  {duplicateResult.isDuplicate ? (
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
                      <span>{duplicateResult.reason || 'Duplicate detected! Please revise.'}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>✅ Unique topic! Passed duplication detector with zero collisions.</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Submit Action Bar */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-sm font-bold shadow-md hover:shadow-lg transition-all disabled:opacity-50"
            >
              <Send className={`w-4 h-4 ${isSubmitting ? 'animate-pulse' : ''}`} />
              <span>{isSubmitting ? 'Publishing & Advancing Queue...' : '🚀 Publish Article Now'}</span>
            </button>
          </div>
        </form>
      )}

      {/* TAB 2: Published Articles & Completed Topics */}
      {activeTab === 'articles' && (
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden space-y-4">
          <div className="p-6 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Completed & Published Articles</h3>
              <p className="text-xs text-slate-500">
                Articles published on StudentTools. Each published article advances the editorial queue.
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-lg border border-emerald-200">
              {stats.published} Completed
            </span>
          </div>

          <div className="divide-y divide-slate-100">
            {publishedArticles.map((art) => (
              <div key={art.id} className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/60 transition-colors">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                      DONE ✅
                    </span>
                    <span className="text-xs font-bold text-slate-500 font-mono">{art.topic_id}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-700">
                      {art.category}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{art.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-1">{art.excerpt}</p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-slate-400">
                    {new Date(art.published_at).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                  <a
                    href={`/blog/${art.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-sky-50 text-sky-700 hover:bg-sky-100 text-xs font-semibold transition-colors"
                  >
                    <span>View Post</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
