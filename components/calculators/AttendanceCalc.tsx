'use client'

import React, { useState } from 'react'
import { calculateAttendance } from '../../lib/calculators/student'
import { UserCheck, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react'

export function AttendanceCalc() {
  const [attended, setAttended] = useState<number>(36)
  const [total, setTotal] = useState<number>(48)
  const [target, setTarget] = useState<number>(75)

  const result = calculateAttendance(attended, total, target)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Classes Attended
          </label>
          <input
            type="number"
            min="0"
            max={total}
            value={attended}
            onChange={(e) => setAttended(Math.max(0, Math.min(total, parseInt(e.target.value) || 0)))}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Total Classes Conducted
          </label>
          <input
            type="number"
            min="1"
            value={total}
            onChange={(e) => {
              const newTotal = Math.max(1, parseInt(e.target.value) || 1)
              setTotal(newTotal)
              if (attended > newTotal) setAttended(newTotal)
            }}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Target Attendance %
          </label>
          <div className="flex gap-1.5">
            {[75, 80, 85, 90].map((t) => (
              <button
                key={t}
                onClick={() => setTarget(t)}
                className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors border ${
                  target === t
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {t}%
              </button>
            ))}
          </div>
          <input
            type="range"
            min="50"
            max="95"
            value={target}
            onChange={(e) => setTarget(parseInt(e.target.value))}
            className="w-full mt-2 accent-sky-600"
          />
        </div>
      </div>

      {/* Visual Percentage Progress Bar */}
      <div>
        <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
          <span>Current: {result.currentPercentage}%</span>
          <span>Target: {result.targetPercentage}%</span>
        </div>
        <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5">
          <div
            className={`h-full rounded-full transition-all duration-300 ${
              result.currentPercentage >= target ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            style={{ width: `${Math.min(100, result.currentPercentage)}%` }}
          />
        </div>
      </div>

      {/* Result Status Cards */}
      <div
        className={`p-6 rounded-2xl border shadow-md ${
          result.currentPercentage >= target
            ? 'bg-gradient-to-br from-emerald-800 to-slate-900 text-white border-emerald-700'
            : 'bg-gradient-to-br from-amber-900 to-slate-900 text-white border-amber-700'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-sky-400" />
              Current Attendance
            </span>
            <div className="text-4xl sm:text-5xl font-black mt-1">
              {result.currentPercentage}%
            </div>
            <div className="text-xs text-slate-300 mt-1">
              {result.attended} of {result.totalConducted} classes attended
            </div>
          </div>

          <div className="sm:col-span-2 sm:border-l sm:border-white/10 sm:pl-6 space-y-3">
            {result.status === 'above_target' ? (
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-400/30 mb-2">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Above Target Criteria</span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-white">
                  You can safely miss{' '}
                  <span className="text-emerald-300 font-black text-2xl underline">
                    {result.bunkableClasses}
                  </span>{' '}
                  {result.bunkableClasses === 1 ? 'class' : 'classes'}
                </div>
                <p className="text-xs text-slate-300 mt-1">{result.summary}</p>
              </div>
            ) : result.status === 'below_target' ? (
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30 mb-2">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Below Target Criteria</span>
                </div>
                <div className="text-lg sm:text-xl font-bold text-white">
                  Must attend next{' '}
                  <span className="text-amber-300 font-black text-2xl underline">
                    {result.classesNeeded}
                  </span>{' '}
                  consecutive {result.classesNeeded === 1 ? 'class' : 'classes'}
                </div>
                <p className="text-xs text-slate-300 mt-1">{result.summary}</p>
              </div>
            ) : (
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-500/20 text-sky-300 text-xs font-bold border border-sky-400/30 mb-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Exactly on Target</span>
                </div>
                <p className="text-sm text-white font-medium">{result.summary}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
