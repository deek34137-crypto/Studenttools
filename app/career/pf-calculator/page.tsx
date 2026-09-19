import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { PfCalc } from '@/components/calculators/PfCalc'

const ROUTE = '/career/pf-calculator'
const TOOL_ID = 'career-pf-calculator'

export const metadata: Metadata = {
  title: "PF Calculator FY 2025-26 (EPF & EPS Monthly Contribution & Interest) | StudentTools",
  description: "Calculate FY 2025-26 monthly Employee and Employer Provident Fund (EPF/EPS) contributions and project long-term compound wealth at EPFO interest rates.",
  alternates: {
    canonical: 'https://www.studenttools.cyou/career/pf-calculator',
  },
  openGraph: {
    title: "PF Calculator FY 2025-26 (EPF & EPS Monthly Contribution & Interest) | StudentTools",
    description: "Calculate FY 2025-26 monthly Employee and Employer Provident Fund (EPF/EPS) contributions and project long-term compound wealth at EPFO interest rates.",
    url: 'https://www.studenttools.cyou/career/pf-calculator',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function CareerPfCalculatorPage() {
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
      <PfCalc />
    </CalculatorLayout>
  )
}
