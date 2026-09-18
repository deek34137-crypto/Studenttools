import { describe, it, expect } from 'vitest'
import {
  cgpaToPercentage,
  calculatePercentage,
  calculateMarksPercentage,
  calculateGpa,
  calculateAttendance,
  calculateRequiredMarks,
  calculateAverageMarks,
  calculateStudyHours,
} from '../../lib/calculators/student'

describe('Student Calculator Engine', () => {
  describe('cgpaToPercentage', () => {
    it('applies CBSE 9.5x formula correctly', () => {
      const res = cgpaToPercentage(8.4, 'cbse')
      // 8.4 * 9.5 = 79.8
      expect(res.percentage).toBe(79.8)
    })

    it('applies 10x formula correctly', () => {
      const res = cgpaToPercentage(9.2, 'ten_factor')
      expect(res.percentage).toBe(92)
    })

    it('applies VTU formula correctly', () => {
      const res = cgpaToPercentage(8.0, 'vtu')
      // (8.0 - 0.75) * 10 = 72.5
      expect(res.percentage).toBe(72.5)
    })

    it('bounds CGPA to 0-100% range and handles edge cases', () => {
      const zero = cgpaToPercentage(0)
      expect(zero.percentage).toBe(0)
      const ten = cgpaToPercentage(10)
      expect(ten.percentage).toBe(95)
    })
  })

  describe('calculatePercentage', () => {
    it('calculates X of Y', () => {
      const res = calculatePercentage('x_of_y', 450, 500)
      expect(res.value).toBe(90)
    })

    it('handles division by zero in X of Y', () => {
      const res = calculatePercentage('x_of_y', 50, 0)
      expect(res.value).toBe(0)
      expect(res.explanation).toContain('zero')
    })

    it('calculates percentage increase', () => {
      const res = calculatePercentage('increase', 200, 250)
      expect(res.value).toBe(25)
    })

    it('calculates percentage decrease', () => {
      const res = calculatePercentage('decrease', 250, 200)
      expect(res.value).toBe(20)
    })
  })

  describe('calculateMarksPercentage', () => {
    it('aggregates multiple subjects accurately', () => {
      const subjects = [
        { name: 'Physics', obtained: 85, maxMarks: 100 },
        { name: 'Chemistry', obtained: 90, maxMarks: 100 },
        { name: 'Maths', obtained: 95, maxMarks: 100 },
      ]
      const res = calculateMarksPercentage(subjects)
      expect(res.totalObtained).toBe(270)
      expect(res.totalMax).toBe(300)
      expect(res.percentage).toBe(90)
      expect(res.average).toBe(90)
      expect(res.isValid).toBe(true)
    })

    it('handles empty subject lists safely', () => {
      const res = calculateMarksPercentage([])
      expect(res.isValid).toBe(false)
    })
  })

  describe('calculateGpa', () => {
    it('calculates weighted GPA correctly', () => {
      const courses = [
        { name: 'CS101', credits: 4, gradePoints: 9 }, // 36
        { name: 'MA101', credits: 3, gradePoints: 8 }, // 24
        { name: 'PH101', credits: 3, gradePoints: 10 }, // 30
      ]
      // total QP = 90, total credits = 10 -> GPA = 9.0
      const res = calculateGpa(courses)
      expect(res.gpa).toBe(9)
      expect(res.totalCredits).toBe(10)
    })
  })

  describe('calculateAttendance', () => {
    it('identifies classes needed when below target', () => {
      // 30 attended out of 50 = 60%. Target = 75%.
      // Needed = ceil((75 * 50 - 100 * 30) / (100 - 75)) = ceil((3750 - 3000)/25) = ceil(750/25) = 30 classes
      const res = calculateAttendance(30, 50, 75)
      expect(res.status).toBe('below_target')
      expect(res.classesNeeded).toBe(30)
      expect(res.bunkableClasses).toBe(0)
    })

    it('identifies bunkable classes when above target', () => {
      // 45 attended out of 50 = 90%. Target = 75%.
      // Bunkable = floor((100 * 45 - 75 * 50) / 75) = floor((4500 - 3750) / 75) = floor(750 / 75) = 10 classes
      const res = calculateAttendance(45, 50, 75)
      expect(res.status).toBe('above_target')
      expect(res.bunkableClasses).toBe(10)
      expect(res.classesNeeded).toBe(0)
    })

    it('handles zero conducted classes safely', () => {
      const res = calculateAttendance(0, 0, 75)
      expect(res.currentPercentage).toBe(0)
      expect(res.classesNeeded).toBe(0)
    })
  })

  describe('calculateRequiredMarks', () => {
    it('determines remaining marks needed for target', () => {
      // Current: 60/100. Remaining max: 100. Overall: 200. Target: 75% -> 150 marks total.
      // Needed: 150 - 60 = 90 marks out of 100 (90%)
      const res = calculateRequiredMarks(60, 100, 100, 75)
      expect(res.isAchievable).toBe(true)
      expect(res.requiredMarks).toBe(90)
    })

    it('flags unachievable targets gracefully', () => {
      // Current: 20/100. Remaining max: 100. Overall: 200. Target: 90% -> 180 marks total.
      // Needed: 180 - 20 = 160 marks (impossible out of 100)
      const res = calculateRequiredMarks(20, 100, 100, 90)
      expect(res.isAchievable).toBe(false)
      expect(res.requiredMarks).toBe(160)
    })
  })

  describe('calculateAverageMarks', () => {
    it('computes simple and weighted averages', () => {
      const simple = calculateAverageMarks([{ marks: 80 }, { marks: 90 }, { marks: 100 }])
      expect(simple.average).toBe(90)
      expect(simple.isWeighted).toBe(false)

      const weighted = calculateAverageMarks([
        { marks: 80, weight: 1 },
        { marks: 100, weight: 3 },
      ])
      // (80*1 + 100*3) / 4 = 380 / 4 = 95
      expect(weighted.average).toBe(95)
      expect(weighted.isWeighted).toBe(true)
    })
  })

  describe('calculateStudyHours', () => {
    it('allocates study hours proportionally by priority', () => {
      const examDate = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000) // 10 days away
      const res = calculateStudyHours(examDate, 5, [
        { name: 'Maths', priority: 'High' },
        { name: 'English', priority: 'Low' },
      ])
      expect(res.totalStudyHours).toBeGreaterThan(0)
      expect(res.subjects.length).toBe(2)
      // High priority subject gets more hours than Low priority
      expect(res.subjects[0].allocatedHours).toBeGreaterThan(res.subjects[1].allocatedHours)
    })
  })
})
