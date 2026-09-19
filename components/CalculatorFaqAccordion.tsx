'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export interface FaqItem {
  question: string
  answer: string
}

export function CalculatorFaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  if (!faqs || faqs.length === 0) return null

  return (
    <div className="divide-y divide-slate-100">
      {faqs.map((faq, index) => {
        const isOpen = openFaqIndex === index
        return (
          <div key={index} className="py-3.5 first:pt-0 last:pb-0">
            <button
              type="button"
              onClick={() => setOpenFaqIndex(isOpen ? null : index)}
              className="w-full flex items-center justify-between gap-4 text-left font-semibold text-slate-900 hover:text-sky-600 transition-colors text-sm sm:text-base py-1 cursor-pointer"
              aria-expanded={isOpen}
            >
              <span>{faq.question}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-sky-600' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed pl-1 animate-fadeIn">
                {faq.answer}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
