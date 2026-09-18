'use client'

import React, { useState } from 'react'
import { calculateBonus } from '../../lib/calculators/career'
import { Gift, IndianRupee } from 'lucide-react'

export function BonusCalc() {
  const [base, setBase] = useState<number>(60000)
  const [bonusType, setBonusType] = useState<'percentage' | 'fixed'>('percentage')
  const [bonusVal, setBonusVal] = useState<number>(15)
  const [tds, setTds] = useState<number>(10)

  const result = calculateBonus(base, bonusType, bonusVal, tds)

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Base Salary (₹)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">
              ₹
            </span>
            <input
              type="number"
              min="0"
              value={base}
              onChange={(e) => setBase(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-lg focus:ring-2 focus:ring-sky-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Bonus Type
          </label>
          <select
            value={bonusType}
            onChange={(e) => setBonusType(e.target.value as 'percentage' | 'fixed')}
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-semibold text-sm focus:ring-2 focus:ring-sky-500"
          >
            <option value="percentage">% of Base Salary</option>
            <option value="fixed">Fixed Lump Sum Amount</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            {bonusType === 'percentage' ? 'Bonus Rate (%)' : 'Fixed Bonus (₹)'}
          </label>
          <input
            type="number"
            min="0"
            value={bonusVal}
            onChange={(e) => setBonusVal(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-lg focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            TDS Tax Deduction (%)
          </label>
          <input
            type="number"
            min="0"
            max="40"
            value={tds}
            onChange={(e) => setTds(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-lg focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold flex items-center gap-1">
              <Gift className="w-4 h-4 text-amber-300" />
              Net Estimated In-Hand Bonus
            </span>
            <div className="text-4xl sm:text-5xl font-black mt-1 text-white">
              ₹{result.netBonus.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Gross Bonus of ₹{result.grossBonus.toLocaleString('en-IN')} before tax deductions.
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-4 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300">Gross Bonus:</span>
              <span className="font-bold text-white">₹{result.grossBonus.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Estimated TDS ({tds}%):</span>
              <span className="font-bold text-red-300">
                -₹{result.estimatedTdsDeduction.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="pt-2 border-t border-white/20 flex justify-between font-bold text-emerald-300 text-sm">
              <span>Net Take-Home Bonus:</span>
              <span>₹{result.netBonus.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
