'use client'

import React, { useState } from 'react'
import { calculateEmi } from '../../lib/calculators/finance'
import { CreditCard, IndianRupee, Table } from 'lucide-react'

export function EmiCalc() {
  const [principal, setPrincipal] = useState<number>(1000000)
  const [rate, setRate] = useState<number>(9.5)
  const [tenureYears, setTenureYears] = useState<number>(5)
  const [showAmortization, setShowAmortization] = useState<boolean>(false)

  const result = calculateEmi({
    principal,
    annualInterestRate: rate,
    tenureYears,
  })

  const principalPresets = [200000, 500000, 1000000, 2500000, 5000000]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Loan Amount (Principal ₹)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">
              ₹
            </span>
            <input
              type="number"
              min="0"
              step="10000"
              value={principal}
              onChange={(e) => setPrincipal(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-extrabold text-xl focus:ring-2 focus:ring-sky-500"
            />
          </div>
          <div className="flex flex-wrap gap-1 mt-2">
            {principalPresets.map((p) => (
              <button
                key={p}
                onClick={() => setPrincipal(p)}
                className="px-2 py-0.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
              >
                ₹{(p / 100000).toFixed(0)}L
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Interest Rate (% p.a.)
          </label>
          <input
            type="number"
            min="0"
            max="40"
            step="0.1"
            value={rate}
            onChange={(e) => setRate(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-extrabold text-xl focus:ring-2 focus:ring-sky-500"
          />
          <span className="text-[11px] text-slate-400 block mt-1">Typical: 8.5% - 14%</span>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Loan Tenure (Years)
          </label>
          <input
            type="number"
            min="1"
            max="30"
            value={tenureYears}
            onChange={(e) => setTenureYears(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-extrabold text-xl focus:ring-2 focus:ring-sky-500"
          />
          <span className="text-[11px] text-slate-400 block mt-1">{tenureYears * 12} Monthly Payments</span>
        </div>
      </div>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-900 to-slate-900 text-white shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold flex items-center justify-center sm:justify-start gap-1">
              <CreditCard className="w-4 h-4 text-sky-400" />
              Monthly Loan EMI
            </span>
            <div className="text-4xl sm:text-5xl font-black mt-1 text-white">
              ₹{result.monthlyEmi.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-indigo-200 mt-1">Payable each month for {result.tenureMonths} months</p>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold">
              Total Interest Payable
            </span>
            <div className="text-2xl sm:text-3xl font-bold mt-1 text-amber-300">
              ₹{result.totalInterest.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-indigo-200 mt-1">
              {principal > 0 ? ((result.totalInterest / principal) * 100).toFixed(1) : 0}% of loan amount
            </p>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold">
              Total Payment (P + I)
            </span>
            <div className="text-2xl sm:text-3xl font-bold mt-1 text-white">
              ₹{result.totalPayment.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-indigo-200 mt-1">Combined Principal and Interest</p>
          </div>
        </div>

        {/* Toggle Amortization Button */}
        <div className="mt-6 pt-4 border-t border-indigo-800 flex justify-between items-center">
          <button
            onClick={() => setShowAmortization(!showAmortization)}
            className="text-xs font-semibold text-sky-300 hover:text-sky-200 flex items-center gap-1.5"
          >
            <Table className="w-3.5 h-3.5" />
            <span>{showAmortization ? 'Hide Amortization Schedule' : 'View Yearly Amortization Schedule'}</span>
          </button>
          <span className="text-xs text-indigo-300">Reducing balance compounding</span>
        </div>

        {/* Amortization Table */}
        {showAmortization && (
          <div className="mt-4 overflow-x-auto rounded-xl border border-indigo-800 bg-slate-900/60">
            <table className="min-w-full text-xs text-left">
              <thead className="bg-indigo-950/80 text-indigo-200 font-semibold">
                <tr>
                  <th className="px-4 py-2.5">Year</th>
                  <th className="px-4 py-2.5 text-right">Principal Paid</th>
                  <th className="px-4 py-2.5 text-right">Interest Paid</th>
                  <th className="px-4 py-2.5 text-right">Remaining Balance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-900/40 text-slate-200">
                {result.schedule.map((row) => (
                  <tr key={row.year} className="hover:bg-indigo-900/20">
                    <td className="px-4 py-2 font-bold text-white">Year {row.year}</td>
                    <td className="px-4 py-2 text-right">₹{row.principalPaid.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-2 text-right text-amber-300">
                      ₹{row.interestPaid.toLocaleString('en-IN')}
                    </td>
                    <td className="px-4 py-2 text-right font-medium">
                      ₹{row.balance.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
