import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { AgeCalc } from '@/components/calculators/AgeCalc'

const ROUTE = '/calculators/age'
const TOOL_ID = 'calculators-age'

export const metadata: Metadata = {
  title: "Age Calculator 2025 (Exact Age in Years, Months, Days & Next Birthday) | StudentTools",
  description: "Calculate your exact age in 2025 — years, months, days, total days lived, the day you were born, and your next birthday countdown.",
  alternates: {
    canonical: 'https://www.studenttools.cyou/calculators/age',
  },
  openGraph: {
    title: "Age Calculator 2025 (Exact Age in Years, Months, Days & Next Birthday) | StudentTools",
    description: "Calculate your exact age in 2025 — years, months, days, total days lived, the day you were born, and your next birthday countdown.",
    url: 'https://www.studenttools.cyou/calculators/age',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function CalculatorsAgePage() {
  const tool = getToolByRoute(ROUTE)
  const content = getToolContent(TOOL_ID)

  if (!tool || !content) {
    notFound()
  }

  return (
    <CalculatorLayout
      tool={tool}
      breadcrumbItems={[
        { label: 'Calculators', href: '/calculators' },
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
      <AgeCalc />
    </CalculatorLayout>
  )
}
