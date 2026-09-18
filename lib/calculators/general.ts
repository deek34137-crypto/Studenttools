export interface AgeResult {
  years: number
  months: number
  days: number
  totalDays: number
  totalWeeks: number
  totalHours: number
  daysUntilNextBirthday: number
  nextBirthdayDate: string
  nextBirthdayDayOfWeek: string
  isBirthdayToday: boolean
}

export interface BmiInput {
  weight: number
  height: number
  unitSystem: 'metric' | 'imperial'
}

export interface BmiResult {
  bmi: number
  category: 'Underweight' | 'Normal weight' | 'Overweight' | 'Obese Class I' | 'Obese Class II' | 'Obese Class III'
  healthyWeightMin: number
  healthyWeightMax: number
  unitSystem: 'metric' | 'imperial'
  disclaimer: string
}

export interface EvalResult {
  success: boolean
  result?: number
  expression?: string
  error?: string
}

export interface UnitCategory {
  name: string
  units: { id: string; name: string; toBase: number | ((val: number) => number); fromBase: number | ((val: number) => number) }[]
}

export interface UnitConvertResult {
  fromValue: number
  fromUnit: string
  toValue: number
  toUnit: string
  category: string
  formula: string
}

export interface DateDiffResult {
  startDate: string
  endDate: string
  totalDays: number
  totalWeeks: number
  remainingDays: number
  businessDays: number
  weekendDays: number
  years: number
  months: number
  days: number
  formattedSummary: string
}

export interface DateAddSubtractResult {
  startDate: string
  operation: 'add' | 'subtract'
  addedDays: number
  resultDate: string
  resultFormatted: string
  dayOfWeek: string
}

export interface DiscountResult {
  originalPrice: number
  discountPercentage: number
  discountAmount: number
  finalPrice: number
  savingsPercentage: number
}

export interface ProfitLossResult {
  costPrice: number
  sellingPrice: number
  amount: number
  percentage: number
  status: 'profit' | 'loss' | 'break_even'
  summary: string
}

export interface RatioResult {
  antecedent: number
  consequent: number
  simplifiedAntecedent: number
  simplifiedConsequent: number
  simplifiedString: string
  decimalValue: number
  percentage: number
}

export interface FractionResult {
  operation: 'add' | 'subtract' | 'multiply' | 'divide'
  num1: number
  den1: number
  num2: number
  den2: number
  resultNumerator: number
  resultDenominator: number
  simplifiedNumerator: number
  simplifiedDenominator: number
  mixedString?: string
  decimalValue: number
}

export interface PercentageChangeResult {
  initialValue: number
  finalValue: number
  absoluteChange: number
  percentageChange: number
  status: 'increase' | 'decrease' | 'no_change'
  steps: string[]
}

function gcd(a: number, b: number): number {
  a = Math.abs(Math.round(a))
  b = Math.abs(Math.round(b))
  while (b) {
    const t = b
    b = a % b
    a = t
  }
  return a
}

export function calculateAge(birthDateInput: Date | string, targetDateInput: Date | string = new Date()): AgeResult {
  const birth = new Date(birthDateInput)
  const target = new Date(targetDateInput)

  if (isNaN(birth.getTime()) || isNaN(target.getTime()) || birth > target) {
    return {
      years: 0,
      months: 0,
      days: 0,
      totalDays: 0,
      totalWeeks: 0,
      totalHours: 0,
      daysUntilNextBirthday: 0,
      nextBirthdayDate: '',
      nextBirthdayDayOfWeek: '',
      isBirthdayToday: false,
    }
  }

  let years = target.getFullYear() - birth.getFullYear()
  let months = target.getMonth() - birth.getMonth()
  let days = target.getDate() - birth.getDate()

  if (days < 0) {
    months--
    const prevMonthLastDay = new Date(target.getFullYear(), target.getMonth(), 0).getDate()
    days += prevMonthLastDay
  }

  if (months < 0) {
    years--
    months += 12
  }

  const diffMs = target.getTime() - birth.getTime()
  const totalDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
  const totalWeeks = Math.floor(totalDays / 7)
  const totalHours = totalDays * 24

  let nextBdayYear = target.getFullYear()
  let nextBday = new Date(nextBdayYear, birth.getMonth(), birth.getDate())

  if (nextBday < target) {
    nextBdayYear++
    nextBday = new Date(nextBdayYear, birth.getMonth(), birth.getDate())
  }

  const isToday = birth.getMonth() === target.getMonth() && birth.getDate() === target.getDate()
  const diffNextBdayMs = nextBday.getTime() - target.getTime()
  const daysUntilNext = isToday ? 0 : Math.ceil(diffNextBdayMs / (1000 * 60 * 60 * 24))

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const nextBirthdayDayOfWeek = dayNames[nextBday.getDay()]

  return {
    years,
    months,
    days,
    totalDays,
    totalWeeks,
    totalHours,
    daysUntilNextBirthday: daysUntilNext,
    nextBirthdayDate: nextBday.toISOString().split('T')[0],
    nextBirthdayDayOfWeek,
    isBirthdayToday: isToday,
  }
}

