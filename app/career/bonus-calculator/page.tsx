import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { BonusCalc } from '@/components/calculators/BonusCalc'

const ROUTE = '/career/bonus-calculator'
const TOOL_ID = 'career-bonus-calculator'

export const metadata: Metadata = {
  title: "Bonus Calculator FY 2025-26 (Performance & Annual Incentive After TDS) | StudentTools",
  description: "Calculate your FY 2025-26 gross bonus from percentage of salary or fixed payout and estimate net in-hand bonus after TDS deductions.",
  alternates: {
    canonical: 'https://www.studenttools.cyou/career/bonus-calculator',
  },
  openGraph: {
    title: "Bonus Calculator FY 2025-26 (Performance & Annual Incentive After TDS) | StudentTools",
    description: "Calculate your FY 2025-26 gross bonus from percentage of salary or fixed payout and estimate net in-hand bonus after TDS deductions.",
    url: 'https://www.studenttools.cyou/career/bonus-calculator',
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
