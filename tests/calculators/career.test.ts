import { describe, it, expect } from 'vitest'
import {
  ctcToInHand,
  monthlyToAnnualSalary,
  annualToMonthlySalary,
  calculateSalaryHike,
  calculateIncrement,
  calculatePf,
  calculateBonus,
  calculateInternshipStipend,
} from '../../lib/calculators/career'

describe('Career Calculator Engine', () => {
  describe('ctcToInHand', () => {
    it('breaks down CTC into monthly in-hand realistically', () => {
      const res = ctcToInHand({
        annualCtc: 600000,
        basicPercentage: 40,
        hraPercentageOfBasic: 50,
      })
      // Basic = 240,000 (20k/mo)
      expect(res.basicAnnual).toBe(240000)
      expect(res.basicMonthly).toBe(20000)
      // Employee PF = 12% of 20k = 2400/mo
      expect(res.employeePfMonthly).toBe(2400)
      expect(res.estimatedInHandMonthly).toBeGreaterThan(0)
      expect(res.estimatedInHandMonthly).toBeLessThan(res.grossSalaryMonthly)
    })

    it('handles zero CTC gracefully without NaN', () => {
      const res = ctcToInHand({ annualCtc: 0 })
      expect(res.estimatedInHandMonthly).toBe(0)
      expect(res.grossSalaryMonthly).toBe(0)
      expect(isNaN(res.estimatedInHandMonthly)).toBe(false)
    })
  })

  describe('Salary Converters', () => {
    it('converts monthly to annual and vice versa accurately', () => {
      const m2a = monthlyToAnnualSalary(50000)
      expect(m2a.annualSalary).toBe(600000)
      expect(m2a.quarterlySalary).toBe(150000)

      const a2m = annualToMonthlySalary(1200000)
      expect(a2m.monthlySalary).toBe(100000)
    })

    it('calculates salary hike', () => {
      const res = calculateSalaryHike(1000000, 20)
      expect(res.newSalaryAnnual).toBe(1200000)
      expect(res.incrementAmountAnnual).toBe(200000)
      expect(res.incrementAmountMonthly).toBe(Math.round(200000 / 12))
    })

    it('calculates increment between old and new CTC', () => {
      const res = calculateIncrement(800000, 1000000)
      expect(res.percentageHike).toBe(25)
      expect(res.isHike).toBe(true)
    })
  })

  describe('calculatePf', () => {
    it('calculates employee and employer contributions accurately', () => {
      const res = calculatePf({ monthlyBasic: 30000, tenureYears: 1 })
      // Employee: 12% of 30,000 = 3600
      expect(res.employeeContributionMonthly).toBe(3600)
      expect(res.totalMonthlyPfDeposit).toBeGreaterThan(3600)
      expect(res.projectedAccumulation).toBeGreaterThan(res.annualTotalDeposit)
    })
  })

  describe('calculateBonus', () => {
    it('calculates percentage bonus with TDS deduction', () => {
      const res = calculateBonus(50000, 'percentage', 20, 10)
      // 20% of 50k = 10,000 gross. TDS 10% = 1000. Net = 9000
      expect(res.grossBonus).toBe(10000)
      expect(res.netBonus).toBe(9000)
    })
  })

  describe('calculateInternshipStipend', () => {
    it('computes total stipend for monthly rate', () => {
      const res = calculateInternshipStipend({ rate: 25000, rateType: 'monthly', durationMonths: 6 })
      expect(res.totalExpectedStipend).toBe(150000)
      expect(res.averageMonthlyStipend).toBe(25000)
    })

    it('computes total stipend for hourly rate', () => {
      const res = calculateInternshipStipend({
        rate: 500,
        rateType: 'hourly',
        durationMonths: 1,
        hoursPerWeek: 40,
      })
      expect(res.totalExpectedStipend).toBeGreaterThan(0)
    })
  })
})
