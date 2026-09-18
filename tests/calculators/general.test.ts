import { describe, it, expect } from 'vitest'
import {
  calculateAge,
  calculateBmi,
  scientificEval,
  convertUnits,
  calculateDateDiff,
  calculateDateAddSubtract,
  calculateDiscount,
  calculateProfitLoss,
  calculateRatio,
  calculateFraction,
  calculatePercentageChange,
} from '../../lib/calculators/general'

describe('General Calculator Engine', () => {
  describe('calculateAge', () => {
    it('computes exact age and birthday countdown', () => {
      const birth = new Date('2000-01-15T00:00:00Z')
      const target = new Date('2026-09-18T00:00:00Z')
      const res = calculateAge(birth, target)
      expect(res.years).toBe(26)
      expect(res.months).toBe(8)
      expect(res.days).toBe(3)
      expect(res.totalDays).toBeGreaterThan(9000)
      expect(res.daysUntilNextBirthday).toBeGreaterThan(0)
    })

    it('handles birthday today', () => {
      const birth = new Date('2000-09-18T00:00:00Z')
      const target = new Date('2026-09-18T00:00:00Z')
      const res = calculateAge(birth, target)
      expect(res.isBirthdayToday).toBe(true)
      expect(res.years).toBe(26)
    })
  })

  describe('calculateBmi', () => {
    it('calculates metric BMI correctly and categorizes', () => {
      // 70 kg, 175 cm -> BMI = 70 / (1.75 * 1.75) = 22.86 -> Normal weight
      const res = calculateBmi({ weight: 70, height: 175, unitSystem: 'metric' })
      expect(res.bmi).toBe(22.9)
      expect(res.category).toBe('Normal weight')
      expect(res.healthyWeightMin).toBeGreaterThan(50)
    })

    it('identifies overweight and underweight', () => {
      const under = calculateBmi({ weight: 45, height: 175, unitSystem: 'metric' })
      expect(under.category).toBe('Underweight')

      const over = calculateBmi({ weight: 95, height: 175, unitSystem: 'metric' })
      expect(over.category).toContain('Obese')
    })
  })

  describe('scientificEval (Safe Expression Parser)', () => {
    it('evaluates basic arithmetic and order of operations', () => {
      const res = scientificEval('2 + 3 * 4')
      expect(res.success).toBe(true)
      expect(res.result).toBe(14)
    })

    it('evaluates parentheses, powers and roots', () => {
      const res = scientificEval('(2 + 3) ^ 2')
      expect(res.success).toBe(true)
      expect(res.result).toBe(25)

      const sqrt = scientificEval('sqrt(144)')
      expect(sqrt.success).toBe(true)
      expect(sqrt.result).toBe(12)
    })

    it('evaluates trigonometry and constants in deg/rad modes', () => {
      const sin30 = scientificEval('sin(30)', 'deg')
      expect(sin30.success).toBe(true)
      expect(sin30.result).toBeCloseTo(0.5, 4)

      const piRes = scientificEval('pi')
      expect(piRes.success).toBe(true)
      expect(piRes.result).toBeCloseTo(Math.PI, 4)
    })

    it('safely rejects division by zero without crashing or returning infinity', () => {
      const res = scientificEval('10 / 0')
      expect(res.success).toBe(false)
      expect(res.error).toContain('Division by zero')
    })

    it('calculates factorials', () => {
      const res = scientificEval('fact(5)')
      expect(res.success).toBe(true)
      expect(res.result).toBe(120)
    })
  })

  describe('convertUnits', () => {
    it('converts meters to kilometers and feet', () => {
      const km = convertUnits('length', 'm', 'km', 1500)
      expect(km.toValue).toBe(1.5)

      const ft = convertUnits('length', 'm', 'ft', 1)
      expect(ft.toValue).toBeCloseTo(3.28084, 3)
    })

    it('converts temperature Celsius to Fahrenheit', () => {
      const f = convertUnits('temperature', 'c', 'f', 100)
      expect(f.toValue).toBe(212)

      const c = convertUnits('temperature', 'f', 'c', 32)
      expect(c.toValue).toBe(0)
    })
  })

  describe('calculateDateDiff and calculateDateAddSubtract', () => {
    it('computes days and business days difference', () => {
      const res = calculateDateDiff('2026-01-01', '2026-01-15')
      expect(res.totalDays).toBe(14)
      expect(res.totalWeeks).toBe(2)
      expect(res.businessDays).toBe(10)
    })

    it('adds and subtracts days from date', () => {
      const add = calculateDateAddSubtract('2026-01-01', 10, 'add')
      expect(add.resultDate).toBe('2026-01-11')
    })
  })

  describe('calculateDiscount', () => {
    it('calculates discounted price', () => {
      const res = calculateDiscount(2000, 25)
      expect(res.discountAmount).toBe(500)
      expect(res.finalPrice).toBe(1500)
    })
  })

  describe('calculateProfitLoss', () => {
    it('computes profit and loss margins', () => {
      const profit = calculateProfitLoss(100, 130)
      expect(profit.status).toBe('profit')
      expect(profit.amount).toBe(30)
      expect(profit.percentage).toBe(30)

      const loss = calculateProfitLoss(100, 80)
      expect(loss.status).toBe('loss')
      expect(loss.amount).toBe(20)
      expect(loss.percentage).toBe(20)
    })
  })

  describe('calculateRatio', () => {
    it('simplifies ratios using GCD', () => {
      const res = calculateRatio(18, 24)
      expect(res.simplifiedString).toBe('3 : 4')
      expect(res.simplifiedAntecedent).toBe(3)
      expect(res.simplifiedConsequent).toBe(4)
    })
  })

  describe('calculateFraction', () => {
    it('adds and simplifies fractions', () => {
      // 1/3 + 1/6 = 3/6 = 1/2
      const res = calculateFraction('add', 1, 3, 1, 6)
      expect(res.simplifiedNumerator).toBe(1)
      expect(res.simplifiedDenominator).toBe(2)
      expect(res.decimalValue).toBe(0.5)
    })

    it('handles mixed fractions and multiplication', () => {
      // 3/2 * 5/2 = 15/4 = 3 3/4
      const res = calculateFraction('multiply', 3, 2, 5, 2)
      expect(res.simplifiedNumerator).toBe(15)
      expect(res.simplifiedDenominator).toBe(4)
      expect(res.mixedString).toBe('3 3/4')
    })
  })

  describe('calculatePercentageChange', () => {
    it('computes step-by-step percentage change', () => {
      const res = calculatePercentageChange(50, 75)
      expect(res.percentageChange).toBe(50)
      expect(res.status).toBe('increase')
      expect(res.steps.length).toBeGreaterThan(0)
    })
  })
})
