'use client'

import React, { useState } from 'react'
import { calculateFraction } from '../../lib/calculators/general'
import { Divide } from 'lucide-react'

export function FractionCalc() {
  const [op, setOp] = useState<'add' | 'subtract' | 'multiply' | 'divide'>('add')
  const [n1, setN1] = useState<number>(3)
  const [d1, setD1] = useState<number>(4)
  const [n2, setN2] = useState<number>(2)
  const [d2, setD2] = useState<number>(5)

  const result = calculateFraction(op, n1, d1, n2, d2)

  const operations: { id: 'add' | 'subtract' | 'multiply' | 'divide'; label: string }[] = [
    { id: 'add', label: '+' },
    { id: 'subtract', label: '−' },
    { id: 'multiply', label: '×' },
    { id: 'divide', label: '÷' },
  ]

  return (
    <div className="space-y-6">
      {/* Operation selector */}
      <div className="flex p-1 bg-slate-100 rounded-xl max-w-xs mx-auto">
        {operations.map((o) => (
          <button
            key={o.id}
            onClick={() => setOp(o.id)}
            className={`flex-1 py-1.5 text-base font-bold rounded-lg transition-colors ${
              op === o.id ? 'bg-white text-sky-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="flex items-center justify-center gap-4 sm:gap-8 max-w-md mx-auto">
        {/* Fraction 1 */}
        <div className="flex flex-col items-center gap-1.5 w-24">
          <input
            type="number"
            value={n1}
            onChange={(e) => setN1(parseInt(e.target.value) || 0)}
            className="w-full px-2 py-2 text-center bg-white border border-slate-200 rounded-lg text-lg font-bold"
          />
          <div className="w-full h-0.5 bg-slate-400 rounded-full" />
          <input
            type="number"
            value={d1}
            onChange={(e) => setD1(parseInt(e.target.value) || 1)}
            className="w-full px-2 py-2 text-center bg-white border border-slate-200 rounded-lg text-lg font-bold"
          />
        </div>

        <span className="text-3xl font-black text-slate-400">
          {op === 'add' ? '+' : op === 'subtract' ? '−' : op === 'multiply' ? '×' : '÷'}
        </span>

        {/* Fraction 2 */}
        <div className="flex flex-col items-center gap-1.5 w-24">
          <input
            type="number"
            value={n2}
            onChange={(e) => setN2(parseInt(e.target.value) || 0)}
            className="w-full px-2 py-2 text-center bg-white border border-slate-200 rounded-lg text-lg font-bold"
          />
          <div className="w-full h-0.5 bg-slate-400 rounded-full" />
          <input
            type="number"
            value={d2}
            onChange={(e) => setD2(parseInt(e.target.value) || 1)}
            className="w-full px-2 py-2 text-center bg-white border border-slate-200 rounded-lg text-lg font-bold"
          />
        </div>
      </div>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 text-white shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div>
              <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold block mb-1">
                Simplified Result
              </span>
              <div className="text-3xl sm:text-5xl font-black font-mono">
                {result.simplifiedNumerator} / {result.simplifiedDenominator}
              </div>
            </div>

            {result.mixedString && (
              <div className="border-l border-slate-700 pl-4">
                <span className="text-xs uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                  Mixed Fraction
                </span>
                <div className="text-2xl sm:text-4xl font-bold font-mono text-emerald-300">
                  {result.mixedString}
                </div>
              </div>
            )}
          </div>

          <div className="bg-white/10 rounded-xl p-4 text-xs space-y-1">
            <span className="text-slate-300">Decimal Value:</span>
            <div className="text-2xl font-bold text-white font-mono">{result.decimalValue}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
