import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { IncomeTaxCalc } from '@/components/calculators/IncomeTaxCalc'

const ROUTE = '/finance/tax-calculator'
const TOOL_ID = 'finance-tax-calculator'

export const metadata: Metadata = {
  title: "Income Tax Calculator India FY 2025-26 (New vs Old Regime, Section 87A & Cess) | StudentTools",
  description: "Calculate Indian Income Tax liability. Compare New Tax Regime vs Old Tax Regime with standard deduction (₹75k), Section 87A rebate, and health cess.",
  alternates: {
    canonical: 'https://studenttools.cyou/finance/tax-calculator',
  },
  openGraph: {
    title: "Income Tax Calculator India FY 2025-26 (New vs Old Regime, Section 87A & Cess) | StudentTools",
    description: "Calculate Indian Income Tax liability. Compare New Tax Regime vs Old Tax Regime with standard deduction (₹75k), Section 87A rebate, and health cess.",
    url: 'https://studenttools.cyou/finance/tax-calculator',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function FinanceTaxCalculatorPage() {
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
      <IncomeTaxCalc />
    </CalculatorLayout>
  )
}
