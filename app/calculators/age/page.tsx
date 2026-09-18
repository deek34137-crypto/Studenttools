import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { AgeCalc } from '@/components/calculators/AgeCalc'

const ROUTE = '/calculators/age'
const TOOL_ID = 'calculators-age'

export const metadata: Metadata = {
  title: "Age Calculator (Exact Age in Years, Months, Days & Next Birthday) | StudentTools",
  description: "Calculate your exact chronological age in years, months, days, and total days lived. Find out the day of the week you were born and next birthday countdown.",
  alternates: {
    canonical: 'https://studenttools.cyou/calculators/age',
  },
  openGraph: {
    title: "Age Calculator (Exact Age in Years, Months, Days & Next Birthday) | StudentTools",
    description: "Calculate your exact chronological age in years, months, days, and total days lived. Find out the day of the week you were born and next birthday countdown.",
    url: 'https://studenttools.cyou/calculators/age',
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
