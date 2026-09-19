import { JEE_MARKING_SCHEME, ESTIMATED_TOTAL_CANDIDATES_DEFAULT, UPCOMING_JEE_SESSIONS } from '../../data/jee/config'
import {
  CutoffRecord,
  Category,
  Quota,
  InstituteType,
  Gender,
  BranchCategory,
  HistoricalCutoffBand,
  CollegePredictorParams,
  CollegePredictionItem,
} from '../../data/jee/types'
import cutoffsData from '../../data/jee/cutoffs.json'


export interface SubjectMarksInput {
  correct: number
  incorrect: number
  unattempted?: number
}

export interface JeeMarksInput {
  correct: number
  incorrect: number
  unattempted?: number
  subjects?: {
    physics?: SubjectMarksInput
    chemistry?: SubjectMarksInput
    mathematics?: SubjectMarksInput
  }
}

export interface SubjectMarksResult {
  name: string
  correct: number
  incorrect: number
  unattempted: number
  attempted: number
  marks: number
  maxMarks: number
  accuracyPercentage: number
}

export interface JeeMarksResult {
  totalMarks: number
  maxMarks: number
  attempted: number
  correct: number
  incorrect: number
  unattempted: number
  accuracyPercentage: number
  percentage: number
  subjects?: SubjectMarksResult[]
}

export interface PercentileEstimateResult {
  marks: number
  estimatedPercentile: number
  lowerPercentile: number
  upperPercentile: number
  difficulty: 'easy' | 'moderate' | 'tough'
  modelDescription: string
  disclaimer: string
}

export interface RankEstimateResult {
  percentile: number
  totalCandidates: number
  estimatedCrlRank: number
  rankRange: {
    min: number
    max: number
  }
  category?: Category
  estimatedCategoryRank?: number
  disclaimer: string
}

export type { CollegePredictionItem }


export interface CountdownResult {
  sessionName: string
  targetDate: string
  isTentative: boolean
  hasPassed: boolean
  days: number
  hours: number
  minutes: number
  seconds: number
  formattedTime: string
}

export function calculateJeeMarks(input: JeeMarksInput): JeeMarksResult {
  if (input.subjects && (input.subjects.physics || input.subjects.chemistry || input.subjects.mathematics)) {
    const subs: SubjectMarksResult[] = []
    let totalCorrect = 0
    let totalIncorrect = 0
    let totalUnattempted = 0

    const subDefs: { key: 'physics' | 'chemistry' | 'mathematics'; label: string }[] = [
      { key: 'physics', label: 'Physics' },
      { key: 'chemistry', label: 'Chemistry' },
      { key: 'mathematics', label: 'Mathematics' },
    ]

    for (const sub of subDefs) {
      const data = input.subjects[sub.key] || { correct: 0, incorrect: 0, unattempted: JEE_MARKING_SCHEME.QUESTIONS_PER_SUBJECT }
      const totalPerSub = JEE_MARKING_SCHEME.QUESTIONS_PER_SUBJECT
      const c = Math.max(0, Math.min(totalPerSub, Math.floor(data.correct || 0)))
      const maxInc = totalPerSub - c
      const inc = Math.max(0, Math.min(maxInc, Math.floor(data.incorrect || 0)))
      const unatt = Math.max(0, totalPerSub - (c + inc))

      const attempted = c + inc
      const marks = (c * JEE_MARKING_SCHEME.CORRECT) + (inc * JEE_MARKING_SCHEME.INCORRECT)
      const accuracy = attempted > 0 ? (c / attempted) * 100 : 0

      totalCorrect += c
      totalIncorrect += inc
      totalUnattempted += unatt

      subs.push({
        name: sub.label,
        correct: c,
        incorrect: inc,
        unattempted: unatt,
        attempted,
        marks,
        maxMarks: JEE_MARKING_SCHEME.MAX_MARKS_PER_SUBJECT,
        accuracyPercentage: Number(accuracy.toFixed(2)),
      })
    }

    const totalAttempted = totalCorrect + totalIncorrect
    const totalMarks = (totalCorrect * JEE_MARKING_SCHEME.CORRECT) + (totalIncorrect * JEE_MARKING_SCHEME.INCORRECT)
    const accuracy = totalAttempted > 0 ? (totalCorrect / totalAttempted) * 100 : 0
    const percentage = (totalMarks / JEE_MARKING_SCHEME.MAX_MARKS) * 100

    return {
      totalMarks,
      maxMarks: JEE_MARKING_SCHEME.MAX_MARKS,
      attempted: totalAttempted,
      correct: totalCorrect,
      incorrect: totalIncorrect,
      unattempted: totalUnattempted,
      accuracyPercentage: Number(accuracy.toFixed(2)),
      percentage: Number(percentage.toFixed(2)),
      subjects: subs,
    }
  }

  // Aggregate questions: strictly enforce JEE Main Paper 1 limits (75 total questions)
  const totalExamQuestions = JEE_MARKING_SCHEME.TOTAL_QUESTIONS
  const correct = Math.max(0, Math.min(totalExamQuestions, Math.floor(input.correct || 0)))
  const maxPossibleIncorrect = totalExamQuestions - correct
  const incorrect = Math.max(0, Math.min(maxPossibleIncorrect, Math.floor(input.incorrect || 0)))
  const totalAttempted = correct + incorrect
  const unattempted = Math.max(0, totalExamQuestions - totalAttempted)

  const totalMarks = (correct * JEE_MARKING_SCHEME.CORRECT) + (incorrect * JEE_MARKING_SCHEME.INCORRECT)
  const accuracy = totalAttempted > 0 ? (correct / totalAttempted) * 100 : 0
  const percentage = (totalMarks / JEE_MARKING_SCHEME.MAX_MARKS) * 100

  return {
    totalMarks,
    maxMarks: JEE_MARKING_SCHEME.MAX_MARKS,
    attempted: totalAttempted,
    correct,
    incorrect,
    unattempted,
    accuracyPercentage: Number(accuracy.toFixed(2)),
    percentage: Number(percentage.toFixed(2)),
  }
}

