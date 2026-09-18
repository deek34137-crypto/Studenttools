import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { CtcInHandCalc } from '@/components/calculators/CtcInHandCalc'

const ROUTE = '/career/ctc-to-in-hand'
const TOOL_ID = 'career-ctc-to-in-hand'

export const metadata: Metadata = {
  title: "CTC to In-Hand Salary Calculator (Monthly Take-Home Breakdown India) | StudentTools",
  description: "Estimate your monthly take-home salary from your annual CTC in India. Detailed breakdown of Basic, HRA, Employee PF, PT, and TDS tax deductions.",
  alternates: {
    canonical: 'https://studenttools.cyou/career/ctc-to-in-hand',
  },
  openGraph: {
    title: "CTC to In-Hand Salary Calculator (Monthly Take-Home Breakdown India) | StudentTools",
    description: "Estimate your monthly take-home salary from your annual CTC in India. Detailed breakdown of Basic, HRA, Employee PF, PT, and TDS tax deductions.",
    url: 'https://studenttools.cyou/career/ctc-to-in-hand',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function CareerCtcToInHandPage() {
  const tool = getToolByRoute(ROUTE)
  const content = getToolContent(TOOL_ID)

  if (!tool || !content) {
    notFound()
  }

  return (
    <CalculatorLayout
      tool={tool}
      breadcrumbItems={[
        { label: 'Career & Salary', href: '/career' },
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
      <CtcInHandCalc />
    </CalculatorLayout>
  )
}