export function calculateBmi(input: BmiInput): BmiResult {
  const isMetric = input.unitSystem === 'metric'
  let weightKg = isMetric ? input.weight : input.weight * 0.453592
  let heightMeters = isMetric ? input.height / 100 : (input.height * 2.54) / 100

  weightKg = Math.max(0, isNaN(weightKg) ? 0 : weightKg)
  heightMeters = Math.max(0.1, isNaN(heightMeters) ? 0.1 : heightMeters)

  const bmi = weightKg / (heightMeters * heightMeters)
  const roundedBmi = Number(bmi.toFixed(1))

  let category: BmiResult['category'] = 'Normal weight'
  if (roundedBmi < 18.5) category = 'Underweight'
  else if (roundedBmi < 25) category = 'Normal weight'
  else if (roundedBmi < 30) category = 'Overweight'
  else if (roundedBmi < 35) category = 'Obese Class I'
  else if (roundedBmi < 40) category = 'Obese Class II'
  else category = 'Obese Class III'

  const minKg = 18.5 * (heightMeters * heightMeters)
  const maxKg = 24.9 * (heightMeters * heightMeters)

  const healthyMin = isMetric ? Number(minKg.toFixed(1)) : Number((minKg / 0.453592).toFixed(1))
  const healthyMax = isMetric ? Number(maxKg.toFixed(1)) : Number((maxKg / 0.453592).toFixed(1))

  return {
    bmi: roundedBmi,
    category,
    healthyWeightMin: healthyMin,
    healthyWeightMax: healthyMax,
    unitSystem: input.unitSystem,
    disclaimer:
      'BMI is a statistical screening measure based on height and weight. It does not directly evaluate body fat percentage, muscle mass, bone density, or individual cardiovascular health. Consult a medical professional for personal clinical assessments.',
  }
}

