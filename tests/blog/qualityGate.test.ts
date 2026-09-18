import { describe, it, expect } from 'vitest'
import {
  runQualityGate,
  computeContentHash,
  calculateJaccardSimilarity,
} from '../../lib/quality/validator'
import { ArticleGeneratedData } from '../../lib/gemini/client'

describe('Automated Content Quality Gate & Similarity Engine', () => {
  const validArticle: ArticleGeneratedData = {
    title: 'How JEE Main Negative Marking Affects Total Score',
    slug: 'how-jee-main-negative-marking-affects-score',
    excerpt: 'Detailed breakdown of how the +4 and -1 marking scheme impacts your overall score and percentile in JEE Main with numerical comparisons.',
    metaTitle: 'JEE Main Negative Marking Impact & Scoring Rules | StudentTools',
    metaDescription: 'Understand how negative marking works in JEE Main Paper 1 with +4 for correct and -1 for wrong answers. Try our free marks calculator.',
    primaryKeyword: 'jee main negative marking',
    secondaryKeywords: ['jee marks', 'scoring rules', 'negative marking impact'],
    category: 'JEE',
    topicCluster: 'Marks & Scoring',
    articleType: 'Explanation',
    content: `## Understanding the Marking Scheme in JEE Main
In the JEE Main examination conducted by the National Testing Agency (NTA), scoring follows a standard +4 and -1 pattern. For each question answered correctly, candidates are awarded four marks, whereas an incorrect attempt attracts a deduction of one mark. This marking scheme applies to both multiple-choice questions (Section A) and numerical value questions (Section B). Unattempted questions carry zero penalty and do not influence your score directly.

Understanding the mathematical expectation behind this scheme is essential for competitive exam aspirants across India. When you attempt a question with complete certainty, the expected value is +4 marks. However, when blind guessing among four options, your probability of picking the correct answer is 25%, and picking an incorrect answer is 75%. The mathematical expected value of a random guess is (0.25 * 4) + (0.75 * -1) = 1.0 - 0.75 = +0.25 marks. While this seems slightly positive theoretically, the high variance in small sample sizes frequently results in severe negative score swings.

## Why Negative Marking Creates Non-Linear Risk
Consider attempting ten questions where you guess without certainty. If two are correct and eight are wrong, your gross score is eight marks, but the penalty deductions amount to eight marks, yielding a net score of zero. Even worse, if you get one correct and nine incorrect, your net score drops to -5 marks from those ten questions.

In competitive examinations like JEE Main, where a difference of a single mark can shift your All India Common Rank List (CRL) standing by several hundred or thousand ranks, unforced negative marks are catastrophic. Aspirants often believe that attempting more questions automatically improves their percentile. In reality, aggressive low-accuracy guessing degrades both your raw score and your shift-normalized percentile standing.

## Practical Scoring Examples and Analysis
Let us examine a candidate attempting 65 questions out of 75 in Paper 1 under different accuracy conditions:
- High accuracy scenario: 58 correct and 7 incorrect yields (58 * 4) - (7 * 1) = 232 - 7 = 225 marks. In most moderate shifts, a raw score of 225 easily secures a 99.4+ percentile and guarantees admission to premier NITs in computer science or electrical branches.
- Moderate accuracy scenario: 50 correct and 15 incorrect yields (50 * 4) - (15 * 1) = 200 - 15 = 185 marks. This yields roughly a 98.8 to 99.1 percentile.
- Low accuracy scenario: 40 correct and 25 incorrect yields (40 * 4) - (25 * 1) = 160 - 25 = 135 marks. Here, 25 negative marks cost the student over 50,000 ranks in the All India merit list.

## Tactical Guidelines for Exam Day
To optimize your score with the JEE Marks Calculator, follow a disciplined two-pass test-taking strategy:
First, solve questions you are 100% confident in during the first 90 minutes. Second, revisit marked questions where you can definitively eliminate at least two incorrect options through dimensional analysis or boundary conditions. Never guess purely at random on numerical value questions where no options exist to eliminate. Focus on question selection and maintain strict emotional discipline throughout the three-hour testing window.`,
    faq: [
      {
        question: 'Is there negative marking in numerical questions?',
        answer: 'Yes, NTA applies negative marking of minus one mark to both Section A and Section B questions.',
      },
      {
        question: 'How many marks are deducted for unattempted questions?',
        answer: 'Zero marks are deducted for unattempted questions in JEE Main.',
      },
    ],
    relatedTools: [
      {
        name: 'JEE Marks Calculator',
        route: '/jee/marks-calculator',
        description: 'Calculate your exact JEE Main score with negative marking.',
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
