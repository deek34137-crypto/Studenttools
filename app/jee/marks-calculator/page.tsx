import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { JeeMarksCalc } from '@/components/calculators/JeeMarksCalc'

const ROUTE = '/jee/marks-calculator'
const TOOL_ID = 'jee-marks-calculator'

export const metadata: Metadata = {
  title: "JEE Main Marks Calculator 2025-26 (Subject-Wise & Negative Marking) | StudentTools",
  description: "Calculate your JEE Main 2025-26 raw score with +4 for correct, -1 for incorrect answers. Review subject-wise performance and accuracy instantly.",
  alternates: {
    canonical: 'https://studenttools.cyou/jee/marks-calculator',
  },
  openGraph: {
    title: "JEE Main Marks Calculator 2025-26 (Subject-Wise & Negative Marking) | StudentTools",
    description: "Calculate your JEE Main 2025-26 raw score with +4 for correct, -1 for incorrect answers. Review subject-wise performance and accuracy instantly.",
    url: 'https://studenttools.cyou/jee/marks-calculator',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function JeeMarksCalculatorPage() {
  const tool = getToolByRoute(ROUTE)
  const content = getToolContent(TOOL_ID)

  if (!tool || !content) {
    notFound()
  }

  return (
    <CalculatorLayout
      tool={tool}
      breadcrumbItems={[
        { label: 'JEE & Exams', href: '/jee' },
        { label: tool.title },
      ]}
      formulaTitle={content.formulaTitle}
      formulaDescription={content.formulaDescription}
      formulaCode={content.formulaCode}
      calculationSteps={content.calculationSteps}
      example={content.example}
      assumptions={content.assumptions}
      disclaimer={content.disclaimer}
      faqs={content.faqs}
    >
      <JeeMarksCalc />
    </CalculatorLayout>
  )
}
