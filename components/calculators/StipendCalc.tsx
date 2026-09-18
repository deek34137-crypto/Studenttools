'use client'

import React, { useState } from 'react'
import { calculateInternshipStipend } from '../../lib/calculators/career'
import { Briefcase, IndianRupee } from 'lucide-react'

export function StipendCalc() {
  const [rate, setRate] = useState<number>(25000)
  const [rateType, setRateType] = useState<'monthly' | 'hourly' | 'weekly' | 'daily'>('monthly')
  const [duration, setDuration] = useState<number>(6)
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(40)

  const result = calculateInternshipStipend({
    rate,
    rateType,
    durationMonths: duration,
    hoursPerWeek,
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Stipend Rate (₹)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">
              ₹
            </span>
            <input
              type="number"
              min="0"
              value={rate}
              onChange={(e) => setRate(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-lg focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Compensation Basis
          </label>
          <select
            value={rateType}
            onChange={(e) => setRateType(e.target.value as any)}
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:ring-2 focus:ring-sky-500"
          >
            <option value="monthly">Per Month (Fixed)</option>
            <option value="weekly">Per Week</option>
            <option value="hourly">Per Hour</option>
            <option value="daily">Per Day</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Internship Duration (Months)
          </label>
          <input
            type="number"
            min="1"
            max="24"
            value={duration}
            onChange={(e) => setDuration(Math.max(1, parseFloat(e.target.value) || 1))}
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-lg focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {rateType === 'hourly' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Working Hours / Week
            </label>
            <input
              type="number"
              min="5"
              max="60"
              value={hoursPerWeek}
              onChange={(e) => setHoursPerWeek(Math.max(5, parseFloat(e.target.value) || 40))}
              className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-lg focus:ring-2 focus:ring-sky-500"
            />
          </div>
        )}
      </div>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 text-white shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              Total Expected Internship Earnings
            </span>
            <div className="text-4xl sm:text-5xl font-black mt-1 text-white">
              ₹{result.totalExpectedStipend.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Average Monthly Payout:{' '}
              <strong className="text-emerald-300">
                ₹{result.averageMonthlyStipend.toLocaleString('en-IN')}/mo
              </strong>
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-4 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300">Duration:</span>
              <span className="font-bold text-white">{duration} Months</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Total Working Days:</span>
              <span className="font-bold text-white">~{result.totalWorkingDays} Days</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Total Working Hours:</span>
              <span className="font-bold text-white">~{result.totalWorkingHours} Hours</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