export function estimateJeePercentile(
  marks: number,
  difficulty: 'easy' | 'moderate' | 'tough' = 'moderate'
): PercentileEstimateResult {
  const safeMarks = Math.max(-75, Math.min(300, isNaN(marks) ? 0 : marks))

  const moderateAnchors: [number, number][] = [
    [300, 100],
    [290, 99.99],
    [280, 99.98],
    [260, 99.94],
    [240, 99.82],
    [220, 99.60],
    [200, 99.30],
    [180, 98.80],
    [160, 97.90],
    [140, 96.40],
    [120, 94.20],
    [100, 91.00],
    [80, 85.50],
    [60, 77.00],
    [40, 62.00],
    [20, 42.00],
    [0, 15.00],
    [-20, 2.00],
    [-75, 0.00],
  ]

  function interpolate(anchors: [number, number][], score: number): number {
    if (score >= anchors[0][0]) return anchors[0][1]
    if (score <= anchors[anchors.length - 1][0]) return anchors[anchors.length - 1][1]

    for (let i = 0; i < anchors.length - 1; i++) {
      const [m1, p1] = anchors[i]
      const [m2, p2] = anchors[i + 1]
      if (score <= m1 && score >= m2) {
        const ratio = (score - m2) / (m1 - m2)
        return p2 + ratio * (p1 - p2)
      }
    }
    return 50
  }

  const shiftOffset = difficulty === 'tough' ? 12 : difficulty === 'easy' ? -12 : 0
  const adjustedMarks = Math.max(-75, Math.min(300, safeMarks + shiftOffset))
  const basePercentile = interpolate(moderateAnchors, adjustedMarks)

  const spread = basePercentile > 99 ? 0.25 : basePercentile > 90 ? 0.75 : 1.5
  const lower = Math.max(0, Number((basePercentile - spread).toFixed(3)))
  const upper = Math.min(100, Number((basePercentile + spread).toFixed(3)))
  const estimated = Math.max(0, Math.min(100, Number(basePercentile.toFixed(3))))

  return {
    marks: safeMarks,
    estimatedPercentile: estimated,
    lowerPercentile: lower,
    upperPercentile: upper,
    difficulty,
    modelDescription: `Estimated based on historical normalization distributions from recent JEE Main test sessions (${difficulty} shift benchmark).`,
    disclaimer:
      'Estimated range based on historical patterns. Actual percentile depends on shift difficulty, session normalization, and total candidates appearing in that specific shift.',
  }
}

