import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { MarksPercentageCalc } from '@/components/calculators/MarksPercentageCalc'

const ROUTE = '/student/marks-percentage'
const TOOL_ID = 'student-marks-percentage'

export const metadata: Metadata = {
  title: "Marks Percentage Calculator 2025-26 (CBSE, ICSE & State Board) | StudentTools",
  description: "Calculate total percentage and average score across any number of subjects in 2025-26. Perfect for CBSE, ICSE, and state board marksheets.",
  alternates: {
    canonical: 'https://www.studenttools.cyou/student/marks-percentage',
  },
  openGraph: {
    title: "Marks Percentage Calculator 2025-26 (CBSE, ICSE & State Board) | StudentTools",
    description: "Calculate total percentage and average score across any number of subjects in 2025-26. Perfect for CBSE, ICSE, and state board marksheets.",
    url: 'https://www.studenttools.cyou/student/marks-percentage',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function StudentMarksPercentagePage() {
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
      <MarksPercentageCalc />
    </CalculatorLayout>
  )
}
