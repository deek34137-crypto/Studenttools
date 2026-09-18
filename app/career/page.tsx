import type { Metadata } from 'next'
import { getToolsByCategory, CATEGORY_DEFINITIONS } from '../../data/tools'
import { ToolCard } from '../../components/ToolCard'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { AdPlaceholder } from '../../components/AdPlaceholder'
import { Briefcase, IndianRupee, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Career & Salary Calculators (CTC In-Hand, Hike & PF) | StudentTools',
  description:
    'Free Indian career tools: CTC to in-hand monthly salary breakdown, appraisal salary hike calculator, EPF interest projection, monthly to annual salary, and internship stipend calculator.',
  alternates: {
    canonical: 'https://studenttools.cyou/career',
  },
}

export default function CareerCategoryPage() {
  const tools = getToolsByCategory('career')

  const faqs = [
    {
      q: 'Why is in-hand salary significantly lower than annual CTC in India?',
      a: 'CTC (Cost to Company) includes both direct employee earnings and employer contributions, such as Employer PF (12% of basic), Gratuity provisions (4.81% of basic), annual performance bonuses, and health insurance premiums. In addition, Employee PF, Professional Tax, and Income Tax (TDS) are deducted monthly.',
    },
    {
      q: 'How is employee PF calculated from Basic salary?',
      a: 'Under EPFO statutory regulations, 12% of your Basic Pay + Dearness Allowance is deducted as Employee PF contribution. The employer matches this 12%, splitting it into 3.67% for EPF and 8.33% for the Employee Pension Scheme (EPS).',
    },
    {
      q: 'How should I calculate my salary hike during an appraisal?',
      a: 'A salary hike percentage is applied to your fixed annual CTC. For example, a 20% hike on a ₹10 Lakh CTC increases your annual package by ₹2,00,000 to ₹12 Lakh, boosting your monthly gross by ~₹16,667.',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          <Breadcrumbs items={[{ label: 'Career & Salary' }]} />
          <div className="mt-3 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
              <Briefcase className="w-3.5 h-3.5" />
              <span>Indian Employment & Compensation</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Career & Salary Calculators
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Demystify your compensation package. Break down annual CTC into monthly in-hand take-home pay, calculate job switch and appraisal hikes, project your EPF retirement accumulations, and estimate intern stipends.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
        <AdPlaceholder slot="top-banner" />

        {/* Tools Grid */}
        <section>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
            Available Career & Salary Tools ({tools.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {tools.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </section>

        {/* Informational Guidance */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-3">
            Decoding Indian Payroll & CTC Structures
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Understanding the distinction between Cost to Company (CTC), Gross Salary, and In-Hand Salary ensures you make informed career transitions and negotiate offer letters with confidence.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <span className="font-bold text-emerald-900 block mb-1">Fixed vs Variable Pay</span>
              <p className="text-emerald-800">
                Variable bonuses are performance-linked and paid annually or quarterly, not in your recurring monthly bank transfer.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <span className="font-bold text-emerald-900 block mb-1">Tax Deductions (TDS)</span>
              <p className="text-emerald-800">
                Employers deduct estimated monthly Income Tax at source based on whether you elect the New or Old Tax Regime.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50/50 border border-emerald-100">
              <span className="font-bold text-emerald-900 block mb-1">EPFO Compound Growth</span>
              <p className="text-emerald-800">
                EPF offers sovereign, tax-exempt compound interest (declared annually by the Government around ~8.25%).
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Career & Salary FAQs</h2>
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