export function estimateJeeRank(
  percentile: number,
  totalCandidates: number = ESTIMATED_TOTAL_CANDIDATES_DEFAULT,
  category: Category = 'OPEN'
): RankEstimateResult {
  const safePercentile = Math.max(0, Math.min(100, isNaN(percentile) ? 0 : percentile))
  const safeCandidates = Math.max(1000, isNaN(totalCandidates) ? ESTIMATED_TOTAL_CANDIDATES_DEFAULT : totalCandidates)

  const exactCrl = ((100 - safePercentile) / 100) * safeCandidates + 1
  const estimatedCrl = Math.max(1, Math.round(exactCrl))

  const marginPercent = safePercentile > 99.5 ? 0.05 : safePercentile > 90 ? 0.08 : 0.12
  const minRank = Math.max(1, Math.round(estimatedCrl * (1 - marginPercent)))
  const maxRank = Math.round(estimatedCrl * (1 + marginPercent))

  let estimatedCategoryRank: number | undefined
  if (category !== 'OPEN') {
    const categoryFactor: Record<string, number> = {
      'OBC-NCL': 0.30,
      'EWS': 0.10,
      'SC': 0.15,
      'ST': 0.075,
      'OPEN-PwD': 0.03,
    }
    const factor = categoryFactor[category] || 0.2
    estimatedCategoryRank = Math.max(1, Math.round(estimatedCrl * factor))
  }

  return {
    percentile: safePercentile,
    totalCandidates: safeCandidates,
    estimatedCrlRank: estimatedCrl,
    rankRange: {
      min: minRank,
      max: maxRank,
    },
    category,
    estimatedCategoryRank,
    disclaimer:
      'This rank is a statistical estimate based on the formula ((100 - Percentile) / 100) * Candidates. Official ranks are determined exclusively by NTA using subject tie-breaker rules and normalization.',
  }
}

export function getJeeCountdown(targetSessionIndex: number = 0, now: Date = new Date()): CountdownResult {
  const session = UPCOMING_JEE_SESSIONS[targetSessionIndex] || UPCOMING_JEE_SESSIONS[0]
  const targetTime = new Date(session.examDate).getTime()
  const currentTime = now.getTime()
  const diffMs = targetTime - currentTime

  if (diffMs <= 0) {
    return {
      sessionName: session.sessionName,
      targetDate: session.examDate,
      isTentative: session.isTentative,
      hasPassed: true,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      formattedTime: '0d 0h 0m 0s',
    }
  }

  const seconds = Math.floor((diffMs / 1000) % 60)
  const minutes = Math.floor((diffMs / (1000 * 60)) % 60)
  const hours = Math.floor((diffMs / (1000 * 60 * 60)) % 24)
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  return {
    sessionName: session.sessionName,
    targetDate: session.examDate,
    isTentative: session.isTentative,
    hasPassed: false,
    days,
    hours,
    minutes,
    seconds,
    formattedTime: `${days}d ${hours}h ${minutes}m ${seconds}s`,
  }
}

export const INDIAN_STATES_AND_UTS = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chandigarh',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jammu and Kashmir',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Puducherry',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
] as const

export const BRANCH_CATEGORY_OPTIONS: { value: BranchCategory | 'ALL'; label: string }[] = [
  { value: 'ALL', label: 'All Disciplines' },
  { value: 'CSE', label: 'Computer Science (CSE)' },
  { value: 'AI', label: 'AI & Data Science (AI / DS)' },
  { value: 'IT', label: 'Information Technology (IT)' },
  { value: 'ECE', label: 'Electronics & Communication (ECE)' },
  { value: 'EE', label: 'Electrical Engineering (EE / EEE)' },
  { value: 'ME', label: 'Mechanical Engineering (ME)' },
  { value: 'CE', label: 'Civil Engineering (CE)' },
  { value: 'Chemical', label: 'Chemical Engineering' },
  { value: 'Biotechnology', label: 'Biotechnology / Bio Engg' },
  { value: 'Production', label: 'Production & Industrial' },
  { value: 'Metallurgy', label: 'Metallurgy & Materials' },
  { value: 'Aerospace', label: 'Aerospace Engineering' },
  { value: 'Architecture', label: 'Architecture & Planning (B.Arch)' },
]

