export type CgpaMethod = 'cbse' | 'ten_factor' | 'vtu' | 'mumbai'

export interface CgpaResult {
  cgpa: number
  percentage: number
  method: CgpaMethod
  methodName: string
  formula: string
  disclaimer: string
}

export interface PercentageResult {
  value: number
  explanation: string
  formatted: string
}

export interface SubjectMarkItem {
  id?: string
  name: string
  obtained: number
  maxMarks: number
}

export interface MarksPercentageResult {
  totalObtained: number
  totalMax: number
  percentage: number
  average: number
  subjectCount: number
  isValid: boolean
  error?: string
}

export interface GpaSubjectItem {
  id?: string
  name: string
  credits: number
  gradePoints: number
}

export interface GpaResult {
  gpa: number
  totalCredits: number
  totalQualityPoints: number
  courseCount: number
  isValid: boolean
}

export interface AttendanceResult {
  attended: number
  totalConducted: number
  currentPercentage: number
  targetPercentage: number
  status: 'above_target' | 'below_target' | 'at_target'
  classesNeeded: number
  bunkableClasses: number
  summary: string
}

export interface RequiredMarksResult {
  currentMarks: number
  currentMax: number
  remainingMax: number
  targetPercentage: number
  requiredMarks: number
  requiredPercentageInRemaining: number
  isAchievable: boolean
  message: string
}

export interface AverageMarksItem {
  marks: number
  weight?: number
}

export interface AverageMarksResult {
  average: number
  isWeighted: boolean
  itemCount: number
  totalMarks: number
  totalWeight: number
}

export interface StudyPlanSubject {
  name: string
  priority: 'High' | 'Medium' | 'Low'
}

export interface StudyPlanItem {
  name: string
  priority: 'High' | 'Medium' | 'Low'
  allocatedHours: number
  hoursPerDay: number
  sharePercentage: number
}

export interface StudyPlanResult {
  daysRemaining: number
  hoursPerDay: number
  totalStudyHours: number
  subjects: StudyPlanItem[]
  disclaimer: string
}

export function cgpaToPercentage(cgpa: number, method: CgpaMethod = 'cbse'): CgpaResult {
  const safeCgpa = Math.max(0, Math.min(10, isNaN(cgpa) ? 0 : cgpa))

  let percentage = 0
  let formula = ''
  let methodName = ''

  switch (method) {
    case 'cbse':
      methodName = 'CBSE Standard (9.5×)'
      percentage = safeCgpa * 9.5
      formula = 'Percentage = CGPA × 9.5'
      break
    case 'ten_factor':
      methodName = 'Direct 10× Multiplier'
      percentage = safeCgpa * 10
      formula = 'Percentage = CGPA × 10'
      break
    case 'vtu':
      methodName = 'VTU Belagavi'
      percentage = safeCgpa >= 0.75 ? (safeCgpa - 0.75) * 10 : 0
      formula = 'Percentage = (CGPA - 0.75) × 10'
      break
    case 'mumbai':
      methodName = 'Mumbai University (7.1/7.2 Rule)'
      if (safeCgpa >= 7.0) {
        percentage = 7.1 * safeCgpa + 11
        formula = 'Percentage = 7.1 × CGPA + 11 (for CGPA ≥ 7.0)'
      } else {
        percentage = 7.2 * safeCgpa + 12
        formula = 'Percentage = 7.2 × CGPA + 12 (for CGPA < 7.0)'
      }
      break
  }

  const boundedPercentage = Math.max(0, Math.min(100, Number(percentage.toFixed(2))))

  return {
    cgpa: safeCgpa,
    percentage: boundedPercentage,
    method,
    methodName,
    formula,
    disclaimer:
      'Conversion rules vary across educational boards and universities. Always verify the specific formula mandated on your official transcript or university marks card.',
  }
}

