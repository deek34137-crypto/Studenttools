// components/ArticleFaqAccordion.tsx
'use client'

import React, { useState } from 'react'
import { ChevronDown, HelpCircle } from 'lucide-react'
import { FaqItem } from '../lib/db/types'

interface ArticleFaqAccordionProps {
  faqs: FaqItem[]
}

export function ArticleFaqAccordion({ faqs }: ArticleFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0)

  if (!faqs || faqs.length === 0) return null

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index
        return (
          <div
            key={index}
            className="rounded-xl border border-slate-200 bg-white overflow-hidden transition-all duration-200"
          >
            <button
              onClick={() => setOpenIndex(isOpen ? null : index)}
              className="w-full text-left p-4 sm:p-5 flex items-center justify-between gap-4 font-semibold text-slate-900 text-sm sm:text-base hover:bg-slate-50/70 transition-colors"
            >
              <span className="flex items-center gap-2.5">
                <HelpCircle className="w-4 h-4 text-sky-600 shrink-0" />
                <span>{faq.question}</span>
              </span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-sky-600' : ''
                }`}
              />
            </button>
            {isOpen && (
              <div className="px-4 pb-4 sm:px-5 sm:pb-5 pt-0 text-slate-600 text-xs sm:text-sm leading-relaxed border-t border-slate-100 mt-2">
                {faq.answer}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
