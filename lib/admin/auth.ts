// lib/admin/auth.ts
import crypto from 'crypto'
import { cookies } from 'next/headers'

const COOKIE_NAME = 'st_admin_session'
const DEFAULT_ADMIN_KEY = 'studenttools_dev_admin_key_2026'

export function getAdminSecretKey(): string {
  return process.env.ADMIN_SECRET_KEY || DEFAULT_ADMIN_KEY
}

/**
 * Creates a deterministic HMAC-SHA256 signature for session token verification.
 */
function createSessionToken(secret: string): string {
  const timestamp = Math.floor(Date.now() / 1000)
  const hmac = crypto.createHmac('sha256', secret).update(`admin_session_${timestamp}`).digest('hex')
  return `${timestamp}.${hmac}`
}

export function verifyAdminPassword(password: string): boolean {
  const expectedKey = getAdminSecretKey()
  if (!password || !expectedKey) return false

  try {
    // Constant time comparison to avoid timing attacks
    const bufA = Buffer.from(password)
    const bufB = Buffer.from(expectedKey)
    if (bufA.length !== bufB.length) return false
    return crypto.timingSafeEqual(bufA, bufB)
  } catch (err) {
    return password === expectedKey
  }
}

export function verifyAdminSessionToken(token: string): boolean {
  const secret = getAdminSecretKey()
  if (!token || !token.includes('.')) return false

  const [timeStr, signature] = token.split('.')
  const timestamp = parseInt(timeStr, 10)
  if (isNaN(timestamp)) return false

  // Session valid for 7 days
  const now = Math.floor(Date.now() / 1000)
  if (now - timestamp > 7 * 24 * 3600) return false

  const expectedHmac = crypto.createHmac('sha256', secret).update(`admin_session_${timestamp}`).digest('hex')
  return signature === expectedHmac
}

export function isAuthenticatedAdmin(): boolean {
  const cookieStore = cookies()
  const token = cookieStore.get(COOKIE_NAME)?.value
  if (!token) return false
  return verifyAdminSessionToken(token)
}

export function getAdminSessionCookieConfig(secret: string) {
  const token = createSessionToken(secret)
  return {
    name: COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
    maxAge: 7 * 24 * 3600, // 7 days
    path: '/',
  }
}
