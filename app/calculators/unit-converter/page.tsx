import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { UnitConverterCalc } from '@/components/calculators/UnitConverterCalc'

const ROUTE = '/calculators/unit-converter'
const TOOL_ID = 'calculators-unit-converter'

export const metadata: Metadata = {
  title: "Unit Converter (Length, Mass, Temperature, Area & Digital Units) | StudentTools",
  description: "Universal unit converter. Convert meters to feet, kilograms to pounds, Celsius to Fahrenheit, acres to bigha, and more.",
  alternates: {
    canonical: 'https://studenttools.cyou/calculators/unit-converter',
  },
  openGraph: {
    title: "Unit Converter (Length, Mass, Temperature, Area & Digital Units) | StudentTools",
    description: "Universal unit converter. Convert meters to feet, kilograms to pounds, Celsius to Fahrenheit, acres to bigha, and more.",
    url: 'https://studenttools.cyou/calculators/unit-converter',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function CalculatorsUnitConverterPage() {
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
      <UnitConverterCalc />
    </CalculatorLayout>
  )
}
