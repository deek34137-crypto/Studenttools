'use client'

import React, { useState } from 'react'
import { calculateStudyHours, StudyPlanSubject } from '../../lib/calculators/student'
import { Calendar, Plus, Trash2, Clock, BookOpen } from 'lucide-react'

export function StudyHoursCalc() {
  const [examDate, setExamDate] = useState<string>(() => {
    const d = new Date()
    d.setDate(d.getDate() + 30)
    return d.toISOString().split('T')[0]
  })
  const [hoursPerDay, setHoursPerDay] = useState<number>(6)
  const [subjects, setSubjects] = useState<StudyPlanSubject[]>([
    { name: 'Mathematics', priority: 'High' },
    { name: 'Physics', priority: 'High' },
    { name: 'Chemistry', priority: 'Medium' },
    { name: 'English', priority: 'Low' },
  ])

  const result = calculateStudyHours(examDate, hoursPerDay, subjects)

  function addSubject() {
    setSubjects([...subjects, { name: `Subject ${subjects.length + 1}`, priority: 'Medium' }])
  }

  function removeSubject(index: number) {
    if (subjects.length <= 1) return
    setSubjects(subjects.filter((_, idx) => idx !== index))
  }

  function updateSubject(index: number, field: keyof StudyPlanSubject, val: any) {
    const next = [...subjects]
    next[index] = { ...next[index], [field]: val }
    setSubjects(next)
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Exam Start Date
          </label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-medium text-sm focus:ring-2 focus:ring-sky-500"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Dedicated Study Hours Per Day
          </label>
          <input
            type="number"
            min="1"
            max="16"
            step="0.5"
            value={hoursPerDay}
            onChange={(e) => setHoursPerDay(parseFloat(e.target.value) || 4)}
            className="w-full px-3.5 py-2.5 bg-white border border-slate-200 rounded-xl text-slate-900 font-bold text-lg focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Subjects & Priorities */}
      <div className="space-y-2">
        <label className="block text-xs font-semibold text-slate-700">
          Subjects & Difficulty / Priority
        </label>
        {subjects.map((sub, idx) => (
          <div key={idx} className="flex items-center gap-3 p-2 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex-1">
              <input
                type="text"
                value={sub.name}
                onChange={(e) => updateSubject(idx, 'name', e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium"
              />
            </div>
            <div className="w-36">
              <select
                value={sub.priority}
                onChange={(e) => updateSubject(idx, 'priority', e.target.value)}
                className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-semibold"
              >
                <option value="High">High Priority (3×)</option>
                <option value="Medium">Medium (2×)</option>
                <option value="Low">Low Priority (1×)</option>
              </select>
            </div>
            <button
              onClick={() => removeSubject(idx)}
              disabled={subjects.length <= 1}
              className="p-1.5 text-slate-400 hover:text-red-600 disabled:opacity-30 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addSubject}
        className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200"
      >
        <Plus className="w-4 h-4" />
        <span>Add Subject</span>
      </button>

      {/* Overview & Distribution Plan */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-sky-950 text-white shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs uppercase tracking-wider text-sky-400 font-semibold flex items-center gap-1.5">
              <Clock className="w-4 h-4" />
              Total Available Revision Hours
            </span>
            <div className="text-4xl sm:text-5xl font-black mt-1">
              {result.totalStudyHours} hrs
            </div>
            <p className="text-xs text-slate-300 mt-1">
              Across {result.daysRemaining} days remaining at {result.hoursPerDay} hrs/day
            </p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {result.subjects.map((s) => (
            <div key={s.name} className="p-3 bg-white/10 rounded-xl flex items-center justify-between">
              <div>
                <div className="font-bold text-sm text-white">{s.name}</div>
                <span className="text-[10px] uppercase font-semibold text-sky-300">
                  {s.priority} Priority • {s.sharePercentage}% share
                </span>
              </div>
              <div className="text-right">
                <div className="text-base font-extrabold text-sky-200">{s.allocatedHours} hrs</div>
                <span className="text-[11px] text-slate-300">{s.hoursPerDay} hrs/day</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
