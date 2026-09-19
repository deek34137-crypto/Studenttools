import type { Metadata } from 'next'
import { getToolsByCategory, CATEGORY_DEFINITIONS } from '../../data/tools'
import { ToolCard } from '../../components/ToolCard'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { AdPlaceholder } from '../../components/AdPlaceholder'
import { GraduationCap, Award, School, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'JEE Main & Advanced Calculators & College Predictor | StudentTools',
  description:
    'Free JEE Main marks to percentile estimator, percentile to rank predictor, JoSAA cutoff explorer, marks calculator, and session countdown timer.',
  alternates: {
    canonical: 'https://www.studenttools.cyou/jee',
  },
}

export default function JeeCategoryPage() {
  const tools = getToolsByCategory('jee')
  const catDef = CATEGORY_DEFINITIONS.jee

  const faqs = [
    {
      q: 'How does the JEE Main marks to percentile conversion work?',
      a: 'NTA normalizes scores across multiple exam shifts using the multi-session normalization formula: Percentile = 100 × (Candidates who scored equal to or less than you in your session) ÷ (Total candidates who appeared in that session).',
    },
    {
      q: 'Can I predict my exact JoSAA college seat before results?',
      a: 'College predictors evaluate your estimated rank against historical opening and closing ranks from past JoSAA counselling rounds. While cutoffs provide a realistic benchmark, annual seat matrix changes and student choices influence actual seat allocations.',
    },
    {
      q: 'What is the negative marking scheme in JEE Main Paper 1?',
      a: 'For each correct answer, you receive +4 marks. For every incorrect answer in both Multiple Choice and Numerical Value questions, 1 mark is deducted (-1). Unattempted questions carry 0 marks.',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          <Breadcrumbs items={[{ label: 'JEE & Exams' }]} />
          <div className="mt-3 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-orange-50 text-orange-700 border border-orange-200 mb-3">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>National Level Engineering Entrance</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              JEE Main & Competitive Exam Calculators
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Transparent, data-backed tools designed for JEE Main and Advanced aspirants. Estimate your percentile range, predict All India CRL and Category ranks, evaluate historical JoSAA NIT/IIIT cutoffs, and track live exam session countdowns.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
        <AdPlaceholder slot="top-banner" />

        {/* Tools Grid */}
        <section>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
            Available JEE Calculators ({tools.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Informational Guidance */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">
            Understanding JEE Main Normalization & JoSAA Counselling
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            JEE Main is conducted across multiple shifts and days. Because test difficulty varies naturally between shifts, the National Testing Agency (NTA) computes NTA Percentile Scores ranging from 100 to 0 rather than relying on raw marks.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100">
              <span className="font-bold text-orange-900 block mb-1">Shift Difficulty Scaling</span>
              <p className="text-orange-800">
                A raw score of 180 in a tough shift may yield 99.2% percentile, whereas in an easier shift it may equate to 98.4%.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100">
              <span className="font-bold text-orange-900 block mb-1">CRL vs Category Rank</span>
              <p className="text-orange-800">
                Common Rank List (CRL) includes all candidates nationwide. JoSAA uses category ranks for allocated quota seats.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-orange-50/50 border border-orange-100">
              <span className="font-bold text-orange-900 block mb-1">Home State Quota</span>
              <p className="text-orange-800">
                NITs reserve 50% of seats for candidates whose Class 12 state of eligibility matches the institute location.
              </p>
            </div>
          </div>
        </section>

        {/* Category FAQs */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">JEE Frequently Asked Questions</h2>
          </div>
          <div className="divide-y divide-slate-100 text-sm">
            {faqs.map((faq, i) => (
              <div key={i} className="py-3 first:pt-0 last:pb-0">
                <h3 className="font-bold text-slate-900 mb-1">{faq.q}</h3>
                <p className="text-slate-600 text-xs sm:text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <AdPlaceholder slot="bottom-content" />
      </div>
    </div>
  )
}
