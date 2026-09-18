'use client'

import React, { useState } from 'react'
import { convertUnits, UNIT_CATEGORIES } from '../../lib/calculators/general'
import { RefreshCw, ArrowRight } from 'lucide-react'

export function UnitConverterCalc() {
  const [category, setCategory] = useState<string>('length')
  const [value, setValue] = useState<number>(10)
  const currentCat = UNIT_CATEGORIES[category] || UNIT_CATEGORIES.length
  const unitKeys = Object.keys(currentCat.units)

  const [fromUnit, setFromUnit] = useState<string>(unitKeys[0])
  const [toUnit, setToUnit] = useState<string>(unitKeys[1] || unitKeys[0])

  function handleCategoryChange(newCat: string) {
    setCategory(newCat)
    const newUnitKeys = Object.keys(UNIT_CATEGORIES[newCat].units)
    setFromUnit(newUnitKeys[0])
    setToUnit(newUnitKeys[1] || newUnitKeys[0])
  }

  function swapUnits() {
    const temp = fromUnit
    setFromUnit(toUnit)
    setToUnit(temp)
  }

  const result = convertUnits(category, fromUnit, toUnit, value)

  return (
    <div className="space-y-6">
      {/* Category Pills */}
      <div className="flex flex-wrap gap-1.5 p-1 bg-slate-100 rounded-xl">
        {Object.entries(UNIT_CATEGORIES).map(([key, cat]) => (
          <button
            key={key}
            onClick={() => handleCategoryChange(key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              category === key
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-7 gap-3 items-center">
        {/* From Input */}
        <div className="sm:col-span-3 space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">From</label>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-lg focus:ring-2 focus:ring-sky-500"
          />
          <select
            value={fromUnit}
            onChange={(e) => setFromUnit(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
          >
            {unitKeys.map((k) => (
              <option key={k} value={k}>
                {currentCat.units[k].name}
              </option>
            ))}
          </select>
        </div>

        {/* Swap Button */}
        <div className="sm:col-span-1 flex justify-center mt-3 sm:mt-4">
          <button
            onClick={swapUnits}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            aria-label="Swap units"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {/* To Output */}
        <div className="sm:col-span-3 space-y-1.5">
          <label className="block text-xs font-semibold text-slate-700">To</label>
          <div className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-black text-lg truncate">
            {result.toValue}
          </div>
          <select
            value={toUnit}
            onChange={(e) => setToUnit(e.target.value)}
            className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium"
          >
            {unitKeys.map((k) => (
              <option key={k} value={k}>
                {currentCat.units[k].name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 text-white shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold">
            Conversion Output
          </span>
          <div className="text-3xl sm:text-4xl font-black mt-1 text-white">
            {value} {result.fromUnit} ={' '}
            <span className="text-emerald-400">{result.toValue}</span> {result.toUnit}
          </div>
          <p className="text-xs text-slate-300 mt-1 font-mono">{result.formula}</p>
        </div>
      </div>
    </div>
  )
}
