export interface EmiInput {
  principal: number
  annualInterestRate: number
  tenureYears: number
  tenureMonths?: number
}

export interface AmortizationRow {
  year: number
  principalPaid: number
  interestPaid: number
  balance: number
}

export interface EmiResult {
  monthlyEmi: number
  principal: number
  annualInterestRate: number
  tenureMonths: number
  totalInterest: number
  totalPayment: number
  schedule: AmortizationRow[]
}

export interface SipInput {
  monthlyInvestment: number
  expectedAnnualReturnRate: number
  tenureYears: number
}

export interface SipResult {
  monthlyInvestment: number
  annualReturnRate: number
  tenureYears: number
  totalInvested: number
  estimatedGains: number
  estimatedMaturityValue: number
  disclaimer: string
}

export interface GstInput {
  amount: number
  gstRate: number
  mode: 'exclusive' | 'inclusive'
}

export interface GstResult {
  baseAmount: number
  gstRate: number
  gstAmount: number
  finalAmount: number
  cgst: number
  sgst: number
  igst: number
  mode: 'exclusive' | 'inclusive'
}

export interface FdInput {
  principal: number
  annualInterestRate: number
  tenureYears: number
  compoundingFrequency?: 'quarterly' | 'monthly' | 'half-yearly' | 'annually'
  isSeniorCitizen?: boolean
}

export interface FdResult {
  principal: number
  annualInterestRate: number
  tenureYears: number
  compoundingFrequency: string
  maturityAmount: number
  totalInterestEarned: number
  effectiveYieldPercentage: number
}

export interface RdInput {
  monthlyDeposit: number
  annualInterestRate: number
  tenureMonths: number
}

export interface RdResult {
  monthlyDeposit: number
  annualInterestRate: number
  tenureMonths: number
  totalInvested: number
  totalInterest: number
  maturityAmount: number
}

export interface TaxInput {
  financialYear: '2024-25' | '2025-26'
  regime: 'new' | 'old'
  grossAnnualIncome: number
  investments80C?: number // for old regime (max 1.5L)
  nps80CCD?: number // for old regime (max 50k)
  healthInsurance80D?: number // for old regime (max 25k/50k)
  hraExemption?: number // for old regime
  homeLoanInterest24B?: number // for old regime (max 2L)
}

export interface TaxBreakdownSlab {
  slab: string
  rate: string
  taxableInSlab: number
  taxAmount: number
}

export interface TaxResult {
  financialYear: string
  regime: 'new' | 'old'
  grossIncome: number
  totalDeductions: number
  standardDeduction: number
  netTaxableIncome: number
  slabsBreakdown: TaxBreakdownSlab[]
  taxBeforeRebate: number
  rebate87A: number
  taxAfterRebate: number
  cess: number // 4% Health and Education Cess
  totalTaxPayable: number
  effectiveTaxRatePercentage: number
  disclaimer: string
}

/**
 * Standard reducing-balance Loan EMI calculator
 */
export function calculateEmi(input: EmiInput): EmiResult {
  const principal = Math.max(0, isNaN(input.principal) ? 0 : input.principal)
  const annualRate = Math.max(0, isNaN(input.annualInterestRate) ? 0 : input.annualInterestRate)
  const totalMonths = (input.tenureYears || 0) * 12 + (input.tenureMonths || 0)
  const n = Math.max(1, totalMonths)

  if (principal === 0) {
    return {
      monthlyEmi: 0,
      principal: 0,
      annualInterestRate: annualRate,
      tenureMonths: n,
      totalInterest: 0,
      totalPayment: 0,
      schedule: [],
    }
  }

  // Handle 0% interest loan
  if (annualRate === 0) {
    const emi = principal / n
    return {
      monthlyEmi: Math.round(emi),
      principal,
      annualInterestRate: 0,
      tenureMonths: n,
      totalInterest: 0,
      totalPayment: principal,
      schedule: [
        {
          year: 1,
          principalPaid: principal,
          interestPaid: 0,
          balance: 0,
        },
      ],
    }
  }

  const monthlyRate = annualRate / (12 * 100)
  // E = P * r * (1+r)^n / ((1+r)^n - 1)
  const rateFactor = Math.pow(1 + monthlyRate, n)
  const emi = (principal * monthlyRate * rateFactor) / (rateFactor - 1)

  const totalPayment = emi * n
  const totalInterest = totalPayment - principal

  // Generate yearly amortization schedule
  const schedule: AmortizationRow[] = []
  let balance = principal
  const totalYears = Math.ceil(n / 12)

  for (let year = 1; year <= totalYears; year++) {
    let yearPrincipalPaid = 0
    let yearInterestPaid = 0
    const monthsInThisYear = Math.min(12, n - (year - 1) * 12)

    for (let m = 0; m < monthsInThisYear; m++) {
      const monthInterest = balance * monthlyRate
      const monthPrincipal = emi - monthInterest
      yearInterestPaid += monthInterest
      yearPrincipalPaid += monthPrincipal
      balance = Math.max(0, balance - monthPrincipal)
    }

    schedule.push({
      year,
      principalPaid: Math.round(yearPrincipalPaid),
      interestPaid: Math.round(yearInterestPaid),
      balance: Math.round(balance),
    })
  }

  return {
    monthlyEmi: Math.round(emi),
    principal: Math.round(principal),
    annualInterestRate: annualRate,
    tenureMonths: n,
    totalInterest: Math.round(totalInterest),
    totalPayment: Math.round(totalPayment),
    schedule,
  }
}

