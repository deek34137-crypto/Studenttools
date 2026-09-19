import { describe, it, expect } from 'vitest'
import {
  runQualityGate,
  computeContentHash,
  calculateJaccardSimilarity,
} from '../../lib/quality/validator'
import { ArticleGeneratedData } from '../../lib/gemini/client'

describe('Automated Content Quality Gate & Similarity Engine', () => {
  const validArticle: ArticleGeneratedData = {
    title: 'How to Convert CBSE CGPA to Percentage Accurately',
    slug: 'test-cbse-cgpa-to-percentage-conversion-guide',
    excerpt: 'Step-by-step guide explaining the official CBSE 9.5 multiplier rule for converting cumulative grade point averages into percentages.',
    metaTitle: 'How to Convert CBSE CGPA to Percentage (9.5x Rule Guide) | StudentTools',
    metaDescription: 'Learn how to convert your 10-point CBSE CGPA to equivalent percentage using the standard 9.5 multiplier formula with worked examples and table.',
    primaryKeyword: 'cbse cgpa to percentage',
    secondaryKeywords: ['cgpa converter', '9.5 rule', 'cgpa to marks percentage'],
    category: 'Student',
    topicCluster: 'Grading Systems',
    articleType: 'How-To Guide',
    content: `## Understanding the Official CBSE CGPA Grading System
The Central Board of Secondary Education (CBSE) utilizes a 10-point Cumulative Grade Point Average (CGPA) system to assess students in secondary and higher secondary examinations. Instead of awarding raw percentage marks directly on initial transcripts, students receive grade points ranging from 1 to 10 across their primary subjects. While this grading approach minimizes unwholesome competition and excessive exam stress among learners, high school graduates frequently need to report raw percentage equivalents when submitting applications for admissions, competitive entrance exams, scholarships, or government verification portals.

To facilitate a standardized conversion across all affiliated schools throughout India, CBSE introduced an official mathematical multiplier: the 9.5 factor. Many students wonder why the multiplier is 9.5 rather than a straightforward 10.0. The CBSE curriculum committee analyzed mark distributions over several academic cycles and established that an average grade point band represents the midpoint of a range, making 9.5 the most statistically accurate nationwide approximation of actual scoring performance.

## Step-by-Step Calculation Using the 9.5 Multiplier Formula
Converting your CGPA to an equivalent percentage is straightforward once you know the exact formula endorsed by board authorities:

Percentage (%) = CGPA × 9.5

For example, if a student secures an overall CGPA of 8.8 across five academic subjects, the calculation proceeds as follows:
- Take the total CGPA: 8.8
- Multiply by the standard factor: 8.8 × 9.5
- The resulting equivalent percentage is: 83.6%

If you need to calculate the approximate subject-wise percentage for individual subjects, CBSE applies the identical rule: multiply the individual subject Grade Point (GP) by 9.5. If a candidate achieves a GP of 9 in Mathematics, the approximate percentage in Mathematics is 9 × 9.5 = 85.5%. Always remember that this conversion yields an estimated equivalent rather than an exact recreation of raw marks obtained during physical evaluation.

## Practical Conversion Table and Common Academic Benchmarks
To help students quickly evaluate their academic standing without manual math, here is a breakdown of common CGPA scores converted using the official formula:
- CGPA 10.0: 10.0 × 9.5 = 95.0% (Represents outstanding performance in A1 grade band)
- CGPA 9.6: 9.6 × 9.5 = 91.2% (Qualifies for top college merit lists across Delhi University and state colleges)
- CGPA 9.0: 9.0 × 9.5 = 85.5% (Strong academic performance in first division with distinction)
- CGPA 8.4: 8.4 × 9.5 = 79.8% (Comfortably clears admission eligibility cutoffs for leading undergraduate courses)
- CGPA 7.6: 7.6 × 9.5 = 72.2% (Satisfies technical entrance eligibility criteria across state universities)
- CGPA 6.8: 6.8 × 9.5 = 64.6% (Standard first division qualification)

## Essential Advice for University Applications and Document Verification
When filling out university admission forms or competitive exam registration portals such as JEE Main, NEET, CUET, or state CETs, always consult the specific guidelines published in the respective information bulletin. Most Indian university portals explicitly instruct candidates to state whether their institution follows the CBSE 9.5 conversion rule, a 10x direct multiplier, or an internal university formula like VTU or Mumbai University.

Whenever submitting verified marksheets, write down the official conversion formula on the application form if requested by the scrutiny committee. You can also utilize our free CGPA to Percentage Calculator to verify multi-semester grade conversions and download instant conversion summaries for your documentation records.`,
    faq: [
      {
        question: 'Why does CBSE multiply CGPA by 9.5 instead of 10?',
        answer: 'CBSE analyzed historical score distributions across all subject bands and found that 9.5 represents the statistically verified average marks achieved by students within each grade bracket.',
      },
      {
        question: 'Can I use the 9.5 rule for college semester conversions?',
        answer: 'No, collegiate universities such as VTU, Mumbai University, or autonomous colleges have their own verified conversion formulas. Always check your university regulations.',
      },
    ],
    relatedTools: [
      {
        name: 'CGPA to Percentage Calculator',
        route: '/student/cgpa-to-percentage',
        description: 'Convert college and CBSE CGPA to percentage using standard conversion rules.',
      },
    ],
  }

  it('should pass a structurally sound, non-plagiarized educational article', async () => {
    const result = await runQualityGate(validArticle)
    expect(result.passed).toBe(true)
    expect(result.status).toBe('PUBLISHED')
    expect(result.errors).toHaveLength(0)
    expect(result.contentHash).toBeDefined()
  })

  it('should reject content containing banned AI language patterns', async () => {
    const aiPolluted: ArticleGeneratedData = {
      ...validArticle,
      title: 'AI Perspective on Scoring',
      content: validArticle.content + '\n\nAs an AI language model, I cannot guarantee official NTA marks.',
    }

    const result = await runQualityGate(aiPolluted)
    expect(result.passed).toBe(false)
    expect(result.errors.some((e) => e.includes('prohibited AI'))).toBe(true)
  })

  it('should reject content containing placeholder or TODO text', async () => {
    const withTodo: ArticleGeneratedData = {
      ...validArticle,
      content: validArticle.content + '\n\n[insert link here to NTA website] and TODO: update for 2027.',
    }

    const result = await runQualityGate(withTodo)
    expect(result.passed).toBe(false)
    expect(result.errors.some((e) => e.includes('prohibited AI or placeholder'))).toBe(true)
  })

  it('should reject articles with fewer than 3 H2 headings', async () => {
    const flatArticle: ArticleGeneratedData = {
      ...validArticle,
      content: 'Just one big block of text without any sections or structure. '.repeat(50),
    }

    const result = await runQualityGate(flatArticle)
    expect(result.passed).toBe(false)
    expect(result.errors.some((e) => e.includes('at least 3 major sections'))).toBe(true)
  })

  it('should reject articles with non-existent calculator routes', async () => {
    const brokenRouteArticle: ArticleGeneratedData = {
      ...validArticle,
      relatedTools: [{ name: 'Fake Tool', route: '/nonexistent/fake-tool' }],
    }

    const result = await runQualityGate(brokenRouteArticle)
    expect(result.passed).toBe(false)
    expect(result.errors.some((e) => e.includes('does not exist'))).toBe(true)
  })

  it('should generate deterministic SHA-256 content hashes', () => {
    const hash1 = computeContentHash('Sample Title', 'Sample Content Body')
    const hash2 = computeContentHash('Sample Title', 'Sample Content Body')
    const hash3 = computeContentHash('Different Title', 'Sample Content Body')

    expect(hash1).toBe(hash2)
    expect(hash1).not.toBe(hash3)
  })

  it('should calculate accurate Jaccard similarity between texts', () => {
    const textA = 'how to calculate percentage from marks cbse class 10'
    const textB = 'how to calculate percentage from marks cbse class 10'
    const textC = 'what is the capital of france in geography'

    const simIdentical = calculateJaccardSimilarity(textA, textB, 2)
    const simDifferent = calculateJaccardSimilarity(textA, textC, 2)

    expect(simIdentical).toBe(1.0)
    expect(simDifferent).toBe(0.0)
  })
})
