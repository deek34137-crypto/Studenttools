'use client'

import React, { useState } from 'react'
import { cgpaToPercentage, CgpaMethod } from '../../lib/calculators/student'
import { Award, Info } from 'lucide-react'

export function CgpaCalc() {
  const [cgpa, setCgpa] = useState<number>(8.5)
  const [method, setMethod] = useState<CgpaMethod>('cbse')

  const result = cgpaToPercentage(cgpa, method)

  const presets = [9.8, 9.0, 8.5, 8.0, 7.5, 7.0]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Enter CGPA (10-Point Scale)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            max="10"
            value={cgpa}
            onChange={(e) => setCgpa(Math.max(0, Math.min(10, parseFloat(e.target.value) || 0)))}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
          <div className="flex flex-wrap gap-1.5 mt-2">
            {presets.map((p) => (
              <button
                key={p}
                onClick={() => setCgpa(p)}
                className="px-2 py-0.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Conversion Formula / University
          </label>
          <select
            value={method}
            onChange={(e) => setMethod(e.target.value as CgpaMethod)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          >
            <option value="cbse">CBSE Standard (9.5× Multiplier)</option>
            <option value="ten_factor">Direct 10× Multiplier</option>
            <option value="vtu">VTU Belagavi ((CGPA - 0.75) × 10)</option>
            <option value="mumbai">Mumbai University (7.1/7.2 Formula)</option>
          </select>
          <p className="text-[11px] text-slate-500 mt-2">
            Selected Formula: <strong className="text-slate-800">{result.formula}</strong>
          </p>
        </div>
      </div>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-600 to-sky-800 text-white shadow-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-sky-200 font-semibold flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-300" />
            Equivalent Percentage
          </span>
          <div className="text-4xl sm:text-5xl font-black mt-1">
            {result.percentage}%
          </div>
          <p className="text-xs text-sky-100 mt-1">
            CGPA {result.cgpa} calculated via {result.methodName}
          </p>
        </div>

        <div className="bg-sky-900/40 border border-sky-400/30 p-3.5 rounded-xl text-xs text-sky-100 max-w-sm">
          <div className="font-bold mb-1 flex items-center gap-1">
            <Info className="w-3.5 h-3.5 text-sky-300" />
            Calculation Note:
          </div>
          {result.disclaimer}
        </div>
      </div>
    </div>
  )
}
