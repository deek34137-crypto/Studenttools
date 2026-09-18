export interface CtcInput {
  annualCtc: number
  basicPercentage?: number
  hraPercentageOfBasic?: number
  variablePayAnnual?: number
  professionalTaxMonthly?: number
  employerPfIncludedInCtc?: boolean
  taxRegime?: 'new' | 'old'
}

export interface CtcResult {
  annualCtc: number
  basicAnnual: number
  basicMonthly: number
  hraAnnual: number
  hraMonthly: number
  specialAllowanceAnnual: number
  specialAllowanceMonthly: number
  variablePayAnnual: number
  grossSalaryAnnual: number
  grossSalaryMonthly: number
  employeePfAnnual: number
  employeePfMonthly: number
  employerPfAnnual: number
  employerPfMonthly: number
  gratuityAnnual: number
  professionalTaxAnnual: number
  professionalTaxMonthly: number
  estimatedIncomeTaxAnnual: number
  estimatedIncomeTaxMonthly: number
  totalDeductionsMonthly: number
  estimatedInHandMonthly: number
  estimatedInHandAnnual: number
  assumptions: string[]
  disclaimer: string
}

export interface SalaryConversionResult {
  monthlySalary: number
  annualSalary: number
  quarterlySalary: number
  weeklySalary: number
  dailySalary: number
  hourlySalary: number
}

export interface SalaryHikeResult {
  currentSalary: number
  hikePercentage: number
  incrementAmountAnnual: number
  incrementAmountMonthly: number
  newSalaryAnnual: number
  newSalaryMonthly: number
}

export interface IncrementCalcResult {
  oldSalary: number
  newSalary: number
  absoluteIncreaseAnnual: number
  absoluteIncreaseMonthly: number
  percentageHike: number
  isHike: boolean
}

export interface PfCalculationInput {
  monthlyBasic: number
  employeeRate?: number
  statutoryWageCeiling?: boolean
  tenureYears?: number
  epfInterestRate?: number
}

export interface PfCalculationResult {
  monthlyBasic: number
  employeeContributionMonthly: number
  employerEpContributionMonthly: number
  employerEpsContributionMonthly: number
  totalMonthlyPfDeposit: number
  annualTotalDeposit: number
  projectedAccumulation: number
  interestRateUsed: number
  disclaimer: string
}

export interface BonusCalculationResult {
  baseSalary: number
  bonusType: 'percentage' | 'fixed'
  bonusRate: number
  grossBonus: number
  estimatedTdsDeduction: number
  netBonus: number
}

export interface StipendInput {
  rate: number
  rateType: 'hourly' | 'daily' | 'weekly' | 'monthly'
  durationMonths: number
  hoursPerWeek?: number
  daysPerWeek?: number
}

export interface StipendResult {
  rate: number
  rateType: string
  durationMonths: number
  totalExpectedStipend: number
  averageMonthlyStipend: number
  totalWorkingDays: number
  totalWorkingHours: number
}

