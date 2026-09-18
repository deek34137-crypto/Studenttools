'use client'

import React, { useState } from 'react'
import { calculateIncrement } from '../../lib/calculators/career'
import { ArrowUpRight, ArrowDownRight, IndianRupee } from 'lucide-react'

export function IncrementCalc() {
  const [oldSalary, setOldSalary] = useState<number>(600000)
  const [newSalary, setNewSalary] = useState<number>(850000)

  const result = calculateIncrement(oldSalary, newSalary)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Previous / Current CTC (₹)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">
              ₹
            </span>
            <input
              type="number"
              min="0"
              step="10000"
              value={oldSalary}
              onChange={(e) => setOldSalary(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Offered / Revised CTC (₹)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">
              ₹
            </span>
            <input
              type="number"
              min="0"
              step="10000"
              value={newSalary}
              onChange={(e) => setNewSalary(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold flex items-center gap-1">
              {result.isHike ? (
                <ArrowUpRight className="w-4 h-4 text-emerald-400" />
              ) : (
                <ArrowDownRight className="w-4 h-4 text-red-400" />
              )}
              Calculated Hike Percentage
            </span>
            <div className="text-4xl sm:text-5xl font-black mt-1 text-white">
              {result.percentageHike >= 0 ? `+${result.percentageHike}%` : `${result.percentageHike}%`}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Increase from ₹{oldSalary.toLocaleString('en-IN')} to ₹{newSalary.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-4 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300">Annual Increment:</span>
              <span className="font-bold text-white text-sm">
                ₹{result.absoluteIncreaseAnnual.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Monthly Addition:</span>
              <span className="font-bold text-white text-sm">
                ₹{result.absoluteIncreaseMonthly.toLocaleString('en-IN')}/mo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
