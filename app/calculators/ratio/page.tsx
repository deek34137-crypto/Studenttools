import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { RatioCalc } from '@/components/calculators/RatioCalc'

const ROUTE = '/calculators/ratio'
const TOOL_ID = 'calculators-ratio'

export const metadata: Metadata = {
  title: "Ratio Calculator (Ratio Simplification to Lowest Terms & Scaling) | StudentTools",
  description: "Simplify mathematical ratios to their simplest form using GCD. Find equivalent ratios, decimal equivalents, and percentage values.",
  alternates: {
    canonical: 'https://studenttools.cyou/calculators/ratio',
  },
  openGraph: {
    title: "Ratio Calculator (Ratio Simplification to Lowest Terms & Scaling) | StudentTools",
    description: "Simplify mathematical ratios to their simplest form using GCD. Find equivalent ratios, decimal equivalents, and percentage values.",
    url: 'https://studenttools.cyou/calculators/ratio',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function CalculatorsRatioPage() {
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
      <RatioCalc />
    </CalculatorLayout>
  )
}