export function ctcToInHand(input: CtcInput): CtcResult {
  const ctc = Math.max(0, isNaN(input.annualCtc) ? 0 : input.annualCtc)
  const basicPct = Math.max(20, Math.min(70, input.basicPercentage || 40)) / 100
  const hraPct = Math.max(0, Math.min(100, input.hraPercentageOfBasic || 50)) / 100
  const variablePay = Math.max(0, isNaN(input.variablePayAnnual || 0) ? 0 : (input.variablePayAnnual || 0))
  const ptMonthly = Math.max(0, isNaN(input.professionalTaxMonthly || 200) ? 200 : (input.professionalTaxMonthly || 200))
  const employerPfIncluded = input.employerPfIncludedInCtc !== false

  const fixedCtc = Math.max(0, ctc - variablePay)

  const basicAnnual = fixedCtc * basicPct
  const basicMonthly = basicAnnual / 12

  const hraAnnual = basicAnnual * hraPct
  const hraMonthly = hraAnnual / 12

  const employeePfAnnual = basicAnnual * 0.12
  const employeePfMonthly = employeePfAnnual / 12

  const employerPfAnnual = employerPfIncluded ? basicAnnual * 0.12 : 0
  const employerPfMonthly = employerPfAnnual / 12

  const gratuityAnnual = fixedCtc > 300000 ? basicAnnual * (15 / 26 / 12) : 0

  const specialAllowanceAnnual = Math.max(
    0,
    fixedCtc - basicAnnual - hraAnnual - employerPfAnnual - gratuityAnnual
  )
  const specialAllowanceMonthly = specialAllowanceAnnual / 12

  const grossSalaryAnnual = basicAnnual + hraAnnual + specialAllowanceAnnual
  const grossSalaryMonthly = grossSalaryAnnual / 12

  const ptAnnual = ptMonthly * 12

  const standardDeduction = 75000
  const taxableIncome = Math.max(0, grossSalaryAnnual - standardDeduction)
  let estimatedTaxAnnual = 0

  if (taxableIncome > 700000) {
    if (taxableIncome > 300000) {
      estimatedTaxAnnual += Math.min(taxableIncome - 300000, 400000) * 0.05
    }
    if (taxableIncome > 700000) {
      estimatedTaxAnnual += Math.min(taxableIncome - 700000, 300000) * 0.10
    }
    if (taxableIncome > 1000000) {
      estimatedTaxAnnual += Math.min(taxableIncome - 1000000, 200000) * 0.15
    }
    if (taxableIncome > 1200000) {
      estimatedTaxAnnual += Math.min(taxableIncome - 1200000, 300000) * 0.20
    }
    if (taxableIncome > 1500000) {
      estimatedTaxAnnual += (taxableIncome - 1500000) * 0.30
    }
    estimatedTaxAnnual *= 1.04
  } else {
    estimatedTaxAnnual = 0
  }

  const estimatedTaxMonthly = estimatedTaxAnnual / 12

  const totalDeductionsMonthly = employeePfMonthly + ptMonthly + estimatedTaxMonthly
  const estimatedInHandMonthly = Math.max(0, grossSalaryMonthly - totalDeductionsMonthly)
  const estimatedInHandAnnual = estimatedInHandMonthly * 12

  return {
    annualCtc: ctc,
    basicAnnual: Math.round(basicAnnual),
    basicMonthly: Math.round(basicMonthly),
    hraAnnual: Math.round(hraAnnual),
    hraMonthly: Math.round(hraMonthly),
    specialAllowanceAnnual: Math.round(specialAllowanceAnnual),
    specialAllowanceMonthly: Math.round(specialAllowanceMonthly),
    variablePayAnnual: Math.round(variablePay),
    grossSalaryAnnual: Math.round(grossSalaryAnnual),
    grossSalaryMonthly: Math.round(grossSalaryMonthly),
    employeePfAnnual: Math.round(employeePfAnnual),
    employeePfMonthly: Math.round(employeePfMonthly),
    employerPfAnnual: Math.round(employerPfAnnual),
    employerPfMonthly: Math.round(employerPfMonthly),
    gratuityAnnual: Math.round(gratuityAnnual),
    professionalTaxAnnual: Math.round(ptAnnual),
    professionalTaxMonthly: Math.round(ptMonthly),
    estimatedIncomeTaxAnnual: Math.round(estimatedTaxAnnual),
    estimatedIncomeTaxMonthly: Math.round(estimatedTaxMonthly),
    totalDeductionsMonthly: Math.round(totalDeductionsMonthly),
    estimatedInHandMonthly: Math.round(estimatedInHandMonthly),
    estimatedInHandAnnual: Math.round(estimatedInHandAnnual),
    assumptions: [
      `Basic Salary assumed at ${(basicPct * 100).toFixed(0)}% of fixed CTC.`,
      `HRA assumed at ${(hraPct * 100).toFixed(0)}% of Basic Salary.`,
      'Employee PF calculated at 12% of Basic.',
      'Professional Tax estimated at ₹200/month.',
      'Income tax estimated under the New Tax Regime (with ₹75,000 Standard Deduction and 87A rebate).',
      'Variable pay is excluded from monthly recurring in-hand and paid per company cycle.',
    ],
    disclaimer:
      'Actual take-home salary varies widely depending on your employer’s specific salary structure, company benefits, voluntary PF, and individual tax declarations.',
  }
}

export function monthlyToAnnualSalary(monthly: number): SalaryConversionResult {
  const m = Math.max(0, isNaN(monthly) ? 0 : monthly)
  const annual = m * 12
  const quarterly = annual / 4
  const weekly = annual / 52
  const daily = m / 22
  const hourly = daily / 8

  return {
    monthlySalary: Math.round(m),
    annualSalary: Math.round(annual),
    quarterlySalary: Math.round(quarterly),
    weeklySalary: Math.round(weekly),
    dailySalary: Math.round(daily),
    hourlySalary: Math.round(hourly),
  }
}

export function annualToMonthlySalary(annual: number): SalaryConversionResult {
  const a = Math.max(0, isNaN(annual) ? 0 : annual)
  const monthly = a / 12
  return monthlyToAnnualSalary(monthly)
}

export function calculateSalaryHike(currentSalary: number, hikePercentage: number): SalaryHikeResult {
  const curr = Math.max(0, isNaN(currentSalary) ? 0 : currentSalary)
  const hike = isNaN(hikePercentage) ? 0 : hikePercentage

  const incrementAnnual = curr * (hike / 100)
  const newSalaryAnnual = curr + incrementAnnual

  return {
    currentSalary: Math.round(curr),
    hikePercentage: Number(hike.toFixed(2)),
    incrementAmountAnnual: Math.round(incrementAnnual),
    incrementAmountMonthly: Math.round(incrementAnnual / 12),
    newSalaryAnnual: Math.round(newSalaryAnnual),
    newSalaryMonthly: Math.round(newSalaryAnnual / 12),
  }
}

