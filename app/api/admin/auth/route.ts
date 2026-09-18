// app/api/admin/auth/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyAdminPassword, getAdminSecretKey, getAdminSessionCookieConfig } from '@/lib/admin/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const password = body?.password

    if (!password || !verifyAdminPassword(password)) {
      return NextResponse.json({ error: 'Invalid admin key.' }, { status: 401 })
    }

    const secret = getAdminSecretKey()
    const cookieConfig = getAdminSessionCookieConfig(secret)

    const response = NextResponse.json({ success: true, message: 'Authenticated successfully.' })
    response.cookies.set(cookieConfig)
    return response
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Authentication error' }, { status: 500 })
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: 'Logged out successfully.' })
  response.cookies.delete('st_admin_session')
  return response
}
