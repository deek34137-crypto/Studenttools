'use client'

import React, { useState } from 'react'
import { calculateMarksPercentage, SubjectMarkItem } from '../../lib/calculators/student'
import { Plus, Trash2, Award } from 'lucide-react'

export function MarksPercentageCalc() {
  const [subjects, setSubjects] = useState<SubjectMarkItem[]>([
    { id: '1', name: 'English', obtained: 88, maxMarks: 100 },
    { id: '2', name: 'Mathematics', obtained: 94, maxMarks: 100 },
    { id: '3', name: 'Physics', obtained: 85, maxMarks: 100 },
    { id: '4', name: 'Chemistry', obtained: 91, maxMarks: 100 },
    { id: '5', name: 'Computer Science', obtained: 96, maxMarks: 100 },
  ])

  const result = calculateMarksPercentage(subjects)

  function addSubject() {
    setSubjects([
      ...subjects,
      { id: Date.now().toString(), name: `Subject ${subjects.length + 1}`, obtained: 80, maxMarks: 100 },
    ])
  }

  function removeSubject(id?: string) {
    if (subjects.length <= 1) return
    setSubjects(subjects.filter((s) => s.id !== id))
  }

  function updateSubject(index: number, field: keyof SubjectMarkItem, value: any) {
    const next = [...subjects]
    next[index] = { ...next[index], [field]: value }
    setSubjects(next)
  }

  return (
    <div className="space-y-6">
      {/* Subject rows */}
      <div className="space-y-2.5">
        <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">
          <div className="col-span-5 sm:col-span-6">Subject Name</div>
          <div className="col-span-3 sm:col-span-3">Marks Obtained</div>
          <div className="col-span-3 sm:col-span-2">Max Marks</div>
          <div className="col-span-1 text-right sm:col-span-1"></div>
        </div>

        {subjects.map((sub, idx) => (
          <div
            key={sub.id || idx}
            className="grid grid-cols-12 gap-2 items-center p-2 rounded-xl bg-slate-50 border border-slate-200"
          >
            <div className="col-span-5 sm:col-span-6">
              <input
                type="text"
                value={sub.name}
                onChange={(e) => updateSubject(idx, 'name', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium"
              />
            </div>
            <div className="col-span-3 sm:col-span-3">
              <input
                type="number"
                min="0"
                value={sub.obtained}
                onChange={(e) => updateSubject(idx, 'obtained', parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-bold text-slate-900"
              />
            </div>
            <div className="col-span-3 sm:col-span-2">
              <input
                type="number"
                min="1"
                value={sub.maxMarks}
                onChange={(e) => updateSubject(idx, 'maxMarks', parseFloat(e.target.value) || 100)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm"
              />
            </div>
            <div className="col-span-1 text-right sm:col-span-1">
              <button
                onClick={() => removeSubject(sub.id)}
                disabled={subjects.length <= 1}
                className="p-1.5 text-slate-400 hover:text-red-600 disabled:opacity-30 rounded-lg transition-colors"
                aria-label="Remove subject"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addSubject}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Add Another Subject</span>
      </button>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-800 text-white shadow-lg">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
          <div>
            <span className="text-xs text-blue-200 uppercase tracking-wider font-semibold">
              Total Percentage
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold mt-1">
              {result.percentage}%
            </div>
          </div>

          <div>
            <span className="text-xs text-blue-200 uppercase tracking-wider font-semibold">
              Total Marks
            </span>
            <div className="text-2xl sm:text-3xl font-bold mt-1">
              {result.totalObtained} <span className="text-sm font-normal text-blue-200">/ {result.totalMax}</span>
            </div>
          </div>

          <div>
            <span className="text-xs text-blue-200 uppercase tracking-wider font-semibold">
              Average Score
            </span>
            <div className="text-2xl sm:text-3xl font-bold mt-1">
              {result.average}
            </div>
          </div>

          <div>
            <span className="text-xs text-blue-200 uppercase tracking-wider font-semibold">
              Total Subjects
            </span>
            <div className="text-2xl sm:text-3xl font-bold mt-1">
              {result.subjectCount}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