export function calculatePercentage(
  type: 'x_of_y' | 'increase' | 'decrease' | 'difference',
  a: number,
  b: number
): PercentageResult {
  const safeA = isNaN(a) ? 0 : a
  const safeB = isNaN(b) ? 0 : b

  switch (type) {
    case 'x_of_y': {
      if (safeB === 0) {
        return { value: 0, explanation: 'Denominator cannot be zero.', formatted: '0%' }
      }
      const val = (safeA / safeB) * 100
      return {
        value: Number(val.toFixed(2)),
        explanation: `(${safeA} / ${safeB}) × 100 = ${val.toFixed(2)}%`,
        formatted: `${val.toFixed(2)}%`,
      }
    }
    case 'increase': {
      if (safeA === 0) {
        return { value: 0, explanation: 'Initial value cannot be zero.', formatted: '0%' }
      }
      const val = ((safeB - safeA) / Math.abs(safeA)) * 100
      return {
        value: Number(val.toFixed(2)),
        explanation: `((${safeB} - ${safeA}) / |${safeA}|) × 100 = ${val.toFixed(2)}%`,
        formatted: `${val >= 0 ? '+' : ''}${val.toFixed(2)}%`,
      }
    }
    case 'decrease': {
      if (safeA === 0) {
        return { value: 0, explanation: 'Initial value cannot be zero.', formatted: '0%' }
      }
      const val = ((safeA - safeB) / Math.abs(safeA)) * 100
      return {
        value: Number(val.toFixed(2)),
        explanation: `((${safeA} - ${safeB}) / |${safeA}|) × 100 = ${val.toFixed(2)}%`,
        formatted: `${val.toFixed(2)}%`,
      }
    }
    case 'difference': {
      const avg = (Math.abs(safeA) + Math.abs(safeB)) / 2
      if (avg === 0) {
        return { value: 0, explanation: 'Both values are zero.', formatted: '0%' }
      }
      const diff = (Math.abs(safeA - safeB) / avg) * 100
      return {
        value: Number(diff.toFixed(2)),
        explanation: `(|${safeA} - ${safeB}| / average) × 100 = ${diff.toFixed(2)}%`,
        formatted: `${diff.toFixed(2)}%`,
      }
    }
  }
}

export function calculateMarksPercentage(subjects: SubjectMarkItem[]): MarksPercentageResult {
  if (!subjects || subjects.length === 0) {
    return {
      totalObtained: 0,
      totalMax: 0,
      percentage: 0,
      average: 0,
      subjectCount: 0,
      isValid: false,
      error: 'Please add at least one subject.',
    }
  }

  let totalObtained = 0
  let totalMax = 0

  for (const s of subjects) {
    const ob = Math.max(0, isNaN(s.obtained) ? 0 : s.obtained)
    const mx = Math.max(0, isNaN(s.maxMarks) ? 0 : s.maxMarks)
    totalObtained += ob
    totalMax += mx
  }

  if (totalMax === 0) {
    return {
      totalObtained,
      totalMax: 0,
      percentage: 0,
      average: 0,
      subjectCount: subjects.length,
      isValid: false,
      error: 'Total maximum marks cannot be zero.',
    }
  }

  const percentage = (totalObtained / totalMax) * 100
  const average = totalObtained / subjects.length

  return {
    totalObtained: Number(totalObtained.toFixed(2)),
    totalMax: Number(totalMax.toFixed(2)),
    percentage: Number(percentage.toFixed(2)),
    average: Number(average.toFixed(2)),
    subjectCount: subjects.length,
    isValid: true,
  }
}

export function calculateGpa(courses: GpaSubjectItem[]): GpaResult {
  if (!courses || courses.length === 0) {
    return { gpa: 0, totalCredits: 0, totalQualityPoints: 0, courseCount: 0, isValid: false }
  }

  let totalCredits = 0
  let totalQualityPoints = 0

  for (const c of courses) {
    const cred = Math.max(0, isNaN(c.credits) ? 0 : c.credits)
    const gp = Math.max(0, Math.min(10, isNaN(c.gradePoints) ? 0 : c.gradePoints))
    totalCredits += cred
    totalQualityPoints += cred * gp
  }

  if (totalCredits === 0) {
    return { gpa: 0, totalCredits: 0, totalQualityPoints: 0, courseCount: courses.length, isValid: false }
  }

  const gpa = totalQualityPoints / totalCredits

  return {
    gpa: Number(gpa.toFixed(2)),
    totalCredits: Number(totalCredits.toFixed(1)),
    totalQualityPoints: Number(totalQualityPoints.toFixed(2)),
    courseCount: courses.length,
    isValid: true,
  }
}

