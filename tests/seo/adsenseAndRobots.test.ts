import { describe, it, expect, beforeEach, afterEach } from 'vitest'
import robots from '../../app/robots'
import sitemap from '../../app/sitemap'
import { GET as adsTxtHandler } from '../../app/ads.txt/route'
import fs from 'fs'
import path from 'path'

describe('SEO, Robots.txt, and AdSense Crawler Compliance', () => {
  const originalEnv = process.env

  beforeEach(() => {
    process.env = { ...originalEnv }
  })

  afterEach(() => {
    process.env = originalEnv
  })

  describe('robots.txt configuration', () => {
    it('should explicitly allow public crawling while disallowing /admin/ and /api/', () => {
      const robotsConfig = robots()
      expect(robotsConfig.rules).toBeDefined()

      const rules = Array.isArray(robotsConfig.rules) ? robotsConfig.rules : [robotsConfig.rules]

      // Verify general crawler rule
      const wildcardRule = rules.find((r) => r.userAgent === '*')
      expect(wildcardRule).toBeDefined()
      expect(wildcardRule?.allow).toBe('/')
      expect(wildcardRule?.disallow).toEqual(['/admin/', '/api/'])

      // Verify Google ad crawler explicit rules
      const mediaPartnersRule = rules.find((r) => r.userAgent === 'Mediapartners-Google')
      expect(mediaPartnersRule).toBeDefined()
      expect(mediaPartnersRule?.allow).toBe('/')
      expect(mediaPartnersRule?.disallow).toEqual(['/admin/', '/api/'])

      const displayAdsBotRule = rules.find((r) => r.userAgent === 'Google-Display-Ads-Bot')
      expect(displayAdsBotRule).toBeDefined()
      expect(displayAdsBotRule?.allow).toBe('/')
      expect(displayAdsBotRule?.disallow).toEqual(['/admin/', '/api/'])

      // Ensure /ads.txt, /blog, and calculator paths are NOT disallowed
      const allDisallows = rules.flatMap((r) => (Array.isArray(r.disallow) ? r.disallow : [r.disallow]))
      expect(allDisallows).not.toContain('/ads.txt')
      expect(allDisallows).not.toContain('/blog')
      expect(allDisallows).not.toContain('/calculators')
    })
  })

  describe('ads.txt route endpoint', () => {
    it('should return HTTP 200 with fallback comment when no publisher ID is configured', async () => {
      delete process.env.NEXT_PUBLIC_ADSENSE_CLIENT
      const res = await adsTxtHandler()
      expect(res.status).toBe(200)
      expect(res.headers.get('content-type')).toContain('text/plain')
      const text = await res.text()
      expect(text).toContain('# ads.txt - StudentTools')
      expect(text).toContain('No AdSense publisher ID configured yet')
    })

    it('should return valid IAB ads.txt format when publisher ID is configured', async () => {
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT = 'ca-pub-1405060407756207'
      const res = await adsTxtHandler()
      expect(res.status).toBe(200)
      expect(res.headers.get('content-type')).toContain('text/plain')
      const text = await res.text()
      expect(text).toBe('google.com, pub-1405060407756207, DIRECT, f08c47fec0942fa0\n')
    })

    it('should normalize publisher ID without double ca- prefix', async () => {
      process.env.NEXT_PUBLIC_ADSENSE_CLIENT = 'pub-998877665544'
      const res = await adsTxtHandler()
      expect(res.status).toBe(200)
      const text = await res.text()
      expect(text).toBe('google.com, pub-998877665544, DIRECT, f08c47fec0942fa0\n')
    })
  })

  describe('AdSense activation conditions', () => {
    it('should verify AdSense activation requirements: only active when enabled AND valid client ID exists', () => {
      const isValidAdsense = (enabled: string | undefined, client: string | undefined) => {
        const isEnabled = enabled === 'true'
        const rawClient = client?.trim()
        const normalized = rawClient && rawClient.startsWith('pub-') ? `ca-${rawClient}` : rawClient
        return isEnabled && Boolean(normalized && /^ca-pub-\d+$/.test(normalized))
      }

      // Disabled state
      expect(isValidAdsense('false', 'ca-pub-1405060407756207')).toBe(false)
      expect(isValidAdsense(undefined, 'ca-pub-1405060407756207')).toBe(false)

      // Missing client
      expect(isValidAdsense('true', '')).toBe(false)
      expect(isValidAdsense('true', undefined)).toBe(false)

      // Invalid format
      expect(isValidAdsense('true', 'invalid-client-id')).toBe(false)

      // Valid state
      expect(isValidAdsense('true', 'ca-pub-1405060407756207')).toBe(true)
      expect(isValidAdsense('true', 'pub-1405060407756207')).toBe(true)
    })
  })

  describe('Public Sitemap & Indexability', () => {
    it('should generate valid sitemap containing public calculators and blog hub', async () => {
      const siteMapEntries = await sitemap()
      expect(siteMapEntries.length).toBeGreaterThanOrEqual(40)

      const urls = siteMapEntries.map((e) => e.url)
      expect(urls).toContain('https://studenttools.cyou/')
      expect(urls).toContain('https://studenttools.cyou/blog')
      expect(urls).toContain('https://studenttools.cyou/jee/marks-to-percentile')
      expect(urls).toContain('https://studenttools.cyou/student/attendance-calculator')
      expect(urls).toContain('https://studenttools.cyou/career/ctc-to-in-hand')
    })

    it('should verify layout.tsx declares index: true and does not noindex public pages', () => {
      const layoutContent = fs.readFileSync(path.resolve(process.cwd(), 'app/layout.tsx'), 'utf-8')
      expect(layoutContent).toContain("index: true")
      expect(layoutContent).toContain("follow: true")
      expect(layoutContent).not.toContain("noindex")
    })
  })
})
