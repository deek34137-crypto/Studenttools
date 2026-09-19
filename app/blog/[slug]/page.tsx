// app/blog/[slug]/page.tsx
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getArticleBySlug, getAllPublishedSlugs } from '@/lib/db/articles'
import { getToolByRoute } from '@/data/tools'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { MarkdownContent } from '@/components/MarkdownContent'
import { ArticleFaqAccordion } from '@/components/ArticleFaqAccordion'
import { ToolCard } from '@/components/ToolCard'
import { AdPlaceholder } from '@/components/AdPlaceholder'
import {
  Calendar,
  Clock,
  Calculator,
  ArrowRight,
  ShieldAlert,
  Share2,
  Tag,
  BookOpen,
} from 'lucide-react'

interface ArticlePageProps {
  params: {
    slug: string
  }
}

export const revalidate = 300

export async function generateStaticParams() {
  const slugs = await getAllPublishedSlugs()
  return slugs.map((s) => ({ slug: s.slug }))
}


export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug)
  if (!article) {
    return {
      title: 'Article Not Found | StudentTools',
      robots: { index: false, follow: false },
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.studenttools.cyou'
  const canonicalUrl = `${siteUrl}/blog/${article.slug}`

  return {
    title: `${article.meta_title} | StudentTools`,
    description: article.meta_description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: article.meta_title,
      description: article.meta_description,
      url: canonicalUrl,
      type: 'article',
      publishedTime: article.published_at,
      siteName: 'StudentTools',
      locale: 'en_IN',
    },
    twitter: {
      card: 'summary_large_image',
      title: article.meta_title,
      description: article.meta_description,
    },
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const article = await getArticleBySlug(params.slug)

  if (!article) {
    notFound()
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.studenttools.cyou'
  const canonicalUrl = `${siteUrl}/blog/${article.slug}`

  // Format date in Indian format
  const pubDate = new Date(article.published_at)
  const formattedDate = pubDate.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Kolkata',
  })

  // Primary related tool
  const primaryToolRef = article.related_tools?.[0]
  const primaryTool = primaryToolRef ? getToolByRoute(primaryToolRef.route) : undefined

  // JSON-LD Schemas
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.excerpt,
    url: canonicalUrl,
    datePublished: article.published_at,
    dateModified: article.updated_at || article.published_at,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': canonicalUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'StudentTools',
      url: siteUrl,
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/icon.png`,
      },
    },
  }

  const breadcrumbSchema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: siteUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: `${siteUrl}/blog`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: article.title,
        item: canonicalUrl,
      },
    ],
  }

  const faqSchema =
    article.faq && article.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: article.faq.map((item) => ({
            '@type': 'Question',
            name: item.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: item.answer,
            },
          })),
        }
      : null

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Top Breadcrumb & Title Area */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          <Breadcrumbs
            items={[
              { label: 'Blog', href: '/blog' },
              { label: article.category, href: `/blog?category=${article.category.toLowerCase()}` },
              { label: article.title },
            ]}
          />

          <div className="mt-4 space-y-4">
            <div className="flex flex-wrap items-center gap-3 text-xs">
              <span className="px-3 py-1 rounded-full font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                {article.category}
              </span>
              {article.topic_cluster && (
                <span className="text-slate-500 font-medium">
                  • Cluster: {article.topic_cluster}
                </span>
              )}
              <span className="text-slate-400">•</span>
              <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>{formattedDate}</span>
              </span>
              <span className="text-slate-400">•</span>
              <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium">
                <Clock className="w-3.5 h-3.5" />
                <span>{article.reading_time_minutes || 5} min read</span>
              </span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
              {article.title}
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed pt-1">
              {article.excerpt}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8">
        {/* Top AdSlot Placeholder */}
        <AdPlaceholder slot="top-banner" />

        {/* PRIMARY CALCULATOR CTA BANNER */}
        {primaryToolRef && (
          <div className="rounded-2xl bg-gradient-to-r from-sky-600 to-indigo-600 text-white p-6 sm:p-7 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-sky-200 text-xs font-semibold tracking-wide uppercase">
                <Calculator className="w-4 h-4" />
                <span>Related Interactive Tool</span>
              </div>
              <h2 className="text-xl font-bold tracking-tight">
                Try the {primaryToolRef.name}
              </h2>
              <p className="text-sky-100 text-xs sm:text-sm max-w-xl">
                Perform instant, accurate calculations with transparent formula steps in your browser. Free and private.
              </p>
            </div>
            <Link
              href={primaryToolRef.route}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-white text-slate-900 hover:bg-sky-50 font-bold text-xs sm:text-sm shrink-0 shadow-sm transition-transform active:scale-95"
            >
              <span>Open Calculator</span>
              <ArrowRight className="w-4 h-4 text-sky-600" />
            </Link>
          </div>
        )}

        {/* MAIN ARTICLE BODY */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10 shadow-2xs">
          <MarkdownContent content={article.content} />
        </div>

        {/* Mid Article AdSlot Placeholder */}
        <AdPlaceholder slot="in-content" />

        {/* FREQUENTLY ASKED QUESTIONS */}
        {article.faq && article.faq.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5 pb-2">
              <div className="w-8 h-8 rounded-lg bg-sky-50 flex items-center justify-center text-sky-600">
                <BookOpen className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
                <p className="text-xs text-slate-500">Key questions about {article.primary_keyword}</p>
              </div>
            </div>
            <ArticleFaqAccordion faqs={article.faq} />
          </div>
        )}

        {/* RELATED CALCULATORS SECTION */}
        {primaryTool && (
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-slate-900">Recommended Interactive Calculators</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ToolCard tool={primaryTool} />
            </div>
          </div>
        )}

        {/* EDITORIAL / REGULATORY DISCLAIMER */}
        <div className="rounded-2xl bg-amber-50/70 border border-amber-200/80 p-5 sm:p-6 text-xs text-amber-900 leading-relaxed space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
            <span>Educational Disclaimer</span>
          </div>
          <p className="text-amber-800">
            This guide is published solely for educational and informational purposes based on standard formulas, historical examination data, and prevailing Indian statutory provisions. Calculations and estimates do not constitute official board notifications, licensed tax auditing, or legal advice. Please consult official examination bodies (NTA/CBSE/JoSAA) or certified professionals for binding determinations.
          </p>
        </div>

        {/* Bottom AdSlot Placeholder */}
        <AdPlaceholder slot="bottom-content" />
      </div>
    </div>
  )
}
