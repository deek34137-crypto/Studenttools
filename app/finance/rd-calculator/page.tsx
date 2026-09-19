import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { RdCalc } from '@/components/calculators/RdCalc'

const ROUTE = '/finance/rd-calculator'
const TOOL_ID = 'finance-rd-calculator'

export const metadata: Metadata = {
  title: "RD Calculator 2025-26 (Recurring Deposit Maturity Amount & Interest) | StudentTools",
  description: "Calculate 2025-26 maturity value and interest earned on recurring monthly deposits across Indian commercial banks and post offices.",
  alternates: {
    canonical: 'https://studenttools.cyou/finance/rd-calculator',
  },
  openGraph: {
    title: "RD Calculator 2025-26 (Recurring Deposit Maturity Amount & Interest) | StudentTools",
    description: "Calculate 2025-26 maturity value and interest earned on recurring monthly deposits across Indian commercial banks and post offices.",
    url: 'https://studenttools.cyou/finance/rd-calculator',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function FinanceRdCalculatorPage() {
  const tool = getToolByRoute(ROUTE)
  const content = getToolContent(TOOL_ID)

  if (!tool || !content) {
    notFound()
  }

  return (
    <CalculatorLayout
      tool={tool}
      breadcrumbItems={[
        { label: 'Finance', href: '/finance' },
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
      <RdCalc />
    </CalculatorLayout>
  )
}
