'use client'

import React, { useState } from 'react'
import { calculateIncomeTax } from '../../lib/calculators/finance'
import { IndianRupee, ShieldCheck, Info, AlertTriangle } from 'lucide-react'

export function IncomeTaxCalc() {
  const [fy, setFy] = useState<'2024-25' | '2025-26'>('2024-25')
  const [regime, setRegime] = useState<'new' | 'old'>('new')
  const [income, setIncome] = useState<number>(1200000)

  // Deductions for Old Regime
  const [c80, setC80] = useState<number>(150000)
  const [d80, setD80] = useState<number>(25000)
  const [hra, setHra] = useState<number>(100000)
  const [homeLoan, setHomeLoan] = useState<number>(0)

  const result = calculateIncomeTax({
    financialYear: fy,
    regime,
    grossAnnualIncome: income,
    investments80C: c80,
    healthInsurance80D: d80,
    hraExemption: hra,
    homeLoanInterest24B: homeLoan,
  })

  // Compare with opposite regime for quick comparison insight
  const comparisonResult = calculateIncomeTax({
    financialYear: fy,
    regime: regime === 'new' ? 'old' : 'new',
    grossAnnualIncome: income,
    investments80C: c80,
    healthInsurance80D: d80,
    hraExemption: hra,
    homeLoanInterest24B: homeLoan,
  })

  return (
    <div className="space-y-6">
      {/* Configuration Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-600">Financial Year:</span>
          <select
            value={fy}
            onChange={(e) => setFy(e.target.value as any)}
            className="px-3 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-800"
          >
            <option value="2024-25">FY 2024-25 (AY 2025-26)</option>
            <option value="2025-26">FY 2025-26 (AY 2026-27)</option>
          </select>
        </div>

        {/* Regime Switcher */}
        <div className="flex p-1 bg-slate-200/80 rounded-lg text-xs">
          <button
            onClick={() => setRegime('new')}
            className={`px-3 py-1.5 font-bold rounded-md transition-colors ${
              regime === 'new' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            New Tax Regime (Default)
          </button>
          <button
            onClick={() => setRegime('old')}
            className={`px-3 py-1.5 font-bold rounded-md transition-colors ${
              regime === 'old' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Old Tax Regime
          </button>
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Gross Annual Income (₹)
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">
            ₹
          </span>
          <input
            type="number"
            min="0"
            step="10000"
            value={income}
            onChange={(e) => setIncome(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-extrabold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Old Regime Deductions Section */}
      {regime === 'old' && (
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Old Tax Regime Deductions & Exemptions
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-500 mb-1">Section 80C (Max ₹1.5L)</label>
              <input
                type="number"
                min="0"
                max="150000"
                value={c80}
                onChange={(e) => setC80(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Section 80D (Health Ins.)</label>
              <input
                type="number"
                min="0"
                max="100000"
                value={d80}
                onChange={(e) => setD80(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">HRA Exemption</label>
              <input
                type="number"
                min="0"
                value={hra}
                onChange={(e) => setHra(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-slate-500 mb-1">Home Loan Interest (24b)</label>
              <input
                type="number"
                min="0"
                max="200000"
                value={homeLoan}
                onChange={(e) => setHomeLoan(Math.max(0, parseFloat(e.target.value) || 0))}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg"
              />
            </div>
          </div>
        </div>
      )}

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 text-white shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold flex items-center gap-1">
              <IndianRupee className="w-4 h-4" />
              Total Estimated Tax Payable ({regime.toUpperCase()} REGIME)
            </span>
            <div className="text-4xl sm:text-5xl font-black mt-1 text-white">
              ₹{result.totalTaxPayable.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Effective Tax Rate: <strong>{result.effectiveTaxRatePercentage}%</strong> of gross income
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-4 text-xs space-y-1.5 text-slate-200">
            <div className="flex justify-between">
              <span className="text-slate-300">Standard Deduction:</span>
              <span className="text-white font-bold">₹{result.standardDeduction.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Net Taxable Income:</span>
              <span className="text-white font-bold">₹{result.netTaxableIncome.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Tax Before Rebate:</span>
              <span>₹{result.taxBeforeRebate.toLocaleString('en-IN')}</span>
            </div>
            {result.rebate87A > 0 && (
              <div className="flex justify-between text-emerald-300 font-bold">
                <span>Section 87A Rebate:</span>
                <span>-₹{result.rebate87A.toLocaleString('en-IN')}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-300">
              <span>Health & Education Cess (4%):</span>
              <span>₹{result.cess.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Comparison Insight */}
        <div className="mt-6 pt-4 border-t border-slate-800 text-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="text-slate-300">
            Under {regime === 'new' ? 'Old Regime' : 'New Regime'}, estimated tax would be{' '}
            <strong className="text-white">
              ₹{comparisonResult.totalTaxPayable.toLocaleString('en-IN')}
            </strong>
            .
          </span>
          <span className="font-bold text-emerald-400">
            {result.totalTaxPayable <= comparisonResult.totalTaxPayable
              ? `You save ₹${(comparisonResult.totalTaxPayable - result.totalTaxPayable).toLocaleString('en-IN')} with ${regime} regime.`
              : `You could save ₹${(result.totalTaxPayable - comparisonResult.totalTaxPayable).toLocaleString('en-IN')} by switching to ${regime === 'new' ? 'Old' : 'New'} regime.`}
          </span>
        </div>
      </div>
    </div>
  )
}
