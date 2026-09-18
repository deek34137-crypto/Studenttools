import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { FdCalc } from '@/components/calculators/FdCalc'

const ROUTE = '/finance/fd-calculator'
const TOOL_ID = 'finance-fd-calculator'

export const metadata: Metadata = {
  title: "Fixed Deposit (FD) Calculator (Quarterly Compounding & Maturity Value) | StudentTools",
  description: "Calculate bank FD maturity value and interest earned with quarterly compounding. Includes special senior citizen interest rate options.",
  alternates: {
    canonical: 'https://studenttools.cyou/finance/fd-calculator',
  },
  openGraph: {
    title: "Fixed Deposit (FD) Calculator (Quarterly Compounding & Maturity Value) | StudentTools",
    description: "Calculate bank FD maturity value and interest earned with quarterly compounding. Includes special senior citizen interest rate options.",
    url: 'https://studenttools.cyou/finance/fd-calculator',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function FinanceFdCalculatorPage() {
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
      <FdCalc />
    </CalculatorLayout>
  )
}
