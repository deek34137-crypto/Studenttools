// app/api/cron/publish/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { executeDailyPublishPipeline } from '@/lib/publisher/pipeline'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  // 1. Verify Vercel Cron or Authorization Header
  const cronSecret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')
  const vercelCronHeader = request.headers.get('x-vercel-cron')

  // In production, CRON_SECRET is required to prevent unauthorized triggers
  if (cronSecret) {
    const isAuthorized =
      authHeader === `Bearer ${cronSecret}` ||
      request.nextUrl.searchParams.get('key') === cronSecret ||
      Boolean(vercelCronHeader)

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized: Invalid or missing cron secret.' },
        { status: 401 }
      )
    }
  }

  try {
    const result = await executeDailyPublishPipeline()
    return NextResponse.json(result)
  } catch (err: any) {
    console.error('Unhandled Cron Publish error:', err)
    return NextResponse.json(
      { error: err.message || 'Internal pipeline error', action: 'FAILED' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  return GET(request)
}
