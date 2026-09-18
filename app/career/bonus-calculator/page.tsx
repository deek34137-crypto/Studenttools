import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { BonusCalc } from '@/components/calculators/BonusCalc'

const ROUTE = '/career/bonus-calculator'
const TOOL_ID = 'career-bonus-calculator'

export const metadata: Metadata = {
  title: "Bonus Calculator (Performance & Annual Incentive After TDS) | StudentTools",
  description: "Calculate gross bonus based on percentage of salary or fixed payout and estimate the net in-hand bonus after TDS deductions.",
  alternates: {
    canonical: 'https://studenttools.cyou/career/bonus-calculator',
  },
  openGraph: {
    title: "Bonus Calculator (Performance & Annual Incentive After TDS) | StudentTools",
    description: "Calculate gross bonus based on percentage of salary or fixed payout and estimate the net in-hand bonus after TDS deductions.",
    url: 'https://studenttools.cyou/career/bonus-calculator',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function CareerBonusCalculatorPage() {
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
      <BonusCalc />
    </CalculatorLayout>
  )
}
