import type { Metadata } from 'next'
import { getToolsByCategory, CATEGORY_DEFINITIONS } from '../../data/tools'
import { ToolCard } from '../../components/ToolCard'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { AdPlaceholder } from '../../components/AdPlaceholder'
import { BookOpen, Award, CheckCircle2, HelpCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Student Tools & Academic Calculators | StudentTools',
  description:
    'Free academic calculators: CGPA to percentage, 75% attendance tracker, weighted semester GPA, marks percentage aggregator, and required exam score calculator.',
  alternates: {
    canonical: 'https://www.studenttools.cyou/student',
  },
}

export default function StudentCategoryPage() {
  const tools = getToolsByCategory('student')

  const faqs = [
    {
      q: 'Why does CBSE use a 9.5 multiplier for CGPA to percentage?',
      a: 'CBSE derived the 9.5 multiplier by analyzing the historical average percentage scored by the top 91-100 score band over multiple board examinations. For instance, an 8.0 CGPA equals 8.0 × 9.5 = 76.0%.',
    },
    {
      q: 'How is weighted GPA calculated from credit hours?',
      a: 'Semester GPA (SGPA) multiplies the numerical grade point of each subject by its credit hours to determine Quality Points. The sum of all Quality Points is then divided by the total semester credits.',
    },
    {
      q: 'How does the 75% attendance rule work?',
      a: 'Most Indian universities enforce a mandatory 75% attendance threshold to appear in end-semester examinations. If you have 30 out of 50 classes attended (60%), you must attend 30 more consecutive classes without absence to achieve 75% overall.',
    },
  ]

  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          <Breadcrumbs items={[{ label: 'Student Tools' }]} />
          <div className="mt-3 max-w-3xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
              <BookOpen className="w-3.5 h-3.5" />
              <span>School, College & University Academics</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Academic Calculators & Student Tools
            </h1>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Essential utilities to navigate academic semesters. Convert your CGPA using official university guidelines, track college attendance and safe bunk limits, compute semester SGPA, and calculate required marks for grade goals.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-10">
        <AdPlaceholder slot="top-banner" />

        {/* Tools Grid */}
        <section>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-4">
            Available Academic Tools ({tools.length})
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
            Academic Performance & Attendance Management
          </h2>
          <p className="text-slate-600 text-sm leading-relaxed mb-4">
            College semesters move fast. Whether you are balancing class attendance against competitive entrance prep or calculating grade thresholds for campus placement eligibility, having transparent numbers is key.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
              <span className="font-bold text-blue-900 block mb-1">Campus Placement Eligibility</span>
              <p className="text-blue-800">
                Most top tier recruiters require at least 60% or 6.5 CGPA with zero active backlogs across semesters.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
              <span className="font-bold text-blue-900 block mb-1">Strict Attendance Criteria</span>
              <p className="text-blue-800">
                A single missed class when near the 75% cutoff requires three consecutive attended sessions to recover.
              </p>
            </div>
            <div className="p-4 rounded-xl bg-blue-50/50 border border-blue-100">
              <span className="font-bold text-blue-900 block mb-1">Credit Weighting</span>
              <p className="text-blue-800">
                Core 4-credit courses impact your cumulative GPA twice as heavily as 2-credit elective or lab subjects.
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          <div className="flex items-center gap-2 mb-4">
            <HelpCircle className="w-5 h-5 text-sky-600" />
            <h2 className="text-lg sm:text-xl font-bold text-slate-900">Academic Frequently Asked Questions</h2>
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
