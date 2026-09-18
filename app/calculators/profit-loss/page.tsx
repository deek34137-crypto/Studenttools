import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { ProfitLossCalc } from '@/components/calculators/ProfitLossCalc'

const ROUTE = '/calculators/profit-loss'
const TOOL_ID = 'calculators-profit-loss'

export const metadata: Metadata = {
  title: "Profit and Loss Calculator (Cost Price vs Selling Price Margin) | StudentTools",
  description: "Determine profit or loss amount and percentage from Cost Price (CP) and Selling Price (SP) with clear mathematical formulas.",
  alternates: {
    canonical: 'https://studenttools.cyou/calculators/profit-loss',
  },
  openGraph: {
    title: "Profit and Loss Calculator (Cost Price vs Selling Price Margin) | StudentTools",
    description: "Determine profit or loss amount and percentage from Cost Price (CP) and Selling Price (SP) with clear mathematical formulas.",
    url: 'https://studenttools.cyou/calculators/profit-loss',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function CalculatorsProfitLossPage() {
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
      <ProfitLossCalc />
    </CalculatorLayout>
  )
}
