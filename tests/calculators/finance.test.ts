import { describe, it, expect } from 'vitest'
import {
  calculateEmi,
  calculateSip,
  calculateGst,
  calculateFd,
  calculateRd,
  calculateIncomeTax,
} from '../../lib/calculators/finance'

describe('Finance Calculator Engine', () => {
  describe('calculateEmi', () => {
    it('calculates reducing balance EMI accurately', () => {
      // Loan ₹10,00,000, 10% interest, 5 years (60 months)
      // Monthly rate = 10 / 1200 = 0.008333...
      // Expected EMI is approx ₹21,247
      const res = calculateEmi({ principal: 1000000, annualInterestRate: 10, tenureYears: 5 })
      expect(res.monthlyEmi).toBeGreaterThan(21000)
      expect(res.monthlyEmi).toBeLessThan(21500)
      expect(res.totalPayment).toBeGreaterThan(1000000)
      expect(res.totalInterest).toBe(res.totalPayment - 1000000)
      expect(res.schedule.length).toBe(5)
    })

    it('handles 0% interest loan correctly', () => {
      const res = calculateEmi({ principal: 120000, annualInterestRate: 0, tenureYears: 1 })
      expect(res.monthlyEmi).toBe(10000)
      expect(res.totalInterest).toBe(0)
      expect(res.totalPayment).toBe(120000)
    })

    it('handles zero principal safely', () => {
      const res = calculateEmi({ principal: 0, annualInterestRate: 8.5, tenureYears: 5 })
      expect(res.monthlyEmi).toBe(0)
      expect(res.totalPayment).toBe(0)
    })
  })

  describe('calculateSip', () => {
    it('computes compound returns for monthly SIP', () => {
      // ₹10,000 / month, 12% annual return, 10 years (120 months)
      // Total Invested = ₹12,00,000
      // Future Value approx ₹23,23,391
      const res = calculateSip({ monthlyInvestment: 10000, expectedAnnualReturnRate: 12, tenureYears: 10 })
      expect(res.totalInvested).toBe(1200000)
      expect(res.estimatedMaturityValue).toBeGreaterThan(2200000)
      expect(res.estimatedMaturityValue).toBeLessThan(2500000)
      expect(res.estimatedGains).toBe(res.estimatedMaturityValue - res.totalInvested)
    })

    it('handles zero return or zero investment', () => {
      const res = calculateSip({ monthlyInvestment: 5000, expectedAnnualReturnRate: 0, tenureYears: 5 })
      expect(res.totalInvested).toBe(300000)
      expect(res.estimatedGains).toBe(0)
    })
  })

  describe('calculateGst', () => {
    it('calculates GST exclusive addition (adds 18% to 1000)', () => {
      const res = calculateGst({ amount: 1000, gstRate: 18, mode: 'exclusive' })
      expect(res.gstAmount).toBe(180)
      expect(res.finalAmount).toBe(1180)
      expect(res.cgst).toBe(90)
      expect(res.sgst).toBe(90)
      expect(res.igst).toBe(180)
    })

    it('calculates GST inclusive extraction (extracts 18% from 1180)', () => {
      const res = calculateGst({ amount: 1180, gstRate: 18, mode: 'inclusive' })
      expect(res.baseAmount).toBe(1000)
      expect(res.gstAmount).toBe(180)
      expect(res.finalAmount).toBe(1180)
    })
  })

  describe('calculateFd', () => {
    it('calculates FD maturity with quarterly compounding', () => {
      const res = calculateFd({ principal: 100000, annualInterestRate: 7, tenureYears: 1 })
      expect(res.maturityAmount).toBeGreaterThan(107000)
      expect(res.totalInterestEarned).toBeGreaterThan(7000)
    })

    it('gives senior citizen rate bonus', () => {
      const normal = calculateFd({ principal: 100000, annualInterestRate: 7, tenureYears: 1, isSeniorCitizen: false })
      const senior = calculateFd({ principal: 100000, annualInterestRate: 7, tenureYears: 1, isSeniorCitizen: true })
      expect(senior.maturityAmount).toBeGreaterThan(normal.maturityAmount)
      expect(senior.annualInterestRate).toBe(7.5)
    })
  })

  describe('calculateRd', () => {
    it('calculates recurring deposit maturity and interest', () => {
      const res = calculateRd({ monthlyDeposit: 5000, annualInterestRate: 7, tenureMonths: 12 })
      expect(res.totalInvested).toBe(60000)
      expect(res.maturityAmount).toBeGreaterThan(60000)
      expect(res.totalInterest).toBeGreaterThan(0)
    })
  })

  describe('calculateIncomeTax', () => {
    it('applies 87A full rebate for income under 7L in New Regime', () => {
      const res = calculateIncomeTax({
        financialYear: '2024-25',
        regime: 'new',
        grossAnnualIncome: 750000, // standard deduction 75k leaves 6,75,000 net taxable <= 7L
      })
      expect(res.totalTaxPayable).toBe(0)
      expect(res.rebate87A).toBeGreaterThan(0)
    })

    it('calculates tax for higher income in New Regime', () => {
      const res = calculateIncomeTax({
        financialYear: '2024-25',
        regime: 'new',
        grossAnnualIncome: 1500000,
      })
      expect(res.totalTaxPayable).toBeGreaterThan(0)
      expect(res.cess).toBeGreaterThan(0)
      expect(res.standardDeduction).toBe(75000)
    })
  })
})
