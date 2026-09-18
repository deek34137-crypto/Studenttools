import type { Metadata } from 'next'
import { getToolsByCategory, CATEGORY_DEFINITIONS } from '../../data/tools'
import { ToolCard } from '../../components/ToolCard'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { AdPlaceholder } from '../../components/AdPlaceholder'
import { Calculator, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Everyday Calculators & Math Utilities | StudentTools',
  description:
    'Free online general calculators: scientific calculator, chronological age calculator, metric & imperial BMI, unit converter, date difference, shopping discount, and fraction simplifier.',
  alternates: {
    canonical: 'https://studenttools.cyou/calculators',
  },
}

export default function GeneralCalculatorsCategoryPage() {
  const tools = getToolsByCategory('calculators')

  const faqs = [
    {
      q: 'Does the scientific calculator support degree and radian angle modes?',
      a: 'Yes, you can toggle between DEG (degrees) and RAD (radians) mode seamlessly for trigonometric operations including sin, cos, tan, asin, acos, and atan.',
    },
    {
      q: 'How does the chronological age calculator handle leap years?',
      a: 'Our age calculation algorithm evaluates the precise number of calendar days in each intermediate month and accounts for leap years (such as February 29th) to yield exact years, months, and days.',
    },
    {
      q: 'What is the limitation of BMI for athletes and fitness enthusiasts?',
      a: 'Body Mass Index (BMI) evaluates body mass relative to height. Because dense skeletal muscle weighs more than fat tissue, muscular athletes may register in the overweight category despite low body fat percentages.',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          <Breadcrumbs items={[{ label: 'Everyday Calculators' }]} />
          <div className="mt-3 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-800 border border-slate-200 mb-3">
              <Calculator className="w-3.5 h-3.5" />
              <span>Universal Everyday Utilities</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Everyday Calculators & Conversions
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Fast, reliable mathematical utilities for daily life and study. Solve expressions with our safe scientific calculator, find exact age and birthday countdowns, check BMI scores, convert units, compute shopping discounts, and solve ratios.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
        <AdPlaceholder slot="top-banner" />

        {/* Tools Grid */}
        <section>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
            Available Everyday Calculators ({tools.length})
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
            Fast, Zero-Installation Mathematical Tools
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            Everyday arithmetic should be effortless. StudentTools provides pure mathematical engines built without heavy libraries, ensuring zero page lag and instant responsiveness on any device.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Safe Expression Parser</span>
              <p className="text-slate-600">
                Our scientific calculator uses a recursive descent mathematical tokenizer rather than hazardous browser eval().
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Standardized Unit Constants</span>
              <p className="text-slate-600">
                Unit conversion relies on internationally certified BIPM conversion factors for length, mass, and temperature.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <span className="font-bold text-slate-900 block mb-1">Business Day Calendar</span>
              <p className="text-slate-600">
                The date calculator segregates business workdays from weekend calendar days for scheduling project deadlines.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">General Calculator FAQs</h2>
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
