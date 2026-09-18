import { describe, it, expect } from 'vitest'
import {
  calculateJeeMarks,
  estimateJeePercentile,
  estimateJeeRank,
  getJeeCountdown,
  predictColleges,
  queryCutoffs,
} from '../../lib/calculators/jee'

describe('JEE Calculator Engine', () => {
  describe('calculateJeeMarks', () => {
    it('calculates standard marks correctly (+4 / -1)', () => {
      const res = calculateJeeMarks({ correct: 50, incorrect: 10, unattempted: 15 })
      // 50 * 4 = 200; 10 * -1 = -10; total = 190
      expect(res.totalMarks).toBe(190)
      expect(res.attempted).toBe(60)
      expect(res.accuracyPercentage).toBeCloseTo(83.33, 1)
      expect(res.percentage).toBeCloseTo(63.33, 1)
    })

    it('handles perfect score (75 correct, 0 incorrect)', () => {
      const res = calculateJeeMarks({ correct: 75, incorrect: 0, unattempted: 0 })
      expect(res.totalMarks).toBe(300)
      expect(res.accuracyPercentage).toBe(100)
      expect(res.percentage).toBe(100)
    })

    it('handles negative score safely', () => {
      const res = calculateJeeMarks({ correct: 0, incorrect: 75, unattempted: 0 })
      expect(res.totalMarks).toBe(-75)
      expect(res.accuracyPercentage).toBe(0)
    })

    it('computes subject breakdown when provided', () => {
      const res = calculateJeeMarks({
        correct: 0,
        incorrect: 0,
        subjects: {
          physics: { correct: 20, incorrect: 5 },
          chemistry: { correct: 18, incorrect: 2 },
          mathematics: { correct: 15, incorrect: 5 },
        },
      })
      expect(res.subjects?.length).toBe(3)
      // Physics: 20*4 - 5*1 = 75
      expect(res.subjects?.[0].marks).toBe(75)
      // Total: 75 + (18*4 - 2) + (15*4 - 5) = 75 + 70 + 55 = 200
      expect(res.totalMarks).toBe(200)
      expect(res.attempted).toBe(65)
    })
  })

  describe('estimateJeePercentile', () => {
    it('returns realistic high percentile for top marks', () => {
      const res = estimateJeePercentile(280)
      expect(res.estimatedPercentile).toBeGreaterThan(99.9)
      expect(res.lowerPercentile).toBeLessThanOrEqual(res.estimatedPercentile)
      expect(res.upperPercentile).toBeGreaterThanOrEqual(res.estimatedPercentile)
      expect(res.disclaimer).toBeTruthy()
    })

    it('handles negative marks and zero marks within bounds', () => {
      const zero = estimateJeePercentile(0)
      expect(zero.estimatedPercentile).toBeGreaterThan(0)
      expect(zero.estimatedPercentile).toBeLessThan(50)

      const negative = estimateJeePercentile(-50)
      expect(negative.estimatedPercentile).toBeGreaterThanOrEqual(0)
    })

    it('adjusts for difficulty shift', () => {
      const moderate = estimateJeePercentile(150, 'moderate')
      const tough = estimateJeePercentile(150, 'tough')
      const easy = estimateJeePercentile(150, 'easy')

      // In a tough shift, same marks yield a higher percentile
      expect(tough.estimatedPercentile).toBeGreaterThan(moderate.estimatedPercentile)
      // In an easy shift, same marks yield a lower percentile
      expect(easy.estimatedPercentile).toBeLessThan(moderate.estimatedPercentile)
    })
  })

  describe('estimateJeeRank', () => {
    it('computes CRL rank for 99 percentile correctly', () => {
      const res = estimateJeeRank(99, 1400000)
      // ((100 - 99) / 100) * 1400000 + 1 = 14001
      expect(res.estimatedCrlRank).toBe(14001)
      expect(res.rankRange.min).toBeLessThan(14001)
      expect(res.rankRange.max).toBeGreaterThan(14001)
    })

    it('computes category ranks for reserved categories', () => {
      const res = estimateJeeRank(98, 1400000, 'OBC-NCL')
      expect(res.estimatedCategoryRank).toBeDefined()
      expect(res.estimatedCategoryRank).toBeLessThan(res.estimatedCrlRank)
    })
  })

  describe('getJeeCountdown', () => {
    it('computes countdown without crashing', () => {
      const res = getJeeCountdown(0, new Date('2026-10-01T00:00:00Z'))
      expect(res.days).toBeGreaterThan(0)
      expect(res.formattedTime).toContain('d')
      expect(res.hasPassed).toBe(false)
    })

    it('handles past target date gracefully', () => {
      const res = getJeeCountdown(0, new Date('2028-01-01T00:00:00Z'))
      expect(res.hasPassed).toBe(true)
      expect(res.days).toBe(0)
    })
  })

  describe('predictColleges and queryCutoffs', () => {
    it('finds eligible colleges for a rank of 3000', () => {
      const res = predictColleges({ rank: 3000, category: 'OPEN', quota: 'OS' })
      expect(res.length).toBeGreaterThan(0)
      expect(['High', 'Moderate', 'Borderline', 'Low']).toContain(res[0].chance)
    })

    it('filters cutoffs by institute type and branch', () => {
      const cutoffs = queryCutoffs({ instituteType: 'NIT', branch: 'Computer' })
      expect(cutoffs.length).toBeGreaterThan(0)
      cutoffs.forEach((c) => {
        expect(c.instituteType).toBe('NIT')
        expect(c.branch.toLowerCase()).toContain('computer')
      })
    })
  })
})