export function scientificEval(expression: string, angleMode: 'deg' | 'rad' = 'deg'): EvalResult {
  if (!expression || !expression.trim()) {
    return { success: false, error: 'Empty expression' }
  }

  const cleaned = expression.replace(/\s+/g, '')
  let pos = 0

  function peek(): string {
    return cleaned[pos] || ''
  }

  function get(): string {
    return cleaned[pos++] || ''
  }

  function parseFactorial(n: number): number {
    if (n < 0 || Math.floor(n) !== n || n > 170) return NaN
    let res = 1
    for (let i = 2; i <= n; i++) res *= i
    return res
  }

  function parseNumber(): number {
    let numStr = ''
    while (peek() && /[0-9.]/.test(peek())) {
      numStr += get()
    }
    const val = parseFloat(numStr)
    return isNaN(val) ? 0 : val
  }

  function parsePrimary(): number {
    const ch = peek()

    if (ch === '(') {
      get()
      const val = parseExpression()
      if (peek() === ')') get()
      return val
    }

    if (ch === '-') {
      get()
      return -parsePrimary()
    }

    if (ch === '+') {
      get()
      return parsePrimary()
    }

    if (/[a-zA-Z]/.test(ch)) {
      let id = ''
      while (peek() && /[a-zA-Z0-9]/.test(peek())) {
        id += get()
      }
      id = id.toLowerCase()

      if (id === 'pi') return Math.PI
      if (id === 'e') return Math.E

      if (peek() === '(') {
        get()
        const arg = parseExpression()
        if (peek() === ')') get()

        const toRad = angleMode === 'deg' ? (arg * Math.PI) / 180 : arg
        const fromRad = (val: number) => (angleMode === 'deg' ? (val * 180) / Math.PI : val)

        switch (id) {
          case 'sin':
            return Math.sin(toRad)
          case 'cos':
            return Math.cos(toRad)
          case 'tan':
            return Math.tan(toRad)
          case 'asin':
            return fromRad(Math.asin(arg))
          case 'acos':
            return fromRad(Math.acos(arg))
          case 'atan':
            return fromRad(Math.atan(arg))
          case 'log':
            return Math.log10(arg)
          case 'ln':
            return Math.log(arg)
          case 'sqrt':
            return Math.sqrt(arg)
          case 'cbrt':
            return Math.cbrt(arg)
          case 'abs':
            return Math.abs(arg)
          case 'fact':
            return parseFactorial(arg)
          default:
            throw new Error(`Unknown function '${id}'`)
        }
      }
      throw new Error(`Unknown identifier '${id}'`)
    }

    const n = parseNumber()
    if (peek() === '!') {
      get()
      return parseFactorial(n)
    }
    return n
  }

  function parsePower(): number {
    let left = parsePrimary()
    if (peek() === '^') {
      get()
      const right = parsePower()
      left = Math.pow(left, right)
    }
    return left
  }

  function parseTerm(): number {
    let left = parsePower()
    while (peek() === '*' || peek() === '/' || peek() === '×' || peek() === '÷' || peek() === '%') {
      const op = get()
      const right = parsePower()
      if (op === '*' || op === '×') {
        left *= right
      } else if (op === '/' || op === '÷') {
        if (right === 0) throw new Error('Division by zero')
        left /= right
      } else if (op === '%') {
        left %= right
      }
    }
    return left
  }

  function parseExpression(): number {
    let left = parseTerm()
    while (peek() === '+' || peek() === '-') {
      const op = get()
      const right = parseTerm()
      if (op === '+') left += right
      else left -= right
    }
    return left
  }

  try {
    const res = parseExpression()
    if (isNaN(res) || !isFinite(res)) {
      return { success: false, error: 'Undefined or infinite mathematical result' }
    }
    return {
      success: true,
      result: Number(res.toFixed(10)),
      expression: cleaned,
    }
  } catch (err: any) {
    return { success: false, error: err.message || 'Invalid syntax' }
  }
}

export const UNIT_CATEGORIES: Record<
  string,
  { name: string; units: Record<string, { name: string; factor: number; toBase?: (v: number) => number; fromBase?: (v: number) => number }> }
