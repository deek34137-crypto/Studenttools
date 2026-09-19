import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { AttendanceCalc } from '@/components/calculators/AttendanceCalc'

const ROUTE = '/student/attendance-calculator'
const TOOL_ID = 'student-attendance-calculator'

export const metadata: Metadata = {
  title: "Attendance Calculator 2025-26 (75% UGC Rule & Safe Bunk Allowance) | StudentTools",
  description: "Calculate your exact 2025-26 college attendance percentage, classes needed for 75% UGC criteria, and how many lectures you can safely bunk.",
  alternates: {
    canonical: 'https://studenttools.cyou/student/attendance-calculator',
  },
  openGraph: {
    title: "Attendance Calculator 2025-26 (75% UGC Rule & Safe Bunk Allowance) | StudentTools",
    description: "Calculate your exact 2025-26 college attendance percentage, classes needed for 75% UGC criteria, and how many lectures you can safely bunk.",
    url: 'https://studenttools.cyou/student/attendance-calculator',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function StudentAttendanceCalculatorPage() {
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
      <AttendanceCalc />
    </CalculatorLayout>
  )
}
