'use client'

import React, { useState } from 'react'
import { calculateGpa, GpaSubjectItem } from '../../lib/calculators/student'
import { Plus, Trash2, Award } from 'lucide-react'

export function GpaCalc() {
  const [courses, setCourses] = useState<GpaSubjectItem[]>([
    { id: '1', name: 'Data Structures', credits: 4, gradePoints: 9 },
    { id: '2', name: 'Digital Logic', credits: 3, gradePoints: 8 },
    { id: '3', name: 'Linear Algebra', credits: 4, gradePoints: 10 },
    { id: '4', name: 'Technical Writing', credits: 2, gradePoints: 8 },
    { id: '5', name: 'Programming Lab', credits: 2, gradePoints: 10 },
  ])

  const result = calculateGpa(courses)

  function addCourse() {
    setCourses([
      ...courses,
      { id: Date.now().toString(), name: `Course ${courses.length + 1}`, credits: 3, gradePoints: 8 },
    ])
  }

  function removeCourse(id?: string) {
    if (courses.length <= 1) return
    setCourses(courses.filter((c) => c.id !== id))
  }

  function updateCourse(index: number, field: keyof GpaSubjectItem, value: any) {
    const next = [...courses]
    next[index] = { ...next[index], [field]: value }
    setCourses(next)
  }

  return (
    <div className="space-y-6">
      {/* Course List */}
      <div className="space-y-2.5">
        <div className="grid grid-cols-12 gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider px-2">
          <div className="col-span-5 sm:col-span-6">Course Title</div>
          <div className="col-span-3 sm:col-span-3">Credit Hours</div>
          <div className="col-span-3 sm:col-span-2">Grade Point (0-10)</div>
          <div className="col-span-1 text-right"></div>
        </div>

        {courses.map((course, idx) => (
          <div
            key={course.id || idx}
            className="grid grid-cols-12 gap-2 items-center p-2 rounded-xl bg-slate-50 border border-slate-200"
          >
            <div className="col-span-5 sm:col-span-6">
              <input
                type="text"
                value={course.name}
                onChange={(e) => updateCourse(idx, 'name', e.target.value)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-medium"
              />
            </div>
            <div className="col-span-3 sm:col-span-3">
              <input
                type="number"
                min="1"
                max="10"
                value={course.credits}
                onChange={(e) => updateCourse(idx, 'credits', parseFloat(e.target.value) || 1)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-bold text-slate-900"
              />
            </div>
            <div className="col-span-3 sm:col-span-2">
              <input
                type="number"
                min="0"
                max="10"
                step="0.5"
                value={course.gradePoints}
                onChange={(e) => updateCourse(idx, 'gradePoints', parseFloat(e.target.value) || 0)}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs sm:text-sm font-bold text-slate-900"
              />
            </div>
            <div className="col-span-1 text-right">
              <button
                onClick={() => removeCourse(course.id)}
                disabled={courses.length <= 1}
                className="p-1.5 text-slate-400 hover:text-red-600 disabled:opacity-30 rounded-lg transition-colors"
                aria-label="Remove course"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={addCourse}
        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 border border-sky-200 transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span>Add Another Course</span>
      </button>

      {/* Result Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-indigo-700 to-slate-900 text-white shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center sm:text-left items-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold flex items-center justify-center sm:justify-start gap-1.5">
              <Award className="w-4 h-4 text-amber-400" />
              Semester GPA (SGPA)
            </span>
            <div className="text-4xl sm:text-5xl font-black mt-1 text-white">
              {result.gpa} <span className="text-sm font-normal text-indigo-300">/ 10.0</span>
            </div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold">
              Total Credits
            </span>
            <div className="text-2xl sm:text-3xl font-bold mt-1">{result.totalCredits}</div>
          </div>

          <div>
            <span className="text-xs uppercase tracking-wider text-indigo-300 font-semibold">
              Total Quality Points
            </span>
            <div className="text-2xl sm:text-3xl font-bold mt-1">{result.totalQualityPoints}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
