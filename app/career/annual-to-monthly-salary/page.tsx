import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { SalaryConverterCalc } from '@/components/calculators/SalaryConverterCalc'

const ROUTE = '/career/annual-to-monthly-salary'
const TOOL_ID = 'career-annual-to-monthly-salary'

export const metadata: Metadata = {
  title: "Annual to Monthly Salary Calculator 2025-26 (LPA to Monthly Gross) | StudentTools",
  description: "Convert your 2025-26 annual CTC in Lakhs Per Annum (LPA) into monthly gross paycheck, weekly income, and daily rates.",
  alternates: {
    canonical: 'https://www.studenttools.cyou/career/annual-to-monthly-salary',
  },
  openGraph: {
    title: "Annual to Monthly Salary Calculator 2025-26 (LPA to Monthly Gross) | StudentTools",
    description: "Convert your 2025-26 annual CTC in Lakhs Per Annum (LPA) into monthly gross paycheck, weekly income, and daily rates.",
    url: 'https://www.studenttools.cyou/career/annual-to-monthly-salary',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function CareerAnnualToMonthlySalaryPage() {
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
      <SalaryConverterCalc initialMode="annual_to_monthly" />
    </CalculatorLayout>
  )
}
