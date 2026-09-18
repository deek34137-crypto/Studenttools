import type { Metadata } from 'next'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { AlertTriangle, GraduationCap, IndianRupee, ShieldAlert, HeartPulse, Scale } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Disclaimer & Terms of Use | StudentTools',
  description:
    'Comprehensive legal, financial, academic, and health disclaimers for tools and calculators on StudentTools.cyou.',
  alternates: {
    canonical: 'https://studenttools.cyou/disclaimer',
  },
}

export default function DisclaimerPage() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-16">
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-10">
          <Breadcrumbs items={[{ label: 'Disclaimer' }]} />
          <div className="mt-3">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Disclaimer & Use of Estimates
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Last updated: September 2026 • Please read carefully before using any tool on StudentTools.cyou
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6 text-sm text-slate-700 leading-relaxed">
        {/* Notice Banner */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 sm:p-6 flex items-start gap-4">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h2 className="text-base font-bold text-amber-900">
              General Informational & Educational Purpose
            </h2>
            <p className="text-amber-800 text-xs sm:text-sm">
              All tools, calculators, rank estimators, tax models, and conversion algorithms on{' '}
              <strong>StudentTools.cyou</strong> are provided solely for general educational, illustrative, and informational purposes. They do not constitute official examination board notifications, legal counsel, certified tax auditing, professional financial advice, or medical screening.
            </p>
          </div>
        </div>

        {/* Section 1: JEE & Competitive Exams */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">1. JEE Main & Competitive Exam Estimators</h2>
              <p className="text-xs text-slate-500">Marks-to-percentile, rank predictors, and JoSAA cutoff insights</p>
            </div>
          </div>
          <div className="space-y-3 pt-2 text-slate-600">
            <p>
              Our JEE calculators (such as the Marks to Percentile Estimator, Percentile to Rank Predictor, and College Predictor) rely on historical JoSAA/CSAB counseling rounds, published NTA tie-breaking guidelines, and normalized statistical models from prior academic sessions.
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong>Session-to-Session Variance:</strong> Actual percentile scores are computed by the National Testing Agency (NTA) using multi-session normalization based on the exact candidate distribution and shift difficulty. Small shifts in paper difficulty or candidate count (e.g. 14–15+ lakh candidates) can cause noticeable variations in cutoffs.
              </li>
              <li>
                <strong>College Seat Allocations:</strong> College and branch predictions are indicative only. Closing ranks vary each year based on seat pool changes, new IIT/NIT/IIIT branches, reservation matrix shifts, and student preferences.
              </li>
              <li>
                <strong>Official Authority:</strong> For official scorecards, all India ranks, and counseling seat allocations, users must refer directly to the National Testing Agency (<a href="https://jeemain.nta.nic.in" target="_blank" rel="noopener noreferrer" className="text-sky-600 underline">jeemain.nta.nic.in</a>) and the Joint Seat Allocation Authority (<a href="https://josaa.nic.in" target="_blank" rel="noopener noreferrer" className="text-sky-600 underline">josaa.nic.in</a>).
              </li>
            </ul>
          </div>
        </div>

        {/* Section 2: Career, CTC & Salary Breakdowns */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">2. Career, CTC & Take-Home Salary Calculations</h2>
              <p className="text-xs text-slate-500">In-hand salary, PF statutory contributions, and hike projections</p>
            </div>
          </div>
          <div className="space-y-3 pt-2 text-slate-600">
            <p>
              The salary and CTC calculators simulate typical Indian corporate compensation structures (e.g., Basic at 40–50% of CTC, statutory Employee Provident Fund at 12% of Basic with standard statutory wage ceiling thresholds, and state-wise Professional Tax ceilings of ~₹200/month).
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong>Employer Policy Discretion:</strong> Actual pay slips may differ depending on variable compensation, performance bonus vesting schedules, flexible benefit plans (FBP), food coupons, group medical insurance premiums, and specific gratuity calculation models.
              </li>
              <li>
                <strong>Statutory Compliance:</strong> Consult your corporate HR department or payroll team for precise salary breakup agreements and Form 16 documentation.
              </li>
            </ul>
          </div>
        </div>

        {/* Section 3: Finance & Income Tax */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <IndianRupee className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">3. Finance, Investments & Income Tax Regulations</h2>
              <p className="text-xs text-slate-500">EMI amortization, mutual fund SIP compounding, and Indian tax regimes</p>
            </div>
          </div>
          <div className="space-y-3 pt-2 text-slate-600">
            <p>
              Our finance calculators (EMI, SIP, GST, FD, RD, and Income Tax) use standard mathematical formulas:
            </p>
            <ul className="list-disc list-inside space-y-1.5 pl-2">
              <li>
                <strong>Investment Returns:</strong> Mutual fund SIP projections assume a constant annual compound rate of return. Real mutual fund returns are subject to market volatility, NAV fluctuations, and fund manager performance. Past performance is no guarantee of future returns.
              </li>
              <li>
                <strong>Loan EMI Calculations:</strong> Real-world bank loans may involve processing fees, stamp duty, odd-day interest, fluctuating floating rates, and monthly reducing vs. annual rest balance conventions.
              </li>
              <li>
                <strong>Tax Regime Provisions:</strong> Tax calculations incorporate the standard provisions of the Union Budget (including New Tax Regime slabs under Section 115BAC, ₹75,000 standard deduction, and Section 87A rebate). Complex individual circumstances (capital gains, business deductions, surcharge, marginal relief) require consultation with a licensed Chartered Accountant (CA) or certified tax professional.
              </li>
            </ul>
          </div>
        </div>

        {/* Section 4: Health & BMI Screening */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <HeartPulse className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">4. Health & BMI Calculator Notice</h2>
              <p className="text-xs text-slate-500">World Health Organization (WHO) and Asian-Indian population cutoffs</p>
            </div>
          </div>
          <div className="space-y-3 pt-2 text-slate-600">
            <p>
              The Body Mass Index (BMI) calculator provides an anthropological screening metric based on height and weight. BMI does not directly measure body fat percentage, muscle mass, visceral fat, bone density, or metabolic cardiovascular health.
            </p>
            <p>
              It is not a diagnostic tool for nutritional status or chronic illness. Please consult a licensed medical physician, registered dietitian, or certified healthcare provider for comprehensive clinical evaluations.
            </p>
          </div>
        </div>

        {/* Section 5: Accuracy & Technical Availability */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-900">5. &quot;As Is&quot; and &quot;As Available&quot; Service</h2>
              <p className="text-xs text-slate-500">Limitation of liability and computation integrity</p>
            </div>
          </div>
          <div className="space-y-3 pt-2 text-slate-600">
            <p>
              While we rigorously test all computation modules against official benchmarks and edge cases (preventing errors, infinite loops, and division by zero), <strong>StudentTools.cyou</strong> makes no representations or warranties of any kind, express or implied, about the absolute completeness, accuracy, reliability, or suitability of the outputs.
            </p>
            <p>
              In no event shall StudentTools, its operators, or contributors be held liable for any loss, financial damage, academic decision, or inconvenience arising from the use of or inability to use this platform.
            </p>
          </div>
        </div>

        {/* Contact info */}
        <div className="text-center pt-4 text-xs text-slate-500">
          Have questions or noticed an anomaly in a calculation? Email us at{' '}
          <a href="mailto:support@studenttools.cyou" className="text-sky-600 underline">
            support@studenttools.cyou
          </a>
        </div>
      </div>
    </div>
  )
}