export function calculateAttendance(
  attended: number,
  totalConducted: number,
  targetPercentage: number = 75
): AttendanceResult {
  const safeAttended = Math.max(0, Math.floor(isNaN(attended) ? 0 : attended))
  const safeTotal = Math.max(0, Math.floor(isNaN(totalConducted) ? 0 : totalConducted))
  const safeTarget = Math.max(1, Math.min(99, isNaN(targetPercentage) ? 75 : targetPercentage))

  const actualAttended = Math.min(safeAttended, safeTotal)

  if (safeTotal === 0) {
    return {
      attended: 0,
      totalConducted: 0,
      currentPercentage: 0,
      targetPercentage: safeTarget,
      status: 'at_target',
      classesNeeded: 0,
      bunkableClasses: 0,
      summary: 'No classes have been conducted yet.',
    }
  }

  const currentPercentage = (actualAttended / safeTotal) * 100
  const roundedCurrent = Number(currentPercentage.toFixed(2))

  if (roundedCurrent >= safeTarget) {
    const bunkable = Math.floor((100 * actualAttended - safeTarget * safeTotal) / safeTarget)
    const isExact = roundedCurrent === safeTarget

    return {
      attended: actualAttended,
      totalConducted: safeTotal,
      currentPercentage: roundedCurrent,
      targetPercentage: safeTarget,
      status: isExact ? 'at_target' : 'above_target',
      classesNeeded: 0,
      bunkableClasses: Math.max(0, bunkable),
      summary: bunkable > 0
        ? `You can safely miss the next ${bunkable} ${bunkable === 1 ? 'class' : 'classes'} and still maintain at least ${safeTarget}% attendance.`
        : `Your attendance is currently exactly at your ${safeTarget}% target. Attend the next class to stay safe.`,
    }
  } else {
    const needed = Math.ceil((safeTarget * safeTotal - 100 * actualAttended) / (100 - safeTarget))

    return {
      attended: actualAttended,
      totalConducted: safeTotal,
      currentPercentage: roundedCurrent,
      targetPercentage: safeTarget,
      status: 'below_target',
      classesNeeded: Math.max(0, needed),
      bunkableClasses: 0,
      summary: `You need to attend the next ${needed} consecutive ${needed === 1 ? 'class' : 'classes'} without missing any to reach ${safeTarget}% attendance.`,
    }
  }
}

export function calculateRequiredMarks(
  currentMarks: number,
  currentMax: number,
  remainingMax: number,
  targetPercentage: number
): RequiredMarksResult {
  const safeCurrent = Math.max(0, isNaN(currentMarks) ? 0 : currentMarks)
  const safeCurrentMax = Math.max(0, isNaN(currentMax) ? 0 : currentMax)
  const safeRemainingMax = Math.max(0, isNaN(remainingMax) ? 0 : remainingMax)
  const safeTarget = Math.max(0, Math.min(100, isNaN(targetPercentage) ? 0 : targetPercentage))

  const overallMax = safeCurrentMax + safeRemainingMax
  if (overallMax === 0 || safeRemainingMax === 0) {
    return {
      currentMarks: safeCurrent,
      currentMax: safeCurrentMax,
      remainingMax: safeRemainingMax,
      targetPercentage: safeTarget,
      requiredMarks: 0,
      requiredPercentageInRemaining: 0,
      isAchievable: false,
      message: 'Remaining maximum marks must be greater than zero.',
    }
  }

  const targetTotalMarks = (safeTarget / 100) * overallMax
  const requiredInRemaining = targetTotalMarks - safeCurrent

  if (requiredInRemaining <= 0) {
    return {
      currentMarks: safeCurrent,
      currentMax: safeCurrentMax,
      remainingMax: safeRemainingMax,
      targetPercentage: safeTarget,
      requiredMarks: 0,
      requiredPercentageInRemaining: 0,
      isAchievable: true,
      message: `You have already secured enough marks to exceed ${safeTarget}%.`,
    }
  }

  const requiredPct = (requiredInRemaining / safeRemainingMax) * 100

  if (requiredInRemaining > safeRemainingMax) {
    return {
      currentMarks: safeCurrent,
      currentMax: safeCurrentMax,
      remainingMax: safeRemainingMax,
      targetPercentage: safeTarget,
      requiredMarks: Number(requiredInRemaining.toFixed(1)),
      requiredPercentageInRemaining: Number(requiredPct.toFixed(1)),
      isAchievable: false,
      message: `Target of ${safeTarget}% requires ${requiredInRemaining.toFixed(1)} marks out of ${safeRemainingMax}, which exceeds 100% in remaining exams.`,
    }
  }

  return {
    currentMarks: safeCurrent,
    currentMax: safeCurrentMax,
    remainingMax: safeRemainingMax,
    targetPercentage: safeTarget,
    requiredMarks: Number(requiredInRemaining.toFixed(1)),
    requiredPercentageInRemaining: Number(requiredPct.toFixed(1)),
    isAchievable: true,
    message: `You need ${requiredInRemaining.toFixed(1)} marks (${requiredPct.toFixed(1)}%) out of ${safeRemainingMax} remaining marks.`,
  }
}

