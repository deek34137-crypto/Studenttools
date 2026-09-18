'use client'

import React, { useState } from 'react'
import { calculateProfitLoss } from '../../lib/calculators/general'
import { TrendingUp, TrendingDown, IndianRupee } from 'lucide-react'

export function ProfitLossCalc() {
  const [cp, setCp] = useState<number>(1500)
  const [sp, setSp] = useState<number>(1950)

  const result = calculateProfitLoss(cp, sp)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Cost Price - CP (₹)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">
              ₹
            </span>
            <input
              type="number"
              min="0"
              value={cp}
              onChange={(e) => setCp(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Selling Price - SP (₹)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">
              ₹
            </span>
            <input
              type="number"
              min="0"
              value={sp}
              onChange={(e) => setSp(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>
        </div>
      </div>

      {/* Result Card */}
      <div
        className={`p-6 rounded-2xl text-white shadow-xl ${
          result.status === 'profit'
            ? 'bg-gradient-to-br from-emerald-900 to-slate-900'
            : result.status === 'loss'
            ? 'bg-gradient-to-br from-rose-950 to-slate-900'
            : 'bg-gradient-to-br from-slate-900 to-slate-800'
        }`}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold flex items-center gap-1">
              {result.status === 'profit' ? (
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-400" />
              )}
              {result.status === 'profit'
                ? 'Net Profit'
                : result.status === 'loss'
                ? 'Net Loss'
                : 'Break-Even (No Profit / No Loss)'}
            </span>
            <div className="text-4xl sm:text-5xl font-black mt-1 text-white">
              ₹{result.amount.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-300 mt-1">{result.summary}</p>
          </div>

          <div className="bg-white/10 rounded-xl p-4 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300">Margin Percentage:</span>
              <span
                className={`font-black text-base ${
                  result.status === 'profit' ? 'text-emerald-300' : 'text-rose-300'
                }`}
              >
                {result.percentage}%
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Cost Price (CP):</span>
              <span className="font-bold text-white">₹{cp.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Selling Price (SP):</span>
              <span className="font-bold text-white">₹{sp.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
