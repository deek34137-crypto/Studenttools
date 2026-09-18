'use client'

import React, { useState } from 'react'
import { queryCutoffs } from '../../lib/calculators/jee'
import { Category, Quota, InstituteType } from '../../data/jee/types'
import { Search, Filter, Database } from 'lucide-react'

export function JeeCutoffExplorerCalc() {
  const [institute, setInstitute] = useState<string>('')
  const [branch, setBranch] = useState<string>('')
  const [category, setCategory] = useState<Category | ''>('')
  const [quota, setQuota] = useState<Quota | ''>('')
  const [instituteType, setInstituteType] = useState<InstituteType | ''>('')

  const cutoffs = queryCutoffs({
    institute: institute || undefined,
    branch: branch || undefined,
    category: category || undefined,
    quota: quota || undefined,
    instituteType: instituteType || undefined,
  })

  return (
    <div className="space-y-6">
      {/* Search Filters */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
          <Filter className="w-3.5 h-3.5 text-sky-600" />
          <span>Filter Official JoSAA Cutoff Records</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Institute Name</label>
            <input
              type="text"
              placeholder="e.g. Trichy, Surathkal"
              value={institute}
              onChange={(e) => setInstitute(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Branch / Discipline</label>
            <input
              type="text"
              placeholder="e.g. Computer, Electronics"
              value={branch}
              onChange={(e) => setBranch(e.target.value)}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
            />
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Institute Type</label>
            <select
              value={instituteType}
              onChange={(e) => setInstituteType(e.target.value as InstituteType | '')}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
            >
              <option value="">All Types</option>
              <option value="NIT">NIT</option>
              <option value="IIIT">IIIT</option>
              <option value="GFTI">GFTI</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Quota</label>
            <select
              value={quota}
              onChange={(e) => setQuota(e.target.value as Quota | '')}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
            >
              <option value="">All Quotas</option>
              <option value="OS">Other State (OS)</option>
              <option value="HS">Home State (HS)</option>
              <option value="AI">All India (AI)</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-medium text-slate-500 mb-1">Category</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category | '')}
              className="w-full px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
            >
              <option value="">All Categories</option>
              <option value="OPEN">OPEN</option>
              <option value="EWS">EWS</option>
              <option value="OBC-NCL">OBC-NCL</option>
              <option value="SC">SC</option>
              <option value="ST">ST</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>Showing {cutoffs.length} cutoff records</span>
        <span>Data source: JoSAA Official Counselling Rounds</span>
      </div>

      {/* Cutoff Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200">
        <table className="min-w-full divide-y divide-slate-200 text-xs text-left">
          <thead className="bg-slate-100 font-semibold text-slate-700">
            <tr>
              <th className="px-4 py-3">Institute & State</th>
              <th className="px-4 py-3">Branch</th>
              <th className="px-3 py-3">Quota</th>
              <th className="px-3 py-3">Category</th>
              <th className="px-3 py-3 text-right">Opening Rank</th>
              <th className="px-3 py-3 text-right">Closing Rank</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 bg-white">
            {cutoffs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-400">
                  No records match your filter criteria.
                </td>
              </tr>
            ) : (
              cutoffs.map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-4 py-3 font-medium text-slate-900">
                    <div>{item.institute}</div>
                    <span className="text-[10px] text-slate-400 font-normal">
                      {item.instituteType} • {item.state}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-700">{item.branch}</td>
                  <td className="px-3 py-3">
                    <span className="px-1.5 py-0.5 rounded-sm bg-slate-100 font-medium text-slate-700">
                      {item.quota}
                    </span>
                  </td>
                  <td className="px-3 py-3">
                    <span className="px-1.5 py-0.5 rounded-sm bg-sky-50 text-sky-700 font-medium border border-sky-100">
                      {item.category}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right font-mono text-slate-600">
                    #{item.openingRank.toLocaleString('en-IN')}
                  </td>
                  <td className="px-3 py-3 text-right font-mono font-bold text-slate-900">
                    #{item.closingRank.toLocaleString('en-IN')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
