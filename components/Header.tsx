'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Search, Menu, X, Calculator, GraduationCap, ChevronRight } from 'lucide-react'
import { GlobalSearch } from './GlobalSearch'

const NAV_LINKS = [
  { label: 'JEE & Exams', href: '/jee' },
  { label: 'Student Tools', href: '/student' },
  { label: 'Career & Salary', href: '/career' },
  { label: 'Finance', href: '/finance' },
  { label: 'Calculators', href: '/calculators' },
]

export function Header() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Global Ctrl+K / Cmd+K listener
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setIsSearchOpen((prev) => !prev)
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  // Close mobile drawer on route change
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <>
      <header className="sticky top-0 z-40 w-full bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <div className="w-9 h-9 rounded-xl bg-sky-600 flex items-center justify-center text-white shadow-sm group-hover:bg-sky-700 transition-colors">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-bold tracking-tight text-slate-900 leading-tight">
                Student<span className="text-sky-600">Tools</span>
              </span>
              <span className="text-[10px] text-slate-500 font-medium tracking-wide -mt-0.5">
                studenttools.cyou
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = pathname.startsWith(link.href)
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-sky-50 text-sky-700'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              )
            })}
          </nav>

          {/* Right actions: Search + Mobile Menu toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 rounded-lg text-xs sm:text-sm font-normal border border-slate-200 transition-colors"
              aria-label="Search tools"
            >
              <Search className="w-4 h-4 text-slate-400" />
              <span className="hidden sm:inline">Search a tool...</span>
              <span className="sm:hidden">Search</span>
              <kbd className="hidden sm:inline-block text-[10px] font-mono font-medium text-slate-400 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                Ctrl K
              </kbd>
            </button>

            <button
              onClick={() => setIsMobileMenuOpen((prev) => !prev)}
              className="lg:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg"
              aria-label="Toggle navigation menu"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
            <nav className="space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = pathname.startsWith(link.href)
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-sky-50 text-sky-700 font-semibold'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{link.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </Link>
                )
              })}
            </nav>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500 px-3">
              <Link href="/about" className="hover:text-slate-800">
                About
              </Link>
              <Link href="/contact" className="hover:text-slate-800">
                Contact
              </Link>
              <Link href="/disclaimer" className="hover:text-slate-800">
                Disclaimer
              </Link>
              <Link href="/privacy" className="hover:text-slate-800">
                Privacy
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <GlobalSearch isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  )
}
