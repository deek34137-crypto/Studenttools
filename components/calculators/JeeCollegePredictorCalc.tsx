'use client'

import React, { useState, useMemo } from 'react'
import {
  predictColleges,
  INDIAN_STATES_AND_UTS,
  BRANCH_CATEGORY_OPTIONS,
} from '../../lib/calculators/jee'
import { Category, Quota, InstituteType, Gender, HistoricalCutoffBand } from '../../data/jee/types'
import {
  School,
  CheckCircle2,
  AlertCircle,
  MinusCircle,
  HelpCircle,
  MapPin,
  ShieldCheck,
  ChevronDown,
  Layers,
  Sparkles,
} from 'lucide-react'

export function JeeCollegePredictorCalc() {
  const [crlRank, setCrlRank] = useState<number>(4500)
  const [categoryRank, setCategoryRank] = useState<number | ''>('')
  const [category, setCategory] = useState<Category>('OPEN')
  const [homeState, setHomeState] = useState<string>('Delhi')
  const [quota, setQuota] = useState<Quota | 'AUTO' | 'ALL'>('AUTO')
  const [gender, setGender] = useState<Gender>('Gender-Neutral')
  const [instituteType, setInstituteType] = useState<InstituteType | 'ALL'>('ALL')
  const [branchCategory, setBranchCategory] = useState<string>('ALL')
  const [searchBranch, setSearchBranch] = useState<string>('')
  const [round, setRound] = useState<number | 'ALL'>(6)
  const [activeBandTab, setActiveBandTab] = useState<HistoricalCutoffBand | 'ALL'>('ALL')
  const [visibleLimit, setVisibleLimit] = useState<number>(15)

  // Memoize all matching predictions
  const allPredictions = useMemo(() => {
    return predictColleges({
      crlRank,
      categoryRank: typeof categoryRank === 'number' ? categoryRank : undefined,
      category,
      homeState,
      quota,
      gender,
      instituteType: instituteType === 'ALL' ? undefined : instituteType,
      branchCategory: branchCategory === 'ALL' ? undefined : branchCategory,
      preferredBranch: searchBranch || undefined,
      round,
    })
  }, [
    crlRank,
    categoryRank,
    category,
    homeState,
    quota,
    gender,
    instituteType,
    branchCategory,
    searchBranch,
    round,
  ])

  // Count per band for filter tabs
  const withinCount = useMemo(
    () => allPredictions.filter((p) => p.band === 'WITHIN_CUTOFF').length,
    [allPredictions]
  )
  const nearCount = useMemo(
    () => allPredictions.filter((p) => p.band === 'NEAR_CUTOFF').length,
    [allPredictions]
  )
  const outsideCount = useMemo(
    () => allPredictions.filter((p) => p.band === 'OUTSIDE_CUTOFF').length,
    [allPredictions]
  )

  // Filtered by active tab
  const displayedPredictions = useMemo(() => {
    if (activeBandTab === 'ALL') return allPredictions
    return allPredictions.filter((p) => p.band === activeBandTab)
  }, [allPredictions, activeBandTab])

  // Reset category rank when switching back to OPEN
  const handleCategoryChange = (newCat: Category) => {
    setCategory(newCat)
    if (newCat === 'OPEN') {
      setCategoryRank('')
    }
  }

  return (
    <div className="space-y-6">
      {/* Dynamic JoSAA Rules Explanation Callout */}
      <div className="p-4 rounded-xl bg-sky-50 border border-sky-200/80 text-sky-950 text-xs sm:text-sm space-y-2">
        <div className="flex items-center gap-2 font-bold text-sky-900">
          <ShieldCheck className="w-4 h-4 text-sky-600 shrink-0" />
          <span>Official JoSAA Seat Allocation Logic Active</span>
        </div>
        <div className="text-slate-700 space-y-1 pl-6">
          <p>
            • <strong>Rank Evaluation:</strong>{' '}
            {category === 'OPEN' ? (
              <span>
                Evaluating your <strong>CRL Rank #{crlRank.toLocaleString('en-IN')}</strong> against official OPEN closing cutoffs.
              </span>
            ) : (
              <span>
                Evaluating your{' '}
                <strong>
                  {category} Category Rank{' '}
                  {typeof categoryRank === 'number' && categoryRank > 0
                    ? `#${categoryRank.toLocaleString('en-IN')}`
                    : '(Estimated from CRL)'}
                </strong>{' '}
                against {category} seats, and your <strong>CRL #{crlRank.toLocaleString('en-IN')}</strong> for OPEN merit seats.
              </span>
            )}
          </p>
          <p>
            • <strong>Quota Resolution:</strong> Home State set to <strong>{homeState}</strong>.
            Candidate automatically gets <strong>Home State (HS)</strong> quota in {homeState} NITs and{' '}
            <strong>Other State (OS)</strong> quota in other state NITs. IIITs and IITs use{' '}
            <strong>All India (AI)</strong> quota.
          </p>
          <p>
            • <strong>Gender Pool:</strong>{' '}
            {gender === 'Female-only'
              ? 'Evaluating both Female-only (Supernumerary) and Gender-Neutral seat pools.'
              : 'Evaluating standard Gender-Neutral seat pools.'}
          </p>
        </div>
      </div>

      {/* Main Filter Panel */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        {/* Row 1: Ranks & Reservation */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
              <span>JEE Main CRL Rank</span>
              <span className="text-[11px] font-normal text-slate-400">All India Rank</span>
            </label>
            <input
              type="number"
              min="1"
              max="1500000"
              value={crlRank}
              onChange={(e) => setCrlRank(Math.max(1, parseInt(e.target.value) || 1))}
              className="w-full px-3 py-2 bg-slate-50 hover:bg-white border border-slate-300 rounded-lg text-sm text-slate-900 font-bold focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-hidden"
              placeholder="e.g. 4500"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Seat Reservation Category
            </label>
            <select
              value={category}
              onChange={(e) => handleCategoryChange(e.target.value as Category)}
              className="w-full px-3 py-2 bg-slate-50 hover:bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-sky-500 focus:bg-white"
            >
              <option value="OPEN">General (OPEN)</option>
              <option value="EWS">GEN-EWS</option>
              <option value="OBC-NCL">OBC-NCL</option>
              <option value="SC">SC (Scheduled Caste)</option>
              <option value="ST">ST (Scheduled Tribe)</option>
              <option value="OPEN-PwD">OPEN-PwD</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
              <span>{category} Category Rank</span>
              {category === 'OPEN' ? (
                <span className="text-[11px] font-normal text-slate-400">N/A for OPEN</span>
              ) : (
                <span className="text-[11px] font-semibold text-amber-600">From NTA Scorecard</span>
              )}
            </label>
            <input
              type="number"
              min="1"
              max="500000"
              disabled={category === 'OPEN'}
              value={categoryRank}
              onChange={(e) =>
                setCategoryRank(e.target.value === '' ? '' : Math.max(1, parseInt(e.target.value) || 1))
              }
              placeholder={category === 'OPEN' ? 'Not applicable' : 'e.g. 450'}
              className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-hidden ${
                category === 'OPEN'
                  ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed'
                  : 'bg-amber-50/50 border-amber-300 text-slate-900 font-bold'
              }`}
            />
          </div>
        </div>

        {/* Row 2: State, Quota & Gender */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1 flex items-center justify-between">
              <span>Home State (12th Board State)</span>
              <span className="text-[11px] font-normal text-slate-400">Determines HS / OS</span>
            </label>
            <select
              value={homeState}
              onChange={(e) => setHomeState(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 hover:bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-sky-500 focus:bg-white"
            >
              {INDIAN_STATES_AND_UTS.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Quota Mode
            </label>
            <select
              value={quota}
              onChange={(e) => setQuota(e.target.value as Quota | 'AUTO' | 'ALL')}
              className="w-full px-3 py-2 bg-slate-50 hover:bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-sky-500 focus:bg-white"
            >
              <option value="AUTO">Auto-Detect (HS for Home State, OS for Others)</option>
              <option value="OS">Other State (OS) Only</option>
              <option value="HS">Home State (HS) Only</option>
              <option value="AI">All India (AI) Only</option>
              <option value="ALL">Show All Quotas</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Gender Pool
            </label>
            <select
              value={gender}
              onChange={(e) => setGender(e.target.value as Gender)}
              className="w-full px-3 py-2 bg-slate-50 hover:bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-sky-500 focus:bg-white"
            >
              <option value="Gender-Neutral">Gender-Neutral (All Candidates)</option>
              <option value="Female-only">Female-only (Incl. Supernumerary)</option>
            </select>
          </div>
        </div>

        {/* Row 3: Institute Type, Discipline & Round */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Institute Type
            </label>
            <select
              value={instituteType}
              onChange={(e) => setInstituteType(e.target.value as InstituteType | 'ALL')}
              className="w-full px-3 py-2 bg-slate-50 hover:bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-sky-500 focus:bg-white"
            >
              <option value="ALL">All Institutes (NIT, IIIT, GFTI, IIT)</option>
              <option value="NIT">NITs (National Institutes of Tech)</option>
              <option value="IIIT">IIITs (Information Technology)</option>
              <option value="GFTI">GFTIs (Govt Funded Technical Inst)</option>
              <option value="IIT">IITs (JEE Advanced Reference)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Normalized Discipline
            </label>
            <select
              value={branchCategory}
              onChange={(e) => setBranchCategory(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 hover:bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-sky-500 focus:bg-white"
            >
              {BRANCH_CATEGORY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Branch / College Search
            </label>
            <input
              type="text"
              placeholder="e.g. Delhi, Computer, ECE"
              value={searchBranch}
              onChange={(e) => setSearchBranch(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 hover:bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-sky-500 focus:bg-white focus:outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-800 mb-1">
              Counselling Round
            </label>
            <select
              value={round}
              onChange={(e) => setRound(e.target.value === 'ALL' ? 'ALL' : parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-slate-50 hover:bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:ring-2 focus:ring-sky-500 focus:bg-white"
            >
              <option value={6}>Round 6 (Final Allotment Benchmark)</option>
              <option value={1}>Round 1 (Initial Allotment)</option>
              <option value={3}>Round 3 (Mid Allotment)</option>
              <option value={5}>Round 5 (Penultimate Allotment)</option>
              <option value="ALL">All Rounds</option>
            </select>
          </div>
        </div>
      </div>

      {/* Historical Cutoff Bands Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveBandTab('ALL')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
            activeBandTab === 'ALL'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All Options ({allPredictions.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveBandTab('WITHIN_CUTOFF')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeBandTab === 'WITHIN_CUTOFF'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100'
          }`}
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Within Closing Rank ({withinCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveBandTab('NEAR_CUTOFF')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeBandTab === 'NEAR_CUTOFF'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100'
          }`}
        >
          <AlertCircle className="w-3.5 h-3.5" />
          Near Cutoff / CSAB Reach ({nearCount})
        </button>

        <button
          type="button"
          onClick={() => setActiveBandTab('OUTSIDE_CUTOFF')}
          className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
            activeBandTab === 'OUTSIDE_CUTOFF'
              ? 'bg-slate-700 text-white shadow-xs'
              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          <MinusCircle className="w-3.5 h-3.5" />
          Outside Closing Range ({outsideCount})
        </button>
      </div>

      {/* Result Cards List */}
      <div className="space-y-3">
        {displayedPredictions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200 p-8">
            <School className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h4 className="text-base font-bold text-slate-800">No matching programs found</h4>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              No JoSAA cutoff records matched your active filter combination. Try selecting &ldquo;All Disciplines&rdquo;,
              switching Quota Mode to &ldquo;Auto-Detect&rdquo;, or viewing &ldquo;All Rounds&rdquo;.
            </p>
          </div>
        ) : (
          displayedPredictions.slice(0, visibleLimit).map((item, idx) => {
            const isWithin = item.band === 'WITHIN_CUTOFF'
            const isNear = item.band === 'NEAR_CUTOFF'

            const cardBorderClass = isWithin
              ? 'border-emerald-200 bg-white hover:border-emerald-400'
              : isNear
              ? 'border-amber-200 bg-white hover:border-amber-400'
              : 'border-slate-200 bg-white hover:border-slate-300'

            const bandBadgeClass = isWithin
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : isNear
              ? 'bg-amber-50 text-amber-800 border-amber-200'
              : 'bg-slate-100 text-slate-700 border-slate-200'

            const instTypeColor: Record<string, string> = {
              NIT: 'bg-blue-100 text-blue-800',
              IIIT: 'bg-purple-100 text-purple-800',
              GFTI: 'bg-indigo-100 text-indigo-800',
              IIT: 'bg-amber-100 text-amber-900 font-extrabold',
            }

            return (
              <div
                key={`${item.record.institute}-${item.record.branch}-${item.record.round}-${item.record.category}-${idx}`}
                className={`p-4 sm:p-5 rounded-2xl border transition-all shadow-2xs space-y-3 ${cardBorderClass}`}
              >
                {/* Header row: Institute, Badges */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-xs font-extrabold px-2.5 py-0.5 rounded-md ${
                          instTypeColor[item.record.instituteType] || 'bg-slate-100 text-slate-800'
                        }`}
                      >
                        {item.record.instituteType}
                      </span>
                      <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {item.record.state}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
                        Quota: {item.record.quota}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-semibold">
                        Seat: {item.record.category}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600">
                        {item.record.gender}
                      </span>
                    </div>

                    <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                      {item.record.institute}
                    </h3>
                    <p className="text-sm font-semibold text-sky-700">{item.record.branch}</p>
                  </div>

                  {/* Cutoff Status Badge */}
                  <div className="shrink-0 self-start sm:self-auto">
                    <span
                      className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border ${bandBadgeClass}`}
                    >
                      {isWithin && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      {isNear && <AlertCircle className="w-3.5 h-3.5 text-amber-600" />}
                      {!isWithin && !isNear && <MinusCircle className="w-3.5 h-3.5 text-slate-500" />}
                      {item.bandLabel}
                    </span>
                  </div>
                </div>

                {/* Side-by-side Rank Comparison */}
                <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Historical Closing
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-900">
                      #{item.record.closingRank.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="border-x border-slate-200 px-1">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">
                      Your {item.evaluatedRankType}
                    </span>
                    <span
                      className={`text-sm sm:text-base font-extrabold ${
                        isWithin
                          ? 'text-emerald-700'
                          : isNear
                          ? 'text-amber-700'
                          : 'text-slate-700'
                      }`}
                    >
                      #{item.evaluatedRank.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      Historical Opening
                    </span>
                    <span className="text-sm sm:text-base font-extrabold text-slate-600">
                      #{item.record.openingRank.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Status description & Source reference */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 pt-1 gap-1">
                  <span className="font-medium text-slate-600">{item.statusDescription}</span>
                  <span className="text-[11px] text-slate-400 shrink-0">
                    Previous-Year Reference: {item.record.counselling} {item.record.year} • Round {item.record.round}
                  </span>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Show more button */}
      {displayedPredictions.length > visibleLimit && (
        <div className="text-center pt-2">
          <button
            type="button"
            onClick={() => setVisibleLimit((prev) => prev + 15)}
            className="px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 text-xs sm:text-sm font-bold rounded-xl shadow-2xs transition-all cursor-pointer inline-flex items-center gap-2"
          >
            <span>Show Next 15 Options ({displayedPredictions.length - visibleLimit} remaining)</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Educational Advisory Notice */}
      <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-600 space-y-1.5">
        <div className="font-bold text-slate-800 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-slate-400" />
          <span>Understanding JoSAA Admission Cutoff Ranges</span>
        </div>
        <p className="leading-relaxed">
          Predictor evaluations are historical reference benchmarks compiled from official JoSAA round
          opening and closing ranks. JoSAA allocations depend dynamically on that year&rsquo;s student choices,
          seat matrix changes, and category distributions. Always fill choices in true descending preference
          order during official JoSAA / CSAB choice locking.
        </p>
      </div>
    </div>
  )
}
