import { MetadataRoute } from 'next'
import { TOOLS, CATEGORY_DEFINITIONS } from '../data/tools'
import { getAllPublishedSlugs } from '../lib/db/articles'

export const dynamic = 'force-dynamic'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.studenttools.cyou'
  if (baseUrl.includes('studenttools.cyou') && !baseUrl.includes('www.')) {
    baseUrl = baseUrl.replace('studenttools.cyou', 'www.studenttools.cyou')
  }
  const currentDate = new Date()

  // Static / Hub pages
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}/`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/disclaimer`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
  ]

  // Category Hubs
  const categoryRoutes: MetadataRoute.Sitemap = Object.values(CATEGORY_DEFINITIONS).map((cat) => ({
    url: `${baseUrl}${cat.route}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.9,
  }))

  // All 38 Dedicated Calculator Tools
  const toolRoutes: MetadataRoute.Sitemap = TOOLS.map((tool) => ({
    url: `${baseUrl}${tool.route}`,
    lastModified: currentDate,
    changeFrequency: 'weekly',
    priority: 0.85,
  }))

  // Dynamic Published Blog Articles
  let blogRoutes: MetadataRoute.Sitemap = []
  try {
    const publishedArticles = await getAllPublishedSlugs()
    blogRoutes = publishedArticles.map((art) => ({
      url: `${baseUrl}/blog/${art.slug}`,
      lastModified: new Date(art.published_at),
      changeFrequency: 'weekly',
      priority: 0.8,
    }))
  } catch (err) {
    console.error('Error fetching blog articles for sitemap:', err)
  }

  return [...staticRoutes, ...categoryRoutes, ...toolRoutes, ...blogRoutes]
}
