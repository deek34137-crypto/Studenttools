import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { DiscountCalc } from '@/components/calculators/DiscountCalc'

const ROUTE = '/calculators/discount'
const TOOL_ID = 'calculators-discount'

export const metadata: Metadata = {
  title: "Discount Calculator 2025 (Sale Price & Total Savings from Percentage Off) | StudentTools",
  description: "Calculate final sale price and total money saved from any percentage discount in 2025. Simple, fast, and accurate shopping discount calculator.",
  alternates: {
    canonical: 'https://www.studenttools.cyou/calculators/discount',
  },
  openGraph: {
    title: "Discount Calculator 2025 (Sale Price & Total Savings from Percentage Off) | StudentTools",
    description: "Calculate final sale price and total money saved from any percentage discount in 2025. Simple, fast, and accurate shopping discount calculator.",
    url: 'https://www.studenttools.cyou/calculators/discount',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function CalculatorsDiscountPage() {
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
      <DiscountCalc />
    </CalculatorLayout>
  )
}
