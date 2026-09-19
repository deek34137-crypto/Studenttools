// components/MarkdownContent.tsx
import React from 'react'
import Link from 'next/link'

interface MarkdownContentProps {
  content: string
}

interface BlockItem {
  type:
    | 'h2'
    | 'h3'
    | 'h4'
    | 'paragraph'
    | 'blockquote'
    | 'ul'
    | 'ol'
    | 'table'
    | 'code'
    | 'math'
    | 'hr'
  content?: string
  items?: { text: string; subItems?: string[] }[]
  rows?: string[][]
  headers?: string[]
}

/**
 * Robust, safe server-side markdown renderer for educational articles and guides.
 * Accurately parses:
 * - Headings (h2, h3, h4) even when immediately followed by paragraphs/lists
 * - Markdown tables with aligned headers
 * - Blockquotes with full inline styling
 * - Ordered and unordered lists (with nested sub-bullets)
 * - Horizontal rules (---)
 * - Internal & external links ([text](url))
 * - LaTeX math syntax ($math$ and $$math$$) with clean mathematical symbols
 * - Code blocks with syntax formatting
 */
export function MarkdownContent({ content }: MarkdownContentProps) {
  const blocks = parseMarkdownBlocks(content)

  return (
    <div className="space-y-6 text-slate-700 text-sm sm:text-base leading-relaxed">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case 'h2':
            return (
              <h2
                key={idx}
                className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight mt-10 mb-4 pt-6 border-t border-slate-200 first:border-t-0 first:pt-0"
              >
                {renderInline(block.content || '')}
              </h2>
            )

          case 'h3':
            return (
              <h3
                key={idx}
                className="text-lg sm:text-xl font-bold text-slate-900 mt-7 mb-3 tracking-tight"
              >
                {renderInline(block.content || '')}
              </h3>
            )

          case 'h4':
            return (
              <h4
                key={idx}
                className="text-base sm:text-lg font-semibold text-slate-900 mt-5 mb-2"
              >
                {renderInline(block.content || '')}
              </h4>
            )

          case 'hr':
            return <hr key={idx} className="my-8 border-slate-200" />

          case 'blockquote':
            return (
              <blockquote
                key={idx}
                className="p-4 sm:p-5 rounded-xl bg-sky-50/80 border-l-4 border-sky-500 text-slate-800 text-sm sm:text-base my-5 shadow-2xs space-y-2"
              >
                {renderInline(block.content || '')}
              </blockquote>
            )

          case 'table':
            return (
              <div
                key={idx}
                className="my-6 overflow-x-auto rounded-xl border border-slate-200 shadow-2xs"
              >
                <table className="w-full text-left text-xs sm:text-sm">
                  {block.headers && block.headers.length > 0 && (
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-900 font-semibold">
                      <tr>
                        {block.headers.map((h, hIdx) => (
                          <th key={hIdx} className="py-3 px-4 font-semibold">
                            {renderInline(h)}
                          </th>
                        ))}
                      </tr>
                    </thead>
                  )}
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {block.rows?.map((row, rIdx) => (
                      <tr
                        key={rIdx}
                        className="hover:bg-slate-50/60 transition-colors"
                      >
                        {row.map((cell, cIdx) => (
                          <td
                            key={cIdx}
                            className="py-2.5 px-4 text-slate-700 leading-snug"
                          >
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )

          case 'ul':
            return (
              <ul key={idx} className="space-y-2 list-disc list-outside pl-5 my-4">
                {block.items?.map((item, itemIdx) => (
                  <li key={itemIdx} className="text-slate-700 text-sm sm:text-base leading-relaxed">
                    {renderInline(item.text)}
                    {item.subItems && item.subItems.length > 0 && (
                      <ul className="space-y-1.5 list-circle list-outside pl-5 mt-2 text-slate-600">
                        {item.subItems.map((sub, sIdx) => (
                          <li key={sIdx} className="text-xs sm:text-sm">
                            {renderInline(sub)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            )

          case 'ol':
            return (
              <ol key={idx} className="space-y-2.5 list-decimal list-outside pl-5 my-4">
                {block.items?.map((item, itemIdx) => (
                  <li key={itemIdx} className="text-slate-700 text-sm sm:text-base leading-relaxed">
                    {renderInline(item.text)}
                    {item.subItems && item.subItems.length > 0 && (
                      <ul className="space-y-1.5 list-disc list-outside pl-5 mt-2 text-slate-600">
                        {item.subItems.map((sub, sIdx) => (
                          <li key={sIdx} className="text-xs sm:text-sm">
                            {renderInline(sub)}
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
            )

          case 'code':
            return (
              <div
                key={idx}
                className="my-5 rounded-xl bg-slate-900 text-slate-100 p-4 sm:p-5 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner"
              >
                <pre>{block.content}</pre>
              </div>
            )

          case 'math':
            return (
              <div
                key={idx}
                className="my-5 p-4 rounded-xl bg-slate-50 border border-slate-200 text-center font-mono text-sm sm:text-base text-slate-900 overflow-x-auto"
              >
                {cleanMathNotation(block.content || '')}
              </div>
            )

          case 'paragraph':
          default:
            return (
              <p
                key={idx}
                className="text-slate-700 text-sm sm:text-base leading-relaxed"
              >
                {renderInline(block.content || '')}
              </p>
            )
        }
      })}
    </div>
  )
}

/**
 * Line-by-line parser that groups continuous markdown structures reliably.
 */
function parseMarkdownBlocks(raw: string): BlockItem[] {
  const normalized = raw.replace(/\r\n/g, '\n')
  const rawLines = normalized.split('\n')
  const blocks: BlockItem[] = []

  let i = 0
  while (i < rawLines.length) {
    const line = rawLines[i]
    const trimmed = line.trim()

    // Empty line
    if (!trimmed) {
      i++
      continue
    }

    // Horizontal rule: --- or *** or ___
    if (/^(---|---|\*\*\*|___)$/.test(trimmed)) {
      blocks.push({ type: 'hr' })
      i++
      continue
    }

    // Headings
    if (trimmed.startsWith('## ')) {
      blocks.push({ type: 'h2', content: trimmed.replace(/^##\s+/, '') })
      i++
      continue
    }
    if (trimmed.startsWith('### ')) {
      blocks.push({ type: 'h3', content: trimmed.replace(/^###\s+/, '') })
      i++
      continue
    }
    if (trimmed.startsWith('#### ')) {
      blocks.push({ type: 'h4', content: trimmed.replace(/^####\s+/, '') })
      i++
      continue
    }

    // Display Math ($$...$$)
    if (trimmed.startsWith('$$')) {
      if (trimmed.endsWith('$$') && trimmed.length > 2) {
        blocks.push({ type: 'math', content: trimmed.slice(2, -2).trim() })
        i++
        continue
      }
      const mathLines: string[] = []
      i++
      while (i < rawLines.length && !rawLines[i].trim().endsWith('$$')) {
        mathLines.push(rawLines[i])
        i++
      }
      if (i < rawLines.length) {
        mathLines.push(rawLines[i].replace(/\$\$$/, ''))
        i++
      }
      blocks.push({ type: 'math', content: mathLines.join('\n').trim() })
      continue
    }

    // Code block (```)
    if (trimmed.startsWith('```')) {
      const codeLines: string[] = []
      i++
      while (i < rawLines.length && !rawLines[i].trim().startsWith('```')) {
        codeLines.push(rawLines[i])
        i++
      }
      if (i < rawLines.length) i++ // skip closing ```
      blocks.push({ type: 'code', content: codeLines.join('\n') })
      continue
    }

    // Blockquote (> )
    if (trimmed.startsWith('>')) {
      const quoteLines: string[] = []
      while (i < rawLines.length && (rawLines[i].trim().startsWith('>') || (rawLines[i].trim() && quoteLines.length > 0 && !rawLines[i].trim().startsWith('#')))) {
        if (rawLines[i].trim().startsWith('>')) {
          quoteLines.push(rawLines[i].replace(/^>\s?/, ''))
        } else {
          quoteLines.push(rawLines[i].trim())
        }
        i++
      }
      blocks.push({ type: 'blockquote', content: quoteLines.join('\n') })
      continue
    }

    // Table (| ... |)
    if (trimmed.startsWith('|') && trimmed.endsWith('|')) {
      const tableLines: string[] = []
      while (i < rawLines.length && rawLines[i].trim().startsWith('|')) {
        tableLines.push(rawLines[i].trim())
        i++
      }

      if (tableLines.length >= 2) {
        const headerRow = tableLines[0]
        const headers = headerRow
          .split('|')
          .slice(1, -1)
          .map((c) => c.trim())

        const bodyLines = tableLines.slice(tableLines[1].includes('---') ? 2 : 1)
        const rows = bodyLines.map((row) =>
          row
            .split('|')
            .slice(1, -1)
            .map((c) => c.trim())
        )

        blocks.push({ type: 'table', headers, rows })
        continue
      }
    }

    // Ordered List (1. ...)
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: { text: string; subItems?: string[] }[] = []
      while (i < rawLines.length) {
        const currLine = rawLines[i]
        const currTrimmed = currLine.trim()

        if (/^\d+\.\s+/.test(currTrimmed)) {
          items.push({
            text: currTrimmed.replace(/^\d+\.\s+/, ''),
            subItems: [],
          })
          i++
        } else if (
          items.length > 0 &&
          (/^[-*]\s+/.test(currTrimmed) || /^\s+[-*]\s+/.test(currLine))
        ) {
          const subText = currTrimmed.replace(/^[-*]\s+/, '')
          items[items.length - 1].subItems?.push(subText)
          i++
        } else if (!currTrimmed) {
          // Check if next non-empty line is part of list
          let nextIdx = i + 1
          while (nextIdx < rawLines.length && !rawLines[nextIdx].trim()) nextIdx++
          if (
            nextIdx < rawLines.length &&
            (/^\d+\.\s+/.test(rawLines[nextIdx].trim()) ||
              /^[-*]\s+/.test(rawLines[nextIdx].trim()))
          ) {
            i = nextIdx
            continue
          }
          break
        } else {
          break
        }
      }
      blocks.push({ type: 'ol', items })
      continue
    }

    // Unordered List (- ... or * ...)
    if (/^[-*]\s+/.test(trimmed)) {
      const items: { text: string; subItems?: string[] }[] = []
      while (i < rawLines.length) {
        const currLine = rawLines[i]
        const currTrimmed = currLine.trim()

        if (/^[-*]\s+/.test(currTrimmed) && !/^\s{2,}[-*]\s+/.test(currLine)) {
          items.push({
            text: currTrimmed.replace(/^[-*]\s+/, ''),
            subItems: [],
          })
          i++
        } else if (items.length > 0 && /^\s{2,}[-*]\s+/.test(currLine)) {
          const subText = currTrimmed.replace(/^[-*]\s+/, '')
          items[items.length - 1].subItems?.push(subText)
          i++
        } else if (!currTrimmed) {
          let nextIdx = i + 1
          while (nextIdx < rawLines.length && !rawLines[nextIdx].trim()) nextIdx++
          if (
            nextIdx < rawLines.length &&
            /^[-*]\s+/.test(rawLines[nextIdx].trim())
          ) {
            i = nextIdx
            continue
          }
          break
        } else {
          break
        }
      }
      blocks.push({ type: 'ul', items })
      continue
    }

    // Standard Paragraph: collect contiguous non-empty lines that don't start other blocks
    const pLines: string[] = []
    while (i < rawLines.length) {
      const curr = rawLines[i].trim()
      if (!curr) break
      if (
        curr.startsWith('## ') ||
        curr.startsWith('### ') ||
        curr.startsWith('#### ') ||
        curr.startsWith('```') ||
        curr.startsWith('> ') ||
        curr.startsWith('|') ||
        /^(---|---|\*\*\*|___)$/.test(curr) ||
        /^\d+\.\s+/.test(curr) ||
        /^[-*]\s+/.test(curr)
      ) {
        break
      }
      pLines.push(curr)
      i++
    }

    if (pLines.length > 0) {
      blocks.push({ type: 'paragraph', content: pLines.join(' ') })
    }
  }

  return blocks
}

/**
 * Clean up LaTeX strings into readable text notations
 */
function cleanMathNotation(formula: string): string {
  return formula
    .replace(/\\times/g, ' × ')
    .replace(/\\div/g, ' ÷ ')
    .replace(/\\pm/g, ' ± ')
    .replace(/\\le/g, ' ≤ ')
    .replace(/\\ge/g, ' ≥ ')
    .replace(/\\approx/g, ' ≈ ')
    .replace(/\\neq/g, ' ≠ ')
    .replace(/\\to/g, ' → ')
    .replace(/\\infty/g, '∞')
    .replace(/\\%/g, '%')
    .replace(/\\mathbf\{([^}]+)\}/g, '$1')
    .replace(/\\text\{([^}]+)\}/g, '$1')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
}

/**
 * Parses inline formatting:
 * - Markdown links [text](url)
 * - Bold **text**
 * - Italic *text* or _text_
 * - Code `text`
 * - Math $formula$
 */
function renderInline(rawText: string): React.ReactNode {
  if (!rawText) return null

  // Pre-clean escaped math notation in body
  const text = cleanMathNotation(rawText)

  // Tokenize using regex covering links, code, bold, italic, and inline math
  // Group 1: Links [label](url)
  // Group 2: Code `code`
  // Group 3: Bold **bold**
  // Group 4: Italic *italic* or _italic_
  // Group 5: Inline Math $math$
  const regex = /(\[[^\]]+\]\([^)]+\)|`[^`]+`|\*\*[^*]+\*\*|(?<!\*)\*[^*]+\*(?!\*)|(?<!_)_[^_]+_(?!_)|\$[^$]+\$)/g

  const parts = text.split(regex)

  return parts.map((part, index) => {
    if (!part) return null

    // 1. Markdown Link: [label](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/)
    if (linkMatch) {
      const label = linkMatch[1]
      const url = linkMatch[2]

      if (url.startsWith('/')) {
        return (
          <Link
            key={index}
            href={url}
            className="font-semibold text-sky-600 hover:text-sky-700 underline decoration-sky-300 hover:decoration-sky-600 underline-offset-2 transition-colors"
          >
            {label}
          </Link>
        )
      }

      return (
        <a
          key={index}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-sky-600 hover:text-sky-700 underline decoration-sky-300 hover:decoration-sky-600 underline-offset-2 transition-colors"
        >
          {label}
        </a>
      )
    }

    // 2. Code: `code`
    if (part.startsWith('`') && part.endsWith('`') && part.length > 2) {
      return (
        <code
          key={index}
          className="px-1.5 py-0.5 rounded-md bg-slate-100 text-sky-700 font-mono text-xs font-medium border border-slate-200/60"
        >
          {part.slice(1, -1)}
        </code>
      )
    }

    // 3. Bold: **bold**
    if (part.startsWith('**') && part.endsWith('**') && part.length > 4) {
      return (
        <strong key={index} className="font-bold text-slate-900">
          {part.slice(2, -2)}
        </strong>
      )
    }

    // 4. Italic: *italic* or _italic_
    if (
      (part.startsWith('*') && part.endsWith('*') && part.length > 2) ||
      (part.startsWith('_') && part.endsWith('_') && part.length > 2)
    ) {
      return (
        <em key={index} className="italic text-slate-800">
          {part.slice(1, -1)}
        </em>
      )
    }

    // 5. Inline Math: $formula$
    if (part.startsWith('$') && part.endsWith('$') && part.length > 2) {
      const mathContent = part.slice(1, -1).trim()
      // If it's a simple variable like C or I
      if (/^[a-zA-Z]$/.test(mathContent)) {
        return (
          <span key={index} className="font-serif italic font-semibold text-slate-900 px-0.5">
            {mathContent}
          </span>
        )
      }
      return (
        <span
          key={index}
          className="font-mono text-xs sm:text-sm bg-slate-100/90 text-slate-900 px-1.5 py-0.5 rounded border border-slate-200 font-medium"
        >
          {mathContent}
        </span>
      )
    }

    return part
  })
}
