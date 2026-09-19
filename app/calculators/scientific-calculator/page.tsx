import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { ScientificCalc } from '@/components/calculators/ScientificCalc'

const ROUTE = '/calculators/scientific-calculator'
const TOOL_ID = 'calculators-scientific-calculator'

export const metadata: Metadata = {
  title: "Scientific Calculator Online 2025 (Trig, Log, Powers, Roots & Safe Parser) | StudentTools",
  description: "Fast online scientific calculator 2025. Supports sine, cosine, tangent, log, ln, square roots, powers, parentheses, and DEG/RAD angle modes with safe expression parser.",
  alternates: {
    canonical: 'https://www.studenttools.cyou/calculators/scientific-calculator',
  },
  openGraph: {
    title: "Scientific Calculator Online 2025 (Trig, Log, Powers, Roots & Safe Parser) | StudentTools",
    description: "Fast online scientific calculator 2025. Supports sine, cosine, tangent, log, ln, square roots, powers, parentheses, and DEG/RAD angle modes with safe expression parser.",
    url: 'https://www.studenttools.cyou/calculators/scientific-calculator',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function CalculatorsScientificCalculatorPage() {
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
      <ScientificCalc />
    </CalculatorLayout>
  )
}
