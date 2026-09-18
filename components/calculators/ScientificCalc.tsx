'use client'

import React, { useState } from 'react'
import { scientificEval } from '../../lib/calculators/general'
import { Calculator, Delete, RotateCcw } from 'lucide-react'

export function ScientificCalc() {
  const [expression, setExpression] = useState<string>('sin(30) + sqrt(16)')
  const [angleMode, setAngleMode] = useState<'deg' | 'rad'>('deg')
  const [history, setHistory] = useState<string[]>([])

  const evalResult = scientificEval(expression, angleMode)

  function append(char: string) {
    setExpression((prev) => prev + char)
  }

  function clearAll() {
    setExpression('')
  }

  function backspace() {
    setExpression((prev) => prev.slice(0, -1))
  }

  function execute() {
    if (evalResult.success && evalResult.result !== undefined) {
      setHistory((prev) => [`${expression} = ${evalResult.result}`, ...prev.slice(0, 4)])
      setExpression(evalResult.result.toString())
    }
  }

  const buttons = [
    { label: 'deg/rad', action: () => setAngleMode(angleMode === 'deg' ? 'rad' : 'deg'), special: true },
    { label: 'sin', action: () => append('sin(') },
    { label: 'cos', action: () => append('cos(') },
    { label: 'tan', action: () => append('tan(') },
    { label: 'C', action: clearAll, danger: true },

    { label: 'ln', action: () => append('ln(') },
    { label: 'log', action: () => append('log(') },
    { label: 'sqrt', action: () => append('sqrt(') },
    { label: '^', action: () => append('^') },
    { label: '⌫', action: backspace, special: true },

    { label: 'pi', action: () => append('pi') },
    { label: '(', action: () => append('(') },
    { label: ')', action: () => append(')') },
    { label: '!', action: () => append('!') },
    { label: '÷', action: () => append('/') },

    { label: '7', action: () => append('7'), num: true },
    { label: '8', action: () => append('8'), num: true },
    { label: '9', action: () => append('9'), num: true },
    { label: '%', action: () => append('%') },
    { label: '×', action: () => append('*') },

    { label: '4', action: () => append('4'), num: true },
    { label: '5', action: () => append('5'), num: true },
    { label: '6', action: () => append('6'), num: true },
    { label: 'e', action: () => append('e') },
    { label: '-', action: () => append('-') },

    { label: '1', action: () => append('1'), num: true },
    { label: '2', action: () => append('2'), num: true },
    { label: '3', action: () => append('3'), num: true },
    { label: '.', action: () => append('.') },
    { label: '+', action: () => append('+') },

    { label: '0', action: () => append('0'), num: true, span2: true },
    { label: '00', action: () => append('00'), num: true },
    { label: '=', action: execute, primary: true, span2: true },
  ]

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      {/* Display Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-slate-900 text-white shadow-inner">
        <div className="flex justify-between items-center text-xs text-sky-400 font-semibold mb-1">
          <span className="uppercase tracking-wider">Mode: {angleMode.toUpperCase()}</span>
          <span className="text-[10px] text-slate-400">Pure Parser (Safe & Zero Eval)</span>
        </div>

        <input
          type="text"
          value={expression}
          onChange={(e) => setExpression(e.target.value)}
          placeholder="Enter formula or use keypad..."
          className="w-full bg-transparent text-slate-100 text-lg sm:text-2xl font-mono outline-hidden font-bold"
        />

        <div className="mt-2 pt-2 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">Result:</span>
          {evalResult.success ? (
            <span className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">
              = {evalResult.result}
            </span>
          ) : (
            <span className="text-xs text-amber-400 font-mono">
              {evalResult.error || 'Syntax incomplete'}
            </span>
          )}
        </div>
      </div>

      {/* Calculator Keypad */}
      <div className="grid grid-cols-5 gap-1.5 sm:gap-2">
        {buttons.map((b, idx) => (
          <button
            key={idx}
            onClick={b.action}
            className={`py-3 px-2 rounded-xl text-xs sm:text-sm font-bold transition-all active:scale-95 ${
              b.primary
                ? 'col-span-2 bg-sky-600 hover:bg-sky-500 text-white shadow-md'
                : b.danger
                ? 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-200'
                : b.special
                ? 'bg-slate-200 hover:bg-slate-300 text-slate-800'
                : b.num
                ? 'bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 font-black'
                : b.span2
                ? 'col-span-2 bg-white hover:bg-slate-100 text-slate-900 border border-slate-200'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
            }`}
          >
            {b.label}
          </button>
        ))}
      </div>

      {/* History */}
      {history.length > 0 && (
        <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-600">
          <span className="font-semibold text-slate-700 block mb-1">Recent Calculations:</span>
          <ul className="space-y-0.5 font-mono text-[11px]">
            {history.map((h, i) => (
              <li key={i}>{h}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
