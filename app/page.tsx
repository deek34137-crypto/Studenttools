'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import {
  TOOLS,
  getPopularTools,
  getToolsByCategory,
  CATEGORY_DEFINITIONS,
  ToolCategory,
} from '../data/tools'
import { ToolCard } from '../components/ToolCard'
import { AdPlaceholder } from '../components/AdPlaceholder'
import { GlobalSearch } from '../components/GlobalSearch'
import {
  Search,
  Sparkles,
  Zap,
  ShieldCheck,
  Smartphone,
  ChevronRight,
  GraduationCap,
  Calculator,
  ChevronDown,
} from 'lucide-react'

export default function HomePage() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  const popularTools = getPopularTools()

  const categories: ToolCategory[] = ['jee', 'student', 'career', 'finance', 'calculators']

  const homeFaqs = [
    {
      q: 'Are all calculators on StudentTools completely free?',
      a: 'Yes, 100% free. Every calculator on StudentTools is open for public access without paywalls, sign-up forms, or limits.',
    },
    {
      q: 'Is my personal financial or marks data uploaded to a server?',
      a: 'No. All mathematical computations run purely on your local browser using client-side JavaScript. Your marks, salary numbers, and inputs never leave your device.',
    },
    {
      q: 'How accurate are the JEE Main percentile and rank estimators?',
      a: 'Our JEE tools use statistical models based on historical normalization score distributions across sessions. We explicitly display error ranges and note that official percentiles are computed by NTA based on exact shift normalization.',
    },
    {
      q: 'Are the Income Tax and CTC calculators updated for recent budgets?',
      a: 'Yes, our tax engine supports both FY 2024-25 and FY 2025-26 under the revised New Tax Regime (with ₹75,000 standard deduction and Section 87A rebate) as well as the Old Tax Regime.',
    },
  ]

  const quickPresets = [
    { label: 'JEE Percentile', href: '/jee/marks-to-percentile' },
    { label: 'CGPA Calculator', href: '/student/cgpa-to-percentage' },
    { label: 'Attendance Calculator', href: '/student/attendance-calculator' },
    { label: 'CTC Calculator', href: '/career/ctc-to-in-hand' },
    { label: 'EMI Calculator', href: '/finance/emi-calculator' },
    { label: 'Percentage Calculator', href: '/student/percentage-calculator' },
  ]

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky-50/70 via-white to-white pt-12 pb-16 sm:pt-20 sm:pb-24 border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-100/80 text-sky-800 border border-sky-200 mb-4">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>38+ Free Tools for Indian Students & Professionals</span>
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Fast, Free Tools for Students, Exams, Careers & Life.
          </h1>

          <p className="mt-4 text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Calculate JEE percentiles, convert CGPAs, track 75% college attendance, decode your CTC in-hand salary, and compute loan EMIs instantly.
          </p>

          {/* Search Trigger Button */}
          <div className="mt-8 max-w-md mx-auto">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50 border border-slate-300 hover:border-sky-400 rounded-2xl shadow-sm text-sm text-slate-500 transition-all group"
            >
              <div className="flex items-center gap-2.5">
                <Search className="w-5 h-5 text-slate-400 group-hover:text-sky-600 transition-colors" />
                <span>Search for a calculator (e.g. JEE, salary, EMI)...</span>
              </div>
              <kbd className="hidden sm:inline-block text-xs font-mono font-medium text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
                Ctrl K
              </kbd>
            </button>
          </div>

          {/* Quick Shortcuts */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-400 font-medium">Quick links:</span>
            {quickPresets.map((qp) => (
              <Link
                key={qp.label}
                href={qp.href}
                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-50 text-slate-700 hover:text-sky-700 border border-slate-200 font-medium transition-colors"
              >
                {qp.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
        {/* Top Ad Banner */}
        <AdPlaceholder slot="top-banner" />

        {/* Popular Tools Section */}
        <section>
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                Most Popular Calculators
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                The most frequently used utilities by Indian students and working freshers.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {popularTools.slice(0, 6).map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Categorized Sections */}
        {categories.map((catKey) => {
          const catDef = CATEGORY_DEFINITIONS[catKey]
          const catTools = getToolsByCategory(catKey)

          return (
            <section key={catKey} className="pt-4">
              <div className="flex items-end justify-between mb-5 border-b border-slate-200 pb-3">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
                    Category
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                    {catDef.name}
                  </h2>
                  <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                    {catDef.description}
                  </p>
                </div>
                <Link
                  href={catDef.route}
                  className="hidden sm:flex items-center gap-1 text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline shrink-0"
                >
                  <span>Explore all {catTools.length} {catDef.name}</span>
                  <ChevronRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {catTools.slice(0, 4).map((tool) => (
                  <ToolCard key={tool.id} tool={tool} />
                ))}
              </div>

              {catTools.length > 4 && (
                <div className="mt-4 text-center sm:hidden">
                  <Link
                    href={catDef.route}
                    className="inline-flex items-center gap-1 text-xs font-bold text-sky-600 hover:underline"
                  >
                    <span>View all {catTools.length} tools →</span>
                  </Link>
                </div>
              )}
            </section>
          )
        })}

        {/* In-content Ad */}
        <AdPlaceholder slot="in-content" />

        {/* Why StudentTools Trust Section */}
        <section className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="max-w-3xl mb-10">
            <span className="text-xs font-bold uppercase tracking-wider text-sky-400">
              Why StudentTools
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1 tracking-tight">
              Designed as a Reliable Utility Platform, Not an Ad Farm.
            </h2>
            <p className="text-slate-400 text-sm sm:text-base mt-2">
              We built StudentTools with four fundamental engineering principles to respect your time and device.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <Zap className="w-6 h-6 text-sky-400 mb-2.5" />
              <h3 className="font-bold text-base text-white">Instant Client-Side Speed</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Calculations execute in your browser with zero latency and zero server round-trips.
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <ShieldCheck className="w-6 h-6 text-emerald-400 mb-2.5" />
              <h3 className="font-bold text-base text-white">Transparent Formulas</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Every calculation reveals its exact mathematical formula, assumptions, and realistic error margins.
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <Smartphone className="w-6 h-6 text-purple-400 mb-2.5" />
              <h3 className="font-bold text-base text-white">Mobile-First Usability</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Designed for quick thumb taps on smartphone screens without zooming, clutter, or annoying popups.
              </p>
            </div>

            <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
              <GraduationCap className="w-6 h-6 text-amber-400 mb-2.5" />
              <h3 className="font-bold text-base text-white">Indian Context Native</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                Tuned specifically for JoSAA rounds, CBSE 9.5x CGPA rules, Indian CTC structures, and Indian Income Tax slabs.
              </p>
            </div>
          </div>
        </section>

        {/* Homepage FAQs */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-10">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="divide-y divide-slate-100">
            {homeFaqs.map((faq, index) => {
              const isOpen = openFaq === index
              return (
                <div key={index} className="py-4 first:pt-0 last:pb-0">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : index)}
                    className="w-full flex items-center justify-between text-left font-semibold text-slate-900 hover:text-sky-600 text-sm sm:text-base py-1"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                        isOpen ? 'rotate-180 text-sky-600' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed pl-1 animate-fadeIn">
                      {faq.a}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        </section>

        {/* Bottom Ad */}
        <AdPlaceholder slot="bottom-content" />
      </div>

      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
