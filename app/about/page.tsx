import type { Metadata } from 'next'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { GraduationCap, Zap, ShieldCheck, Heart, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About StudentTools — Mission, Methodology & Trust',
  description:
    'Learn about StudentTools.cyou, our commitment to 100% free educational tools, transparent calculation methodologies, and student privacy.',
  alternates: {
    canonical: 'https://www.studenttools.cyou/about',
  },
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          <Breadcrumbs items={[{ label: 'About Us' }]} />
          <div className="mt-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200 mb-3">
              <Sparkles className="w-3.5 h-3.5 text-sky-600" />
              <span>Our Platform Mission</span>
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              About StudentTools
            </h1>
            <p className="mt-3 text-base text-slate-600 leading-relaxed">
              StudentTools is an independent Indian educational utility platform dedicated to providing free, fast, and transparent calculators for students, job seekers, and everyday problem solvers.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-8 text-sm text-slate-700 leading-relaxed">
        {/* Origin & Why We Built This */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Why We Built StudentTools</h2>
          <p>
            The internet is crowded with calculator websites overloaded with intrusive popups, slow loading scripts, paywalls, and opaque formulas that don&apos;t cater to Indian educational and career realities.
          </p>
          <p>
            Indian students and professionals deal with specific systems: Class 12 board normalization, JoSAA counselling quotas, CBSE 9.5x CGPA multipliers, Indian EPF statutory contributions, and New vs Old income tax slabs.
          </p>
          <p>
            StudentTools was engineered to solve this problem by providing a clean, blazing-fast, mobile-first utility platform built around authentic Indian standards and mathematical transparency.
          </p>
        </section>

        {/* Core Principles */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Our Guiding Engineering Principles</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-sky-100 text-sky-600 flex items-center justify-center shrink-0 mt-0.5">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Client-Side Computation</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Calculations occur directly on your local device. We don&apos;t store your marks, salary numbers, or inputs on remote servers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Transparent Methodology</h3>
                <p className="text-xs text-slate-600 mt-1">
                  We clearly display the underlying formulas, step-by-step mathematical logic, and assumptions behind every tool.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center shrink-0 mt-0.5">
                <GraduationCap className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Truth in Estimates</h3>
                <p className="text-xs text-slate-600 mt-1">
                  We never claim statistical models are official results. JEE predictions, salary take-homes, and tax estimates are clearly demarcated with error boundaries.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center shrink-0 mt-0.5">
                <Heart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-base">Always Free Access</h3>
                <p className="text-xs text-slate-600 mt-1">
                  Education and essential mathematical tools should be universally accessible without sign-ups or subscriptions.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Data Quality & Sourcing */}
        <section className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-3">
          <h2 className="text-xl font-bold text-slate-900">Data Architecture & Verification</h2>
          <p>
            Our JEE cutoff datasets are structured directly from official Joint Seat Allocation Authority (JoSAA) public counselling records. Tax engines are updated against the latest Finance Act notifications published by the Ministry of Finance, Government of India.
          </p>
          <p>
            We continuously audit calculation algorithms to ensure compliance with updated examination policies and statutory fiscal regulations.
          </p>
        </section>
      </div>
    </div>
  )
}
