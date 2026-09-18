'use client'

import React, { useState } from 'react'
import { calculateDateDiff, calculateDateAddSubtract } from '../../lib/calculators/general'
import { Calendar, Clock, Plus, Minus } from 'lucide-react'

export function DateCalc() {
  const [mode, setMode] = useState<'difference' | 'add_subtract'>('difference')

  // Date Diff state
  const [d1, setD1] = useState<string>(() => new Date().toISOString().split('T')[0])
  const [d2, setD2] = useState<string>(() => {
    const d = new Date()
    d.setDate(d.getDate() + 45)
    return d.toISOString().split('T')[0]
  })

  // Add/Subtract state
  const [baseDate, setBaseDate] = useState<string>(() => new Date().toISOString().split('T')[0])
  const [daysCount, setDaysCount] = useState<number>(30)
  const [operation, setOperation] = useState<'add' | 'subtract'>('add')

  const diffResult = calculateDateDiff(d1, d2)
  const addSubResult = calculateDateAddSubtract(baseDate, daysCount, operation)

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex p-1 bg-slate-100 rounded-xl max-w-sm">
        <button
          onClick={() => setMode('difference')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            mode === 'difference' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Days Between Dates
        </button>
        <button
          onClick={() => setMode('add_subtract')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            mode === 'add_subtract' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Add / Subtract Days
        </button>
      </div>

      {mode === 'difference' ? (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Start Date</label>
              <input
                type="date"
                value={d1}
                onChange={(e) => setD1(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">End Date</label>
              <input
                type="date"
                value={d2}
                onChange={(e) => setD2(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 text-white shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold">
                  Total Duration
                </span>
                <div className="text-4xl sm:text-5xl font-black mt-1 text-white">
                  {diffResult.totalDays} <span className="text-xl font-normal text-sky-300">Days</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{diffResult.formattedSummary}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-4 text-xs">
              <div className="p-3 bg-white/10 rounded-xl">
                <span className="text-[10px] text-sky-300 uppercase block">Weeks & Days</span>
                <div className="text-base font-bold mt-0.5">
                  {diffResult.totalWeeks} w, {diffResult.remainingDays} d
                </div>
              </div>
              <div className="p-3 bg-white/10 rounded-xl">
                <span className="text-[10px] text-emerald-300 uppercase block">Business Days</span>
                <div className="text-base font-bold mt-0.5">{diffResult.businessDays} Days</div>
              </div>
              <div className="p-3 bg-white/10 rounded-xl">
                <span className="text-[10px] text-slate-400 uppercase block">Weekend Days</span>
                <div className="text-base font-bold mt-0.5">{diffResult.weekendDays} Days</div>
              </div>
              <div className="p-3 bg-white/10 rounded-xl">
                <span className="text-[10px] text-sky-300 uppercase block">Total Hours</span>
                <div className="text-base font-bold mt-0.5">{diffResult.totalDays * 24} hrs</div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Start Date</label>
              <input
                type="date"
                value={baseDate}
                onChange={(e) => setBaseDate(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Operation</label>
              <div className="flex gap-2">
                <button
                  onClick={() => setOperation('add')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                    operation === 'add'
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  + Add Days
                </button>
                <button
                  onClick={() => setOperation('subtract')}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                    operation === 'subtract'
                      ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  - Subtract Days
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Number of Days</label>
              <input
                type="number"
                min="1"
                value={daysCount}
                onChange={(e) => setDaysCount(Math.max(1, parseInt(e.target.value) || 1))}
                className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-lg focus:ring-2 focus:ring-sky-500"
              />
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 text-white shadow-xl">
            <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold">
              Calculated Target Date
            </span>
            <div className="text-3xl sm:text-4xl font-black mt-1 text-white">
              {addSubResult.resultFormatted}
            </div>
            <p className="text-xs text-slate-300 mt-1 font-medium">
              {addSubResult.dayOfWeek} ({addSubResult.resultDate})
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
