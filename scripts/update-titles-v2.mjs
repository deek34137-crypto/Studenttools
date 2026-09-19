/**
 * update-titles-v2.mjs — fixes remaining skipped pages with correct existing titles
 */
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const ROOT = 'c:/Users/kumku/Documents/antigravity/vibrant-lavoisier/app'

const updates = [
  // ── CAREER (actual titles from file) ────────────────────────────────────────
  {
    file: 'career/ctc-to-in-hand/page.tsx',
    old: 'CTC to In-Hand Salary Calculator (Monthly Take-Home Breakdown India) | StudentTools',
    new: 'CTC to In-Hand Salary Calculator FY 2025-26 (Monthly Take-Home Breakdown India) | StudentTools',
    oldDesc: 'Estimate your monthly take-home salary from your annual CTC in India. Detailed breakdown of Basic, HRA, Employee PF, PT, and TDS tax deductions.',
    newDesc: 'Estimate your FY 2025-26 monthly take-home salary from annual CTC in India. Detailed breakdown of Basic, HRA, Employee PF, PT, and new regime TDS deductions.',
  },
  {
    file: 'career/monthly-to-annual-salary/page.tsx',
    old: 'Monthly to Annual Salary Calculator (Yearly, Weekly & Daily Rates) | StudentTools',
    new: 'Monthly to Annual Salary Calculator 2025-26 (Yearly, Weekly & Daily Rates) | StudentTools',
    oldDesc: 'Quickly convert your monthly earnings into annual gross salary, quarterly figures, weekly pay, and hourly rates.',
    newDesc: 'Convert your 2025-26 monthly earnings into annual gross salary, quarterly figures, weekly pay, and hourly rates instantly.',
  },
  {
    file: 'career/annual-to-monthly-salary/page.tsx',
    old: 'Annual to Monthly Salary Calculator (LPA to Monthly Gross) | StudentTools',
    new: 'Annual to Monthly Salary Calculator 2025-26 (LPA to Monthly Gross) | StudentTools',
    oldDesc: 'Convert annual CTC package in Lakhs Per Annum (LPA) into monthly gross paycheck, weekly income, and daily rates.',
    newDesc: 'Convert your 2025-26 annual CTC in Lakhs Per Annum (LPA) into monthly gross paycheck, weekly income, and daily rates.',
  },
  {
    file: 'career/increment-calculator/page.tsx',
    old: 'Increment Calculator (Percentage Hike Between Old & New Salary) | StudentTools',
    new: 'Increment Calculator 2025-26 (Percentage Hike Between Old & New Salary) | StudentTools',
    oldDesc: 'Compare your previous salary and revised salary to calculate the exact percentage increment and monthly gain.',
    newDesc: 'Compare your previous and revised 2025-26 salary to calculate the exact percentage increment and monthly gain during appraisals.',
  },
  {
    file: 'career/pf-calculator/page.tsx',
    old: 'PF Calculator (EPF & EPS Monthly Contribution & Interest) | StudentTools',
    new: 'PF Calculator FY 2025-26 (EPF & EPS Monthly Contribution & Interest) | StudentTools',
    oldDesc: 'Calculate monthly Employee and Employer Provident Fund (EPF/EPS) contributions and project long-term compound wealth at EPFO interest rates.',
    newDesc: 'Calculate FY 2025-26 monthly Employee and Employer Provident Fund (EPF/EPS) contributions and project long-term compound wealth at EPFO interest rates.',
  },
  {
    file: 'career/bonus-calculator/page.tsx',
    old: 'Bonus Calculator (Performance & Annual Incentive After TDS) | StudentTools',
    new: 'Bonus Calculator FY 2025-26 (Performance & Annual Incentive After TDS) | StudentTools',
    oldDesc: 'Calculate gross bonus based on percentage of salary or fixed payout and estimate the net in-hand bonus after TDS deductions.',
    newDesc: 'Calculate your FY 2025-26 gross bonus from percentage of salary or fixed payout and estimate net in-hand bonus after TDS deductions.',
  },
  {
    file: 'career/internship-stipend/page.tsx',
    old: 'Internship Stipend Calculator (Hourly, Weekly & Monthly Intern Pay) | StudentTools',
    new: 'Internship Stipend Calculator 2025-26 (Hourly, Weekly & Monthly Intern Pay) | StudentTools',
    oldDesc: 'Calculate your total expected internship earnings based on monthly, weekly, or hourly compensation and working schedules.',
    newDesc: 'Calculate your 2025-26 total internship earnings based on monthly, weekly, or hourly compensation and working schedule.',
  },

  // ── CALCULATORS (actual titles from file) ────────────────────────────────────
  {
    file: 'calculators/age/page.tsx',
    old: 'Age Calculator (Exact Age in Years, Months, Days & Next Birthday) | StudentTools',
    new: 'Age Calculator 2025 (Exact Age in Years, Months, Days & Next Birthday) | StudentTools',
    oldDesc: 'Calculate your exact chronological age in years, months, days, and total days lived. Find out the day of the week you were born and next birthday countdown.',
    newDesc: 'Calculate your exact age in 2025 — years, months, days, total days lived, the day you were born, and your next birthday countdown.',
  },
  {
    file: 'calculators/bmi/page.tsx',
    old: 'BMI Calculator (Body Mass Index & Healthy Weight Range) | StudentTools',
    new: 'BMI Calculator 2025 (Body Mass Index, WHO Categories & Healthy Weight Range) | StudentTools',
    oldDesc: 'Free Body Mass Index (BMI) calculator. Check your BMI score, WHO weight category, and healthy weight range for your height.',
    newDesc: 'Free BMI calculator 2025. Check your Body Mass Index score, WHO weight category, Asian-Indian thresholds, and healthy weight range for your height.',
  },
  {
    file: 'calculators/scientific-calculator/page.tsx',
    old: 'Scientific Calculator Online (Trig, Log, Powers & Roots) | StudentTools',
    new: 'Scientific Calculator Online 2025 (Trig, Log, Powers, Roots & Safe Parser) | StudentTools',
    oldDesc: 'Fast, responsive online scientific calculator. Supports sine, cosine, tangent, log, ln, square roots, powers, parentheses, and angle modes.',
    newDesc: 'Fast online scientific calculator 2025. Supports sine, cosine, tangent, log, ln, square roots, powers, parentheses, and DEG/RAD angle modes with safe expression parser.',
  },
  {
    file: 'calculators/unit-converter/page.tsx',
    old: 'Unit Converter (Length, Mass, Temperature, Area & Digital Units) | StudentTools',
    new: 'Unit Converter 2025 (Length, Mass, Temperature, Area, Volume, Speed & Digital Units) | StudentTools',
    oldDesc: 'Universal unit converter. Convert meters to feet, kilograms to pounds, Celsius to Fahrenheit, acres to bigha, and more.',
    newDesc: 'Universal unit converter 2025. Convert length, mass, temperature, area, volume, speed, and digital storage units instantly on any device.',
  },
  {
    file: 'calculators/date/page.tsx',
    old: 'Date Calculator (Days Between Dates & Add/Subtract Days) | StudentTools',
    new: 'Date Calculator 2025 (Days Between Dates, Business Days & Add/Subtract) | StudentTools',
    oldDesc: 'Calculate exact days, weeks, months, and business days between two dates, or add and subtract days to compute future deadlines.',
    newDesc: 'Calculate days between any two dates in 2025, count business days, add or subtract days, and find future deadlines accurately.',
  },
  {
    file: 'calculators/discount/page.tsx',
    old: 'Discount Calculator (Sale Price & Savings Amount) | StudentTools',
    new: 'Discount Calculator 2025 (Sale Price & Total Savings from Percentage Off) | StudentTools',
    oldDesc: 'Calculate final sale prices and total money saved from percentage discounts. Simple, fast shopping discount calculator.',
    newDesc: 'Calculate final sale price and total money saved from any percentage discount in 2025. Simple, fast, and accurate shopping discount calculator.',
  },
  {
    file: 'calculators/profit-loss/page.tsx',
    old: 'Profit and Loss Calculator (Cost Price vs Selling Price Margin) | StudentTools',
    new: 'Profit & Loss Calculator 2025 (Cost Price vs Selling Price Margin & Percentage) | StudentTools',
    oldDesc: 'Determine profit or loss amount and percentage from Cost Price (CP) and Selling Price (SP) with clear mathematical formulas.',
    newDesc: 'Determine profit or loss amount and percentage from Cost Price (CP) and Selling Price (SP) in 2025 with clear step-by-step formulas.',
  },
  {
    file: 'calculators/ratio/page.tsx',
    old: 'Ratio Calculator (Ratio Simplification to Lowest Terms & Scaling) | StudentTools',
    new: 'Ratio Calculator 2025 (Simplify to Lowest Terms, Decimal & Percentage) | StudentTools',
    oldDesc: 'Simplify mathematical ratios to their simplest form using GCD. Find equivalent ratios, decimal equivalents, and percentage values.',
    newDesc: 'Simplify any ratio to lowest terms using GCD in 2025. Find equivalent ratios, decimal equivalents, and percentage representation with steps.',
  },
  {
    file: 'calculators/fraction/page.tsx',
    old: 'Fraction Calculator (Add, Subtract, Multiply, Divide & Simplify) | StudentTools',
    new: 'Fraction Calculator 2025 (Add, Subtract, Multiply, Divide & Simplify with Steps) | StudentTools',
    oldDesc: 'Free online fraction calculator. Add, subtract, multiply, and divide fractions with step-by-step simplification and mixed numbers.',
    newDesc: 'Free online fraction calculator 2025. Add, subtract, multiply, and divide fractions with full step-by-step simplification and mixed number support.',
  },
  {
    file: 'calculators/percentage-change/page.tsx',
    old: 'Percentage Increase / Decrease Calculator (Step-by-Step Change) | StudentTools',
    new: 'Percentage Increase / Decrease Calculator 2025 (Step-by-Step Change) | StudentTools',
    oldDesc: 'Calculate the percentage change between an initial and final value. Shows clear step-by-step formula and explains increase vs decrease.',
    newDesc: 'Calculate percentage increase or decrease between any two values in 2025 with clear step-by-step formula and increase/decrease direction indicator.',
  },
]

let updated = 0
let skipped = 0

for (const { file, old: oldStr, new: newStr, oldDesc, newDesc } of updates) {
  const filePath = join(ROOT, file)
  let content
  try {
    content = readFileSync(filePath, 'utf-8')
  } catch {
    console.log(`⚠️  SKIP (not found): ${file}`)
    skipped++
    continue
  }

  const updatedContent = content
    .replaceAll(oldStr, newStr)
    .replaceAll(oldDesc, newDesc)

  if (updatedContent === content) {
    console.log(`⚠️  NO CHANGE: ${file}`)
    skipped++
    continue
  }

  writeFileSync(filePath, updatedContent, 'utf-8')
  console.log(`✅ Updated: ${file}`)
  updated++
}

console.log(`\n🎯 Done: ${updated} updated, ${skipped} skipped.`)