/**
 * Systematic Investment Plan (SIP) compound wealth projector
 */
export function calculateSip(input: SipInput): SipResult {
  const p = Math.max(0, isNaN(input.monthlyInvestment) ? 0 : input.monthlyInvestment)
  const r = Math.max(0, isNaN(input.expectedAnnualReturnRate) ? 0 : input.expectedAnnualReturnRate)
  const years = Math.max(1, Math.min(50, isNaN(input.tenureYears) ? 1 : input.tenureYears))
  const n = years * 12

  const totalInvested = p * n

  if (p === 0 || r === 0) {
    return {
      monthlyInvestment: p,
      annualReturnRate: r,
      tenureYears: years,
      totalInvested,
      estimatedGains: 0,
      estimatedMaturityValue: totalInvested,
      disclaimer: 'Returns are estimates based on assumed constant compounding rate. Mutual fund investments are subject to market risks.',
    }
  }

  const i = r / (12 * 100)
  // M = P * [ ( (1 + i)^n - 1 ) / i ] * (1 + i)
  const maturityValue = p * ((Math.pow(1 + i, n) - 1) / i) * (1 + i)
  const estimatedGains = maturityValue - totalInvested

  return {
    monthlyInvestment: p,
    annualReturnRate: r,
    tenureYears: years,
    totalInvested: Math.round(totalInvested),
    estimatedGains: Math.round(estimatedGains),
    estimatedMaturityValue: Math.round(maturityValue),
    disclaimer:
      'Mutual fund investments are subject to market risks. SIP projections are computed with standard monthly compounding at an assumed rate of return and do not represent guaranteed outcomes.',
  }
}

/**
 * Goods & Services Tax (GST) Calculator (CGST, SGST, IGST)
 */
export function calculateGst(input: GstInput): GstResult {
  const amount = Math.max(0, isNaN(input.amount) ? 0 : input.amount)
  const rate = Math.max(0, isNaN(input.gstRate) ? 0 : input.gstRate)

  if (input.mode === 'inclusive') {
    // Amount includes GST. Base = Amount / (1 + Rate/100)
    const base = amount / (1 + rate / 100)
    const gst = amount - base

    return {
      baseAmount: Number(base.toFixed(2)),
      gstRate: rate,
      gstAmount: Number(gst.toFixed(2)),
      finalAmount: Number(amount.toFixed(2)),
      cgst: Number((gst / 2).toFixed(2)),
      sgst: Number((gst / 2).toFixed(2)),
      igst: Number(gst.toFixed(2)),
      mode: 'inclusive',
    }
  } else {
    // Amount is exclusive of GST.
    const gst = (amount * rate) / 100
    const finalAmt = amount + gst

    return {
      baseAmount: Number(amount.toFixed(2)),
      gstRate: rate,
      gstAmount: Number(gst.toFixed(2)),
      finalAmount: Number(finalAmt.toFixed(2)),
      cgst: Number((gst / 2).toFixed(2)),
      sgst: Number((gst / 2).toFixed(2)),
      igst: Number(gst.toFixed(2)),
      mode: 'exclusive',
    }
  }
}

/**
 * Fixed Deposit (FD) Compounding Calculator
 */