export function calculateIncrement(oldSalary: number, newSalary: number): IncrementCalcResult {
  const oldVal = Math.max(0, isNaN(oldSalary) ? 0 : oldSalary)
  const newVal = Math.max(0, isNaN(newSalary) ? 0 : newSalary)

  const diffAnnual = newVal - oldVal
  const diffMonthly = diffAnnual / 12
  const pct = oldVal > 0 ? (diffAnnual / oldVal) * 100 : 0

  return {
    oldSalary: Math.round(oldVal),
    newSalary: Math.round(newVal),
    absoluteIncreaseAnnual: Math.round(diffAnnual),
    absoluteIncreaseMonthly: Math.round(diffMonthly),
    percentageHike: Number(pct.toFixed(2)),
    isHike: diffAnnual >= 0,
  }
}

export function calculatePf(input: PfCalculationInput): PfCalculationResult {
  const basic = Math.max(0, isNaN(input.monthlyBasic) ? 0 : input.monthlyBasic)
  const empRate = (input.employeeRate || 12) / 100
  const interestRate = input.epfInterestRate || 8.25
  const tenure = Math.max(1, Math.min(40, input.tenureYears || 1))

  const employeeContrib = basic * empRate

  const epsApplicableWage = input.statutoryWageCeiling ? Math.min(15000, basic) : basic
  const epsContrib = Math.min(1250, epsApplicableWage * 0.0833)
  const employerEpContrib = Math.max(0, basic * 0.12 - epsContrib)

  const totalMonthlyPf = employeeContrib + employerEpContrib
  const annualDeposit = totalMonthlyPf * 12

  let balance = 0
  const r = interestRate / 100
  for (let y = 0; y < tenure; y++) {
    balance = (balance + annualDeposit) * (1 + r)
  }

  return {
    monthlyBasic: Math.round(basic),
    employeeContributionMonthly: Math.round(employeeContrib),
    employerEpContributionMonthly: Math.round(employerEpContrib),
    employerEpsContributionMonthly: Math.round(epsContrib),
    totalMonthlyPfDeposit: Math.round(totalMonthlyPf),
    annualTotalDeposit: Math.round(annualDeposit),
    projectedAccumulation: Math.round(balance),
    interestRateUsed: interestRate,
    disclaimer:
      'EPFO interest rates are declared annually by the Government of India. The calculation assumes standard annual compounding without accounting for mid-year salary hikes or withdrawals.',
  }
}

export function calculateBonus(
  baseSalary: number,
  bonusType: 'percentage' | 'fixed',
  bonusValue: number,
  tdsPercentage: number = 10
): BonusCalculationResult {
  const base = Math.max(0, isNaN(baseSalary) ? 0 : baseSalary)
  const bVal = Math.max(0, isNaN(bonusValue) ? 0 : bonusValue)
  const tds = Math.max(0, Math.min(40, isNaN(tdsPercentage) ? 10 : tdsPercentage)) / 100

  const grossBonus = bonusType === 'percentage' ? base * (bVal / 100) : bVal
  const tdsDeduction = grossBonus * tds
  const netBonus = Math.max(0, grossBonus - tdsDeduction)

  return {
    baseSalary: Math.round(base),
    bonusType,
    bonusRate: bVal,
    grossBonus: Math.round(grossBonus),
    estimatedTdsDeduction: Math.round(tdsDeduction),
    netBonus: Math.round(netBonus),
  }
}

export function calculateInternshipStipend(input: StipendInput): StipendResult {
  const rate = Math.max(0, isNaN(input.rate) ? 0 : input.rate)
  const duration = Math.max(0.5, Math.min(24, isNaN(input.durationMonths) ? 1 : input.durationMonths))
  const hoursPerWeek = Math.max(5, Math.min(80, input.hoursPerWeek || 40))
  const daysPerWeek = Math.max(1, Math.min(7, input.daysPerWeek || 5))

  const totalWeeks = duration * 4.333
  const totalDays = Math.round(totalWeeks * daysPerWeek)
  const totalHours = Math.round(totalWeeks * hoursPerWeek)

  let totalStipend = 0

  switch (input.rateType) {
    case 'monthly':
      totalStipend = rate * duration
      break
    case 'weekly':
      totalStipend = rate * totalWeeks
      break
    case 'daily':
      totalStipend = rate * totalDays
      break
    case 'hourly':
      totalStipend = rate * totalHours
      break
  }

  const avgMonthly = totalStipend / duration

  return {
    rate: Math.round(rate),
    rateType: input.rateType,
    durationMonths: duration,
    totalExpectedStipend: Math.round(totalStipend),
    averageMonthlyStipend: Math.round(avgMonthly),
    totalWorkingDays: totalDays,
    totalWorkingHours: totalHours,
  }
}
