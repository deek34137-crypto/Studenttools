import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { StipendCalc } from '@/components/calculators/StipendCalc'

const ROUTE = '/career/internship-stipend'
const TOOL_ID = 'career-internship-stipend'

export const metadata: Metadata = {
  title: "Internship Stipend Calculator 2025-26 (Hourly, Weekly & Monthly Intern Pay) | StudentTools",
  description: "Calculate your 2025-26 total internship earnings based on monthly, weekly, or hourly compensation and working schedule.",
  alternates: {
    canonical: 'https://www.studenttools.cyou/career/internship-stipend',
  },
  openGraph: {
    title: "Internship Stipend Calculator 2025-26 (Hourly, Weekly & Monthly Intern Pay) | StudentTools",
    description: "Calculate your 2025-26 total internship earnings based on monthly, weekly, or hourly compensation and working schedule.",
    url: 'https://www.studenttools.cyou/career/internship-stipend',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function CareerInternshipStipendPage() {
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
      <StipendCalc />
    </CalculatorLayout>
  )
}
