'use client'

import React, { useState } from 'react'
import { predictColleges } from '../../lib/calculators/jee'
import { Category, Quota, InstituteType } from '../../data/jee/types'
import { School, CheckCircle2, AlertTriangle, HelpCircle } from 'lucide-react'

export function JeeCollegePredictorCalc() {
  const [rank, setRank] = useState<number>(4500)
  const [category, setCategory] = useState<Category>('OPEN')
  const [quota, setQuota] = useState<Quota>('OS')
  const [branch, setBranch] = useState<string>('')
  const [instituteType, setInstituteType] = useState<InstituteType | ''>('')

  const predictions = predictColleges({
    rank,
    category,
    quota,
    preferredBranch: branch || undefined,
    instituteType: instituteType || undefined,
  })

  return (
    <div className="space-y-6">
      {/* Filter Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Your JEE Main Rank
          </label>
          <input
            type="number"
            min="1"
            max="1000000"
            value={rank}
            onChange={(e) => setRank(Math.max(1, parseInt(e.target.value) || 1))}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 font-bold focus:ring-2 focus:ring-sky-500 focus:outline-hidden"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Category
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-sky-500"
          >
            <option value="OPEN">General (OPEN)</option>
            <option value="EWS">GEN-EWS</option>
            <option value="OBC-NCL">OBC-NCL</option>
            <option value="SC">SC</option>
            <option value="ST">ST</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Quota
          </label>
          <select
            value={quota}
            onChange={(e) => setQuota(e.target.value as Quota)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-sky-500"
          >
            <option value="OS">Other State (OS)</option>
            <option value="HS">Home State (HS)</option>
            <option value="AI">All India (AI)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Institute Type
          </label>
          <select
            value={instituteType}
            onChange={(e) => setInstituteType(e.target.value as InstituteType | '')}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-sky-500"
          >
            <option value="">All (NIT, IIIT, GFTI)</option>
            <option value="NIT">NITs</option>
            <option value="IIIT">IIITs</option>
            <option value="GFTI">GFTIs</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Preferred Branch
          </label>
          <input
            type="text"
            placeholder="e.g. Computer, Electronics"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Predictions count bar */}
      <div className="flex items-center justify-between py-2 px-3 bg-slate-100 rounded-xl text-xs text-slate-600">
        <span>
          Found <strong>{predictions.length}</strong> matching JoSAA reference options for rank{' '}
          <strong>#{rank.toLocaleString('en-IN')}</strong>.
        </span>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Sorted by admission probability
        </span>
      </div>

      {/* Predictions Table / Cards */}
      <div className="space-y-3">
        {predictions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-slate-200 p-6">
            <School className="w-10 h-10 text-slate-300 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-700">No matching programs found.</p>
            <p className="text-xs text-slate-500 mt-1">
              Try adjusting your preferred branch, quota, or exploring later CSAB round cutoffs.
            </p>
          </div>
        ) : (
          predictions.slice(0, 15).map((item, idx) => {
            const chanceBadge: Record<string, string> = {
              High: 'bg-emerald-100 text-emerald-800 border-emerald-200',
              Moderate: 'bg-amber-100 text-amber-800 border-amber-200',
              Borderline: 'bg-orange-100 text-orange-800 border-orange-200',
              Low: 'bg-slate-100 text-slate-600 border-slate-200',
            }

            return (
              <div
                key={idx}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-sky-300 transition-all shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
                      {item.record.instituteType}
                    </span>
                    <span className="text-xs font-semibold text-slate-500">
                      {item.record.state} • Quota: {item.record.quota}
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                        chanceBadge[item.chance]
                      }`}
                    >
                      {item.chance} Probability
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                    {item.record.institute}
                  </h4>
                  <p className="text-xs text-slate-600 font-medium">{item.record.branch}</p>
                  <p className="text-[11px] text-slate-400">{item.recommendation}</p>
                </div>

                <div className="text-left sm:text-right shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">
                    JoSAA Round {item.record.round} Cutoff
                  </span>
                  <div className="text-sm sm:text-base font-extrabold text-slate-800">
                    Closing: #{item.record.closingRank.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] text-slate-500">
                    Opening: #{item.record.openingRank.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>

      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-500 flex items-start gap-2">
        <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
        <span>
          Predictor results are estimates based on JoSAA Round 5 historical counselling closing ranks.
          Actual cutoffs fluctuate annually based on candidate preferences and seat matrix revisions.
        </span>
      </div>
    </div>
  )
}
