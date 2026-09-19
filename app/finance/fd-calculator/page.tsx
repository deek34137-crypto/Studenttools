import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { FdCalc } from '@/components/calculators/FdCalc'

const ROUTE = '/finance/fd-calculator'
const TOOL_ID = 'finance-fd-calculator'

export const metadata: Metadata = {
  title: "FD Calculator 2025-26 (Fixed Deposit Quarterly Compounding & Maturity Value) | StudentTools",
  description: "Calculate bank FD maturity value and interest earned for 2025-26 with quarterly compounding. Includes senior citizen interest rate options.",
  alternates: {
    canonical: 'https://www.studenttools.cyou/finance/fd-calculator',
  },
  openGraph: {
    title: "FD Calculator 2025-26 (Fixed Deposit Quarterly Compounding & Maturity Value) | StudentTools",
    description: "Calculate bank FD maturity value and interest earned for 2025-26 with quarterly compounding. Includes senior citizen interest rate options.",
    url: 'https://www.studenttools.cyou/finance/fd-calculator',
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
