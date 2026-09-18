// scripts/generate_pages.js
const fs = require('fs');
const path = require('path');

const TOOL_WIDGET_MAP = {
  'jee-marks-to-percentile': { component: 'JeePercentileCalc', importPath: '@/components/calculators/JeePercentileCalc' },
  'jee-percentile-to-rank': { component: 'JeeRankCalc', importPath: '@/components/calculators/JeeRankCalc' },
  'jee-college-predictor': { component: 'JeeCollegePredictorCalc', importPath: '@/components/calculators/JeeCollegePredictorCalc' },
  'jee-cutoff': { component: 'JeeCutoffExplorerCalc', importPath: '@/components/calculators/JeeCutoffExplorerCalc' },
  'jee-marks-calculator': { component: 'JeeMarksCalc', importPath: '@/components/calculators/JeeMarksCalc' },
  'jee-countdown': { component: 'JeeCountdownCalc', importPath: '@/components/calculators/JeeCountdownCalc' },

  'student-cgpa-to-percentage': { component: 'CgpaCalc', importPath: '@/components/calculators/CgpaCalc' },
  'student-percentage-calculator': { component: 'PercentageCalc', importPath: '@/components/calculators/PercentageCalc' },
  'student-marks-percentage': { component: 'MarksPercentageCalc', importPath: '@/components/calculators/MarksPercentageCalc' },
  'student-gpa-calculator': { component: 'GpaCalc', importPath: '@/components/calculators/GpaCalc' },
  'student-attendance-calculator': { component: 'AttendanceCalc', importPath: '@/components/calculators/AttendanceCalc' },
  'student-required-marks': { component: 'RequiredMarksCalc', importPath: '@/components/calculators/RequiredMarksCalc' },
  'student-average-marks': { component: 'AverageMarksCalc', importPath: '@/components/calculators/AverageMarksCalc' },
  'student-study-hours': { component: 'StudyHoursCalc', importPath: '@/components/calculators/StudyHoursCalc' },

  'career-ctc-to-in-hand': { component: 'CtcInHandCalc', importPath: '@/components/calculators/CtcInHandCalc' },
  'career-monthly-to-annual-salary': {
    component: 'SalaryConverterCalc',
    importPath: '@/components/calculators/SalaryConverterCalc',
    props: 'initialMode="monthly_to_annual"'
  },
  'career-annual-to-monthly-salary': {
    component: 'SalaryConverterCalc',
    importPath: '@/components/calculators/SalaryConverterCalc',
    props: 'initialMode="annual_to_monthly"'
  },
  'career-salary-hike': { component: 'SalaryHikeCalc', importPath: '@/components/calculators/SalaryHikeCalc' },
  'career-increment-calculator': { component: 'IncrementCalc', importPath: '@/components/calculators/IncrementCalc' },
  'career-pf-calculator': { component: 'PfCalc', importPath: '@/components/calculators/PfCalc' },
  'career-bonus-calculator': { component: 'BonusCalc', importPath: '@/components/calculators/BonusCalc' },
  'career-internship-stipend': { component: 'StipendCalc', importPath: '@/components/calculators/StipendCalc' },

  'finance-emi-calculator': { component: 'EmiCalc', importPath: '@/components/calculators/EmiCalc' },
  'finance-sip-calculator': { component: 'SipCalc', importPath: '@/components/calculators/SipCalc' },
  'finance-gst-calculator': { component: 'GstCalc', importPath: '@/components/calculators/GstCalc' },
  'finance-fd-calculator': { component: 'FdCalc', importPath: '@/components/calculators/FdCalc' },
  'finance-rd-calculator': { component: 'RdCalc', importPath: '@/components/calculators/RdCalc' },
  'finance-tax-calculator': { component: 'IncomeTaxCalc', importPath: '@/components/calculators/IncomeTaxCalc' },

  'calculators-age': { component: 'AgeCalc', importPath: '@/components/calculators/AgeCalc' },
  'calculators-bmi': { component: 'BmiCalc', importPath: '@/components/calculators/BmiCalc' },
  'calculators-scientific-calculator': { component: 'ScientificCalc', importPath: '@/components/calculators/ScientificCalc' },
  'calculators-unit-converter': { component: 'UnitConverterCalc', importPath: '@/components/calculators/UnitConverterCalc' },
  'calculators-date': { component: 'DateCalc', importPath: '@/components/calculators/DateCalc' },
  'calculators-discount': { component: 'DiscountCalc', importPath: '@/components/calculators/DiscountCalc' },
  'calculators-profit-loss': { component: 'ProfitLossCalc', importPath: '@/components/calculators/ProfitLossCalc' },
  'calculators-ratio': { component: 'RatioCalc', importPath: '@/components/calculators/RatioCalc' },
  'calculators-fraction': { component: 'FractionCalc', importPath: '@/components/calculators/FractionCalc' },
  'calculators-percentage-change': { component: 'PercentageChangeCalc', importPath: '@/components/calculators/PercentageChangeCalc' }
};

