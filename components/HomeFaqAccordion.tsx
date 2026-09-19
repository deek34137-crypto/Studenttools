'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FaqItem {
  q: string
  a: string
}

export function HomeFaqAccordion({ faqs }: { faqs: FaqItem[] }) {
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  return (
    <div className="divide-y divide-slate-100">
      {faqs.map((faq, index) => {
        const isOpen = openFaq === index
        return (
          <div key={index} className="py-4 first:pt-0 last:pb-0">
            <button
              type="button"
              onClick={() => setOpenFaq(isOpen ? null : index)}
              className="w-full flex items-center justify-between text-left font-semibold text-slate-900 hover:text-sky-600 text-sm sm:text-base py-1 cursor-pointer transition-colors"
              aria-expanded={isOpen}
            >
              <span>{faq.q}</span>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-200 ${
                  isOpen ? 'rotate-180 text-sky-600' : ''
                }`}
              />
            </button>
            {isOpen && (
              <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed pl-1 animate-fadeIn">
                {faq.a}
              </p>
            )}
          </div>
        )
      })}
    </div>
  )
}