export function calculateFd(input: FdInput): FdResult {
  const p = Math.max(0, isNaN(input.principal) ? 0 : input.principal)
  let rate = Math.max(0, isNaN(input.annualInterestRate) ? 0 : input.annualInterestRate)
  if (input.isSeniorCitizen) {
    rate += 0.5 // Standard 50 bps senior citizen premium in Indian banks
  }
  const t = Math.max(0.25, Math.min(30, isNaN(input.tenureYears) ? 1 : input.tenureYears))

  // Indian banks typically compound quarterly
  let n = 4
  if (input.compoundingFrequency === 'monthly') n = 12
  else if (input.compoundingFrequency === 'half-yearly') n = 2
  else if (input.compoundingFrequency === 'annually') n = 1

  // A = P * (1 + r/n)^(n*t)
  const rDecimal = rate / 100
  const maturity = p * Math.pow(1 + rDecimal / n, n * t)
  const totalInterest = maturity - p
  const yieldPct = p > 0 ? (totalInterest / (p * t)) * 100 : 0

  return {
    principal: Math.round(p),
    annualInterestRate: rate,
    tenureYears: t,
    compoundingFrequency: input.compoundingFrequency || 'quarterly',
    maturityAmount: Math.round(maturity),
    totalInterestEarned: Math.round(totalInterest),
    effectiveYieldPercentage: Number(yieldPct.toFixed(2)),
  }
}

/**
 * Recurring Deposit (RD) Calculator
 */
export function calculateRd(input: RdInput): RdResult {
  const p = Math.max(0, isNaN(input.monthlyDeposit) ? 0 : input.monthlyDeposit)
  const rate = Math.max(0, isNaN(input.annualInterestRate) ? 0 : input.annualInterestRate)
  const months = Math.max(3, Math.min(120, Math.floor(isNaN(input.tenureMonths) ? 12 : input.tenureMonths)))

  const totalInvested = p * months

  // Standard Indian Banking formula for quarterly compounding RD:
  // Quarter count q = months / 3
  // Summing each monthly deposit compounded quarterly
  const r = rate / 400 // quarterly rate
  let maturity = 0

  for (let m = 1; m <= months; m++) {
    // Number of remaining quarters for deposit m
    const quartersRemaining = (months - m + 1) / 3
    maturity += p * Math.pow(1 + r, quartersRemaining)
  }

  const interest = maturity - totalInvested

  return {
    monthlyDeposit: Math.round(p),
    annualInterestRate: rate,
    tenureMonths: months,
    totalInvested: Math.round(totalInvested),
    totalInterest: Math.round(interest),
    maturityAmount: Math.round(maturity),
  }
}

/**
 * Indian Income Tax Slabs Engine (FY 2024-25 & FY 2025-26)
 */
