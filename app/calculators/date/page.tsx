import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { DateCalc } from '@/components/calculators/DateCalc'

const ROUTE = '/calculators/date'
const TOOL_ID = 'calculators-date'

export const metadata: Metadata = {
  title: "Date Calculator (Days Between Dates & Add/Subtract Days) | StudentTools",
  description: "Calculate exact days, weeks, months, and business days between two dates, or add and subtract days to compute future deadlines.",
  alternates: {
    canonical: 'https://studenttools.cyou/calculators/date',
  },
  openGraph: {
    title: "Date Calculator (Days Between Dates & Add/Subtract Days) | StudentTools",
    description: "Calculate exact days, weeks, months, and business days between two dates, or add and subtract days to compute future deadlines.",
    url: 'https://studenttools.cyou/calculators/date',
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
