import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { AverageMarksCalc } from '@/components/calculators/AverageMarksCalc'

const ROUTE = '/student/average-marks'
const TOOL_ID = 'student-average-marks'

export const metadata: Metadata = {
  title: "Average Marks Calculator (Simple & Weighted Mean Score) | StudentTools",
  description: "Easily calculate simple and weighted average marks across subjects, quizzes, and test evaluations with clear steps.",
  alternates: {
    canonical: 'https://studenttools.cyou/student/average-marks',
  },
  openGraph: {
    title: "Average Marks Calculator (Simple & Weighted Mean Score) | StudentTools",
    description: "Easily calculate simple and weighted average marks across subjects, quizzes, and test evaluations with clear steps.",
    url: 'https://studenttools.cyou/student/average-marks',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function StudentAverageMarksPage() {
  const tool = getToolByRoute(ROUTE)
  const content = getToolContent(TOOL_ID)

  if (!tool || !content) {
    notFound()
  }

  return (
    <CalculatorLayout
      tool={tool}
      breadcrumbItems={[
        { label: 'Student Tools', href: '/student' },
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
      <AverageMarksCalc />
    </CalculatorLayout>
  )
}
