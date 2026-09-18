'use client'

import React, { useState } from 'react'
import { calculatePercentage } from '../../lib/calculators/student'
import { Percent, ArrowRight } from 'lucide-react'

export function PercentageCalc() {
  const [tab, setTab] = useState<'x_of_y' | 'increase' | 'decrease' | 'difference'>('x_of_y')
  const [a, setA] = useState<number>(450)
  const [b, setB] = useState<number>(500)

  const result = calculatePercentage(tab, a, b)

  const tabs: { id: 'x_of_y' | 'increase' | 'decrease' | 'difference'; label: string }[] = [
    { id: 'x_of_y', label: 'X out of Y' },
    { id: 'increase', label: 'Percentage Increase' },
    { id: 'decrease', label: 'Percentage Decrease' },
    { id: 'difference', label: 'Percentage Difference' },
  ]

  return (
    <div className="space-y-6">
      {/* Tabs */}
      <div className="flex flex-wrap p-1 bg-slate-100 rounded-xl gap-1">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-colors ${
              tab === t.id ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {tab === 'x_of_y' ? 'Obtained Value (X)' : 'Initial / First Value (A)'}
          </label>
          <input
            type="number"
            value={a}
            onChange={(e) => setA(parseFloat(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {tab === 'x_of_y' ? 'Total / Base Value (Y)' : 'Final / Second Value (B)'}
          </label>
          <input
            type="number"
            value={b}
            onChange={(e) => setB(parseFloat(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 text-white shadow-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Calculated Result
            </span>
            <div className="text-3xl sm:text-5xl font-black mt-1 text-white">
              {result.formatted}
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 font-mono">
              {result.explanation}
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-4 text-xs text-sky-100 max-w-xs">
            <span className="font-semibold block text-white mb-1">Method Applied:</span>
            {tab === 'x_of_y' && 'Part divided by whole, multiplied by 100.'}
            {tab === 'increase' && 'Change relative to initial value, multiplied by 100.'}
            {tab === 'decrease' && 'Reduction relative to initial baseline.'}
            {tab === 'difference' && 'Absolute difference divided by the average of both values.'}
          </div>
        </div>
      </div>
    </div>
  )
}