> = {
  length: {
    name: 'Length',
    units: {
      m: { name: 'Meters (m)', factor: 1 },
      km: { name: 'Kilometers (km)', factor: 1000 },
      cm: { name: 'Centimeters (cm)', factor: 0.01 },
      mm: { name: 'Millimeters (mm)', factor: 0.001 },
      mi: { name: 'Miles (mi)', factor: 1609.344 },
      yd: { name: 'Yards (yd)', factor: 0.9144 },
      ft: { name: 'Feet (ft)', factor: 0.3048 },
      in: { name: 'Inches (in)', factor: 0.0254 },
    },
  },
  mass: {
    name: 'Mass & Weight',
    units: {
      kg: { name: 'Kilograms (kg)', factor: 1 },
      g: { name: 'Grams (g)', factor: 0.001 },
      mg: { name: 'Milligrams (mg)', factor: 0.000001 },
      lb: { name: 'Pounds (lb)', factor: 0.45359237 },
      oz: { name: 'Ounces (oz)', factor: 0.028349523 },
      tonne: { name: 'Metric Tonnes (t)', factor: 1000 },
      quintal: { name: 'Quintals (q)', factor: 100 },
    },
  },
  temperature: {
    name: 'Temperature',
    units: {
      c: {
        name: 'Celsius (°C)',
        factor: 1,
        toBase: (c) => c,
        fromBase: (c) => c,
      },
      f: {
        name: 'Fahrenheit (°F)',
        factor: 1,
        toBase: (f) => ((f - 32) * 5) / 9,
        fromBase: (c) => (c * 9) / 5 + 32,
      },
      k: {
        name: 'Kelvin (K)',
        factor: 1,
        toBase: (k) => k - 273.15,
        fromBase: (c) => c + 273.15,
      },
    },
  },
  area: {
    name: 'Area',
    units: {
      sqm: { name: 'Square Meters (m²)', factor: 1 },
      sqkm: { name: 'Square Kilometers (km²)', factor: 1000000 },
      sqft: { name: 'Square Feet (sq ft)', factor: 0.092903 },
      acre: { name: 'Acres', factor: 4046.856 },
      hectare: { name: 'Hectares', factor: 10000 },
      bigha: { name: 'Bigha (Standard)', factor: 2500 },
      guntha: { name: 'Guntha', factor: 101.17 },
    },
  },
  speed: {
    name: 'Speed',
    units: {
      mps: { name: 'Meters/second (m/s)', factor: 1 },
      kmph: { name: 'Kilometers/hour (km/h)', factor: 1 / 3.6 },
      mph: { name: 'Miles/hour (mph)', factor: 0.44704 },
      knot: { name: 'Knots', factor: 0.514444 },
    },
  },
  digital: {
    name: 'Digital Storage',
    units: {
      b: { name: 'Bytes (B)', factor: 1 },
      kb: { name: 'Kilobytes (KB)', factor: 1024 },
      mb: { name: 'Megabytes (MB)', factor: 1024 * 1024 },
      gb: { name: 'Gigabytes (GB)', factor: 1024 * 1024 * 1024 },
      tb: { name: 'Terabytes (TB)', factor: 1024 * 1024 * 1024 * 1024 },
    },
  },
}

export function convertUnits(categoryKey: string, fromUnitKey: string, toUnitKey: string, value: number): UnitConvertResult {
  const cat = UNIT_CATEGORIES[categoryKey] || UNIT_CATEGORIES.length
  const fromU = cat.units[fromUnitKey]
  const toU = cat.units[toUnitKey]

  if (!fromU || !toU || isNaN(value)) {
    return {
      fromValue: 0,
      fromUnit: fromUnitKey,
      toValue: 0,
      toUnit: toUnitKey,
      category: cat.name,
      formula: '1:1',
    }
  }

  let baseVal: number
  if (fromU.toBase) {
    baseVal = fromU.toBase(value)
  } else {
    baseVal = value * fromU.factor
  }

  let finalVal: number
  if (toU.fromBase) {
    finalVal = toU.fromBase(baseVal)
  } else {
    finalVal = baseVal / toU.factor
  }

  return {
    fromValue: value,
    fromUnit: fromU.name,
    toValue: Number(finalVal.toFixed(6)),
    toUnit: toU.name,
    category: cat.name,
    formula: `1 ${fromU.name} = ${(fromU.factor / toU.factor).toFixed(4)} ${toU.name}`,
  }
}

