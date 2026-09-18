'use client'

import React, { useState } from 'react'
import { calculatePf } from '../../lib/calculators/career'
import { ShieldCheck, IndianRupee } from 'lucide-react'

export function PfCalc() {
  const [basic, setBasic] = useState<number>(30000)
  const [tenure, setTenure] = useState<number>(5)
  const [useWageCeiling, setUseWageCeiling] = useState<boolean>(false)

  const result = calculatePf({
    monthlyBasic: basic,
    tenureYears: tenure,
    statutoryWageCeiling: useWageCeiling,
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Monthly Basic Salary + DA (₹)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">
              ₹
            </span>
            <input
              type="number"
              min="1000"
              step="1000"
              value={basic}
              onChange={(e) => setBasic(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Projection Horizon (Years)
          </label>
          <select
            value={tenure}
            onChange={(e) => setTenure(parseInt(e.target.value))}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold text-base focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          >
            {[1, 3, 5, 10, 15, 20, 25, 30].map((y) => (
              <option key={y} value={y}>
                {y} {y === 1 ? 'Year' : 'Years'}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="ceilingCheck"
          checked={useWageCeiling}
          onChange={(e) => setUseWageCeiling(e.target.checked)}
          className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
        />
        <label htmlFor="ceilingCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
          Apply statutory EPS wage cap (Cap EPS contribution to 8.33% of ₹15,000 = max ₹1,250/mo)
        </label>
      </div>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 text-white shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              Total Monthly PF Deposit
            </span>
            <div className="text-4xl sm:text-5xl font-black mt-1 text-white">
              ₹{result.totalMonthlyPfDeposit.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Projected balance in {tenure} years at {result.interestRateUsed}%:{' '}
              <strong className="text-emerald-300">
                ₹{result.projectedAccumulation.toLocaleString('en-IN')}
              </strong>
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-4 text-xs space-y-2">
            <span className="font-bold text-sky-300 uppercase tracking-wider text-[11px] block">
              Monthly Contribution Split
            </span>
            <div className="flex justify-between">
              <span className="text-slate-300">Employee Share (12%):</span>
              <span className="font-bold text-white">
                ₹{result.employeeContributionMonthly.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Employer EPF Share:</span>
              <span className="font-bold text-white">
                ₹{result.employerEpContributionMonthly.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Employer EPS (Pension):</span>
              <span className="font-bold text-white">
                ₹{result.employerEpsContributionMonthly.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
