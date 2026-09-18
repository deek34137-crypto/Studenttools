import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { IncrementCalc } from '@/components/calculators/IncrementCalc'

const ROUTE = '/career/increment-calculator'
const TOOL_ID = 'career-increment-calculator'

export const metadata: Metadata = {
  title: "Increment Calculator (Percentage Hike Between Old & New Salary) | StudentTools",
  description: "Compare your previous salary and revised salary to calculate the exact percentage increment and monthly gain.",
  alternates: {
    canonical: 'https://studenttools.cyou/career/increment-calculator',
  },
  openGraph: {
    title: "Increment Calculator (Percentage Hike Between Old & New Salary) | StudentTools",
    description: "Compare your previous salary and revised salary to calculate the exact percentage increment and monthly gain.",
    url: 'https://studenttools.cyou/career/increment-calculator',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function CareerIncrementCalculatorPage() {
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
      <IncrementCalc />
    </CalculatorLayout>
  )
}