const CATEGORY_NAMES = {
  jee: { label: 'JEE & Exams', href: '/jee' },
  student: { label: 'Student Tools', href: '/student' },
  career: { label: 'Career & Salary', href: '/career' },
  finance: { label: 'Finance', href: '/finance' },
  calculators: { label: 'Calculators', href: '/calculators' }
};

// Read data/tools.ts
const toolsFile = fs.readFileSync(path.resolve(__dirname, '../data/tools.ts'), 'utf-8');
const toolsMatch = toolsFile.match(/export const TOOLS: ToolMetadata\[\] = (\[[\s\S]*?\n\])/);
if (!toolsMatch) {
  console.error('Could not find TOOLS array in data/tools.ts');
  process.exit(1);
}

// Evaluate TOOLS
const evalFn = new Function(`return ${toolsMatch[1]}`);
const tools = evalFn();

console.log(`Found ${tools.length} tools to generate.`);

let generatedCount = 0;

for (const tool of tools) {
  const mapping = TOOL_WIDGET_MAP[tool.id];
  if (!mapping) {
    console.warn(`No widget mapping found for tool id: ${tool.id}`);
    continue;
  }

  const categoryMeta = CATEGORY_NAMES[tool.category] || { label: tool.categoryName, href: `/${tool.category}` };
  // Route is e.g. /jee/marks-to-percentile -> directory app/jee/marks-to-percentile/page.tsx
  const relativeDir = tool.route.startsWith('/') ? tool.route.slice(1) : tool.route;
  const targetDir = path.resolve(__dirname, '../app', relativeDir);
  const targetFile = path.join(targetDir, 'page.tsx');

  fs.mkdirSync(targetDir, { recursive: true });

  const widgetJSX = mapping.props
    ? `<${mapping.component} ${mapping.props} />`
    : `<${mapping.component} />`;

  const pageContent = `import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getToolByRoute } from '@/data/tools'
import { getToolContent } from '@/data/toolContent'
import { CalculatorLayout } from '@/components/CalculatorLayout'
import { ${mapping.component} } from '${mapping.importPath}'

const ROUTE = '${tool.route}'
const TOOL_ID = '${tool.id}'

export const metadata: Metadata = {
  title: ${JSON.stringify(tool.seoTitle)},
  description: ${JSON.stringify(tool.seoDescription)},
  alternates: {
    canonical: 'https://studenttools.cyou${tool.route}',
  },
  openGraph: {
    title: ${JSON.stringify(tool.seoTitle)},
    description: ${JSON.stringify(tool.seoDescription)},
    url: 'https://studenttools.cyou${tool.route}',
    siteName: 'StudentTools',
    type: 'website',
  },
}

export default function ${tool.id.split('-').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join('')}Page() {
  const tool = getToolByRoute(ROUTE)
  const content = getToolContent(TOOL_ID)

  if (!tool || !content) {
    notFound()
  }

  return (
    <CalculatorLayout
      tool={tool}
      breadcrumbItems={[
        { label: '${categoryMeta.label}', href: '${categoryMeta.href}' },
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
      ${widgetJSX}
    </CalculatorLayout>
  )
}
`;

  fs.writeFileSync(targetFile, pageContent, 'utf-8');
  generatedCount++;
}

console.log(`Successfully generated ${generatedCount} tool pages in app/ directory.`);
