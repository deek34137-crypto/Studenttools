import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { CgpaCalc } from '@/components/calculators/CgpaCalc'

const ROUTE = '/student/cgpa-to-percentage'
const TOOL_ID = 'student-cgpa-to-percentage'

export const metadata: Metadata = {
  title: "CGPA to Percentage Calculator (CBSE 9.5x, 10x, VTU & Mumbai Univ) | StudentTools",
  description: "Free CGPA to percentage converter. Easily convert 10-point CGPA into equivalent percentage using official CBSE and university conversion rules.",
  alternates: {
    canonical: 'https://studenttools.cyou/student/cgpa-to-percentage',
  },
  openGraph: {
    title: "CGPA to Percentage Calculator (CBSE 9.5x, 10x, VTU & Mumbai Univ) | StudentTools",
    description: "Free CGPA to percentage converter. Easily convert 10-point CGPA into equivalent percentage using official CBSE and university conversion rules.",
    url: 'https://studenttools.cyou/student/cgpa-to-percentage',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function StudentCgpaToPercentagePage() {
  const tool = getToolByRoute(ROUTE)
  const content = getToolContent(TOOL_ID)

  if (!tool || !content) {
    notFound()
  }

  return (
    <CalculatorLayout
      tool={tool}
      breadcrumbItems={[
        { label: 'Student Tools', href: '/student' },
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
      <CgpaCalc />
    </CalculatorLayout>
  )
}
