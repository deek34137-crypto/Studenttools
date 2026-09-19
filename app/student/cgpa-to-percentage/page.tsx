import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { CgpaCalc } from '@/components/calculators/CgpaCalc'

const ROUTE = '/student/cgpa-to-percentage'
const TOOL_ID = 'student-cgpa-to-percentage'

export const metadata: Metadata = {
  title: "CGPA to Percentage Calculator 2025-26 (Official CBSE 9.5x, VTU & Mumbai Univ Formula) | StudentTools",
  description: "Free CBSE CGPA to percentage converter 2025-26. Convert 10-point CGPA using official 9.5x CBSE, VTU, and Mumbai University conversion formulas.",
  alternates: {
    canonical: 'https://studenttools.cyou/student/cgpa-to-percentage',
  },
  openGraph: {
    title: "CGPA to Percentage Calculator 2025-26 (Official CBSE 9.5x, VTU & Mumbai Univ Formula) | StudentTools",
    description: "Free CBSE CGPA to percentage converter 2025-26. Convert 10-point CGPA using official 9.5x CBSE, VTU, and Mumbai University conversion formulas.",
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
