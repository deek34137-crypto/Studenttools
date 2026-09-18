'use client'

import React, { useState, useEffect } from 'react'
import { getJeeCountdown } from '../../lib/calculators/jee'
import { UPCOMING_JEE_SESSIONS } from '../../data/jee/config'
import { Clock, Calendar, ExternalLink, AlertCircle } from 'lucide-react'

export function JeeCountdownCalc() {
  const [selectedSessionIndex, setSelectedSessionIndex] = useState<number>(0)
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  const countdown = getJeeCountdown(selectedSessionIndex, currentTime)
  const session = UPCOMING_JEE_SESSIONS[selectedSessionIndex]

  return (
    <div className="space-y-6">
      {/* Session Selector */}
      <div className="flex flex-wrap gap-2">
        {UPCOMING_JEE_SESSIONS.map((s, idx) => (
          <button
            key={s.sessionName}
            onClick={() => setSelectedSessionIndex(idx)}
            className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all border ${
              selectedSessionIndex === idx
                ? 'bg-sky-600 text-white border-sky-600 shadow-sm'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {s.sessionName}
          </button>
        ))}
      </div>

      {/* Live Countdown Display */}
      <div className="p-6 sm:p-10 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 text-white shadow-xl text-center">
        <span className="text-xs uppercase tracking-widest text-sky-400 font-semibold flex items-center justify-center gap-1.5 mb-2">
          <Clock className="w-4 h-4" />
          {session.sessionName}
        </span>

        {countdown.hasPassed ? (
          <div className="py-6 text-xl font-bold text-amber-300">
            This exam session has concluded or is currently underway.
          </div>
        ) : (
          <div className="grid grid-cols-4 gap-2 sm:gap-4 max-w-lg mx-auto my-4">
            <div className="bg-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-xs">
              <span className="text-2xl sm:text-4xl font-black">{countdown.days}</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-sky-200 block mt-1">
                Days
              </span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-xs">
              <span className="text-2xl sm:text-4xl font-black">{countdown.hours}</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-sky-200 block mt-1">
                Hours
              </span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-xs">
              <span className="text-2xl sm:text-4xl font-black">{countdown.minutes}</span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-sky-200 block mt-1">
                Minutes
              </span>
            </div>
            <div className="bg-white/10 rounded-xl p-3 sm:p-4 backdrop-blur-xs">
              <span className="text-2xl sm:text-4xl font-black text-sky-300">
                {countdown.seconds}
              </span>
              <span className="text-[10px] sm:text-xs uppercase tracking-wider text-sky-200 block mt-1">
                Seconds
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-xs text-slate-300 mt-6 pt-4 border-t border-slate-800">
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-sky-400" />
            Target Date: <strong>{new Date(session.examDate).toLocaleDateString('en-IN', { dateStyle: 'long' })}</strong>
          </span>
          <a
            href={session.officialWebsite}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sky-400 hover:text-sky-300 underline"
          >
            Official NTA Portal
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>

      {session.isTentative && (
        <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span>
            <strong>Tentative Schedule:</strong> Dates are estimated based on past annual cycles. Official NTA schedules are released in the Information Bulletin at jeemain.nta.ac.in.
          </span>
        </div>
      )}
    </div>
  )
}
