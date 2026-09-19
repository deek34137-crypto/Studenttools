// app/admin/blog/page.tsx
import type { Metadata } from 'next'
import { isAuthenticatedAdmin } from '@/lib/admin/auth'
import { AdminLoginForm } from '@/components/admin/AdminLoginForm'
import { AdminDashboard } from '@/components/admin/AdminDashboard'
import { getTopicQueueStats, getNextReadyTopic } from '@/lib/sheets/topicQueue'
import { getTodayPublishCount, getGenerationLogs } from '@/lib/db/articles'
import { getOperationalDateKey } from '@/lib/publisher/pipeline'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Blog Editorial Dashboard | StudentTools Admin',
  robots: { index: false, follow: false },
}

export default async function AdminBlogPage() {
  const isAuth = isAuthenticatedAdmin()

  if (!isAuth) {
    return (
      <div className="min-h-screen bg-slate-50/50 py-12">
        <AdminLoginForm />
      </div>
    )
  }

  const dateKey = getOperationalDateKey()
  let stats = {
    total: 0,
    ready: 0,
    processing: 0,
    published: 0,
    reviewRequired: 0,
    failed: 0,
    skipped: 0,
    byCategory: {} as Record<string, number>,
  }
  let nextTopic = null
  let todayCount = 0
  let recentLogs: any[] = []
  let loadWarning: string | null = null

  try {
    const results = await Promise.allSettled([
      getTopicQueueStats(),
      getNextReadyTopic(),
      getTodayPublishCount(dateKey),
      getGenerationLogs(15),
    ])

    if (results[0].status === 'fulfilled') {
      stats = results[0].value
    } else {
      console.error('Failed to load topic stats:', results[0].reason)
      loadWarning = 'Topic queue statistics could not be loaded.'
    }

    if (results[1].status === 'fulfilled') {
      nextTopic = results[1].value
    } else {
      console.error('Failed to load next topic:', results[1].reason)
    }

    if (results[2].status === 'fulfilled') {
      todayCount = results[2].value
    } else {
      console.error('Failed to load today publish count:', results[2].reason)
    }

    if (results[3].status === 'fulfilled') {
      recentLogs = results[3].value
    } else {
      console.error('Failed to load recent logs:', results[3].reason)
    }
  } catch (err: any) {
    console.error('Unexpected error loading admin dashboard data:', err)
    loadWarning = err?.message || 'Some data could not be retrieved from the backend.'
  }

  const dailyLimit = parseInt(process.env.BLOG_DAILY_LIMIT || '1', 10)
  const autopublishEnabled = process.env.BLOG_AUTOPUBLISH_ENABLED === 'true'

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  StudentTools Editorial System
                </span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
                Automated Blog Publishing Dashboard
              </h1>
            </div>
            <div className="text-xs text-slate-500 text-right">
              <div>Timezone: <strong className="text-slate-800">{process.env.BLOG_TIMEZONE || 'Asia/Kolkata'}</strong></div>
              <div>Model: <strong className="text-slate-800">{process.env.GEMINI_MODEL || 'gemini-2.5-flash'}</strong></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        {loadWarning && (
          <div className="mb-6 p-4 rounded-xl border border-amber-200 bg-amber-50 text-amber-900 text-sm flex items-center gap-2">
            <span className="font-semibold">Notice:</span> {loadWarning}
          </div>
        )}
        <AdminDashboard
          initialStats={stats}
          nextTopic={nextTopic}
          todayCount={todayCount}
          dailyLimit={dailyLimit}
          dateKey={dateKey}
          recentLogs={recentLogs}
          autopublishEnabled={autopublishEnabled}
        />
      </div>
    </div>
  )
}
