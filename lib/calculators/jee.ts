import { JEE_MARKING_SCHEME, ESTIMATED_TOTAL_CANDIDATES_DEFAULT, UPCOMING_JEE_SESSIONS } from '../../data/jee/config'
import { CutoffRecord, Category, Quota, InstituteType } from '../../data/jee/types'
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

export interface CollegePredictionItem {
  record: CutoffRecord
  chance: 'High' | 'Moderate' | 'Borderline' | 'Low'
  rankDiff: number
  recommendation: string
}

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
      const c = Math.max(0, Math.floor(data.correct || 0))
      const inc = Math.max(0, Math.floor(data.incorrect || 0))
      const totalPerSub = JEE_MARKING_SCHEME.QUESTIONS_PER_SUBJECT
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

  const correct = Math.max(0, Math.floor(input.correct || 0))
  const incorrect = Math.max(0, Math.floor(input.incorrect || 0))
  const totalAttempted = correct + incorrect
  const unattempted = input.unattempted !== undefined
    ? Math.max(0, Math.floor(input.unattempted))
    : Math.max(0, JEE_MARKING_SCHEME.TOTAL_QUESTIONS - totalAttempted)

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

export function predictColleges(params: {
  rank: number
  category?: Category
  quota?: Quota
  preferredBranch?: string
  instituteType?: InstituteType
}): CollegePredictionItem[] {
  const safeRank = Math.max(1, isNaN(params.rank) ? 1 : params.rank)
  const category = params.category || 'OPEN'
  const allCutoffs = cutoffsData as CutoffRecord[]

  const filtered = allCutoffs.filter((rec) => {
    if (rec.category !== category) return false
    if (params.quota && rec.quota !== params.quota) return false
    if (params.instituteType && rec.instituteType !== params.instituteType) return false
    if (params.preferredBranch && !rec.branch.toLowerCase().includes(params.preferredBranch.toLowerCase())) return false
    return true
  })

  const results: CollegePredictionItem[] = []

  for (const record of filtered) {
    const diff = record.closingRank - safeRank
    let chance: 'High' | 'Moderate' | 'Borderline' | 'Low'
    let recommendation: string

    if (diff >= 300) {
      chance = 'High'
      recommendation = `Strong admission probability based on Round ${record.round} cutoff.`
    } else if (diff >= -50) {
      chance = 'Moderate'
      recommendation = 'Competitive; historically falls around the cutoff boundary.'
    } else if (diff >= -600) {
      chance = 'Borderline'
      recommendation = 'May be attainable in later JoSAA rounds or CSAB special rounds.'
    } else {
      chance = 'Low'
      recommendation = 'Historical cutoff was higher than current rank.'
    }

    results.push({
      record,
      chance,
      rankDiff: diff,
      recommendation,
    })
  }

  const chanceWeight: Record<string, number> = { High: 3, Moderate: 2, Borderline: 1, Low: 0 }
  results.sort((a, b) => {
    const wDiff = chanceWeight[b.chance] - chanceWeight[a.chance]
    if (wDiff !== 0) return wDiff
    return a.record.closingRank - b.record.closingRank
  })

  return results
}
