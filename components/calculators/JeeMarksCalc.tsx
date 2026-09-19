// components/calculators/JeeMarksCalc.tsx
'use client'

import React, { useState } from 'react'
import { calculateJeeMarks, JeeMarksInput } from '../../lib/calculators/jee'
import { AlertCircle, RotateCcw, Info } from 'lucide-react'

export function JeeMarksCalc() {
  const [correct, setCorrect] = useState<number>(55)
  const [incorrect, setIncorrect] = useState<number>(10)
  const [mode, setMode] = useState<'aggregate' | 'subject'>('aggregate')

  // Subject inputs (25 max per subject)
  const [phyCorrect, setPhyCorrect] = useState<number>(20)
  const [phyIncorrect, setPhyIncorrect] = useState<number>(3)
  const [chemCorrect, setChemCorrect] = useState<number>(18)
  const [chemIncorrect, setChemIncorrect] = useState<number>(4)
  const [mathCorrect, setMathCorrect] = useState<number>(17)
  const [mathIncorrect, setMathIncorrect] = useState<number>(3)

  // Overall aggregate validation & auto-calculation
  const maxPossibleIncorrect = Math.max(0, 75 - correct)
  const unattempted = Math.max(0, 75 - (correct + incorrect))
  const totalAttempted = correct + incorrect

  function handleCorrectChange(val: number) {
    const safeCorrect = Math.max(0, Math.min(75, val))
    setCorrect(safeCorrect)
    // If correct + incorrect exceeds 75, clamp incorrect
    if (safeCorrect + incorrect > 75) {
      setIncorrect(75 - safeCorrect)
    }
  }

  function handleIncorrectChange(val: number) {
    const maxInc = Math.max(0, 75 - correct)
    const safeIncorrect = Math.max(0, Math.min(maxInc, val))
    setIncorrect(safeIncorrect)
  }

  function handleSubjectChange(
    subject: 'phy' | 'chem' | 'math',
    type: 'correct' | 'incorrect',
    val: number
  ) {
    if (subject === 'phy') {
      if (type === 'correct') {
        const c = Math.max(0, Math.min(25, val))
        setPhyCorrect(c)
        if (c + phyIncorrect > 25) setPhyIncorrect(25 - c)
      } else {
        const maxInc = Math.max(0, 25 - phyCorrect)
        setPhyIncorrect(Math.max(0, Math.min(maxInc, val)))
      }
    } else if (subject === 'chem') {
      if (type === 'correct') {
        const c = Math.max(0, Math.min(25, val))
        setChemCorrect(c)
        if (c + chemIncorrect > 25) setChemIncorrect(25 - c)
      } else {
        const maxInc = Math.max(0, 25 - chemCorrect)
        setChemIncorrect(Math.max(0, Math.min(maxInc, val)))
      }
    } else {
      if (type === 'correct') {
        const c = Math.max(0, Math.min(25, val))
        setMathCorrect(c)
        if (c + mathIncorrect > 25) setMathIncorrect(25 - c)
      } else {
        const maxInc = Math.max(0, 25 - mathCorrect)
        setMathIncorrect(Math.max(0, Math.min(maxInc, val)))
      }
    }
  }

  function handleReset() {
    setCorrect(55)
    setIncorrect(10)
    setPhyCorrect(20)
    setPhyIncorrect(3)
    setChemCorrect(18)
    setChemIncorrect(4)
    setMathCorrect(17)
    setMathIncorrect(3)
  }

  const input: JeeMarksInput =
    mode === 'subject'
      ? {
          correct: 0,
          incorrect: 0,
          subjects: {
            physics: { correct: phyCorrect, incorrect: phyIncorrect },
            chemistry: { correct: chemCorrect, incorrect: chemIncorrect },
            mathematics: { correct: mathCorrect, incorrect: mathIncorrect },
          },
        }
      : {
          correct,
          incorrect,
          unattempted,
        }

  const result = calculateJeeMarks(input)

  return (
    <div className="space-y-6">
      {/* Mode toggle and Reset */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex p-1 bg-slate-100 rounded-xl max-w-xs">
          <button
            onClick={() => setMode('aggregate')}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'aggregate' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Overall Questions
          </button>
          <button
            onClick={() => setMode('subject')}
            className={`flex-1 py-1.5 px-3 text-xs font-semibold rounded-lg transition-colors ${
              mode === 'subject' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Subject-Wise
          </button>
        </div>

        <button
          onClick={handleReset}
          className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span>Reset Defaults</span>
        </button>
      </div>

      {mode === 'aggregate' ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Correct Answers */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Correct Answers (+4)
                </label>
                <span className="text-[11px] text-emerald-600 font-semibold">Max 75</span>
              </div>
              <input
                type="number"
                min="0"
                max="75"
                value={correct}
                onChange={(e) => handleCorrectChange(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 font-bold text-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-400">Awarded +4 marks each</p>
            </div>

            {/* Incorrect Answers */}
            <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Incorrect Answers (-1)
                </label>
                <span className="text-[11px] text-rose-600 font-semibold">
                  Max {maxPossibleIncorrect}
                </span>
              </div>
              <input
                type="number"
                min="0"
                max={maxPossibleIncorrect}
                value={incorrect}
                onChange={(e) => handleIncorrectChange(parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 bg-slate-50/50 border border-slate-200 rounded-lg text-slate-900 font-bold text-lg focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
              />
              <p className="text-[11px] text-slate-400">Deducts 1 mark each</p>
            </div>

            {/* Unattempted Questions (Auto-Calculated) */}
            <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/80 space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700">
                  Unattempted (0 marks)
                </label>
                <span className="text-[10px] uppercase font-bold text-sky-600 bg-sky-50 px-1.5 py-0.5 rounded">
                  Auto-Calculated
                </span>
              </div>
              <div className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 font-bold text-lg">
                {unattempted}
              </div>
              <p className="text-[11px] text-slate-400">75 - Attempted ({totalAttempted})</p>
            </div>
          </div>

          {/* Exam constraints indicator */}
          <div className="px-4 py-2.5 rounded-xl bg-sky-50/70 border border-sky-100 flex items-center justify-between text-xs text-sky-900">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-600 shrink-0" />
              <span>
                JEE Main Paper 1 contains exactly <strong>75 questions</strong> (300 marks).
              </span>
            </div>
            <div className="font-semibold text-slate-700">
              Total Accounted: {totalAttempted + unattempted} / 75
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {[
            {
              key: 'phy' as const,
              label: 'Physics',
              c: phyCorrect,
              inc: phyIncorrect,
            },
            {
              key: 'chem' as const,
              label: 'Chemistry',
              c: chemCorrect,
              inc: chemIncorrect,
            },
            {
              key: 'math' as const,
              label: 'Mathematics',
              c: mathCorrect,
              inc: mathIncorrect,
            },
          ].map((sub) => {
            const subAttempted = sub.c + sub.inc
            const subUnattempted = Math.max(0, 25 - subAttempted)
            const subMaxInc = Math.max(0, 25 - sub.c)

            return (
              <div key={sub.label} className="p-4 rounded-xl border border-slate-200 bg-white space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">
                    {sub.label}
                  </h4>
                  <span className="text-xs text-slate-500 font-medium">
                    Attempted: <strong className="text-slate-800">{subAttempted}</strong> / 25 questions
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Correct (+4)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="25"
                      value={sub.c}
                      onChange={(e) =>
                        handleSubjectChange(sub.key, 'correct', parseInt(e.target.value) || 0)
                      }
                      className="w-full px-2.5 py-1.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                      Incorrect (-1)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max={subMaxInc}
                      value={sub.inc}
                      onChange={(e) =>
                        handleSubjectChange(sub.key, 'incorrect', parseInt(e.target.value) || 0)
                      }
                      className="w-full px-2.5 py-1.5 bg-slate-50/50 border border-slate-200 rounded-lg text-sm font-bold text-slate-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Unattempted
                    </label>
                    <div className="px-2.5 py-1.5 bg-slate-100/60 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600">
                      {subUnattempted}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Result Display Box */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-sky-500 to-sky-700 text-white shadow-md">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <span className="text-xs text-sky-100 uppercase tracking-wider font-medium">Total Score</span>
            <div className="text-3xl sm:text-4xl font-extrabold mt-1">
              {result.totalMarks} <span className="text-sm font-normal text-sky-200">/ 300</span>
            </div>
          </div>
          <div>
            <span className="text-xs text-sky-100 uppercase tracking-wider font-medium">Accuracy</span>
            <div className="text-2xl sm:text-3xl font-bold mt-1.5">{result.accuracyPercentage}%</div>
          </div>
          <div>
            <span className="text-xs text-sky-100 uppercase tracking-wider font-medium">Attempted</span>
            <div className="text-2xl sm:text-3xl font-bold mt-1.5">
              {result.attempted} <span className="text-sm font-normal text-sky-200">/ 75</span>
            </div>
          </div>
          <div>
            <span className="text-xs text-sky-100 uppercase tracking-wider font-medium">Score Percentage</span>
            <div className="text-2xl sm:text-3xl font-bold mt-1.5">{result.percentage}%</div>
          </div>
        </div>

        {result.subjects && (
          <div className="mt-6 pt-4 border-t border-sky-400/50 grid grid-cols-3 gap-2 text-center text-xs">
            {result.subjects.map((s) => (
              <div key={s.name} className="bg-sky-600/60 rounded-lg p-2.5">
                <div className="font-semibold text-sky-100">{s.name}</div>
                <div className="text-base font-bold mt-0.5">{s.marks} / 100</div>
                <div className="text-[10px] text-sky-200 mt-0.5">
                  Accuracy: {s.accuracyPercentage}% ({s.attempted}/25)
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
