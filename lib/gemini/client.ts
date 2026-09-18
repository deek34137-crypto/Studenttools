// lib/gemini/client.ts
import { GoogleGenerativeAI } from '@google/generative-ai'
import { z } from 'zod'
import { TopicRow } from '../db/types'
import { getToolByRoute } from '../../data/tools'
import { getToolContent } from '../../data/toolContent'

export const ArticleGenerationSchema = z.object({
  title: z.string().min(20).max(120),
  slug: z.string().min(5).max(120).regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric with hyphens'),
  excerpt: z.string().min(60).max(300),
  metaTitle: z.string().min(25).max(75),
  metaDescription: z.string().min(100).max(175),
  primaryKeyword: z.string().min(2),
  secondaryKeywords: z.array(z.string()).min(1),
  category: z.string(),
  topicCluster: z.string(),
  articleType: z.string(),
  content: z.string().min(400), // Markdown content
  faq: z.array(
    z.object({
      question: z.string().min(10),
      answer: z.string().min(20),
    })
  ).min(2),
  relatedTools: z.array(
    z.object({
      name: z.string(),
      route: z.string(),
      description: z.string().optional(),
    })
  ).min(1),
  relatedArticles: z.array(
    z.object({
      title: z.string(),
      slug: z.string(),
      excerpt: z.string().optional(),
    })
  ).optional(),
  factualClaims: z.array(z.string()).optional(),
  verificationNotes: z.string().optional(),
})

export type ArticleGeneratedData = z.infer<typeof ArticleGenerationSchema>

