// app/api/cron/publish/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getNextReadyTopic, getTopicQueueStats } from '@/lib/sheets/topicQueue'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // Automated AI writer is permanently disabled in favor of the manual editorial workflow.
  // This endpoint now reports the current queue status and next topic in line.
  try {
    const nextTopic = await getNextReadyTopic()
    const stats = await getTopicQueueStats()

    return NextResponse.json({
      status: 'MANUAL_EDITORIAL_MODE',
      message: 'Automated AI writer is disabled. Manual editorial queue workflow is active.',
      nextTopicId: nextTopic?.topic_id || null,
      nextTopicTitle: nextTopic?.topic || null,
      stats: {
        total: stats.total,
        published: stats.published,
        ready: stats.ready,
      },
    })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
