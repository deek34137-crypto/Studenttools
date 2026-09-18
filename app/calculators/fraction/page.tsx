import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { FractionCalc } from '@/components/calculators/FractionCalc'

const ROUTE = '/calculators/fraction'
const TOOL_ID = 'calculators-fraction'

export const metadata: Metadata = {
  title: "Fraction Calculator (Add, Subtract, Multiply, Divide & Simplify) | StudentTools",
  description: "Free online fraction calculator. Add, subtract, multiply, and divide fractions with step-by-step simplification and mixed numbers.",
  alternates: {
    canonical: 'https://studenttools.cyou/calculators/fraction',
  },
  openGraph: {
    title: "Fraction Calculator (Add, Subtract, Multiply, Divide & Simplify) | StudentTools",
    description: "Free online fraction calculator. Add, subtract, multiply, and divide fractions with step-by-step simplification and mixed numbers.",
    url: 'https://studenttools.cyou/calculators/fraction',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function CalculatorsFractionPage() {
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
      <FractionCalc />
    </CalculatorLayout>
  )
}
