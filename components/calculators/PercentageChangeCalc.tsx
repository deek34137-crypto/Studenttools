'use client'

import React, { useState } from 'react'
import { calculatePercentageChange } from '../../lib/calculators/general'
import { TrendingUp, TrendingDown, ArrowRight } from 'lucide-react'

export function PercentageChangeCalc() {
  const [initialVal, setInitialVal] = useState<number>(50)
  const [finalVal, setFinalVal] = useState<number>(75)

  const result = calculatePercentageChange(initialVal, finalVal)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Initial / Starting Value
          </label>
          <input
            type="number"
            value={initialVal}
            onChange={(e) => setInitialVal(parseFloat(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Final / New Value
          </label>
          <input
            type="number"
            value={finalVal}
            onChange={(e) => setFinalVal(parseFloat(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Result Card */}
      <div
        className={`p-6 rounded-2xl text-white shadow-xl ${
          result.status === 'increase'
            ? 'bg-gradient-to-br from-emerald-900 to-slate-900'
            : result.status === 'decrease'
            ? 'bg-gradient-to-br from-rose-950 to-slate-900'
            : 'bg-gradient-to-br from-slate-900 to-slate-800'
        }`}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-white/10">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-1">
              {result.status === 'increase' ? (
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-400" />
              )}
              {result.status === 'increase'
                ? 'Percentage Increase'
                : result.status === 'decrease'
                ? 'Percentage Decrease'
                : 'No Change'}
            </span>
            <div className="text-4xl sm:text-5xl font-black mt-1 text-white">
              {result.percentageChange >= 0 ? `+${result.percentageChange}%` : `${result.percentageChange}%`}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Absolute change of {result.absoluteChange >= 0 ? `+${result.absoluteChange}` : result.absoluteChange}
            </p>
          </div>
        </div>

        {/* Step-by-Step Breakdown */}
        <div className="mt-4">
          <h4 className="text-xs uppercase tracking-wider font-bold text-slate-300 mb-2">
            Step-by-Step Mathematical Resolution:
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-200 font-mono">
            {result.steps.map((st, i) => (
              <li key={i} className="flex items-start gap-2">
                <ArrowRight className="w-3.5 h-3.5 text-sky-400 shrink-0 mt-0.5" />
                <span>{st}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
