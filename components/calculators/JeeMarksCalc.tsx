'use client'

import React, { useState } from 'react'
import { calculateJeeMarks, JeeMarksInput } from '../../lib/calculators/jee'
import { CheckCircle, XCircle, HelpCircle, RotateCcw } from 'lucide-react'

export function JeeMarksCalc() {
  const [correct, setCorrect] = useState<number>(55)
  const [incorrect, setIncorrect] = useState<number>(10)
  const [unattempted, setUnattempted] = useState<number>(10)
  const [mode, setMode] = useState<'aggregate' | 'subject'>('aggregate')

  // Subject inputs
  const [phyCorrect, setPhyCorrect] = useState<number>(20)
  const [phyIncorrect, setPhyIncorrect] = useState<number>(3)
  const [chemCorrect, setChemCorrect] = useState<number>(18)
  const [chemIncorrect, setChemIncorrect] = useState<number>(4)
  const [mathCorrect, setMathCorrect] = useState<number>(17)
  const [mathIncorrect, setMathIncorrect] = useState<number>(3)

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
      {/* Mode toggle */}
      <div className="flex p-1 bg-slate-100 rounded-xl max-w-xs">
        <button
          onClick={() => setMode('aggregate')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            mode === 'aggregate' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Overall Questions
        </button>
        <button
          onClick={() => setMode('subject')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            mode === 'subject' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
          }`}
        >
          Subject-Wise
        </button>
      </div>

      {mode === 'aggregate' ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Correct Answers (+4 each)
            </label>
            <input
              type="number"
              min="0"
              max="75"
              value={correct}
              onChange={(e) => setCorrect(Math.max(0, Math.min(75, parseInt(e.target.value) || 0)))}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Incorrect Answers (-1 each)
            </label>
            <input
              type="number"
              min="0"
              max="75"
              value={incorrect}
              onChange={(e) => setIncorrect(Math.max(0, Math.min(75, parseInt(e.target.value) || 0)))}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-700 mb-1">
              Unattempted Questions (0 marks)
            </label>
            <input
              type="number"
              min="0"
              max="75"
              value={unattempted}
              onChange={(e) => setUnattempted(Math.max(0, Math.min(75, parseInt(e.target.value) || 0)))}
              className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {[
            { label: 'Physics', c: phyCorrect, setC: setPhyCorrect, inc: phyIncorrect, setInc: setPhyIncorrect },
            { label: 'Chemistry', c: chemCorrect, setC: setChemCorrect, inc: chemIncorrect, setInc: setChemIncorrect },
            { label: 'Mathematics', c: mathCorrect, setC: setMathCorrect, inc: mathIncorrect, setInc: setMathIncorrect },
          ].map((sub) => (
            <div key={sub.label} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">
                {sub.label} (Max 25 Questions)
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Correct (+4)</label>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={sub.c}
                    onChange={(e) => sub.setC(Math.max(0, Math.min(25, parseInt(e.target.value) || 0)))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm"
                  />
                </div>
                <div>
                  <label className="block text-[11px] text-slate-500 mb-0.5">Incorrect (-1)</label>
                  <input
                    type="number"
                    min="0"
                    max="25"
                    value={sub.inc}
                    onChange={(e) => sub.setInc(Math.max(0, Math.min(25, parseInt(e.target.value) || 0)))}
                    className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-sm"
                  />
                </div>
              </div>
            </div>
          ))}
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
              <div key={s.name} className="bg-sky-600/60 rounded-lg p-2">
                <div className="font-semibold text-sky-100">{s.name}</div>
                <div className="text-base font-bold mt-0.5">{s.marks} / 100</div>
                <div className="text-[10px] text-sky-200">Accuracy: {s.accuracyPercentage}%</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
