'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Breadcrumbs, BreadcrumbItem } from './Breadcrumbs'
import { ToolMetadata, getRelatedTools } from '../data/tools'
import { ToolCard } from './ToolCard'
import { AdPlaceholder } from './AdPlaceholder'
import { ChevronDown, HelpCircle, Info, Calculator, CheckCircle2, AlertTriangle, BookOpen, ArrowRight } from 'lucide-react'

export interface FaqItem {
  question: string
  answer: string
}

export interface RelatedArticleItem {
  title: string
  slug: string
  excerpt?: string
}

export interface CalculatorLayoutProps {
  tool: ToolMetadata
  breadcrumbItems: BreadcrumbItem[]
  children: React.ReactNode // Interactive calculator component
  formulaTitle?: string
  formulaDescription?: string
  formulaCode?: string
  calculationSteps?: string[]
  example?: {
    scenario: string
    inputs: string
    calculation: string
    outcome: string
  }
  assumptions?: string[]
  disclaimer: string
  faqs?: FaqItem[]
  relatedArticles?: RelatedArticleItem[]
}

export function CalculatorLayout({
  tool,
  breadcrumbItems,
  children,
  formulaTitle = 'Formula & Calculation Method',
  formulaDescription,
  formulaCode,
  calculationSteps,
  example,
  assumptions,
  disclaimer,
  faqs = [],
  relatedArticles = [],
}: CalculatorLayoutProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)
  const relatedTools = getRelatedTools(tool.id, 4)

  // WebApplication JSON-LD Schema
  const webAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: tool.title,
    url: `https://studenttools.cyou${tool.route}`,
    description: tool.description,
    applicationCategory: 'EducationalApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'INR',
    },
  }

  // FAQPage JSON-LD Schema
  const faqSchema =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer,
            },
          })),
        }
      : null

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      {/* Structured Data Scripts */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webAppSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}

      {/* Hero Banner Header */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-8">
          <Breadcrumbs items={breadcrumbItems} />
          <div className="mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 mb-3">
              <Calculator className="w-3.5 h-3.5" />
              <span>{tool.categoryName}</span>
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight">
              {tool.title}
            </h1>
            <p className="mt-2.5 text-sm sm:text-base text-slate-600 max-w-3xl leading-relaxed">
              {tool.description}
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
        {/* Top Ad Slot (Non-intrusive banner) */}
        <AdPlaceholder slot="top-banner" />

        {/* Primary Calculator Card */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-5 sm:p-8">
          {children}
        </div>

        {/* Between Content Ad Slot */}
        <AdPlaceholder slot="in-content" />

        {/* Methodology & Formula Section */}
        {(formulaCode || formulaDescription || calculationSteps) && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mt-6">
            <div className="flex items-center gap-2 mb-3 text-slate-900">
              <Info className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg sm:text-xl font-bold">{formulaTitle}</h2>
            </div>
            {formulaDescription && (
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-4">
                {formulaDescription}
              </p>
            )}
            {formulaCode && (
              <div className="p-4 rounded-xl bg-slate-900 text-sky-300 font-mono text-xs sm:text-sm overflow-x-auto my-3 shadow-inner">
                {formulaCode}
              </div>
            )}
            {calculationSteps && calculationSteps.length > 0 && (
              <div className="mt-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                  Calculation Steps
                </h3>
                <ul className="space-y-2">
                  {calculationSteps.map((step, idx) => (
                    <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-700 text-xs font-semibold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </section>
        )}

        {/* Worked Example Section */}
        {example && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mt-6">
            <div className="flex items-center gap-2 mb-3 text-slate-900">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <h2 className="text-lg sm:text-xl font-bold">Practical Example</h2>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100 text-slate-800 space-y-2 text-xs sm:text-sm">
              <p>
                <strong>Scenario:</strong> {example.scenario}
              </p>
              <p>
                <strong>Inputs:</strong> {example.inputs}
              </p>
              <p>
                <strong>Calculation:</strong> {example.calculation}
              </p>
              <p className="font-semibold text-emerald-900">
                <strong>Result:</strong> {example.outcome}
              </p>
            </div>
          </section>
        )}

        {/* Assumptions & Disclaimers */}
        <section className="bg-amber-50/70 border border-amber-200/80 rounded-2xl p-6 sm:p-8 mt-6">
          <div className="flex items-center gap-2 text-amber-900 font-bold mb-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <h2 className="text-base sm:text-lg">Assumptions & Disclaimers</h2>
          </div>
          {assumptions && assumptions.length > 0 && (
            <div className="mb-3">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-amber-800 mb-1.5">
                Key Assumptions:
              </h3>
              <ul className="list-disc list-inside space-y-1 text-xs sm:text-sm text-amber-900">
                {assumptions.map((asm, i) => (
                  <li key={i}>{asm}</li>
                ))}
              </ul>
            </div>
          )}
          <p className="text-xs sm:text-sm text-amber-800 leading-relaxed font-normal">
            {disclaimer}
          </p>
        </section>

        {/* Frequently Asked Questions */}
        {faqs && faqs.length > 0 && (
          <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mt-6">
            <div className="flex items-center gap-2 mb-4 text-slate-900">
              <HelpCircle className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg sm:text-xl font-bold">Frequently Asked Questions</h2>
            </div>
            <div className="divide-y divide-slate-100">
              {faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index
                return (
                  <div key={index} className="py-3.5 first:pt-0 last:pb-0">
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                      className="w-full flex items-center justify-between gap-4 text-left font-semibold text-slate-900 hover:text-sky-600 transition-colors text-sm sm:text-base py-1"
                      aria-expanded={isOpen}
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-sky-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed pl-1 animate-fadeIn">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Related Tools */}
        {relatedTools.length > 0 && (
          <section className="mt-10">
            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
              Related Calculators & Tools
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedTools.map((rel) => (
                <ToolCard key={rel.id} tool={rel} />
              ))}
            </div>
          </section>
        )}

        {/* Related Educational Guides & Articles */}
        {relatedArticles && relatedArticles.length > 0 && (
          <section className="mt-10">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-sky-600" />
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Related Educational Guides & Calculation Methods
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedArticles.map((art) => (
                <Link
                  key={art.slug}
                  href={`/blog/${art.slug}`}
                  className="p-5 rounded-2xl bg-white border border-slate-200 hover:border-sky-300 hover:shadow-sm transition-all group flex flex-col justify-between"
                >
                  <div>
                    <h3 className="text-sm sm:text-base font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                      {art.title}
                    </h3>
                    {art.excerpt && (
                      <p className="mt-1.5 text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {art.excerpt}
                      </p>
                    )}
                  </div>
                  <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-sky-600 group-hover:translate-x-0.5 transition-transform">
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Bottom Content Ad Slot */}
        <AdPlaceholder slot="bottom-content" />
      </div>
    </div>
  )
}
