'use client'

import React, { useState } from 'react'
import { calculateFd } from '../../lib/calculators/finance'
import { PiggyBank, IndianRupee } from 'lucide-react'

export function FdCalc() {
  const [principal, setPrincipal] = useState<number>(100000)
  const [rate, setRate] = useState<number>(7.1)
  const [years, setYears] = useState<number>(3)
  const [isSenior, setIsSenior] = useState<boolean>(false)

  const result = calculateFd({
    principal,
    annualInterestRate: rate,
    tenureYears: years,
    isSeniorCitizen: isSenior,
  })

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Deposit Amount (Principal ₹)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">
              ₹
            </span>
            <input
              type="number"
              min="1000"
              step="5000"
              value={principal}
              onChange={(e) => setPrincipal(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Interest Rate (% p.a.)
          </label>
          <input
            type="number"
            min="1"
            max="15"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
          <span className="text-[11px] text-slate-400 block mt-1">
            {isSenior ? `Includes +0.50% senior citizen bonus (${result.annualInterestRate}%)` : 'Standard bank rate'}
          </span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Tenure (Years)
          </label>
          <input
            type="number"
            min="0.5"
            max="10"
            step="0.5"
            value={years}
            onChange={(e) => setYears(Math.max(0.25, parseFloat(e.target.value) || 1))}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="seniorCheck"
          checked={isSenior}
          onChange={(e) => setIsSenior(e.target.checked)}
          className="rounded text-sky-600 focus:ring-sky-500 w-4 h-4"
        />
        <label htmlFor="seniorCheck" className="text-xs text-slate-700 font-medium cursor-pointer">
          Senior Citizen (Adds +0.50% interest rate premium standard across Indian banks)
        </label>
      </div>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 text-white shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold flex items-center justify-center sm:justify-start gap-1">
              <PiggyBank className="w-4 h-4" />
              Maturity Amount
            </span>
            <div className="text-4xl sm:text-5xl font-black mt-1 text-white">
              ₹{result.maturityAmount.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-300 mt-1">Quarterly compounding applied</p>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-400 font-semibold">
              Total Interest Earned
            </span>
            <div className="text-2xl sm:text-3xl font-bold mt-1 text-emerald-300">
              ₹{result.totalInterestEarned.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-400 mt-1">Over {years} years</p>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-slate-300 font-semibold">
              Effective Annual Yield
            </span>
            <div className="text-2xl sm:text-3xl font-bold mt-1 text-white">
              {result.effectiveYieldPercentage}%
            </div>
            <p className="text-xs text-slate-400 mt-1">Compound annualized return</p>
          </div>
        </div>
      </div>
    </div>
  )
}
