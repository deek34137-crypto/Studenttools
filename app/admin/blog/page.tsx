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
  const [stats, nextTopic, todayCount, recentLogs] = await Promise.all([
    getTopicQueueStats(),
    getNextReadyTopic(),
    getTodayPublishCount(dateKey),
    getGenerationLogs(15),
  ])

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
              <div>Model: <strong className="text-slate-800">{process.env.GEMINI_MODEL || 'gemini-3.7-flash'}</strong></div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
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
