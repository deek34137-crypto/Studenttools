import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { JeeCutoffExplorerCalc } from '@/components/calculators/JeeCutoffExplorerCalc'

const ROUTE = '/jee/cutoff'
const TOOL_ID = 'jee-cutoff'

export const metadata: Metadata = {
  title: "JEE Main Cutoff Explorer 2025-26 (JoSAA Opening & Closing Ranks) | StudentTools",
  description: "Explore 2025-26 opening and closing ranks for premier engineering colleges in India across categories, home state, and other state quotas.",
  alternates: {
    canonical: 'https://studenttools.cyou/jee/cutoff',
  },
  openGraph: {
    title: "JEE Main Cutoff Explorer 2025-26 (JoSAA Opening & Closing Ranks) | StudentTools",
    description: "Explore 2025-26 opening and closing ranks for premier engineering colleges in India across categories, home state, and other state quotas.",
    url: 'https://studenttools.cyou/jee/cutoff',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function JeeCutoffPage() {
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
      <JeeCutoffExplorerCalc />
    </CalculatorLayout>
  )
}
