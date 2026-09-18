'use client'

import React, { useState } from 'react'
import { ctcToInHand, CtcInput } from '../../lib/calculators/career'
import { DollarSign, ChevronDown, ChevronUp, AlertCircle, IndianRupee } from 'lucide-react'

export function CtcInHandCalc() {
  const [ctc, setCtc] = useState<number>(800000)
  const [basicPct, setBasicPct] = useState<number>(40)
  const [variablePay, setVariablePay] = useState<number>(0)
  const [ptMonthly, setPtMonthly] = useState<number>(200)
  const [showAdvanced, setShowAdvanced] = useState<boolean>(false)

  const input: CtcInput = {
    annualCtc: ctc,
    basicPercentage: basicPct,
    variablePayAnnual: variablePay,
    professionalTaxMonthly: ptMonthly,
  }

  const result = ctcToInHand(input)

  const ctcPresets = [400000, 600000, 800000, 1200000, 1800000, 2500000]

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-xs font-semibold text-slate-700 mb-1.5">
          Annual CTC Package (Cost to Company in ₹)
        </label>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">
            ₹
          </span>
          <input
            type="number"
            step="10000"
            min="0"
            value={ctc}
            onChange={(e) => setCtc(Math.max(0, parseInt(e.target.value) || 0))}
            className="w-full pl-8 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-extrabold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>
        {/* Presets */}
        <div className="flex flex-wrap gap-1.5 mt-2">
          <span className="text-[11px] text-slate-400 py-1">Quick CTCs:</span>
          {ctcPresets.map((p) => (
            <button
              key={p}
              onClick={() => setCtc(p)}
              className="px-2 py-0.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
            >
              ₹{(p / 100000).toFixed(0)} Lakh
            </button>
          ))}
        </div>
      </div>

      {/* Advanced Customizations Toggle */}
      <div>
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="flex items-center gap-1.5 text-xs font-semibold text-sky-600 hover:text-sky-700"
        >
          {showAdvanced ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          <span>{showAdvanced ? 'Hide Salary Structure Customizations' : 'Customize Basic %, Variable Pay & PT'}</span>
        </button>

        {showAdvanced && (
          <div className="mt-3 p-4 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Basic Salary (% of CTC)
              </label>
              <input
                type="number"
                min="20"
                max="70"
                value={basicPct}
                onChange={(e) => setBasicPct(Math.max(20, Math.min(70, parseInt(e.target.value) || 40)))}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
              <span className="text-[10px] text-slate-400">Typically 40% or 50%</span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Annual Variable Pay / Bonus (₹)
              </label>
              <input
                type="number"
                min="0"
                value={variablePay}
                onChange={(e) => setVariablePay(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
              <span className="text-[10px] text-slate-400">Excluded from monthly in-hand</span>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-slate-600 mb-1">
                Monthly Professional Tax (₹)
              </label>
              <input
                type="number"
                min="0"
                max="300"
                value={ptMonthly}
                onChange={(e) => setPtMonthly(Math.max(0, parseInt(e.target.value) || 200))}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              />
              <span className="text-[10px] text-slate-400">Standard ₹200/month</span>
            </div>
          </div>
        )}
      </div>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-800 to-slate-900 text-white shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-emerald-300 font-semibold flex items-center gap-1">
              <IndianRupee className="w-4 h-4" />
              Estimated Monthly In-Hand Salary
            </span>
            <div className="text-4xl sm:text-5xl font-black mt-1 text-white">
              ₹{result.estimatedInHandMonthly.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-emerald-200 mt-1">
              Estimated Annual Take-Home:{' '}
              <strong className="text-white">
                ₹{result.estimatedInHandAnnual.toLocaleString('en-IN')}
              </strong>
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-4 text-xs space-y-1.5 text-slate-200">
            <div className="flex justify-between font-medium">
              <span>Gross Monthly:</span>
              <span className="text-white">₹{result.grossSalaryMonthly.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Employee PF (12% Basic):</span>
              <span>-₹{result.employeePfMonthly.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Professional Tax:</span>
              <span>-₹{result.professionalTaxMonthly.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Estimated TDS (Income Tax):</span>
              <span>-₹{result.estimatedIncomeTaxMonthly.toLocaleString('en-IN')}</span>
            </div>
            <div className="pt-2 border-t border-white/20 flex justify-between font-bold text-emerald-300">
              <span>Total Monthly Deductions:</span>
              <span>₹{result.totalDeductionsMonthly.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Detailed Breakdown Table */}
        <div className="mt-6 pt-4 border-t border-emerald-700/60">
          <h4 className="text-xs uppercase tracking-wider font-bold text-emerald-200 mb-2">
            Annual & Monthly CTC Breakdown
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="bg-emerald-900/50 p-2 rounded-lg">
              <span className="text-[10px] text-emerald-200 block">Basic Salary</span>
              <span className="font-bold">₹{result.basicMonthly.toLocaleString('en-IN')}/mo</span>
            </div>
            <div className="bg-emerald-900/50 p-2 rounded-lg">
              <span className="text-[10px] text-emerald-200 block">HRA</span>
              <span className="font-bold">₹{result.hraMonthly.toLocaleString('en-IN')}/mo</span>
            </div>
            <div className="bg-emerald-900/50 p-2 rounded-lg">
              <span className="text-[10px] text-emerald-200 block">Special Allowance</span>
              <span className="font-bold">₹{result.specialAllowanceMonthly.toLocaleString('en-IN')}/mo</span>
            </div>
            <div className="bg-emerald-900/50 p-2 rounded-lg">
              <span className="text-[10px] text-emerald-200 block">Employer PF / Gratuity</span>
              <span className="font-bold">
                ₹{(result.employerPfMonthly + Math.round(result.gratuityAnnual / 12)).toLocaleString('en-IN')}/mo
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
