// app/api/admin/publish-now/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticatedAdmin, verifyAdminPassword } from '@/lib/admin/auth'
import { executeDailyPublishPipeline } from '@/lib/publisher/pipeline'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  // Check authorization via cookie or header
  const isAuth = isAuthenticatedAdmin()
  const adminKeyHeader = request.headers.get('x-admin-key')
  const isHeaderAuth = adminKeyHeader ? verifyAdminPassword(adminKeyHeader) : false

  if (!isAuth && !isHeaderAuth) {
    return NextResponse.json({ error: 'Unauthorized: Admin authentication required.' }, { status: 401 })
  }

  try {
    const body = await request.json().catch(() => ({}))
    const dryRun = Boolean(body.dryRun)
    const forceTopicId = body.forceTopicId ? String(body.forceTopicId) : undefined
    const allowManualOverride = Boolean(body.allowManualOverride ?? true)

    const result = await executeDailyPublishPipeline({
      dryRun,
      forceTopicId,
      allowManualOverride,
    })

    return NextResponse.json(result)
  } catch (err: any) {
    console.error('Admin Publish Now error:', err)
    return NextResponse.json({ error: err.message || 'Pipeline execution failed' }, { status: 500 })
  }
}
