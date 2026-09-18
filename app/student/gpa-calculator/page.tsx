import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { GpaCalc } from '@/components/calculators/GpaCalc'

const ROUTE = '/student/gpa-calculator'
const TOOL_ID = 'student-gpa-calculator'

export const metadata: Metadata = {
  title: "GPA Calculator (Credit-Weighted Semester GPA & Quality Points) | StudentTools",
  description: "Calculate your weighted semester Grade Point Average (GPA) using course credit hours and 10-point grade values.",
  alternates: {
    canonical: 'https://studenttools.cyou/student/gpa-calculator',
  },
  openGraph: {
    title: "GPA Calculator (Credit-Weighted Semester GPA & Quality Points) | StudentTools",
    description: "Calculate your weighted semester Grade Point Average (GPA) using course credit hours and 10-point grade values.",
    url: 'https://studenttools.cyou/student/gpa-calculator',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function StudentGpaCalculatorPage() {
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
      <GpaCalc />
    </CalculatorLayout>
  )
}