export function calculateDateDiff(startDateInput: Date | string, endDateInput: Date | string): DateDiffResult {
  const d1 = new Date(startDateInput)
  const d2 = new Date(endDateInput)

  if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
    return {
      startDate: '',
      endDate: '',
      totalDays: 0,
      totalWeeks: 0,
      remainingDays: 0,
      businessDays: 0,
      weekendDays: 0,
      years: 0,
      months: 0,
      days: 0,
      formattedSummary: 'Invalid dates',
    }
  }

  const start = d1 < d2 ? d1 : d2
  const end = d1 < d2 ? d2 : d1

  const diffMs = end.getTime() - start.getTime()
  const totalDays = Math.round(diffMs / (1000 * 60 * 60 * 24))
  const totalWeeks = Math.floor(totalDays / 7)
  const remainingDays = totalDays % 7

  let businessDays = 0
  let weekendDays = 0
  const cur = new Date(start)

  for (let i = 0; i < totalDays; i++) {
    cur.setDate(cur.getDate() + 1)
    const day = cur.getDay()
    if (day === 0 || day === 6) {
      weekendDays++
    } else {
      businessDays++
    }
  }

  let years = end.getFullYear() - start.getFullYear()
  let months = end.getMonth() - start.getMonth()
  let days = end.getDate() - start.getDate()

  if (days < 0) {
    months--
    const prevMonthDays = new Date(end.getFullYear(), end.getMonth(), 0).getDate()
    days += prevMonthDays
  }
  if (months < 0) {
    years--
    months += 12
  }

  return {
    startDate: start.toISOString().split('T')[0],
    endDate: end.toISOString().split('T')[0],
    totalDays,
    totalWeeks,
    remainingDays,
    businessDays,
    weekendDays,
    years,
    months,
    days,
    formattedSummary: `${years} years, ${months} months, and ${days} days (${totalDays} total days)`,
  }
}

export function calculateDateAddSubtract(
  startDateInput: Date | string,
  daysCount: number,
  operation: 'add' | 'subtract' = 'add'
): DateAddSubtractResult {
  const d = new Date(startDateInput)
  if (isNaN(d.getTime())) {
    return {
      startDate: '',
      operation,
      addedDays: 0,
      resultDate: '',
      resultFormatted: '',
      dayOfWeek: '',
    }
  }

  const offset = operation === 'add' ? daysCount : -daysCount
  d.setDate(d.getDate() + offset)

  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
  const dayOfWeek = dayNames[d.getDay()]

  return {
    startDate: new Date(startDateInput).toISOString().split('T')[0],
    operation,
    addedDays: daysCount,
    resultDate: d.toISOString().split('T')[0],
    resultFormatted: d.toLocaleDateString('en-IN', { dateStyle: 'full' }),
    dayOfWeek,
  }
}

export function calculateDiscount(originalPrice: number, discountPercentage: number): DiscountResult {
  const price = Math.max(0, isNaN(originalPrice) ? 0 : originalPrice)
  const pct = Math.max(0, Math.min(100, isNaN(discountPercentage) ? 0 : discountPercentage))

  const discountAmount = price * (pct / 100)
  const finalPrice = price - discountAmount

  return {
    originalPrice: Number(price.toFixed(2)),
    discountPercentage: Number(pct.toFixed(2)),
    discountAmount: Number(discountAmount.toFixed(2)),
    finalPrice: Number(finalPrice.toFixed(2)),
    savingsPercentage: Number(pct.toFixed(2)),
  }
}

export function calculateProfitLoss(costPrice: number, sellingPrice: number): ProfitLossResult {
  const cp = Math.max(0, isNaN(costPrice) ? 0 : costPrice)
  const sp = Math.max(0, isNaN(sellingPrice) ? 0 : sellingPrice)

  const diff = sp - cp
  const absDiff = Math.abs(diff)
  const pct = cp > 0 ? (absDiff / cp) * 100 : 0

  let status: ProfitLossResult['status'] = 'break_even'
  let summary = 'No profit, no loss.'

  if (diff > 0) {
    status = 'profit'
    summary = `Profit of ₹${absDiff.toFixed(2)} (${pct.toFixed(2)}%)`
  } else if (diff < 0) {
    status = 'loss'
    summary = `Loss of ₹${absDiff.toFixed(2)} (${pct.toFixed(2)}%)`
  }

  return {
    costPrice: Number(cp.toFixed(2)),
    sellingPrice: Number(sp.toFixed(2)),
    amount: Number(absDiff.toFixed(2)),
    percentage: Number(pct.toFixed(2)),
    status,
    summary,
  }
}

