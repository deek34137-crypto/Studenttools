import { describe, it, expect } from 'vitest'
import {
  verifyAdminPassword,
  verifyAdminSessionToken,
  getAdminSessionCookieConfig,
} from '../../lib/admin/auth'

describe('Admin Authentication & Session Security', () => {
  const secretKey = 'studenttools_dev_admin_key_2026'

  it('should verify correct admin password', () => {
    expect(verifyAdminPassword(secretKey)).toBe(true)
    expect(verifyAdminPassword('wrong_password_123')).toBe(false)
    expect(verifyAdminPassword('')).toBe(false)
  })

  it('should create and verify valid session tokens', () => {
    const cookieConfig = getAdminSessionCookieConfig(secretKey)
    expect(cookieConfig.name).toBe('st_admin_session')
    expect(cookieConfig.value).toBeDefined()
    expect(cookieConfig.httpOnly).toBe(true)

    const isValid = verifyAdminSessionToken(cookieConfig.value)
    expect(isValid).toBe(true)
  })

  it('should reject tampered or expired session tokens', () => {
    expect(verifyAdminSessionToken('invalid_token')).toBe(false)
    expect(verifyAdminSessionToken('123456.tampered_signature')).toBe(false)

    // Expired timestamp (10 days ago)
    const oldTimestamp = Math.floor(Date.now() / 1000) - 10 * 24 * 3600
    expect(verifyAdminSessionToken(`${oldTimestamp}.any_signature`)).toBe(false)
  })
})
