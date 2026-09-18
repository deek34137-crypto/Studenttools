'use client'

import React, { useState } from 'react'
import { calculateGst } from '../../lib/calculators/finance'
import { Receipt, IndianRupee } from 'lucide-react'

export function GstCalc() {
  const [amount, setAmount] = useState<number>(5000)
  const [gstRate, setGstRate] = useState<number>(18)
  const [mode, setMode] = useState<'exclusive' | 'inclusive'>('exclusive')

  const result = calculateGst({
    amount,
    gstRate,
    mode,
  })

  const standardRates = [5, 12, 18, 28]

  return (
    <div className="space-y-6">
      {/* Mode Switcher */}
      <div className="flex p-1 bg-slate-100 rounded-xl max-w-sm">
        <button
          onClick={() => setMode('exclusive')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            mode === 'exclusive' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          GST Exclusive (Add GST)
        </button>
        <button
          onClick={() => setMode('inclusive')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            mode === 'inclusive' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          GST Inclusive (Extract GST)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {mode === 'exclusive' ? 'Base / Net Amount (₹)' : 'Total Price Including GST (₹)'}
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">
              ₹
            </span>
            <input
              type="number"
              min="0"
              value={amount}
              onChange={(e) => setAmount(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            GST Tax Slab Rate (%)
          </label>
          <div className="flex gap-1.5">
            {standardRates.map((r) => (
              <button
                key={r}
                onClick={() => setGstRate(r)}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold border transition-colors ${
                  gstRate === r
                    ? 'bg-sky-600 text-white border-sky-600 shadow-xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {r}%
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-[11px] text-slate-500">Or custom rate:</span>
            <input
              type="number"
              min="0"
              max="50"
              value={gstRate}
              onChange={(e) => setGstRate(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-20 px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs font-bold"
            />
            <span className="text-xs text-slate-400">%</span>
          </div>
        </div>
      </div>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 text-white shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold flex items-center gap-1">
              <Receipt className="w-4 h-4" />
              {mode === 'exclusive' ? 'Total Final Price (with GST)' : 'Pre-Tax Net Base Amount'}
            </span>
            <div className="text-4xl sm:text-5xl font-black mt-1 text-white">
              ₹
              {mode === 'exclusive'
                ? result.finalAmount.toLocaleString('en-IN')
                : result.baseAmount.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              {mode === 'exclusive'
                ? `Base: ₹${result.baseAmount.toLocaleString('en-IN')} + GST: ₹${result.gstAmount.toLocaleString('en-IN')}`
                : `Total: ₹${result.finalAmount.toLocaleString('en-IN')} (Includes ₹${result.gstAmount.toLocaleString('en-IN')} GST)`}
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-4 text-xs space-y-2">
            <span className="font-bold text-sky-300 uppercase tracking-wider text-[11px] block">
              GST Tax Breakdown ({gstRate}%)
            </span>
            <div className="flex justify-between">
              <span className="text-slate-300">Total GST Amount:</span>
              <span className="font-bold text-white text-sm">₹{result.gstAmount.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>CGST (Central Tax - {gstRate / 2}%):</span>
              <span>₹{result.cgst.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>SGST (State Tax - {gstRate / 2}%):</span>
              <span>₹{result.sgst.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-2 border-t border-white/20 flex justify-between text-[11px] text-slate-400">
              <span>For Inter-State Sales (IGST):</span>
              <span>₹{result.igst.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
