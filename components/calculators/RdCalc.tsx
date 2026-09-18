'use client'

import React, { useState } from 'react'
import { calculateRd } from '../../lib/calculators/finance'
import { Repeat, IndianRupee } from 'lucide-react'

export function RdCalc() {
  const [monthly, setMonthly] = useState<number>(5000)
  const [rate, setRate] = useState<number>(6.8)
  const [months, setMonths] = useState<number>(24)

  const result = calculateRd({
    monthlyDeposit: monthly,
    annualInterestRate: rate,
    tenureMonths: months,
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Monthly Deposit (₹)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">
              ₹
            </span>
            <input
              type="number"
              min="500"
              step="500"
              value={monthly}
              onChange={(e) => setMonthly(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Annual Interest Rate (%)
          </label>
          <input
            type="number"
            min="1"
            max="15"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Tenure (Months)
          </label>
          <select
            value={months}
            onChange={(e) => setMonths(parseInt(e.target.value))}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold text-base focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          >
            {[6, 12, 24, 36, 48, 60].map((m) => (
              <option key={m} value={m}>
                {m} Months ({m / 12} {m / 12 === 1 ? 'Year' : 'Years'})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold flex items-center justify-center sm:justify-start gap-1">
              <Repeat className="w-4 h-4" />
              Total Maturity Proceeds
            </span>
            <div className="text-4xl sm:text-5xl font-black mt-1 text-white">
              ₹{result.maturityAmount.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-300 mt-1">Payable at end of {months} months</p>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
              Total Invested Principal
            </span>
            <div className="text-2xl sm:text-3xl font-bold mt-1 text-white">
              ₹{result.totalInvested.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-400 mt-1">{months} monthly deposits</p>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              Total Interest Earned
            </span>
            <div className="text-2xl sm:text-3xl font-bold mt-1 text-emerald-300">
              ₹{result.totalInterest.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-400 mt-1">Quarterly compounding</p>
          </div>
        </div>
      </div>
    </div>
  )
}
