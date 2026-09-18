import Link from 'next/link'
import { GraduationCap, ShieldAlert } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand & Mission Column */}
          <div className="col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-sky-500 flex items-center justify-center text-white">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white">
                Student<span className="text-sky-400">Tools</span>
              </span>
            </Link>
            <p className="text-slate-400 text-xs sm:text-sm leading-relaxed max-w-sm">
              Free, fast, client-side calculators and educational utilities designed for Indian students, competitive exam aspirants, freshers, and working professionals.
            </p>
            <div className="pt-2 text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-slate-400 shrink-0" />
              <span>Calculations are executed client-side for speed and privacy.</span>
            </div>
          </div>

          {/* Academic & JEE */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Exams & Academic
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/jee/marks-to-percentile" className="hover:text-white transition-colors">
                  JEE Marks to Percentile
                </Link>
              </li>
              <li>
                <Link href="/jee/percentile-to-rank" className="hover:text-white transition-colors">
                  JEE Percentile to Rank
                </Link>
              </li>
              <li>
                <Link href="/jee/college-predictor" className="hover:text-white transition-colors">
                  JEE College Predictor
                </Link>
              </li>
              <li>
                <Link href="/student/cgpa-to-percentage" className="hover:text-white transition-colors">
                  CGPA to Percentage
                </Link>
              </li>
              <li>
                <Link href="/student/attendance-calculator" className="hover:text-white transition-colors">
                  Attendance Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Career & Finance */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Career & Finance
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/career/ctc-to-in-hand" className="hover:text-white transition-colors">
                  CTC to In-Hand Salary
                </Link>
              </li>
              <li>
                <Link href="/career/salary-hike" className="hover:text-white transition-colors">
                  Salary Hike Calculator
                </Link>
              </li>
              <li>
                <Link href="/career/pf-calculator" className="hover:text-white transition-colors">
                  PF Contribution
                </Link>
              </li>
              <li>
                <Link href="/finance/emi-calculator" className="hover:text-white transition-colors">
                  Loan EMI Calculator
                </Link>
              </li>
              <li>
                <Link href="/finance/tax-calculator" className="hover:text-white transition-colors">
                  Income Tax Calculator
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Legal */}
          <div>
            <h4 className="text-white text-xs font-semibold uppercase tracking-wider mb-4">
              Trust & Legal
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About StudentTools
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact Support
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/disclaimer" className="hover:text-white transition-colors">
                  Full Disclaimers
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {currentYear} StudentTools. Built for Indian students and professionals.</p>
          <p className="text-center sm:text-right">
            Results provided are for informational and planning purposes.
          </p>
        </div>
      </div>
    </footer>
  )
}
