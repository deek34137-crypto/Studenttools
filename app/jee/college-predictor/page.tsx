import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { JeeCollegePredictorCalc } from '@/components/calculators/JeeCollegePredictorCalc'

const ROUTE = '/jee/college-predictor'
const TOOL_ID = 'jee-college-predictor'

export const metadata: Metadata = {
  title: "JEE Main College Predictor 2025-26 (NITs, IIITs & GFTIs by JoSAA Cutoffs) | StudentTools",
  description: "Find NIT, IIIT, and GFTI admission chances for your JEE Main 2025-26 rank based on official JoSAA counselling closing ranks.",
  alternates: {
    canonical: 'https://studenttools.cyou/jee/college-predictor',
  },
  openGraph: {
    title: "JEE Main College Predictor 2025-26 (NITs, IIITs & GFTIs by JoSAA Cutoffs) | StudentTools",
    description: "Find NIT, IIIT, and GFTI admission chances for your JEE Main 2025-26 rank based on official JoSAA counselling closing ranks.",
    url: 'https://studenttools.cyou/jee/college-predictor',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function JeeCollegePredictorPage() {
  const tool = getToolByRoute(ROUTE)
  const content = getToolContent(TOOL_ID)

  if (!tool || !content) {
    notFound()
  }

  return (
    <CalculatorLayout
      tool={tool}
      breadcrumbItems={[
        { label: 'JEE & Exams', href: '/jee' },
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
      <JeeCollegePredictorCalc />
    </CalculatorLayout>
  )
}
