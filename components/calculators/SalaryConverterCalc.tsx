'use client'

import React, { useState } from 'react'
import { monthlyToAnnualSalary, annualToMonthlySalary } from '../../lib/calculators/career'
import { IndianRupee, ArrowLeftRight } from 'lucide-react'

interface SalaryConverterProps {
  initialMode?: 'monthly_to_annual' | 'annual_to_monthly'
}

export function SalaryConverterCalc({ initialMode = 'monthly_to_annual' }: SalaryConverterProps) {
  const [mode, setMode] = useState<'monthly_to_annual' | 'annual_to_monthly'>(initialMode)
  const [amount, setAmount] = useState<number>(mode === 'monthly_to_annual' ? 65000 : 800000)

  const result =
    mode === 'monthly_to_annual'
      ? monthlyToAnnualSalary(amount)
      : annualToMonthlySalary(amount)

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex p-1 bg-slate-100 rounded-xl max-w-sm">
        <button
          onClick={() => {
            setMode('monthly_to_annual')
            setAmount(65000)
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            mode === 'monthly_to_annual' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Monthly → Annual
        </button>
        <button
          onClick={() => {
            setMode('annual_to_monthly')
            setAmount(800000)
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            mode === 'annual_to_monthly' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Annual → Monthly
        </button>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          {mode === 'monthly_to_annual' ? 'Monthly Gross Salary (₹)' : 'Annual Package / CTC (₹)'}
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">
            ₹
          </span>
          <input
            type="number"
            min="0"
            value={amount}
            onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-extrabold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Result Breakdown Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              {mode === 'monthly_to_annual' ? 'Projected Annual Salary' : 'Equivalent Monthly Salary'}
            </span>
            <div className="text-3xl sm:text-5xl font-black mt-1 text-white">
              ₹
              {mode === 'monthly_to_annual'
                ? result.annualSalary.toLocaleString('en-IN')
                : result.monthlySalary.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Based on standard 12 calendar months pro-rata calculation.
            </p>
          </div>
        </div>

        {/* Detailed Timeline Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3 bg-white/10 rounded-xl">
            <span className="text-[10px] text-emerald-300 uppercase tracking-wider block">
              Quarterly (Every 3 Mo)
            </span>
            <div className="text-base sm:text-lg font-bold mt-0.5">
              ₹{result.quarterlySalary.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="p-3 bg-white/10 rounded-xl">
            <span className="text-[10px] text-emerald-300 uppercase tracking-wider block">
              Weekly Pay (52 Wks)
            </span>
            <div className="text-base sm:text-lg font-bold mt-0.5">
              ₹{result.weeklySalary.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="p-3 bg-white/10 rounded-xl">
            <span className="text-[10px] text-emerald-300 uppercase tracking-wider block">
              Daily (22 Working Days)
            </span>
            <div className="text-base sm:text-lg font-bold mt-0.5">
              ₹{result.dailySalary.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="p-3 bg-white/10 rounded-xl">
            <span className="text-[10px] text-emerald-300 uppercase tracking-wider block">
              Hourly Rate (8 Hrs/Day)
            </span>
            <div className="text-base sm:text-lg font-bold mt-0.5">
              ₹{result.hourlySalary.toLocaleString('en-IN')}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
