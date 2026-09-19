import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { PercentageCalc } from '@/components/calculators/PercentageCalc'

const ROUTE = '/student/percentage-calculator'
const TOOL_ID = 'student-percentage-calculator'

export const metadata: Metadata = {
  title: "Percentage Calculator 2025 (X of Y, Increase, Decrease & Difference) | StudentTools",
  description: "Calculate percentages instantly in 2025. Features X of Y, percentage increase, percentage decrease, and difference with step-by-step breakdown.",
  alternates: {
    canonical: 'https://studenttools.cyou/student/percentage-calculator',
  },
  openGraph: {
    title: "Percentage Calculator 2025 (X of Y, Increase, Decrease & Difference) | StudentTools",
    description: "Calculate percentages instantly in 2025. Features X of Y, percentage increase, percentage decrease, and difference with step-by-step breakdown.",
    url: 'https://studenttools.cyou/student/percentage-calculator',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function StudentPercentageCalculatorPage() {
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
      <PercentageCalc />
    </CalculatorLayout>
  )
}
