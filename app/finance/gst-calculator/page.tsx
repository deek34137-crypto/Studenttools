import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { GstCalc } from '@/components/calculators/GstCalc'

const ROUTE = '/finance/gst-calculator'
const TOOL_ID = 'finance-gst-calculator'

export const metadata: Metadata = {
  title: "GST Calculator India 2025-26 (Inclusive & Exclusive with CGST/SGST Breakdown) | StudentTools",
  description: "Calculate Indian GST instantly for 2025-26. Supports GST inclusive and exclusive modes with automatic 50:50 CGST and SGST bifurcation.",
  alternates: {
    canonical: 'https://www.studenttools.cyou/finance/gst-calculator',
  },
  openGraph: {
    title: "GST Calculator India 2025-26 (Inclusive & Exclusive with CGST/SGST Breakdown) | StudentTools",
    description: "Calculate Indian GST instantly for 2025-26. Supports GST inclusive and exclusive modes with automatic 50:50 CGST and SGST bifurcation.",
    url: 'https://www.studenttools.cyou/finance/gst-calculator',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function FinanceGstCalculatorPage() {
  const tool = getToolByRoute(ROUTE)
  const content = getToolContent(TOOL_ID)

  if (!tool || !content) {
    notFound()
  }

  return (
    <CalculatorLayout
      tool={tool}
      breadcrumbItems={[
        { label: 'Finance', href: '/finance' },
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
      <GstCalc />
    </CalculatorLayout>
  )
}
