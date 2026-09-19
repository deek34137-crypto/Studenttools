import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { JeeRankCalc } from '@/components/calculators/JeeRankCalc'

const ROUTE = '/jee/percentile-to-rank'
const TOOL_ID = 'jee-percentile-to-rank'

export const metadata: Metadata = {
  title: "JEE Main Percentile to Rank Estimator 2025-26 (CRL & Category Rank) | StudentTools",
  description: "Convert your JEE Main 2025-26 NTA percentile score into an estimated All India CRL rank and category rank with statistical error ranges.",
  alternates: {
    canonical: 'https://studenttools.cyou/jee/percentile-to-rank',
  },
  openGraph: {
    title: "JEE Main Percentile to Rank Estimator 2025-26 (CRL & Category Rank) | StudentTools",
    description: "Convert your JEE Main 2025-26 NTA percentile score into an estimated All India CRL rank and category rank with statistical error ranges.",
    url: 'https://studenttools.cyou/jee/percentile-to-rank',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function JeePercentileToRankPage() {
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
      <JeeRankCalc />
    </CalculatorLayout>
  )
}
