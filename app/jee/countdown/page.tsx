import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { JeeCountdownCalc } from '@/components/calculators/JeeCountdownCalc'

const ROUTE = '/jee/countdown'
const TOOL_ID = 'jee-countdown'

export const metadata: Metadata = {
  title: "JEE Exam Countdown Timer 2025-26 (Days Left for Next JEE Main Session) | StudentTools",
  description: "Real-time countdown timer to upcoming JEE Main 2026 and Advanced exam dates. Track exact days, hours, and minutes remaining for your preparation.",
  alternates: {
    canonical: 'https://www.studenttools.cyou/jee/countdown',
  },
  openGraph: {
    title: "JEE Exam Countdown Timer 2025-26 (Days Left for Next JEE Main Session) | StudentTools",
    description: "Real-time countdown timer to upcoming JEE Main 2026 and Advanced exam dates. Track exact days, hours, and minutes remaining for your preparation.",
    url: 'https://www.studenttools.cyou/jee/countdown',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function JeeCountdownPage() {
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
      <JeeCountdownCalc />
    </CalculatorLayout>
  )
}
