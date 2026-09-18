import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { EmiCalc } from '@/components/calculators/EmiCalc'

const ROUTE = '/finance/emi-calculator'
const TOOL_ID = 'finance-emi-calculator'

export const metadata: Metadata = {
  title: "EMI Calculator (Loan EMI, Total Interest & Amortization Schedule) | StudentTools",
  description: "Calculate monthly loan EMI with reducing balance interest. View total interest, total payment, and detailed yearly amortization schedule.",
  alternates: {
    canonical: 'https://studenttools.cyou/finance/emi-calculator',
  },
  openGraph: {
    title: "EMI Calculator (Loan EMI, Total Interest & Amortization Schedule) | StudentTools",
    description: "Calculate monthly loan EMI with reducing balance interest. View total interest, total payment, and detailed yearly amortization schedule.",
    url: 'https://studenttools.cyou/finance/emi-calculator',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function FinanceEmiCalculatorPage() {
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
      <EmiCalc />
    </CalculatorLayout>
  )
}
