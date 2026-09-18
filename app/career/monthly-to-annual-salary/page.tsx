import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { SalaryConverterCalc } from '@/components/calculators/SalaryConverterCalc'

const ROUTE = '/career/monthly-to-annual-salary'
const TOOL_ID = 'career-monthly-to-annual-salary'

export const metadata: Metadata = {
  title: "Monthly to Annual Salary Calculator (Yearly, Weekly & Daily Rates) | StudentTools",
  description: "Quickly convert your monthly earnings into annual gross salary, quarterly figures, weekly pay, and hourly rates.",
  alternates: {
    canonical: 'https://studenttools.cyou/career/monthly-to-annual-salary',
  },
  openGraph: {
    title: "Monthly to Annual Salary Calculator (Yearly, Weekly & Daily Rates) | StudentTools",
    description: "Quickly convert your monthly earnings into annual gross salary, quarterly figures, weekly pay, and hourly rates.",
    url: 'https://studenttools.cyou/career/monthly-to-annual-salary',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function CareerMonthlyToAnnualSalaryPage() {
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
      <SalaryConverterCalc initialMode="monthly_to_annual" />
    </CalculatorLayout>
  )
}
