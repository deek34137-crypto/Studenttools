'use client'

import React, { useState } from 'react'
import { calculateAverageMarks, AverageMarksItem } from '../../lib/calculators/student'
import { Plus, Trash2, BarChart2 } from 'lucide-react'

export function AverageMarksCalc() {
  const [items, setItems] = useState<AverageMarksItem[]>([
    { marks: 85, weight: 20 },
    { marks: 90, weight: 30 },
    { marks: 78, weight: 50 },
  ])
  const [isWeightedMode, setIsWeightedMode] = useState<boolean>(true)

  const activeItems = isWeightedMode
    ? items
    : items.map((it) => ({ marks: it.marks }))

  const result = calculateAverageMarks(activeItems)

  function addItem() {
    setItems([...items, { marks: 80, weight: 10 }])
  }

  function removeItem(index: number) {
    if (items.length <= 1) return
    setItems(items.filter((_, idx) => idx !== index))
  }

  function updateItem(index: number, field: keyof AverageMarksItem, val: number) {
    const next = [...items]
    next[index] = { ...next[index], [field]: val }
    setItems(next)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <label className="text-xs font-semibold text-slate-700">Calculation Type:</label>
        <div className="flex p-1 bg-slate-100 rounded-lg text-xs">
          <button
            onClick={() => setIsWeightedMode(false)}
            className={`px-3 py-1 font-semibold rounded-md transition-colors ${
              !isWeightedMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Simple Average
          </button>
          <button
            onClick={() => setIsWeightedMode(true)}
            className={`px-3 py-1 font-semibold rounded-md transition-colors ${
              isWeightedMode ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Weighted Average
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {items.map((it, idx) => (
          <div key={idx} className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex-1">
              <label className="block text-[11px] text-slate-500 mb-0.5">Item #{idx + 1} Marks</label>
              <input
                type="number"
                value={it.marks}
                onChange={(e) => updateItem(idx, 'marks', parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold"
              />
            </div>

            {isWeightedMode && (
              <div className="w-32">
                <label className="block text-[11px] text-slate-500 mb-0.5">Weight / %</label>
                <input
                  type="number"
                  value={it.weight ?? 1}
                  onChange={(e) => updateItem(idx, 'weight', parseFloat(e.target.value) || 1)}
                  className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold"
                />
              </div>
            )}

            <button
              onClick={() => removeItem(idx)}
              disabled={items.length <= 1}
              className="p-2 text-slate-400 hover:text-red-600 disabled:opacity-30 mt-4 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addItem}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200"
      >
        <Plus className="w-4 h-4" />
        <span>Add Row</span>
      </button>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-indigo-950 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold flex items-center gap-1.5">
              <BarChart2 className="w-4 h-4 text-sky-400" />
              {result.isWeighted ? 'Weighted Average Marks' : 'Simple Arithmetic Average'}
            </span>
            <div className="text-4xl sm:text-5xl font-black mt-1">
              {result.average}
            </div>
          </div>

          <div className="text-xs text-indigo-200 bg-white/10 p-3 rounded-xl max-w-xs">
            {result.isWeighted
              ? `Calculated using sum of (Marks × Weight) / Total Weights (${result.totalWeight}).`
              : `Calculated using sum of marks (${result.totalMarks}) / ${result.itemCount} items.`}
          </div>
        </div>
      </div>
    </div>
  )
}