export async function generateArticleWithGemini(
  topic: TopicRow
): Promise<{ success: true; data: ArticleGeneratedData } | { success: false; error: string; rawResponse?: string }> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    return { success: false, error: 'GEMINI_API_KEY is not configured in environment variables.' }
  }

  const modelName = process.env.GEMINI_MODEL || 'gemini-3.7-flash'

  // Retrieve relevant calculator metadata if available
  const tool = topic.related_tool_slug ? getToolByRoute(topic.related_tool_slug) : undefined
  const toolContent = tool ? getToolContent(tool.id) : undefined

  let toolContextInfo = ''
  if (tool && toolContent) {
    toolContextInfo = `
TARGET CALCULATOR ON STUDENTTOOLS:
- Tool Name: "${tool.title}"
- Canonical Route: "${tool.route}"
- Description: "${tool.description}"
- Formula: "${toolContent.formulaCode || 'Standard formula'}"
- Formula Explanation: "${toolContent.formulaDescription}"
- Sample Worked Example: ${JSON.stringify(toolContent.example)}
- Stated Assumptions: ${JSON.stringify(toolContent.assumptions)}
- Official Disclaimer: "${toolContent.disclaimer}"
`
  }

  const systemInstruction = `You are an expert educational and technical writer for StudentTools.cyou (an Indian student, exam, career, and financial calculator platform).
Your mission is to produce an in-depth, genuinely helpful, search-intent-focused educational article explaining the specified topic clearly.

STRICT EDITORIAL RULES:
1. NO AI FILLER: Never output generic fluff, fake summaries, repetitive conclusions, or robotic transitions.
2. ABSOLUTELY NO SYSTEM LEAKAGE: Never use phrases such as "As an AI...", "As a language model...", "In this article, we will...", or placeholders like "[insert link here]" or "TODO".
3. NO FABRICATIONS: Never invent fake quotes, fake professors, fake NTA announcements, or fake tax rules. Use factual, established formulas and explain assumptions clearly.
4. CALCULATOR CONNECTION: The article must prominently explain the mathematical or procedural logic behind the related StudentTools calculator (${topic.related_tool || 'calculator'}), including step-by-step calculations and realistic numbers.
5. NATURAL HEADINGS: Structure with natural Markdown headings (## and ###). Do NOT force every article into an identical template. Adapt to the topic type (${topic.article_type}).
6. TIME SENSITIVITY: Distinguish between evergreen formulas (like percentage or EMI) and time-sensitive regulations (JEE 2026/2027, FY 2024-25/2025-26 New Tax Regime).
7. INDIAN CONTEXT: Use Indian standards where relevant (LPA, Rupees ₹, Lakhs/Crores, CBSE 9.5x rule, NTA normalization, JoSAA rounds, EPFO rates).
8. STRICT JSON FORMAT: You MUST return a single valid JSON object strictly matching the requested schema. Do not enclose in markdown ticks unless requested.
`

  const prompt = `Generate a complete, high-quality educational article based on the following topic specification:

TOPIC SPECIFICATION:
- Topic Title: "${topic.topic}"
- Category: "${topic.category}"
- Topic Cluster: "${topic.topic_cluster}"
- Article Type: "${topic.article_type}"
- Search Intent: "${topic.search_intent}"
- Primary Keyword: "${topic.primary_keyword}"
- Secondary Keywords: "${topic.secondary_keywords}"
- Content Angle: "${topic.content_angle}"
- Evergreen Status: "${topic.evergreen}"
${toolContextInfo}

OUTPUT JSON SCHEMA:
{
  "title": "Natural, compelling H1 title matching search intent (20-100 characters)",
  "slug": "clean-lowercase-hyphenated-slug-derived-from-title",
  "excerpt": "Compelling 2-sentence summary answering the core question directly (100-250 characters)",
  "metaTitle": "SEO title under 65 chars including primary keyword | StudentTools",
  "metaDescription": "Concise meta description under 160 chars with primary keyword and CTA",
  "primaryKeyword": "${topic.primary_keyword}",
  "secondaryKeywords": ["keyword1", "keyword2"],
  "category": "${topic.category}",
  "topicCluster": "${topic.topic_cluster}",
  "articleType": "${topic.article_type}",
  "content": "Full comprehensive Markdown body with ## and ### headings, clear explanations, formula breakdowns, worked numerical examples, and actionable advice.",
  "faq": [
    { "question": "Relevant question 1?", "answer": "Direct, informative answer." },
    { "question": "Relevant question 2?", "answer": "Direct, informative answer." },
    { "question": "Relevant question 3?", "answer": "Direct, informative answer." }
  ],
  "relatedTools": [
    { "name": "${topic.related_tool || 'Calculator'}", "route": "${topic.related_tool_slug || '/calculators'}", "description": "Quick calculator description" }
  ],
  "factualClaims": ["Key factual claim 1 verified", "Key factual claim 2"],
  "verificationNotes": "Editorial notes explaining source assumptions or standard regulations used."
}

Return ONLY the valid JSON object.
`

  try {
    const candidateModels = [
      process.env.GEMINI_MODEL || 'gemini-flash-latest',
      'gemini-flash-latest',
      'gemini-3.6-flash',
      'gemini-3.7-flash',
    ]

  let lastError: any = null
  let rawText = ''

  for (const modelCandidate of candidateModels) {
    try {
      const genAI = new GoogleGenerativeAI(apiKey)
      const model = genAI.getGenerativeModel({
        model: modelCandidate,
        generationConfig: {
          responseMimeType: 'application/json',
          temperature: 0.3,
        },
        systemInstruction,
      })

      const response = await model.generateContent(prompt)
      rawText = response.response.text()
      if (rawText) {
        lastError = null
        break
      }
    } catch (err: any) {
      lastError = err
      console.warn(`Model ${modelCandidate} failed with: ${err.message}. Trying fallback if available...`)
    }
  }

  if (lastError || !rawText) {
    return {
      success: false,
      error: `Gemini API execution error: ${lastError?.message || 'No response from model'}`,
    }
  }

    // Clean JSON text if wrapped in markdown blocks
    let cleaned = rawText.trim()
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.replace(/^```json\s*/, '').replace(/\s*```$/, '')
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*/, '').replace(/\s*```$/, '')
    }

    let parsedJson: unknown
    try {
      parsedJson = JSON.parse(cleaned)
    } catch (parseErr: any) {
      return {
        success: false,
        error: `JSON parse error: ${parseErr.message}`,
        rawResponse: rawText.slice(0, 500),
      }
    }

    const zodResult = ArticleGenerationSchema.safeParse(parsedJson)
    if (!zodResult.success) {
      return {
        success: false,
        error: `Zod validation error: ${zodResult.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', ')}`,
        rawResponse: cleaned.slice(0, 500),
      }
    }

    return { success: true, data: zodResult.data }
  } catch (err: any) {
    return {
      success: false,
      error: `Gemini API execution error: ${err.message || String(err)}`,
    }
  }
}
