'use client'

import React, { useState } from 'react'
import { calculateDiscount } from '../../lib/calculators/general'
import { Tag, IndianRupee } from 'lucide-react'

export function DiscountCalc() {
  const [originalPrice, setOriginalPrice] = useState<number>(2499)
  const [discountPercentage, setDiscountPercentage] = useState<number>(25)

  const result = calculateDiscount(originalPrice, discountPercentage)
  const discountPresets = [10, 15, 20, 25, 30, 40, 50, 70]

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Original Price (₹)
          </label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-slate-400 font-bold">
              ₹
            </span>
            <input
              type="number"
              min="0"
              value={originalPrice}
              onChange={(e) => setOriginalPrice(Math.max(0, parseFloat(e.target.value) || 0))}
              className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Discount Percentage (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            value={discountPercentage}
            onChange={(e) => setDiscountPercentage(Math.max(0, parseFloat(e.target.value) || 0))}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-xl focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
          <div className="flex flex-wrap gap-1 mt-2">
            {discountPresets.map((d) => (
              <button
                key={d}
                onClick={() => setDiscountPercentage(d)}
                className="px-2 py-0.5 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-md font-medium"
              >
                {d}% Off
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 text-white shadow-xl">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold flex items-center gap-1">
              <Tag className="w-4 h-4" />
              Final Discounted Price
            </span>
            <div className="text-4xl sm:text-5xl font-black mt-1 text-white">
              ₹{result.finalPrice.toLocaleString('en-IN')}
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Reduced from ₹{originalPrice.toLocaleString('en-IN')}
            </p>
          </div>

          <div className="bg-white/10 rounded-xl p-4 text-xs space-y-2">
            <div className="flex justify-between">
              <span className="text-slate-300">You Save:</span>
              <span className="font-bold text-emerald-300 text-base">
                ₹{result.discountAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-300">Discount Percentage:</span>
              <span className="font-bold text-white">{discountPercentage}% OFF</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
