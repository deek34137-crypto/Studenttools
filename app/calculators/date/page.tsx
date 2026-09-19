import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { DateCalc } from '@/components/calculators/DateCalc'

const ROUTE = '/calculators/date'
const TOOL_ID = 'calculators-date'

export const metadata: Metadata = {
  title: "Date Calculator 2025 (Days Between Dates, Business Days & Add/Subtract) | StudentTools",
  description: "Calculate days between any two dates in 2025, count business days, add or subtract days, and find future deadlines accurately.",
  alternates: {
    canonical: 'https://www.studenttools.cyou/calculators/date',
  },
  openGraph: {
    title: "Date Calculator 2025 (Days Between Dates, Business Days & Add/Subtract) | StudentTools",
    description: "Calculate days between any two dates in 2025, count business days, add or subtract days, and find future deadlines accurately.",
    url: 'https://www.studenttools.cyou/calculators/date',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function CalculatorsDatePage() {
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
      <DateCalc />
    </CalculatorLayout>
  )
}
