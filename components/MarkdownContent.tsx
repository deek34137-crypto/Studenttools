// components/MarkdownContent.tsx
import React from 'react'

interface MarkdownContentProps {
  content: string
}

/**
 * Clean, safe server-side markdown renderer for educational articles.
 * Transforms markdown headings, bullet lists, bold, italics, code blocks,
 * blockquotes, and formulas into elegant Tailwind typography without dangerous HTML.
 */
export function MarkdownContent({ content }: MarkdownContentProps) {
  // Split into paragraphs / blocks
  const blocks = content.split(/\n\s*\n/)

  return (
    <div className="space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
      {blocks.map((block, idx) => {
        const trimmed = block.trim()
        if (!trimmed) return null

        // H2
        if (trimmed.startsWith('## ')) {
          const text = trimmed.replace(/^##\s+/, '')
          return (
            <h2
              key={idx}
              className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-10 mb-4 pt-4 border-t border-slate-100 first:border-t-0 first:pt-0"
            >
              {text}
            </h2>
          )
        }

        // H3
        if (trimmed.startsWith('### ')) {
          const text = trimmed.replace(/^###\s+/, '')
          return (
            <h3 key={idx} className="text-lg sm:text-xl font-bold text-slate-900 mt-6 mb-3">
              {text}
            </h3>
          )
        }

        // Blockquote
        if (trimmed.startsWith('> ')) {
          const quoteText = trimmed.replace(/^>\s+/gm, '')
          return (
            <blockquote
              key={idx}
              className="p-4 rounded-xl bg-sky-50/70 border-l-4 border-sky-500 text-slate-700 text-xs sm:text-sm my-4 italic"
            >
              {quoteText}
            </blockquote>
          )
        }

        // Markdown Table
        if (trimmed.startsWith('|') && trimmed.includes('\n|')) {
          const lines = trimmed.split('\n').filter((l) => l.trim().startsWith('|'))
          if (lines.length >= 2) {
            const headerCells = lines[0].split('|').slice(1, -1).map((c) => c.trim())
            const bodyLines = lines.slice(lines[1].includes('---') ? 2 : 1)
            return (
              <div key={idx} className="my-6 overflow-x-auto rounded-xl border border-slate-200 shadow-sm">
                <table className="w-full text-left text-xs sm:text-sm">
                  <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
                    <tr>
                      {headerCells.map((h, hIdx) => (
                        <th key={hIdx} className="py-3 px-4 font-semibold">{renderInlineFormatting(h)}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {bodyLines.map((row, rIdx) => {
                      const cells = row.split('|').slice(1, -1).map((c) => c.trim())
                      return (
                        <tr key={rIdx} className="hover:bg-slate-50/50 transition-colors">
                          {cells.map((cell, cIdx) => (
                            <td key={cIdx} className="py-2.5 px-4 text-slate-700">{renderInlineFormatting(cell)}</td>
                          ))}
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )
          }
        }

        // Unordered List
        if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
          const items = trimmed.split('\n').map((line) => line.replace(/^[-*]\s+/, '').trim())
          return (
            <ul key={idx} className="space-y-2 list-disc list-outside pl-5 my-4">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="text-slate-700 text-sm leading-relaxed">
                  {renderInlineFormatting(item)}
                </li>
              ))}
            </ul>
          )
        }

        // Numbered List
        if (/^\d+\.\s+/.test(trimmed)) {
          const items = trimmed.split('\n').map((line) => line.replace(/^\d+\.\s+/, '').trim())
          return (
            <ol key={idx} className="space-y-2 list-decimal list-outside pl-5 my-4">
              {items.map((item, itemIdx) => (
                <li key={itemIdx} className="text-slate-700 text-sm leading-relaxed">
                  {renderInlineFormatting(item)}
                </li>
              ))}
            </ol>
          )
        }

        // Code block or Formula
        if (trimmed.startsWith('```')) {
          const codeText = trimmed.replace(/^```[a-z]*\n?/, '').replace(/\n?```$/, '')
          return (
            <div key={idx} className="my-5 rounded-xl bg-slate-900 text-slate-100 p-4 font-mono text-xs overflow-x-auto">
              <pre>{codeText}</pre>
            </div>
          )
        }

        // Standard Paragraph
        return (
          <p key={idx} className="text-slate-700 text-sm sm:text-base leading-relaxed">
            {renderInlineFormatting(trimmed)}
          </p>
        )
      })}
    </div>
  )
}

function renderInlineFormatting(text: string): React.ReactNode {
  // Simple inline token parsing for **bold** and `code`
  const parts = text.split(/(\*\*.*?\*\*|`.*?`)/g)

  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className="font-semibold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      )
    }
    if (part.startsWith('`') && part.endsWith('`')) {
      return (
        <code key={i} className="px-1.5 py-0.5 rounded-md bg-slate-100 text-sky-700 font-mono text-xs">
          {part.slice(1, -1)}
        </code>
      )
    }
    return part
  })
}
