'use client'

import React, { useState } from 'react'
import { calculateSalaryHike } from '../../lib/calculators/career'
import { TrendingUp, ArrowUpRight, IndianRupee } from 'lucide-react'

export function SalaryHikeCalc() {
  const [currentSalary, setCurrentSalary] = useState<number>(700000)
  const [hikePercentage, setHikePercentage] = useState<number>(20)

  const result = calculateSalaryHike(currentSalary, hikePercentage)

  const hikePresets = [10, 15, 20, 25, 30, 40]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Current Annual Salary (₹)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">
              ₹
            </span>
            <input
              type="number"
              min="0"
              step="10000"
              value={currentSalary}
              onChange={(e) => setCurrentSalary(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Expected Hike / Increment Percentage (%)
          </label>
          <input
            type="number"
            min="0"
            max="300"
            step="0.5"
            value={hikePercentage}
            onChange={(e) => setHikePercentage(parseFloat(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
          {/* Quick presets */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {hikePresets.map((p) => (
              <button
                key={p}
                onClick={() => setHikePercentage(p)}
                className="px-2 py-0.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
              >
                +{p}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-emerald-950 text-white shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold flex items-center gap-1">
              <TrendingUp className="w-4 h-4" />
              Revised Annual Salary
            </span>
            <div className="text-4xl sm:text-5xl font-black mt-1 text-white">
              ₹{result.newSalaryAnnual.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Revised Monthly Gross:{' '}
              <strong className="text-emerald-300">
                ₹{result.newSalaryMonthly.toLocaleString('en-IN')}/mo
              </strong>
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-4 text-xs space-y-2">
            <span className="font-bold text-emerald-300 uppercase tracking-wider text-[11px] block">
              Increment Highlights
            </span>
            <div className="flex justify-between">
              <span className="text-slate-300">Total Annual Gain:</span>
              <span className="font-bold text-white text-sm">
                +₹{result.incrementAmountAnnual.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Monthly Hike Amount:</span>
              <span className="font-bold text-white text-sm">
                +₹{result.incrementAmountMonthly.toLocaleString('en-IN')}/mo
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Increment %:</span>
              <span className="font-bold text-emerald-400">+{result.hikePercentage}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
