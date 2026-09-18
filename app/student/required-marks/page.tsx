import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { RequiredMarksCalc } from '@/components/calculators/RequiredMarksCalc'

const ROUTE = '/student/required-marks'
const TOOL_ID = 'student-required-marks'

export const metadata: Metadata = {
  title: "Required Marks Calculator (Score Needed for Target Percentage) | StudentTools",
  description: "Determine the exact marks needed in upcoming assessments and final exams to achieve your desired overall percentage.",
  alternates: {
    canonical: 'https://studenttools.cyou/student/required-marks',
  },
  openGraph: {
    title: "Required Marks Calculator (Score Needed for Target Percentage) | StudentTools",
    description: "Determine the exact marks needed in upcoming assessments and final exams to achieve your desired overall percentage.",
    url: 'https://studenttools.cyou/student/required-marks',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function StudentRequiredMarksPage() {
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
      <RequiredMarksCalc />
    </CalculatorLayout>
  )
}
