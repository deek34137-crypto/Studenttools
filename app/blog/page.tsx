// app/blog/page.tsx
import type { Metadata } from 'next'
import Link from 'next/link'
import { listPublishedArticles } from '@/lib/db/articles'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { BookOpen, Calendar, Clock, ArrowRight, Calculator, Search, Tag } from 'lucide-react'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Educational Guides, Formula Walkthroughs & Student Advice | StudentTools Blog',
  description:
    'Comprehensive guides on JEE scoring, NTA percentile normalization, CBSE CGPA conversions, Indian take-home salary calculations, EMI schedules, and everyday math.',
  alternates: {
    canonical: 'https://studenttools.cyou/blog',
  },
  openGraph: {
    title: 'Educational Guides, Formula Walkthroughs & Student Advice | StudentTools Blog',
    description:
      'In-depth, search-intent-focused educational articles explaining mathematical formulas, exam rules, and Indian career compensation.',
    url: 'https://studenttools.cyou/blog',
    siteName: 'StudentTools',
    type: 'website',
  },
}

interface BlogPageProps {
  searchParams?: {
    category?: string
    page?: string
    q?: string
  }
}

export default async function BlogIndexPage({ searchParams }: BlogPageProps) {
  const currentCategory = searchParams?.category || 'all'
  const currentPage = parseInt(searchParams?.page || '1', 10)
  const searchQuery = searchParams?.q || ''

  const { articles, total, page, totalPages } = await listPublishedArticles({
    category: currentCategory,
    page: currentPage,
    limit: 12,
    search: searchQuery,
  })

  const categories = [
    { id: 'all', name: 'All Topics' },
    { id: 'jee', name: 'JEE & Exams' },
    { id: 'student', name: 'Student Tools' },
    { id: 'career', name: 'Career & Salary' },
    { id: 'finance', name: 'Finance' },
    { id: 'general', name: 'Everyday Calculators' },
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      {/* Header Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
          <Breadcrumbs items={[{ label: 'Blog & Educational Guides' }]} />

          <div className="mt-4 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 border border-sky-200 text-sky-700 text-xs font-semibold mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>StudentTools Learning Hub</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Educational Guides & Calculation Methods
            </h1>
            <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed">
              Step-by-step breakdowns of examination scoring rules, normalization algorithms, Indian corporate compensation, and everyday mathematics.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="mt-8 flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {categories.map((cat) => {
              const isActive = currentCategory === cat.id
              return (
                <Link
                  key={cat.id}
                  href={`/blog${cat.id === 'all' ? '' : `?category=${cat.id}`}`}
                  className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {cat.name}
                </Link>
              )
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {articles.length === 0 ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto">
              <BookOpen className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Articles Are Being Curated</h2>
            <p className="text-sm text-slate-500 leading-relaxed">
              Our automated editorial engine is queueing fresh educational guides. Check back shortly or explore our 38 interactive calculators directly.
            </p>
            <div className="pt-2">
              <Link
                href="/calculators"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                <Calculator className="w-4 h-4" />
                <span>Explore All Calculators</span>
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Showing {articles.length} of {total} Published Guides
              </p>
            </div>

            {/* Articles Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((art) => (
                <article
                  key={art.slug}
                  className="bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all flex flex-col overflow-hidden group"
                >
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center justify-between gap-2 mb-3">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-sky-50 text-sky-700 border border-sky-100">
                        {art.category}
                      </span>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{art.reading_time_minutes || 5} min read</span>
                      </div>
                    </div>

                    <h2 className="text-lg font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-2 leading-snug">
                      <Link href={`/blog/${art.slug}`}>{art.title}</Link>
                    </h2>

                    <p className="mt-2.5 text-xs sm:text-sm text-slate-600 line-clamp-3 leading-relaxed flex-1">
                      {art.excerpt}
                    </p>

                    {/* Related Tool Indicator */}
                    {art.related_tools && art.related_tools.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-slate-100 flex items-center justify-between text-xs">
                        <span className="inline-flex items-center gap-1.5 text-slate-500 font-medium">
                          <Calculator className="w-3.5 h-3.5 text-sky-500" />
                          <span className="truncate max-w-[170px]">{art.related_tools[0].name}</span>
                        </span>
                        <span className="text-sky-600 font-semibold inline-flex items-center gap-1 group-hover:translate-x-0.5 transition-transform">
                          Read Guide
                          <ArrowRight className="w-3 h-3" />
                        </span>
                      </div>
                    )}
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="mt-12 flex items-center justify-center gap-3">
                {page > 1 && (
                  <Link
                    href={`/blog?page=${page - 1}${currentCategory !== 'all' ? `&category=${currentCategory}` : ''}`}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Previous
                  </Link>
                )}
                <span className="text-xs font-medium text-slate-500">
                  Page {page} of {totalPages}
                </span>
                {page < totalPages && (
                  <Link
                    href={`/blog?page=${page + 1}${currentCategory !== 'all' ? `&category=${currentCategory}` : ''}`}
                    className="px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Next
                  </Link>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
