import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.studenttools.cyou'
  if (baseUrl.includes('studenttools.cyou') && !baseUrl.includes('www.')) {
    baseUrl = baseUrl.replace('studenttools.cyou', 'www.studenttools.cyou')
  }

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'Mediapartners-Google',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'Google-Display-Ads-Bot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: ['/admin/', '/api/'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}
