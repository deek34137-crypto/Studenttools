'use client'

import React, { useState } from 'react'
import { calculateBmi } from '../../lib/calculators/general'
import { Activity, AlertCircle } from 'lucide-react'

export function BmiCalc() {
  const [unitSystem, setUnitSystem] = useState<'metric' | 'imperial'>('metric')
  const [weight, setWeight] = useState<number>(68)
  const [height, setHeight] = useState<number>(172)

  const result = calculateBmi({
    weight,
    height,
    unitSystem,
  })

  const categoryColor: Record<string, string> = {
    Underweight: 'text-amber-300',
    'Normal weight': 'text-emerald-300',
    Overweight: 'text-orange-300',
    'Obese Class I': 'text-red-400',
    'Obese Class II': 'text-red-500',
    'Obese Class III': 'text-red-600',
  }

  return (
    <div className="space-y-6">
      {/* Unit system toggle */}
      <div className="flex p-1 bg-slate-100 rounded-xl max-w-xs">
        <button
          onClick={() => {
            setUnitSystem('metric')
            setWeight(68)
            setHeight(172)
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            unitSystem === 'metric' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Metric (kg / cm)
        </button>
        <button
          onClick={() => {
            setUnitSystem('imperial')
            setWeight(150)
            setHeight(68)
          }}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            unitSystem === 'imperial' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Imperial (lbs / in)
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Weight ({unitSystem === 'metric' ? 'Kilograms - kg' : 'Pounds - lbs'})
          </label>
          <input
            type="number"
            min="10"
            max="300"
            step="0.5"
            value={weight}
            onChange={(e) => setWeight(parseFloat(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Height ({unitSystem === 'metric' ? 'Centimeters - cm' : 'Inches - in'})
          </label>
          <input
            type="number"
            min="50"
            max="250"
            step="0.5"
            value={height}
            onChange={(e) => setHeight(parseFloat(e.target.value) || 0)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 text-white shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold flex items-center gap-1">
              <Activity className="w-4 h-4" />
              Body Mass Index (BMI) Score
            </span>
            <div className="text-4xl sm:text-5xl font-black mt-1 text-white">
              {result.bmi} <span className="text-sm font-normal text-slate-400">kg/m²</span>
            </div>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-slate-300">Category:</span>
              <span className={`text-base font-extrabold ${categoryColor[result.category] || 'text-white'}`}>
                {result.category}
              </span>
            </div>
          </div>

          <div className="bg-white/10 rounded-xl p-4 text-xs space-y-2">
            <span className="font-bold text-sky-300 uppercase tracking-wider text-[11px] block">
              Healthy Target Range (BMI 18.5 - 24.9)
            </span>
            <p className="text-slate-200">
              For your height of {height} {unitSystem === 'metric' ? 'cm' : 'in'}, a normal healthy weight is:
            </p>
            <div className="text-base font-bold text-emerald-300">
              {result.healthyWeightMin} – {result.healthyWeightMax} {unitSystem === 'metric' ? 'kg' : 'lbs'}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