export function normalizeBranchCategory(branch: string): BranchCategory {
  const b = branch.toLowerCase()
  if (
    b.includes('data science') ||
    b.includes('artificial intelligence') ||
    b.includes('ai &') ||
    b.includes('ai and') ||
    b.includes('machine learning')
  ) {
    return 'AI'
  }
  if (b.includes('computer') || b.includes('cse') || b.includes('software')) {
    return 'CSE'
  }
  if (b.includes('information tech') || b.includes('it') || b.includes('infotech')) {
    return 'IT'
  }
  if (
    b.includes('electronics and communication') ||
    b.includes('electronics & communication') ||
    b.includes('ece') ||
    b.includes('telecommunication')
  ) {
    return 'ECE'
  }
  if (b.includes('electrical') || b.includes('eee')) {
    return 'EE'
  }
  if (b.includes('mechanical')) {
    return 'ME'
  }
  if (b.includes('civil')) {
    return 'CE'
  }
  if (b.includes('chemical')) {
    return 'Chemical'
  }
  if (b.includes('biotech') || b.includes('biomedical') || b.includes('biochemical')) {
    return 'Biotechnology'
  }
  if (b.includes('production') || b.includes('industrial') || b.includes('manufacturing')) {
    return 'Production'
  }
  if (b.includes('metallurg') || b.includes('materials')) {
    return 'Metallurgy'
  }
  if (b.includes('aerospace') || b.includes('aeronautical')) {
    return 'Aerospace'
  }
  if (b.includes('architecture') || b.includes('planning') || b.includes('b.arch')) {
    return 'Architecture'
  }
  return 'Other'
}

export function queryCutoffs(filters: {
  institute?: string
  branch?: string
  category?: Category
  quota?: Quota
  instituteType?: InstituteType
}): CutoffRecord[] {
  const allCutoffs = cutoffsData as CutoffRecord[]
  return allCutoffs.filter((rec) => {
    if (filters.institute && !rec.institute.toLowerCase().includes(filters.institute.toLowerCase())) return false
    if (filters.branch && !rec.branch.toLowerCase().includes(filters.branch.toLowerCase())) return false
    if (filters.category && rec.category !== filters.category) return false
    if (filters.quota && rec.quota !== filters.quota) return false
    if (filters.instituteType && rec.instituteType !== filters.instituteType) return false
    return true
  })
}

export interface ExtendedPredictorParams extends Partial<CollegePredictorParams> {
  rank?: number // legacy backwards compatibility
}

