import Link from 'next/link'
import { getPopularTools } from '../data/tools'
import { ToolCard } from '../components/ToolCard'
import { Search, Home, FileQuestion } from 'lucide-react'

export default function NotFound() {
  const popularTools = getPopularTools().slice(0, 4)

  return (
    <div className="min-h-[75vh] flex flex-col items-center justify-center px-4 py-16 text-center">
      <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4">
        <FileQuestion className="w-8 h-8" />
      </div>

      <span className="text-xs font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
        404 — Page Not Found
      </span>

      <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-3">
        Tool or Calculator Not Found
      </h1>

      <p className="text-sm sm:text-base text-slate-600 max-w-md mt-2">
        The calculator you are looking for may have moved or doesn&apos;t exist. Use the global search or explore our popular calculators below.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-sky-600 text-white font-semibold text-sm hover:bg-sky-700 transition-colors shadow-sm"
        >
          <Home className="w-4 h-4" />
          <span>Back to Homepage</span>
        </Link>
      </div>

      <div className="w-full max-w-4xl mt-12 text-left">
        <h2 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-4 text-center">
          Popular Tools You Might Need:
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {popularTools.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  )
}