export function calculateIncomeTax(input: TaxInput): TaxResult {
  const gross = Math.max(0, isNaN(input.grossAnnualIncome) ? 0 : input.grossAnnualIncome)
  const isNewRegime = input.regime === 'new'

  let stdDeduction = 0
  let totalDeductions = 0

  if (isNewRegime) {
    // Standard deduction under New Tax Regime was increased to ₹75,000 from Budget 2024
    stdDeduction = Math.min(gross, 75000)
    totalDeductions = stdDeduction
  } else {
    // Old Tax Regime: Standard deduction ₹50,000 + 80C, 80D, HRA, etc.
    stdDeduction = Math.min(gross, 50000)
    const c80 = Math.min(150000, Math.max(0, input.investments80C || 0))
    const nps = Math.min(50000, Math.max(0, input.nps80CCD || 0))
    const d80 = Math.min(50000, Math.max(0, input.healthInsurance80D || 0))
    const hra = Math.max(0, input.hraExemption || 0)
    const homeLoan = Math.min(200000, Math.max(0, input.homeLoanInterest24B || 0))

    totalDeductions = Math.min(gross, stdDeduction + c80 + nps + d80 + hra + homeLoan)
  }

  const netTaxableIncome = Math.max(0, gross - totalDeductions)
  const breakdown: TaxBreakdownSlab[] = []
  let taxBeforeRebate = 0

  if (isNewRegime) {
    // New Regime Slabs (FY 2024-25 / 2025-26 revised slabs):
    // 0 to 3,00,000: Nil
    // 3,00,001 to 7,00,000: 5%
    // 7,00,001 to 10,00,000: 10%
    // 10,00,001 to 12,00,000: 15%
    // 12,00,001 to 15,00,000: 20%
    // Above 15,00,000: 30%
    const slabs = [
      { max: 300000, rate: 0, label: '₹0 - ₹3,00,000', rateLabel: '0%' },
      { max: 700000, rate: 0.05, label: '₹3,00,001 - ₹7,00,000', rateLabel: '5%' },
      { max: 1000000, rate: 0.10, label: '₹7,00,001 - ₹10,00,000', rateLabel: '10%' },
      { max: 1200000, rate: 0.15, label: '₹10,00,001 - ₹12,00,000', rateLabel: '15%' },
      { max: 1500000, rate: 0.20, label: '₹12,00,001 - ₹15,00,000', rateLabel: '20%' },
      { max: Infinity, rate: 0.30, label: 'Above ₹15,00,000', rateLabel: '30%' },
    ]

    let prevLimit = 0
    for (const slab of slabs) {
      if (netTaxableIncome > prevLimit) {
        const taxableInThisSlab = Math.min(netTaxableIncome - prevLimit, slab.max - prevLimit)
        const taxInThisSlab = taxableInThisSlab * slab.rate
        taxBeforeRebate += taxInThisSlab
        breakdown.push({
          slab: slab.label,
          rate: slab.rateLabel,
          taxableInSlab: Math.round(taxableInThisSlab),
          taxAmount: Math.round(taxInThisSlab),
        })
      }
      prevLimit = slab.max
    }
  } else {
    // Old Regime Slabs:
    // 0 to 2,50,000: Nil
    // 2,50,001 to 5,00,000: 5%
    // 5,00,001 to 10,00,000: 20%
    // Above 10,00,000: 30%
    const slabs = [
      { max: 250000, rate: 0, label: '₹0 - ₹2,50,000', rateLabel: '0%' },
      { max: 500000, rate: 0.05, label: '₹2,50,001 - ₹5,00,000', rateLabel: '5%' },
      { max: 1000000, rate: 0.20, label: '₹5,00,001 - ₹10,00,000', rateLabel: '20%' },
      { max: Infinity, rate: 0.30, label: 'Above ₹10,00,000', rateLabel: '30%' },
    ]

    let prevLimit = 0
    for (const slab of slabs) {
      if (netTaxableIncome > prevLimit) {
        const taxableInThisSlab = Math.min(netTaxableIncome - prevLimit, slab.max - prevLimit)
        const taxInThisSlab = taxableInThisSlab * slab.rate
        taxBeforeRebate += taxInThisSlab
        breakdown.push({
          slab: slab.label,
          rate: slab.rateLabel,
          taxableInSlab: Math.round(taxableInThisSlab),
          taxAmount: Math.round(taxInThisSlab),
        })
      }
      prevLimit = slab.max
    }
  }

  // Section 87A Rebate
  let rebate87A = 0
  if (isNewRegime) {
    // Up to ₹7,00,000 taxable income receives 100% tax rebate (max ₹25,000)
    if (netTaxableIncome <= 700000) {
      rebate87A = taxBeforeRebate
    }
  } else {
    // Old regime: rebate up to ₹5,00,000 taxable income (max ₹12,500)
    if (netTaxableIncome <= 500000) {
      rebate87A = Math.min(taxBeforeRebate, 12500)
    }
  }

  const taxAfterRebate = Math.max(0, taxBeforeRebate - rebate87A)
  // Health and Education Cess: 4% on tax after rebate
  const cess = taxAfterRebate > 0 ? taxAfterRebate * 0.04 : 0
  const totalTaxPayable = taxAfterRebate + cess
  const effectiveRate = gross > 0 ? (totalTaxPayable / gross) * 100 : 0

  return {
    financialYear: input.financialYear,
    regime: input.regime,
    grossIncome: Math.round(gross),
    totalDeductions: Math.round(totalDeductions),
    standardDeduction: Math.round(stdDeduction),
    netTaxableIncome: Math.round(netTaxableIncome),
    slabsBreakdown: breakdown,
    taxBeforeRebate: Math.round(taxBeforeRebate),
    rebate87A: Math.round(rebate87A),
    taxAfterRebate: Math.round(taxAfterRebate),
    cess: Math.round(cess),
    totalTaxPayable: Math.round(totalTaxPayable),
    effectiveTaxRatePercentage: Number(effectiveRate.toFixed(2)),
    disclaimer:
      'Tax calculations are estimates for informational purposes based on the selected Financial Year and tax regime rules. Verify with a qualified Chartered Accountant or official income tax portal before filing.',
  }
}
