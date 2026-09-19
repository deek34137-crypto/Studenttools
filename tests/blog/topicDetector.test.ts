// tests/blog/topicDetector.test.ts
import { describe, it, expect } from 'vitest'
import { detectDuplicates, computeContentHash, calculateJaccardSimilarity } from '../../lib/quality/topicDetector'

describe('Topic & Plagiarism Duplication Detector', () => {
  it('should detect an exact slug collision with an already published article', async () => {
    const result = await detectDuplicates({
      title: 'A Random Title About Negative Marking',
      slug: 'how-jee-main-negative-marking-affects-score',
      primaryKeyword: 'jee negative marks',
    })

    expect(result.isDuplicate).toBe(true)
    expect(result.checks.slugCollision).toBe(true)
    expect(result.reason).toContain('already published')
  })

  it('should flag high title similarity with an existing published article', async () => {
    const result = await detectDuplicates({
      title: 'How JEE Main Negative Marking Affects Total Score',
      slug: 'how-jee-main-negative-marking-affects-total-score-2026',
      primaryKeyword: 'jee main negative marking',
    })

    expect(result.isDuplicate).toBe(true)
    expect(result.similarityScore).toBeGreaterThanOrEqual(0.70)
  })

  it('should pass a fresh, unique topic from the queue', async () => {
    // Use a completely unpublished topic unrelated to any existing articles
    const result = await detectDuplicates({
      title: 'How to Convert CGPA to Percentage in Anna University Grading System',
      slug: 'cgpa-to-percentage-anna-university-grading-system',
      primaryKeyword: 'anna university cgpa to percentage conversion',
      content: `## Anna University CGPA Scale\nAnna University uses a 10-point grading scale for undergraduate engineering programmes.\n\n## Conversion Formula\nMultiply CGPA by 10 to obtain the approximate percentage equivalent.`,
    })

    expect(result.isDuplicate).toBe(false)
    expect(result.similarityScore).toBeLessThan(0.70)
  })

  it('should detect duplicate paragraphs inside the content', async () => {
    const repeatedPara = 'In competitive examinations like JEE Main, candidates must pay close attention to the scoring guidelines and negative marks deduction rules for every single question.'
    const content = `## Section One\n${repeatedPara}\n\n## Section Two\n${repeatedPara}`

    const result = await detectDuplicates({
      title: 'Unique Guide to Shift Normalization',
      slug: 'unique-guide-to-shift-normalization',
      primaryKeyword: 'shift normalization guide',
      content,
    })

    expect(result.isDuplicate).toBe(true)
    expect(result.checks.duplicateParagraph).toBe(true)
  })

  it('should calculate accurate Jaccard token similarity', () => {
    const str1 = 'jee main negative marking affects score'
    const str2 = 'jee main negative marking affects score'
    const str3 = 'completely unrelated topic about biology'

    expect(calculateJaccardSimilarity(str1, str2)).toBe(1.0)
    expect(calculateJaccardSimilarity(str1, str3)).toBe(0.0)
  })

  it('should generate deterministic sha256 hashes', () => {
    const h1 = computeContentHash('Sample Title', 'Sample Content Body')
    const h2 = computeContentHash('Sample Title', 'Sample Content Body')
    expect(h1).toBe(h2)
  })
})
