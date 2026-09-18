'use client'

import React, { useState } from 'react'
import { estimateJeePercentile } from '../../lib/calculators/jee'
import { Info, AlertCircle } from 'lucide-react'

export function JeePercentileCalc() {
  const [marks, setMarks] = useState<number>(180)
  const [difficulty, setDifficulty] = useState<'easy' | 'moderate' | 'tough'>('moderate')

  const result = estimateJeePercentile(marks, difficulty)

  const presetMarks = [260, 210, 180, 150, 120, 90]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Total Marks in JEE Main (-75 to 300)
          </label>
          <input
            type="number"
            min="-75"
            max="300"
            value={marks}
            onChange={(e) => setMarks(parseInt(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold text-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
          {/* Presets */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            <span className="text-[11px] text-slate-400 py-1">Presets:</span>
            {presetMarks.map((p) => (
              <button
                key={p}
                onClick={() => setMarks(p)}
                className="px-2 py-0.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium transition-colors"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Assumed Shift Difficulty Level
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(['easy', 'moderate', 'tough'] as const).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold capitalize transition-colors border ${
                  difficulty === d
                    ? 'bg-sky-50 text-sky-700 border-sky-300 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-slate-500 mt-2">
            {difficulty === 'tough'
              ? 'Tough shift: lower scores yield higher percentiles due to relative scaling.'
              : difficulty === 'easy'
              ? 'Easy shift: high competition requires higher scores for top percentiles.'
              : 'Moderate shift: typical average JEE Main session difficulty.'}
          </p>
        </div>
      </div>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-800 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-sky-400">
              Estimated Percentile Range
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold mt-1 text-white">
              {result.lowerPercentile}% – {result.upperPercentile}%
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Midpoint Estimate:{' '}
              <strong className="text-sky-300 font-bold text-sm">
                ~{result.estimatedPercentile.toFixed(2)} percentile
              </strong>
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 p-3 rounded-xl text-xs text-slate-300 max-w-xs">
            <span className="font-semibold text-white block mb-0.5">Benchmark Model:</span>
            {result.modelDescription}
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-slate-700/80 flex items-start gap-2 text-xs text-amber-300/90">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-amber-400" />
          <span>{result.disclaimer}</span>
        </div>
      </div>
    </div>
  )
}
