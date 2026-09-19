import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { BmiCalc } from '@/components/calculators/BmiCalc'

const ROUTE = '/calculators/bmi'
const TOOL_ID = 'calculators-bmi'

export const metadata: Metadata = {
  title: "BMI Calculator 2025 (Body Mass Index, WHO Categories & Healthy Weight Range) | StudentTools",
  description: "Free BMI calculator 2025. Check your Body Mass Index score, WHO weight category, Asian-Indian thresholds, and healthy weight range for your height.",
  alternates: {
    canonical: 'https://www.studenttools.cyou/calculators/bmi',
  },
  openGraph: {
    title: "BMI Calculator 2025 (Body Mass Index, WHO Categories & Healthy Weight Range) | StudentTools",
    description: "Free BMI calculator 2025. Check your Body Mass Index score, WHO weight category, Asian-Indian thresholds, and healthy weight range for your height.",
    url: 'https://www.studenttools.cyou/calculators/bmi',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function CalculatorsBmiPage() {
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
      <BmiCalc />
    </CalculatorLayout>
  )
}
