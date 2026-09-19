import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { SalaryHikeCalc } from '@/components/calculators/SalaryHikeCalc'

const ROUTE = '/career/salary-hike'
const TOOL_ID = 'career-salary-hike'

export const metadata: Metadata = {
  title: "Salary Hike Calculator 2025-26 (Appraisal & Job Switch Increment) | StudentTools",
  description: "Calculate your revised annual CTC and monthly salary after receiving a percentage hike during appraisals or job switches.",
  alternates: {
    canonical: 'https://studenttools.cyou/career/salary-hike',
  },
  openGraph: {
    title: "Salary Hike Calculator 2025-26 (Appraisal & Job Switch Increment) | StudentTools",
    description: "Calculate your revised annual CTC and monthly salary after receiving a percentage hike during appraisals or job switches.",
    url: 'https://studenttools.cyou/career/salary-hike',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function CareerSalaryHikePage() {
  const tool = getToolByRoute(ROUTE)
  const content = getToolContent(TOOL_ID)

  if (!tool || !content) {
    notFound()
  }

  return (
    <CalculatorLayout
      tool={tool}
      breadcrumbItems={[
        { label: 'Career & Salary', href: '/career' },
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
      <SalaryHikeCalc />
    </CalculatorLayout>
  )
}
