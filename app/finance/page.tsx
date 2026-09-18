import type { Metadata } from 'next'
import { getToolsByCategory, CATEGORY_DEFINITIONS } from '../../data/tools'
import { ToolCard } from '../../components/ToolCard'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { AdPlaceholder } from '../../components/AdPlaceholder'
import { IndianRupee, TrendingUp, ShieldCheck, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Finance Calculators (Loan EMI, SIP, GST & Tax) | StudentTools',
  description:
    'Free Indian personal finance calculators: reducing balance loan EMI schedule, mutual fund SIP wealth projector, GST split calculator, FD/RD interest, and Income Tax estimator.',
  alternates: {
    canonical: 'https://studenttools.cyou/finance',
  },
}

export default function FinanceCategoryPage() {
  const tools = getToolsByCategory('finance')

  const faqs = [
    {
      q: 'How does reducing-balance loan EMI calculation differ from flat interest?',
      a: 'In a reducing-balance loan, interest is computed each month only on the remaining unpaid principal rather than the full initial loan amount. This lowers your total interest burden significantly compared to flat rate loans.',
    },
    {
      q: 'What is the standard compounding frequency for Indian Bank Fixed Deposits (FDs)?',
      a: 'Most Indian public and private commercial banks (SBI, HDFC, ICICI) compound interest quarterly (every 3 months), meaning your interest earns interest four times a year.',
    },
    {
      q: 'Which Income Tax regime is better for salaried individuals in FY 2024-25 and 2025-26?',
      a: 'The New Tax Regime provides lower tax slab rates, a ₹75,000 standard deduction, and a full Section 87A rebate for taxable income up to ₹7,00,000 (effective zero tax up to ₹7.75 Lakhs). The Old Tax Regime may be preferable if you claim substantial deductions under 80C, 80D, and HRA.',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          <Breadcrumbs items={[{ label: 'Finance' }]} />
          <div className="mt-3 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200 mb-3">
              <IndianRupee className="w-3.5 h-3.5" />
              <span>Personal Finance & Wealth Management</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Indian Financial Calculators
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Make smart financial decisions. Plan your loan EMI payments with detailed yearly amortization schedules, project mutual fund SIP wealth creation, calculate GST invoice bifurcations, and compare New vs Old Income Tax regimes.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
        <AdPlaceholder slot="top-banner" />

        {/* Tools Grid */}
        <section>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
            Available Finance Tools ({tools.length})
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
            Smart Financial Planning in India
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Financial planning involves balancing debt obligations, long-term wealth accumulation, and statutory tax compliance.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
              <span className="font-bold text-purple-900 block mb-1">Prepayment Power in EMIs</span>
              <p className="text-purple-800">
                Making even a single additional EMI payment towards principal each year can shorten a 20-year home loan by 3 to 4 years.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
              <span className="font-bold text-purple-900 block mb-1">Rupee Cost Averaging</span>
              <p className="text-purple-800">
                Monthly mutual fund SIPs mitigate market timing risk by accumulating more units when prices dip.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-purple-50/50 border border-purple-100">
              <span className="font-bold text-purple-900 block mb-1">Budget 2024 New Tax Relief</span>
              <p className="text-purple-800">
                The standard deduction was increased to ₹75,000 for salaried employees opting for the New Tax Regime.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Finance Frequently Asked Questions</h2>
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
