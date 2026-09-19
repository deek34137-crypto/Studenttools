// app/api/admin/detect-duplicate/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticatedAdmin } from '@/lib/admin/auth'
import { detectDuplicates } from '@/lib/quality/topicDetector'

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  if (!isAuthenticatedAdmin()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const body = await request.json()
    const { title, slug, primaryKeyword, content, excludeSlug } = body

    if (!title || !slug) {
      return NextResponse.json(
        { error: 'Title and slug are required for duplicate detection.' },
        { status: 400 }
      )
    }

    const result = await detectDuplicates({
      title: String(title),
      slug: String(slug),
      primaryKeyword: String(primaryKeyword || ''),
      content: content ? String(content) : undefined,
      excludeSlug: excludeSlug ? String(excludeSlug) : undefined,
    })

    return NextResponse.json(result)
  } catch (err: any) {
    console.error('Error in detect-duplicate API:', err)
    return NextResponse.json(
      { error: err.message || 'Failed to analyze topic duplicates.' },
      { status: 500 }
    )
  }
}
