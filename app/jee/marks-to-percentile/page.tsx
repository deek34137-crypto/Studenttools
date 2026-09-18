import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { JeePercentileCalc } from '@/components/calculators/JeePercentileCalc'

const ROUTE = '/jee/marks-to-percentile'
const TOOL_ID = 'jee-marks-to-percentile'

export const metadata: Metadata = {
  title: "JEE Main Marks to Percentile Estimator (Shift-Wise Normalization Range) | StudentTools",
  description: "Estimate your JEE Main percentile from your total marks. View shift-wise difficulty benchmarks, normalization methodology, and score-to-percentile ranges.",
  alternates: {
    canonical: 'https://studenttools.cyou/jee/marks-to-percentile',
  },
  openGraph: {
    title: "JEE Main Marks to Percentile Estimator (Shift-Wise Normalization Range) | StudentTools",
    description: "Estimate your JEE Main percentile from your total marks. View shift-wise difficulty benchmarks, normalization methodology, and score-to-percentile ranges.",
    url: 'https://studenttools.cyou/jee/marks-to-percentile',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function JeeMarksToPercentilePage() {
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
      <JeePercentileCalc />
    </CalculatorLayout>
  )
}
