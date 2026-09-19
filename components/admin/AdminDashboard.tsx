// components/admin/AdminDashboard.tsx
'use client'

import React, { useState } from 'react'
import {
  Play,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Clock,
  BookOpen,
  Layers,
  ShieldCheck,
  RefreshCw,
  LogOut,
  ChevronRight,
} from 'lucide-react'
import { TopicRow, GenerationLogRecord } from '../../lib/db/types'

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
  dailyLimit: number
  dateKey: string
  recentLogs: GenerationLogRecord[]
  autopublishEnabled: boolean
}

export function AdminDashboard({
  initialStats,
  nextTopic,
  todayCount,
  dailyLimit,
  dateKey,
  recentLogs,
  autopublishEnabled,
}: AdminDashboardProps) {
  const [loading, setLoading] = useState(false)
  const [statusMessage, setStatusMessage] = useState<string | null>(null)
  const [statusType, setStatusType] = useState<'success' | 'error' | 'info'>('info')
  const [logs, setLogs] = useState<GenerationLogRecord[]>(recentLogs)
  const [lastResult, setLastResult] = useState<any>(null)

  async function handlePublishAction(dryRun: boolean, forceTopicId?: string) {
    setLoading(true)
    setStatusMessage(dryRun ? 'Running dry-run test with Gemini & Quality Gate...' : 'Executing publishing pipeline...')
    setStatusType('info')
    setLastResult(null)

    try {
      const res = await fetch('/api/admin/publish-now', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dryRun,
          forceTopicId,
          allowManualOverride: true,
        }),
      })

      const data = await res.json()
      setLastResult(data)

      if (data.action === 'SKIPPED') {
        setStatusType('info')
        setStatusMessage(`Pipeline Skipped: ${data.reason || 'No action required.'}`)
      } else if (data.success) {
        setStatusType('success')
        setStatusMessage(
          dryRun
            ? `Dry-Run Succeeded! Generated article '${data.articleSlug}' passed Automated Content Quality Gate.`
            : `Successfully Published Article! URL: ${data.articleUrl}`
        )
      } else {
        setStatusType('error')
        setStatusMessage(`Pipeline Halted: ${data.reason || data.error || 'Validation failed'}`)
      }
    } catch (err: any) {
      setStatusType('error')
      setStatusMessage(`Network/Server error: ${err.message}`)
    } finally {
      setLoading(false)
    }
  }

  async function handleLogout() {
    await fetch('/api/admin/auth', { method: 'DELETE' })
    window.location.reload()
  }

  return (
    <div className="space-y-8">
      {/* Top Banner with Quotas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Today&apos;s Quota</span>
            <Clock className="w-4 h-4 text-sky-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{todayCount}</span>
            <span className="text-slate-400 font-medium text-sm">/ {dailyLimit} published</span>
          </div>
          <p className="text-xs text-slate-500">Date: {dateKey} (Asia/Kolkata)</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Autopublish State</span>
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold ${
                autopublishEnabled ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
              }`}
            >
              {autopublishEnabled ? 'ACTIVE (09:00 IST)' : 'STANDBY (MANUAL ONLY)'}
            </span>
          </div>
          <p className="text-xs text-slate-500">Config: BLOG_AUTOPUBLISH_ENABLED</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Topics in Queue</span>
            <Layers className="w-4 h-4 text-indigo-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-slate-900">{initialStats.ready}</span>
            <span className="text-slate-400 font-medium text-sm">READY / {initialStats.total} total</span>
          </div>
          <p className="text-xs text-slate-500">{initialStats.published} published so far</p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-500 font-semibold uppercase">
            <span>Review & Failures</span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-600">{initialStats.reviewRequired}</span>
            <span className="text-slate-400 font-medium text-sm">Review | {initialStats.failed} Failed</span>
          </div>
          <p className="text-xs text-slate-500">Quality gate catches</p>
        </div>
      </div>

      {/* Manual Actions Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-7 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Pipeline Execution Controls</h2>
            <p className="text-xs text-slate-500">
              Test article generation or trigger single publication without waiting for the 09:00 IST cron.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => handlePublishAction(true)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Dry-Run Test (No Save)</span>
            </button>
            <button
              onClick={() => handlePublishAction(false)}
              disabled={loading}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs transition-colors disabled:opacity-50"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Publish Next Topic Now</span>
            </button>
            <button
              onClick={handleLogout}
              className="p-2.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Status Alert */}
        {statusMessage && (
          <div
            className={`p-4 rounded-xl text-xs leading-relaxed border ${
              statusType === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : statusType === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-sky-50 text-sky-800 border-sky-200'
            }`}
          >
            <p className="font-semibold">{statusMessage}</p>
          </div>
        )}

        {/* Detailed result card if dry run or run occurred */}
        {lastResult && (
          <div className="mt-4 p-4 rounded-xl bg-slate-900 text-slate-100 font-mono text-xs overflow-x-auto max-h-60">
            <pre>{JSON.stringify(lastResult, null, 2)}</pre>
          </div>
        )}
      </div>

      {/* Next Up Topic Preview */}
      {nextTopic && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">
              Next Up in Editorial Queue ({nextTopic.topic_id})
            </span>
            <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-100">
              {nextTopic.category} • {nextTopic.priority}
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900">{nextTopic.topic}</h3>
          <p className="text-xs text-slate-600 leading-relaxed">{nextTopic.content_angle}</p>
          <div className="pt-2 flex flex-wrap items-center gap-4 text-xs text-slate-500">
            <span>Primary Keyword: <strong className="text-slate-700">{nextTopic.primary_keyword}</strong></span>
            <span>Related Tool: <strong className="text-slate-700">{nextTopic.related_tool} ({nextTopic.related_tool_slug})</strong></span>
          </div>
        </div>
      )}

      {/* Recent Pipeline Logs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Recent Generation & Quality Gate Logs</h2>
        {logs.length === 0 ? (
          <p className="text-xs text-slate-400">No logs recorded yet.</p>
        ) : (
          <div className="divide-y divide-slate-100">
            {logs.slice(0, 10).map((log, idx) => (
              <div key={idx} className="py-3 flex items-start justify-between gap-4 text-xs">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.result === 'SUCCESS'
                          ? 'bg-emerald-50 text-emerald-700'
                          : log.result === 'QUALITY_FAILED'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-rose-50 text-rose-700'
                      }`}
                    >
                      {log.result}
                    </span>
                    <span className="font-semibold text-slate-800">Topic: {log.topic_id}</span>
                    <span className="text-slate-400">({log.model})</span>
                  </div>
                  {log.publication_result && (
                    <p className="text-slate-600 font-mono text-[11px]">{log.publication_result}</p>
                  )}
                  {log.error && (
                    <p className="text-rose-600">{log.error}</p>
                  )}
                </div>
                <span className="text-slate-400 whitespace-nowrap text-[11px]">
                  {new Date(log.created_at).toLocaleTimeString('en-IN', { timeZone: 'Asia/Kolkata' })}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
