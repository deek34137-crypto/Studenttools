'use client'

import React, { useState } from 'react'
import { calculateAge } from '../../lib/calculators/general'
import { Calendar, Smile, Cake } from 'lucide-react'

export function AgeCalc() {
  const [dob, setDob] = useState<string>('2000-08-15')
  const [asOfDate, setAsOfDate] = useState<string>(() => new Date().toISOString().split('T')[0])

  const result = calculateAge(dob, asOfDate)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Date of Birth (DOB)
          </label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDob(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Age as of Date (Today by default)
          </label>
          <input
            type="date"
            value={asOfDate}
            onChange={(e) => setAsOfDate(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div>
            <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold flex items-center gap-1.5">
              <Smile className="w-4 h-4" />
              Exact Chronological Age
            </span>
            <div className="text-3xl sm:text-5xl font-black mt-1 text-white">
              {result.years} <span className="text-xl font-normal text-sky-300">Years</span>,{' '}
              {result.months} <span className="text-xl font-normal text-sky-300">Months</span>,{' '}
              {result.days} <span className="text-xl font-normal text-sky-300">Days</span>
            </div>
            {result.isBirthdayToday && (
              <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full bg-amber-400 text-slate-950 font-bold text-xs">
                <Cake className="w-4 h-4" />
                <span>Happy Birthday! Today is your special day!</span>
              </div>
            )}
          </div>

          <div className="bg-white/10 rounded-xl p-4 text-xs text-sky-100 max-w-xs">
            <span className="font-semibold block text-white mb-1">Next Birthday:</span>
            {result.daysUntilNextBirthday === 0 ? (
              <span className="font-bold text-amber-300">Today!</span>
            ) : (
              <span>
                In <strong>{result.daysUntilNextBirthday} days</strong> ({result.nextBirthdayDayOfWeek})
              </span>
            )}
          </div>
        </div>

        {/* Detailed Timespans */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
          <div className="p-3 bg-white/10 rounded-xl">
            <span className="text-[10px] text-sky-300 uppercase tracking-wider block">Total Days Lived</span>
            <div className="text-base sm:text-xl font-bold mt-0.5">
              {result.totalDays.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="p-3 bg-white/10 rounded-xl">
            <span className="text-[10px] text-sky-300 uppercase tracking-wider block">Total Weeks</span>
            <div className="text-base sm:text-xl font-bold mt-0.5">
              {result.totalWeeks.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="p-3 bg-white/10 rounded-xl">
            <span className="text-[10px] text-sky-300 uppercase tracking-wider block">Total Hours</span>
            <div className="text-base sm:text-xl font-bold mt-0.5">
              {result.totalHours.toLocaleString('en-IN')}
            </div>
          </div>

          <div className="p-3 bg-white/10 rounded-xl">
            <span className="text-[10px] text-sky-300 uppercase tracking-wider block">Months + Days</span>
            <div className="text-base sm:text-xl font-bold mt-0.5">
              {result.years * 12 + result.months} m, {result.days} d
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
