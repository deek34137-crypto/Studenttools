'use client'

import React, { useState } from 'react'
import { calculateRatio } from '../../lib/calculators/general'
import { Minimize2 } from 'lucide-react'

export function RatioCalc() {
  const [a, setA] = useState<number>(36)
  const [b, setB] = useState<number>(48)

  const result = calculateRatio(a, b)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Antecedent (First Value A)
          </label>
          <input
            type="number"
            min="0"
            value={a}
            onChange={(e) => setA(parseFloat(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Consequent (Second Value B)
          </label>
          <input
            type="number"
            min="0"
            value={b}
            onChange={(e) => setB(parseFloat(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 text-white shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold flex items-center gap-1">
              <Minimize2 className="w-4 h-4" />
              Simplified Ratio
            </span>
            <div className="text-4xl sm:text-5xl font-black mt-1 text-white font-mono">
              {result.simplifiedString}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Reduced from {a} : {b} using greatest common divisor
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-4 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300">Decimal Equivalent:</span>
              <span className="font-bold text-white text-base">{result.decimalValue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Percentage Proportion:</span>
              <span className="font-bold text-emerald-300 text-base">{result.percentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
