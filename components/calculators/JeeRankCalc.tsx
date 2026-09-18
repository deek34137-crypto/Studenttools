'use client'

import React, { useState } from 'react'
import { estimateJeeRank } from '../../lib/calculators/jee'
import { Category } from '../../data/jee/types'
import { Award, AlertCircle } from 'lucide-react'

export function JeeRankCalc() {
  const [percentile, setPercentile] = useState<number>(98.5)
  const [candidates, setCandidates] = useState<number>(1450000)
  const [category, setCategory] = useState<Category>('OPEN')

  const result = estimateJeeRank(percentile, candidates, category)

  const presetPercentiles = [99.8, 99.2, 98.5, 96.0, 92.0, 85.0]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            NTA Percentile Score (0 – 100)
          </label>
          <input
            type="number"
            step="0.001"
            min="0"
            max="100"
            value={percentile}
            onChange={(e) => setPercentile(Math.max(0, Math.min(100, parseFloat(e.target.value) || 0)))}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold text-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
          <div className="flex flex-wrap gap-1 mt-2">
            {presetPercentiles.map((p) => (
              <button
                key={p}
                onClick={() => setPercentile(p)}
                className="px-2 py-0.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
              >
                {p}%
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Total Candidates Appeared
          </label>
          <input
            type="number"
            min="100000"
            max="2500000"
            value={candidates}
            onChange={(e) => setCandidates(parseInt(e.target.value) || 1450000)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold text-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
          <span className="text-[11px] text-slate-400 block mt-1">
            Approx 14.5 Lakh unique aspirants in recent sessions.
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold text-base focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          >
            <option value="OPEN">General (OPEN)</option>
            <option value="EWS">GEN-EWS</option>
            <option value="OBC-NCL">OBC-NCL</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
            <option value="OPEN-PwD">PwD</option>
          </select>
          <span className="text-[11px] text-slate-400 block mt-1">
            Category rank is approximated from demographic shares.
          </span>
        </div>
      </div>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="border-b sm:border-b-0 sm:border-r border-indigo-700/50 pb-4 sm:pb-0 sm:pr-6">
            <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              Estimated Common Rank List (CRL)
            </span>
            <div className="text-3xl sm:text-4xl font-black mt-2 text-white">
              #{result.estimatedCrlRank.toLocaleString('en-IN')}
            </div>
            <div className="text-xs text-indigo-200 mt-1">
              Estimated CRL Range:{' '}
              <strong className="text-white">
                #{result.rankRange.min.toLocaleString('en-IN')} – #{result.rankRange.max.toLocaleString('en-IN')}
              </strong>
            </div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold">
              Category Rank ({category})
            </span>
            <div className="text-3xl sm:text-4xl font-black mt-2 text-white">
              {result.estimatedCategoryRank
                ? `#${result.estimatedCategoryRank.toLocaleString('en-IN')}`
                : 'Same as CRL'}
            </div>
            <div className="text-xs text-indigo-200 mt-1">
              Based on ((100 - P) / 100) × {candidates.toLocaleString('en-IN')} formula.
            </div>
          </div>
        </div>

        <div className="mt-5 pt-4 border-t border-indigo-800 flex items-start gap-2 text-xs text-amber-300/90">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <span>{result.disclaimer}</span>
        </div>
      </div>
    </div>
  )
}
