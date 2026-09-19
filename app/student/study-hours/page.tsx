import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { StudyHoursCalc } from '@/components/calculators/StudyHoursCalc'

const ROUTE = '/student/study-hours'
const TOOL_ID = 'student-study-hours'

export const metadata: Metadata = {
  title: "Study Hours Calculator 2025-26 (Exam Revision Time Budget & Planner) | StudentTools",
  description: "Plan your 2025-26 exam preparation. Calculate available study hours and allocate revision time across high, medium, and low priority subjects.",
  alternates: {
    canonical: 'https://studenttools.cyou/student/study-hours',
  },
  openGraph: {
    title: "Study Hours Calculator 2025-26 (Exam Revision Time Budget & Planner) | StudentTools",
    description: "Plan your 2025-26 exam preparation. Calculate available study hours and allocate revision time across high, medium, and low priority subjects.",
    url: 'https://studenttools.cyou/student/study-hours',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function StudentStudyHoursPage() {
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
      <StudyHoursCalc />
    </CalculatorLayout>
  )
}
