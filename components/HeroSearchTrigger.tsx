'use client'

import React from 'react'
import { Search } from 'lucide-react'

export function HeroSearchTrigger() {
  const handleTrigger = () => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-global-search'))
    }
  }

  return (
    <div className="mt-8 max-w-md mx-auto">
      <button
        type="button"
        onClick={handleTrigger}
        className="w-full flex items-center justify-between px-4 py-3 bg-white hover:bg-slate-50 border border-slate-300 hover:border-sky-400 rounded-2xl shadow-sm text-sm text-slate-500 transition-all group cursor-pointer"
      >
        <div className="flex items-center gap-2.5">
          <Search className="w-5 h-5 text-slate-400 group-hover:text-sky-600 transition-colors" />
          <span>Search for a calculator (e.g. JEE, salary, EMI)...</span>
        </div>
        <kbd className="hidden sm:inline-block text-xs font-mono font-medium text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md">
          Ctrl K
        </kbd>
      </button>
    </div>
  )
}
