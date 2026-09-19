import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { PercentageChangeCalc } from '@/components/calculators/PercentageChangeCalc'

const ROUTE = '/calculators/percentage-change'
const TOOL_ID = 'calculators-percentage-change'

export const metadata: Metadata = {
  title: "Percentage Increase / Decrease Calculator 2025 (Step-by-Step Change) | StudentTools",
  description: "Calculate percentage increase or decrease between any two values in 2025 with clear step-by-step formula and increase/decrease direction indicator.",
  alternates: {
    canonical: 'https://www.studenttools.cyou/calculators/percentage-change',
  },
  openGraph: {
    title: "Percentage Increase / Decrease Calculator 2025 (Step-by-Step Change) | StudentTools",
    description: "Calculate percentage increase or decrease between any two values in 2025 with clear step-by-step formula and increase/decrease direction indicator.",
    url: 'https://www.studenttools.cyou/calculators/percentage-change',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function CalculatorsPercentageChangePage() {
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
      <PercentageChangeCalc />
    </CalculatorLayout>
  )
}
