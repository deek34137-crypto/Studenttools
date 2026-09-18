'use client'

import React, { useState } from 'react'
import { calculateSip } from '../../lib/calculators/finance'
import { TrendingUp, IndianRupee, PieChart } from 'lucide-react'

export function SipCalc() {
  const [monthly, setMonthly] = useState<number>(5000)
  const [returnRate, setReturnRate] = useState<number>(12)
  const [years, setYears] = useState<number>(10)

  const result = calculateSip({
    monthlyInvestment: monthly,
    expectedAnnualReturnRate: returnRate,
    tenureYears: years,
  })

  const monthlyPresets = [2000, 5000, 10000, 15000, 25000]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Monthly Investment Amount (₹)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">
              ₹
            </span>
            <input
              type="number"
              min="100"
              step="500"
              value={monthly}
              onChange={(e) => setMonthly(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-extrabold text-xl focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {monthlyPresets.map((p) => (
              <button
                key={p}
                onClick={() => setMonthly(p)}
                className="px-2 py-0.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
              >
                ₹{p.toLocaleString('en-IN')}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Expected Annual Return (%)
          </label>
          <input
            type="number"
            min="1"
            max="30"
            step="0.5"
            value={returnRate}
            onChange={(e) => setReturnRate(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-extrabold text-xl focus:ring-2 focus:ring-sky-500"
          />
          <span className="text-[11px] text-slate-400 block mt-1">Equity funds benchmark: 12% - 15%</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Time Horizon (Years)
          </label>
          <input
            type="number"
            min="1"
            max="40"
            value={years}
            onChange={(e) => setYears(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-extrabold text-xl focus:ring-2 focus:ring-sky-500"
          />
          <span className="text-[11px] text-slate-400 block mt-1">{years * 12} Installments</span>
        </div>
      </div>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 text-white shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold flex items-center justify-center sm:justify-start gap-1">
              <TrendingUp className="w-4 h-4" />
              Expected Maturity Wealth
            </span>
            <div className="text-4xl sm:text-5xl font-black mt-1 text-white">
              ₹{result.estimatedMaturityValue.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-300 mt-1">Projected total at {returnRate}% compound growth</p>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
              Total Capital Invested
            </span>
            <div className="text-2xl sm:text-3xl font-bold mt-1 text-white">
              ₹{result.totalInvested.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-400 mt-1">{years * 12} monthly contributions</p>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              Estimated Wealth Gain
            </span>
            <div className="text-2xl sm:text-3xl font-bold mt-1 text-emerald-300">
              ₹{result.estimatedGains.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {result.totalInvested > 0 ? ((result.estimatedGains / result.totalInvested) * 100).toFixed(0) : 0}% growth on capital
            </p>
          </div>
        </div>

        {/* Wealth Ratio Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800">
          <div className="flex justify-between text-xs text-slate-400 mb-1">
            <span>Invested Capital</span>
            <span>Estimated Gains</span>
          </div>
          <div className="w-full h-3 bg-white/20 rounded-full overflow-hidden flex">
            <div
              className="h-full bg-sky-400"
              style={{
                width: `${
                  result.estimatedMaturityValue > 0
                    ? (result.totalInvested / result.estimatedMaturityValue) * 100
                    : 50
                }%`,
              }}
            />
            <div
              className="h-full bg-emerald-400"
              style={{
                width: `${
                  result.estimatedMaturityValue > 0
                    ? (result.estimatedGains / result.estimatedMaturityValue) * 100
                    : 50
                }%`,
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