export function predictColleges(params: ExtendedPredictorParams): CollegePredictionItem[] {
  const rawRank = params.crlRank !== undefined ? params.crlRank : params.rank !== undefined ? params.rank : 4500
  const safeCrl = Math.max(1, isNaN(rawRank) ? 1 : Math.round(rawRank))
  const candidateCategory: Category = params.category || 'OPEN'
  const candidateGender: Gender = params.gender || 'Gender-Neutral'
  const candidateState = (params.homeState || '').trim().toLowerCase()
  const quotaMode = params.quota || 'AUTO'
  const allCutoffs = cutoffsData as CutoffRecord[]

  const filtered = allCutoffs.filter((rec) => {
    // 1. Category evaluation:
    // If user is OPEN: only OPEN seats are applicable.
    // If user has reserved category: both their reserved category seats AND OPEN seats are applicable.
    if (candidateCategory === 'OPEN') {
      if (rec.category !== 'OPEN') return false
    } else {
      if (rec.category !== candidateCategory && rec.category !== 'OPEN') return false
    }

    // 2. Gender pool evaluation:
    // Gender-Neutral candidate matches only Gender-Neutral seats.
    // Female-only candidate matches both Female-only (supernumerary) and Gender-Neutral seats.
    if (candidateGender === 'Gender-Neutral' && rec.gender === 'Female-only') {
      return false
    }

    // 3. Institute Type filter
    if (params.instituteType && params.instituteType !== 'ALL') {
      if (rec.instituteType !== params.instituteType) return false
    }


    // 4. Quota evaluation
    if (quotaMode === 'AUTO') {
      if (candidateState && candidateState !== 'all') {
        if (rec.instituteType === 'NIT' || (rec.instituteType === 'GFTI' && (rec.quota === 'HS' || rec.quota === 'OS'))) {
          const isHomeState = rec.state.toLowerCase() === candidateState
          if (isHomeState && rec.quota !== 'HS') return false
          if (!isHomeState && rec.quota !== 'OS') return false
        }
        // For AI (All India) quota, everyone is eligible regardless of home state
      }
    } else if (quotaMode !== 'ALL') {
      if (rec.quota !== quotaMode) return false
    }

    // 5. Branch filters
    if (params.branchCategory && params.branchCategory !== 'ALL') {
      const norm = normalizeBranchCategory(rec.branch)
      if (norm !== params.branchCategory) return false
    }

    if (params.preferredBranch && params.preferredBranch.trim()) {
      const query = params.preferredBranch.trim().toLowerCase()
      const matchesBranch = rec.branch.toLowerCase().includes(query)
      const matchesNorm = normalizeBranchCategory(rec.branch).toLowerCase().includes(query)
      if (!matchesBranch && !matchesNorm) return false
    }

    // 6. Round filter
    if (params.round && params.round !== 'ALL') {
      if (rec.round !== Number(params.round)) return false
    }

    // 7. Year filter
    if (params.year && params.year > 0) {
      if (rec.year !== Number(params.year)) return false
    }

    return true
  })

  const results: CollegePredictionItem[] = []

  for (const record of filtered) {
    // Determine the correct rank to compare:
    // For OPEN seats: CRL rank is compared.
    // For reserved seats: Category rank is compared against category closing rank.
    let evaluatedRank: number
    let evaluatedRankType: 'CRL' | 'Category Rank'

    if (record.category === 'OPEN') {
      evaluatedRank = safeCrl
      evaluatedRankType = 'CRL'
    } else {
      evaluatedRankType = 'Category Rank'
      if (params.categoryRank && params.categoryRank > 0) {
        evaluatedRank = Math.max(1, Math.round(params.categoryRank))
      } else {
        // Statistical fallback factor if candidate did not input category rank
        const factors: Record<string, number> = {
          'OBC-NCL': 0.30,
          'EWS': 0.10,
          'SC': 0.15,
          'ST': 0.075,
          'OPEN-PwD': 0.03,
        }
        const factor = factors[record.category] || 0.2
        evaluatedRank = Math.max(1, Math.round(safeCrl * factor))
      }
    }

    const diff = record.closingRank - evaluatedRank

    let band: HistoricalCutoffBand
    let bandLabel: string
    let chance: 'High' | 'Moderate' | 'Borderline' | 'Low'
    let statusDescription: string

    if (diff >= 0) {
      band = 'WITHIN_CUTOFF'
      bandLabel = 'Within historical closing rank'
      chance = diff >= 300 ? 'High' : 'Moderate'
      statusDescription =
        diff === 0
          ? 'Exact match with historical closing cutoff rank.'
          : `${diff.toLocaleString('en-IN')} rank cushion inside historical closing cutoff.`
    } else {
      // Near cutoff threshold: within 15% or up to 800 ranks beyond closing cutoff
      const nearThreshold = Math.max(800, Math.round(record.closingRank * 0.15))
      const gap = Math.abs(diff)

      if (gap <= nearThreshold) {
        band = 'NEAR_CUTOFF'
        bandLabel = 'Near historical cutoff'
        chance = 'Borderline'
        statusDescription = `~${gap.toLocaleString('en-IN')} ranks beyond historical closing; strong possibility in later JoSAA rounds or CSAB special spot rounds.`
      } else {
        band = 'OUTSIDE_CUTOFF'
        bandLabel = 'Outside historical closing range'
        chance = 'Low'
        statusDescription = `${gap.toLocaleString('en-IN')} ranks beyond historical closing cutoff.`
      }
    }

    results.push({
      record,
      band,
      bandLabel,
      evaluatedRank,
      evaluatedRankType,
      rankDiff: diff,
      statusDescription,
      chance,
      recommendation: statusDescription,
    })
  }

  // Sort results logically:
  // 1. Within cutoff first, ordered by closing rank ascending (most competitive / premier first)
  // 2. Near cutoff next, ordered by smallest gap to cutoff
  // 3. Outside cutoff last, ordered by smallest gap
  const bandWeight: Record<HistoricalCutoffBand, number> = {
    WITHIN_CUTOFF: 2,
    NEAR_CUTOFF: 1,
    OUTSIDE_CUTOFF: 0,
  }

  results.sort((a, b) => {
    const bDiff = bandWeight[b.band] - bandWeight[a.band]
    if (bDiff !== 0) return bDiff

    if (a.band === 'WITHIN_CUTOFF') {
      return a.record.closingRank - b.record.closingRank
    }
    return Math.abs(a.rankDiff) - Math.abs(b.rankDiff)
  })

  return results
}

