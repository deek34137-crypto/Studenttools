'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Search, X, Calculator, ArrowRight, CornerDownLeft } from 'lucide-react'
import { TOOLS, ToolMetadata } from '../data/tools'

interface GlobalSearchProps {
  isOpen: boolean
  onClose: () => void
}

export function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ToolMetadata[]>([])
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      setQuery('')
      setResults(TOOLS.slice(0, 8)) // Default popular/initial tools
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [isOpen])

  useEffect(() => {
    if (!query.trim()) {
      setResults(TOOLS.slice(0, 8))
      setSelectedIndex(0)
      return
    }

    const q = query.toLowerCase().trim()
    const filtered = TOOLS.filter((tool) => {
      if (tool.title.toLowerCase().includes(q)) return true
      if (tool.categoryName.toLowerCase().includes(q)) return true
      if (tool.category.toLowerCase().includes(q)) return true
      if (tool.description.toLowerCase().includes(q)) return true
      if (tool.keywords.some((k) => k.toLowerCase().includes(q))) return true
      if (tool.aliases.some((a) => a.toLowerCase().includes(q))) return true
      return false
    })

    setResults(filtered.slice(0, 10))
    setSelectedIndex(0)
  }, [query])

  // Keyboard navigation inside search modal
  useEffect(() => {
    if (!isOpen) return

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        onClose()
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        setSelectedIndex((prev) => (results.length > 0 ? (prev + 1) % results.length : 0))
      } else if (e.key === 'ArrowUp') {
        e.preventDefault()
        setSelectedIndex((prev) => (results.length > 0 ? (prev - 1 + results.length) % results.length : 0))
      } else if (e.key === 'Enter') {
        e.preventDefault()
        if (results[selectedIndex]) {
          router.push(results[selectedIndex].route)
          onClose()
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, results, selectedIndex, router, onClose])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Search all tools and calculators"
      >
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-100">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search calculators (e.g. JEE, salary, attendance, EMI, CGPA)..."
            className="w-full text-slate-900 text-sm sm:text-base placeholder-slate-400 bg-transparent outline-hidden"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-md"
              aria-label="Clear query"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded-sm">
              ESC
            </kbd>
          )}
        </div>

        <div className="max-h-[380px] overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="py-12 text-center text-slate-500">
              <Calculator className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-medium">No calculator found matching &quot;{query}&quot;</p>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for &quot;attendance&quot;, &quot;salary&quot;, &quot;percentile&quot;, or &quot;emi&quot;.
              </p>
            </div>
          ) : (
            <ul className="space-y-1">
              {results.map((tool, idx) => {
                const isSelected = idx === selectedIndex
                return (
                  <li key={tool.id}>
                    <button
                      onClick={() => {
                        router.push(tool.route)
                        onClose()
                      }}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full text-left flex items-center justify-between p-3 rounded-xl transition-colors ${
                        isSelected
                          ? 'bg-sky-50 text-sky-900 border border-sky-200'
                          : 'hover:bg-slate-50 text-slate-800 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                            isSelected ? 'bg-sky-500 text-white' : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          <Calculator className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{tool.title}</span>
                            <span className="text-[10px] uppercase font-semibold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-sm">
                              {tool.categoryName}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                            {tool.shortDescription}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0 ml-2">
                        {isSelected && (
                          <span className="hidden sm:flex items-center gap-1 text-sky-600 font-medium">
                            <span>Open</span>
                            <CornerDownLeft className="w-3 h-3" />
                          </span>
                        )}
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <div className="hidden sm:flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-white border border-slate-200 px-1 py-0.5 rounded text-[10px]">↑</kbd>{' '}
              <kbd className="font-mono bg-white border border-slate-200 px-1 py-0.5 rounded text-[10px]">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="font-mono bg-white border border-slate-200 px-1 py-0.5 rounded text-[10px]">↵</kbd> Select
            </span>
            <span>
              <kbd className="font-mono bg-white border border-slate-200 px-1 py-0.5 rounded text-[10px]">esc</kbd> Close
            </span>
          </div>
          <span className="text-slate-400">38 free tools ready</span>
        </div>
      </div>
    </div>
  )
}
