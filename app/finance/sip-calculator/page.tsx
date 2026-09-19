import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { SipCalc } from '@/components/calculators/SipCalc'

const ROUTE = '/finance/sip-calculator'
const TOOL_ID = 'finance-sip-calculator'

export const metadata: Metadata = {
  title: "SIP Calculator 2025-26 (Mutual Fund Returns & Compound Wealth Projector) | StudentTools",
  description: "Project your 2025-26 mutual fund SIP returns. Calculate total invested capital, estimated gains, and final maturity value over 1 to 30 years.",
  alternates: {
    canonical: 'https://studenttools.cyou/finance/sip-calculator',
  },
  openGraph: {
    title: "SIP Calculator 2025-26 (Mutual Fund Returns & Compound Wealth Projector) | StudentTools",
    description: "Project your 2025-26 mutual fund SIP returns. Calculate total invested capital, estimated gains, and final maturity value over 1 to 30 years.",
    url: 'https://studenttools.cyou/finance/sip-calculator',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function FinanceSipCalculatorPage() {
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
      <SipCalc />
    </CalculatorLayout>
  )
}