export function calculateRatio(a: number, b: number): RatioResult {
  const safeA = Math.max(0, isNaN(a) ? 0 : a)
  const safeB = Math.max(0, isNaN(b) ? 0 : b)

  if (safeA === 0 || safeB === 0) {
    return {
      antecedent: safeA,
      consequent: safeB,
      simplifiedAntecedent: safeA,
      simplifiedConsequent: safeB,
      simplifiedString: `${safeA} : ${safeB}`,
      decimalValue: safeB > 0 ? safeA / safeB : 0,
      percentage: safeB > 0 ? (safeA / safeB) * 100 : 0,
    }
  }

  const divisor = gcd(safeA, safeB)
  const simA = safeA / divisor
  const simB = safeB / divisor

  return {
    antecedent: safeA,
    consequent: safeB,
    simplifiedAntecedent: simA,
    simplifiedConsequent: simB,
    simplifiedString: `${simA} : ${simB}`,
    decimalValue: Number((safeA / safeB).toFixed(4)),
    percentage: Number(((safeA / safeB) * 100).toFixed(2)),
  }
}

export function calculateFraction(
  operation: 'add' | 'subtract' | 'multiply' | 'divide',
  num1: number,
  den1: number,
  num2: number,
  den2: number
): FractionResult {
  const n1 = isNaN(num1) ? 0 : num1
  const d1 = den1 === 0 ? 1 : den1
  const n2 = isNaN(num2) ? 0 : num2
  const d2 = den2 === 0 ? 1 : den2

  let resN = 0
  let resD = 1

  switch (operation) {
    case 'add':
      resN = n1 * d2 + n2 * d1
      resD = d1 * d2
      break
    case 'subtract':
      resN = n1 * d2 - n2 * d1
      resD = d1 * d2
      break
    case 'multiply':
      resN = n1 * n2
      resD = d1 * d2
      break
    case 'divide':
      if (n2 === 0) throw new Error('Cannot divide by zero fraction.')
      resN = n1 * d2
      resD = d1 * n2
      break
  }

  if (resD < 0) {
    resN = -resN
    resD = -resD
  }

  const divisor = gcd(resN, resD)
  const simN = resN / divisor
  const simD = resD / divisor

  let mixedStr: string | undefined
  if (Math.abs(simN) >= simD && simD !== 1) {
    const whole = Math.trunc(simN / simD)
    const remainder = Math.abs(simN % simD)
    if (remainder > 0) {
      mixedStr = `${whole} ${remainder}/${simD}`
    }
  }

  return {
    operation,
    num1: n1,
    den1: d1,
    num2: n2,
    den2: d2,
    resultNumerator: resN,
    resultDenominator: resD,
    simplifiedNumerator: simN,
    simplifiedDenominator: simD,
    mixedString: mixedStr,
    decimalValue: Number((resN / resD).toFixed(4)),
  }
}

export function calculatePercentageChange(initialVal: number, finalVal: number): PercentageChangeResult {
  const v1 = isNaN(initialVal) ? 0 : initialVal
  const v2 = isNaN(finalVal) ? 0 : finalVal

  const diff = v2 - v1
  const absDiff = Math.abs(diff)

  if (v1 === 0) {
    return {
      initialValue: v1,
      finalValue: v2,
      absoluteChange: diff,
      percentageChange: 0,
      status: diff > 0 ? 'increase' : diff < 0 ? 'decrease' : 'no_change',
      steps: ['Initial value is 0; percentage change cannot be mathematically computed.'],
    }
  }

  const pct = (diff / Math.abs(v1)) * 100
  const status = diff > 0 ? 'increase' : diff < 0 ? 'decrease' : 'no_change'

  const steps = [
    `Step 1: Calculate the absolute change: |${v2} - ${v1}| = ${absDiff}`,
    `Step 2: Divide the change by original value: ${diff} / |${v1}| = ${(diff / Math.abs(v1)).toFixed(4)}`,
    `Step 3: Multiply by 100 to convert to percentage: ${(diff / Math.abs(v1)).toFixed(4)} × 100 = ${pct.toFixed(2)}%`,
    `Result: A ${Math.abs(pct).toFixed(2)}% ${status}.`,
  ]

  return {
    initialValue: v1,
    finalValue: v2,
    absoluteChange: Number(diff.toFixed(2)),
    percentageChange: Number(pct.toFixed(2)),
    status,
    steps,
  }
}
