'use client'

import React, { useState } from 'react'
import { calculateRequiredMarks } from '../../lib/calculators/student'
import { Target, CheckCircle2, AlertCircle } from 'lucide-react'

export function RequiredMarksCalc() {
  const [currentMarks, setCurrentMarks] = useState<number>(140)
  const [currentMax, setCurrentMax] = useState<number>(200)
  const [remainingMax, setRemainingMax] = useState<number>(100)
  const [targetPercentage, setTargetPercentage] = useState<number>(75)

  const result = calculateRequiredMarks(currentMarks, currentMax, remainingMax, targetPercentage)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Current Marks Scored
          </label>
          <input
            type="number"
            min="0"
            value={currentMarks}
            onChange={(e) => setCurrentMarks(parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-bold focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Current Maximum Marks
          </label>
          <input
            type="number"
            min="1"
            value={currentMax}
            onChange={(e) => setCurrentMax(parseFloat(e.target.value) || 1)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-bold focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Remaining Exam Max Marks
          </label>
          <input
            type="number"
            min="1"
            value={remainingMax}
            onChange={(e) => setRemainingMax(parseFloat(e.target.value) || 1)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-bold focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Desired Overall Target %
          </label>
          <input
            type="number"
            min="1"
            max="100"
            value={targetPercentage}
            onChange={(e) => setTargetPercentage(parseFloat(e.target.value) || 75)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-bold focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Result Card */}
      <div
        className={`p-6 rounded-2xl text-white shadow-lg ${
          result.isAchievable
            ? 'bg-gradient-to-br from-sky-700 to-indigo-900'
            : 'bg-gradient-to-br from-amber-800 to-slate-900'
        }`}
      >
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-sky-200 font-semibold flex items-center gap-1.5">
              <Target className="w-4 h-4 text-amber-300" />
              Marks Needed in Upcoming Exams
            </span>
            <div className="text-4xl sm:text-5xl font-black mt-1">
              {result.requiredMarks}{' '}
              <span className="text-base font-normal text-sky-200">
                / {remainingMax} marks
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-200 mt-2 font-medium">
              Requires <strong>{result.requiredPercentageInRemaining}%</strong> in the remaining exams.
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-4 text-xs text-slate-100 max-w-sm">
            <span className="font-bold block mb-1">Assessment Analysis:</span>
            {result.message}
          </div>
        </div>
      </div>
    </div>
  )
}
