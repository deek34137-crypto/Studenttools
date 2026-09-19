import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const rawClient = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() || 'ca-pub-1405060407756207'

  // Normalize publisher ID: strip "ca-" prefix if present (e.g. ca-pub-1405060407756207 -> pub-1405060407756207)
  const publisherId = rawClient.replace(/^ca-/, '')
  const content = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`

  return new NextResponse(content, {
    status: 200,
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}