export function calculateAverageMarks(items: AverageMarksItem[]): AverageMarksResult {
  if (!items || items.length === 0) {
    return { average: 0, isWeighted: false, itemCount: 0, totalMarks: 0, totalWeight: 0 }
  }

  let totalMarks = 0
  let weightedSum = 0
  let totalWeight = 0
  let hasWeights = false

  for (const item of items) {
    const m = isNaN(item.marks) ? 0 : item.marks
    const w = item.weight !== undefined && !isNaN(item.weight) ? item.weight : undefined

    totalMarks += m
    if (w !== undefined && w > 0) {
      hasWeights = true
      weightedSum += m * w
      totalWeight += w
    }
  }

  if (hasWeights && totalWeight > 0) {
    const avg = weightedSum / totalWeight
    return {
      average: Number(avg.toFixed(2)),
      isWeighted: true,
      itemCount: items.length,
      totalMarks: Number(totalMarks.toFixed(2)),
      totalWeight: Number(totalWeight.toFixed(2)),
    }
  }

  const simpleAvg = totalMarks / items.length
  return {
    average: Number(simpleAvg.toFixed(2)),
    isWeighted: false,
    itemCount: items.length,
    totalMarks: Number(totalMarks.toFixed(2)),
    totalWeight: items.length,
  }
}

export function calculateStudyHours(
  examDate: Date | string,
  hoursPerDay: number,
  subjects: StudyPlanSubject[],
  now: Date = new Date()
): StudyPlanResult {
  const targetTime = new Date(examDate).getTime()
  const currentTime = now.getTime()
  const diffMs = targetTime - currentTime
  const daysRemaining = Math.max(1, Math.ceil(diffMs / (1000 * 60 * 60 * 24)))
  const safeDailyHours = Math.max(0.5, Math.min(18, isNaN(hoursPerDay) ? 4 : hoursPerDay))

  const totalStudyHours = Math.round(daysRemaining * safeDailyHours * 10) / 10

  if (!subjects || subjects.length === 0) {
    return {
      daysRemaining,
      hoursPerDay: safeDailyHours,
      totalStudyHours,
      subjects: [],
      disclaimer: 'This schedule is a planning guideline. Adjust daily hours according to your personal pace and topic complexity.',
    }
  }

  const priorityWeights: Record<string, number> = {
    High: 3,
    Medium: 2,
    Low: 1,
  }

  let totalWeight = 0
  for (const s of subjects) {
    totalWeight += priorityWeights[s.priority] || 2
  }

  const planItems: StudyPlanItem[] = subjects.map((s) => {
    const weight = priorityWeights[s.priority] || 2
    const share = weight / totalWeight
    const allocated = totalStudyHours * share
    const daily = allocated / daysRemaining

    return {
      name: s.name,
      priority: s.priority,
      allocatedHours: Number(allocated.toFixed(1)),
      hoursPerDay: Number(daily.toFixed(1)),
      sharePercentage: Number((share * 100).toFixed(1)),
    }
  })

  return {
    daysRemaining,
    hoursPerDay: safeDailyHours,
    totalStudyHours,
    subjects: planItems,
    disclaimer:
      'This study plan is a time-budgeting tool. Prioritize understanding of core concepts rather than strictly adhering to exact minutes.',
  }
}
