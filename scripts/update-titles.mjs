/**
 * update-titles.mjs
 * Batch-updates all tool page titles with year identifiers for CTR boost.
 * Run: node scripts/update-titles.mjs
 */

import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'

const ROOT = 'c:/Users/kumku/Documents/antigravity/vibrant-lavoisier/app'

const updates = [
  // ── STUDENT ────────────────────────────────────────────────────────────────
  {
    file: 'student/attendance-calculator/page.tsx',
    oldTitle: 'Attendance Calculator (75% Rule & Safe Bunk Allowance) | StudentTools',
    newTitle: 'Attendance Calculator 2025-26 (75% UGC Rule & Safe Bunk Allowance) | StudentTools',
    oldDesc: 'Calculate your exact attendance percentage, how many consecutive classes you need to attend for 75% criteria, and how many you can safely bunk.',
    newDesc: 'Calculate your exact 2025-26 college attendance percentage, classes needed for 75% UGC criteria, and how many lectures you can safely bunk.',
  },
  {
    file: 'student/average-marks/page.tsx',
    oldTitle: 'Average Marks Calculator (Simple & Weighted Mean Score) | StudentTools',
    newTitle: 'Average Marks Calculator 2025 (Simple & Weighted Mean Score) | StudentTools',
    oldDesc: 'Easily calculate simple and weighted average marks across subjects, quizzes, and test evaluations with clear steps.',
    newDesc: 'Easily calculate simple and weighted average marks across subjects, quizzes, and test evaluations in 2025 with clear step-by-step breakdown.',
  },
  {
    file: 'student/cgpa-to-percentage/page.tsx',
    oldTitle: 'CGPA to Percentage Calculator (CBSE 9.5x, 10x, VTU & Mumbai Univ) | StudentTools',
    newTitle: 'CGPA to Percentage Calculator 2025-26 (Official CBSE 9.5x, VTU & Mumbai Univ Formula) | StudentTools',
    oldDesc: 'Free CGPA to percentage converter. Easily convert 10-point CGPA into equivalent percentage using official CBSE and university conversion rules.',
    newDesc: 'Free CBSE CGPA to percentage converter 2025-26. Convert 10-point CGPA using official 9.5x CBSE, VTU, and Mumbai University conversion formulas.',
  },
  {
    file: 'student/gpa-calculator/page.tsx',
    oldTitle: 'GPA Calculator (Credit-Weighted Semester GPA & Quality Points) | StudentTools',
    newTitle: 'GPA Calculator 2025-26 (Credit-Weighted Semester SGPA & Quality Points) | StudentTools',
    oldDesc: 'Calculate your weighted semester Grade Point Average (GPA) using course credit hours and 10-point grade values.',
    newDesc: 'Calculate your 2025-26 weighted semester GPA (SGPA) using course credit hours and 10-point grade scale for Indian engineering and degree colleges.',
  },
  {
    file: 'student/marks-percentage/page.tsx',
    oldTitle: 'Marks Percentage Calculator (Dynamic Subjects & Overall Grade) | StudentTools',
    newTitle: 'Marks Percentage Calculator 2025-26 (CBSE, ICSE & State Board) | StudentTools',
    oldDesc: 'Calculate total percentage and average score across any number of subjects. Perfect for CBSE, ICSE, and state board marksheets.',
    newDesc: 'Calculate total percentage and average score across any number of subjects in 2025-26. Perfect for CBSE, ICSE, and state board marksheets.',
  },
  {
    file: 'student/percentage-calculator/page.tsx',
    oldTitle: 'Percentage Calculator (X of Y, Increase, Decrease & Difference) | StudentTools',
    newTitle: 'Percentage Calculator 2025 (X of Y, Increase, Decrease & Difference) | StudentTools',
    oldDesc: 'Calculate percentages instantly. Features X of Y, percentage increase, decrease, difference, with step-by-step mathematical breakdown.',
    newDesc: 'Calculate percentages instantly in 2025. Features X of Y, percentage increase, percentage decrease, and difference with step-by-step breakdown.',
  },
  {
    file: 'student/required-marks/page.tsx',
    oldTitle: 'Required Marks Calculator (Score Needed for Target Percentage) | StudentTools',
    newTitle: 'Required Marks Calculator 2025-26 (Score Needed for Target Percentage) | StudentTools',
    oldDesc: 'Determine the exact marks needed in upcoming assessments and final exams to achieve your desired overall percentage.',
    newDesc: 'Determine the exact marks needed in your 2025-26 assessments and final exams to achieve your desired overall percentage or grade.',
  },
  {
    file: 'student/study-hours/page.tsx',
    oldTitle: 'Study Hours Calculator (Exam Revision Time Budget & Planner) | StudentTools',
    newTitle: 'Study Hours Calculator 2025-26 (Exam Revision Time Budget & Planner) | StudentTools',
    oldDesc: 'Calculate total available study hours before your exams and allocate time proportionally across high, medium, and low priority subjects.',
    newDesc: 'Plan your 2025-26 exam preparation. Calculate available study hours and allocate revision time across high, medium, and low priority subjects.',
  },

  // ── CAREER ─────────────────────────────────────────────────────────────────
  {
    file: 'career/ctc-to-in-hand/page.tsx',
    oldTitle: 'CTC to In-Hand Salary Calculator (Monthly Take-Home After PF & TDS) | StudentTools',
    newTitle: 'CTC to In-Hand Salary Calculator FY 2025-26 (Take-Home After PF, PT & TDS) | StudentTools',
    oldDesc: 'Calculate your monthly in-hand take-home salary from annual CTC. Includes PF, Professional Tax, standard deduction, and new regime TDS estimation.',
    newDesc: 'Calculate your monthly in-hand take-home salary from annual CTC for FY 2025-26. Includes PF, Professional Tax, standard deduction, and new tax regime TDS.',
  },
  {
    file: 'career/monthly-to-annual-salary/page.tsx',
    oldTitle: 'Monthly to Annual Salary Converter (Gross Pay to LPA & Hourly Rate) | StudentTools',
    newTitle: 'Monthly to Annual Salary Converter 2025-26 (Gross Pay to LPA & Hourly Rate) | StudentTools',
    oldDesc: 'Convert your monthly gross salary to annual CTC (LPA). Also calculates weekly, daily, and hourly equivalent earnings.',
    newDesc: 'Convert your 2025-26 monthly gross salary to annual CTC in LPA. Calculates weekly, daily, and hourly equivalent earnings instantly.',
  },
  {
    file: 'career/annual-to-monthly-salary/page.tsx',
    oldTitle: 'Annual to Monthly Salary Converter (LPA to Monthly Gross Paycheck) | StudentTools',
    newTitle: 'Annual to Monthly Salary Converter 2025-26 (LPA to Monthly Gross Paycheck) | StudentTools',
    oldDesc: 'Convert your annual salary package (LPA) to monthly gross pay. Understand the breakdown between monthly and annual compensation.',
    newDesc: 'Convert your 2025-26 annual salary package (LPA) to monthly gross pay. Understand the full breakdown of monthly vs annual compensation.',
  },
  {
    file: 'career/salary-hike/page.tsx',
    oldTitle: 'Salary Hike Calculator (Appraisal & Job Switch Increment) | StudentTools',
    newTitle: 'Salary Hike Calculator 2025-26 (Appraisal & Job Switch Increment) | StudentTools',
    oldDesc: 'Calculate your revised salary, total increment amount, and monthly gain after receiving an appraisal or job-switch percentage hike.',
    newDesc: 'Calculate your 2025-26 revised salary, increment amount, and monthly gain after an appraisal or job-switch hike. Supports any percentage increase.',
  },
  {
    file: 'career/increment-calculator/page.tsx',
    oldTitle: 'Increment Percentage Calculator (Hike Between Old & New Salary) | StudentTools',
    newTitle: 'Increment Percentage Calculator 2025-26 (Hike Between Old & New Salary) | StudentTools',
    oldDesc: 'Find the exact percentage hike you received between your old and new salary during appraisals or job changes.',
    newDesc: 'Find the exact hike percentage between your old and new salary for 2025-26 appraisals or job changes. Instant calculation with steps.',
  },
  {
    file: 'career/pf-calculator/page.tsx',
    oldTitle: 'EPF Calculator (Employee PF, Employer Contribution & Compound Interest) | StudentTools',
    newTitle: 'EPF Calculator FY 2025-26 (Employee PF, Employer Contribution & Compound Interest) | StudentTools',
    oldDesc: 'Calculate Employee Provident Fund (EPF) contributions for employee and employer, EPS pension fund breakdown, and compound interest over tenure.',
    newDesc: 'Calculate Employee Provident Fund (EPF) contributions for FY 2025-26 — employee and employer shares, EPS pension breakdown, and compound interest over tenure.',
  },
  {
    file: 'career/bonus-calculator/page.tsx',
    oldTitle: 'Bonus Calculator (Performance Pay & Take-Home After Tax) | StudentTools',
    newTitle: 'Bonus Calculator 2025-26 (Performance Pay & Take-Home After Tax) | StudentTools',
    oldDesc: 'Calculate your bonus take-home after TDS tax deduction. Supports flat bonus, percentage of CTC, and annual performance bonus structures.',
    newDesc: 'Calculate your 2025-26 bonus take-home after TDS deduction. Supports flat bonus, percentage of CTC, and annual performance bonus structures.',
  },
  {
    file: 'career/internship-stipend/page.tsx',
    oldTitle: 'Internship Stipend Calculator (Total Earnings Over Duration) | StudentTools',
    newTitle: 'Internship Stipend Calculator 2025-26 (Total Earnings Over Duration) | StudentTools',
    oldDesc: 'Calculate total internship stipend earnings across any duration. Supports daily, weekly, and monthly stipend structures with working days.',
    newDesc: 'Calculate your 2025-26 internship stipend earnings across any duration. Supports daily, weekly, and monthly structures with working days calculation.',
  },

  // ── FINANCE ────────────────────────────────────────────────────────────────
  {
    file: 'finance/emi-calculator/page.tsx',
    oldTitle: 'EMI Calculator (Loan EMI, Total Interest & Amortization Schedule) | StudentTools',
    newTitle: 'EMI Calculator 2025-26 (Loan EMI, Total Interest & Amortization Schedule) | StudentTools',
    oldDesc: 'Calculate monthly loan EMI with reducing balance interest. View total interest, total payment, and detailed yearly amortization schedule.',
    newDesc: 'Calculate monthly loan EMI using reducing balance method. View total interest, total payment, and detailed 2025-26 yearly amortization schedule.',
  },
  {
    file: 'finance/sip-calculator/page.tsx',
    oldTitle: 'SIP Calculator (Mutual Fund Returns & Compound Wealth Projector) | StudentTools',
    newTitle: 'SIP Calculator 2025-26 (Mutual Fund Returns & Compound Wealth Projector) | StudentTools',
    oldDesc: 'Project your mutual fund SIP returns. Calculate total invested capital, estimated gains, and final maturity value over 1 to 30 years.',
    newDesc: 'Project your 2025-26 mutual fund SIP returns. Calculate total invested capital, estimated gains, and final maturity value over 1 to 30 years.',
  },
  {
    file: 'finance/gst-calculator/page.tsx',
    oldTitle: 'GST Calculator India (Inclusive & Exclusive with CGST/SGST Breakdown) | StudentTools',
    newTitle: 'GST Calculator India 2025-26 (Inclusive & Exclusive with CGST/SGST Breakdown) | StudentTools',
    oldDesc: 'Calculate Indian GST instantly. Supports GST inclusive and exclusive modes with automatic 50:50 CGST and SGST bifurcation.',
    newDesc: 'Calculate Indian GST instantly for 2025-26. Supports GST inclusive and exclusive modes with automatic 50:50 CGST and SGST bifurcation.',
  },
  {
    file: 'finance/fd-calculator/page.tsx',
    oldTitle: 'Fixed Deposit (FD) Calculator (Quarterly Compounding & Maturity Value) | StudentTools',
    newTitle: 'FD Calculator 2025-26 (Fixed Deposit Quarterly Compounding & Maturity Value) | StudentTools',
    oldDesc: 'Calculate bank FD maturity value and interest earned with quarterly compounding. Includes special senior citizen interest rate options.',
    newDesc: 'Calculate bank FD maturity value and interest earned for 2025-26 with quarterly compounding. Includes senior citizen interest rate options.',
  },
  {
    file: 'finance/rd-calculator/page.tsx',
    oldTitle: 'Recurring Deposit (RD) Calculator (Maturity Amount & Interest) | StudentTools',
    newTitle: 'RD Calculator 2025-26 (Recurring Deposit Maturity Amount & Interest) | StudentTools',
    oldDesc: 'Calculate maturity value and interest earned on recurring monthly deposits across Indian commercial banks and post offices.',
    newDesc: 'Calculate 2025-26 maturity value and interest earned on recurring monthly deposits across Indian commercial banks and post offices.',
  },
  {
    file: 'finance/tax-calculator/page.tsx',
    oldTitle: 'Income Tax Calculator India (New vs Old Regime FY 2024-25 & 2025-26) | StudentTools',
    newTitle: 'Income Tax Calculator India FY 2025-26 (New vs Old Regime, Section 87A & Cess) | StudentTools',
    oldDesc: 'Calculate Indian Income Tax liability. Compare New Tax Regime vs Old Tax Regime with standard deduction (?75k), Section 87A rebate, and health cess.',
    newDesc: 'Calculate FY 2025-26 Indian Income Tax. Compare New Tax Regime vs Old Tax Regime with ₹75,000 standard deduction, Section 87A rebate, and health cess.',
  },

  // ── CALCULATORS (everyday) ─────────────────────────────────────────────────
  {
    file: 'calculators/age/page.tsx',
    oldTitle: 'Age Calculator (Exact Age in Years, Months, Days & Birthday Countdown) | StudentTools',
    newTitle: 'Age Calculator 2025 (Exact Age in Years, Months, Days & Birthday Countdown) | StudentTools',
    oldDesc: 'Calculate your exact chronological age in years, months, and days from your date of birth. Includes total days lived and days until next birthday.',
    newDesc: 'Calculate your exact age in 2025 — years, months, days, total days lived, and days remaining until your next birthday.',
  },
  {
    file: 'calculators/bmi/page.tsx',
    oldTitle: 'BMI Calculator (Metric & Imperial with WHO & Asian-Indian Thresholds) | StudentTools',
    newTitle: 'BMI Calculator 2025 (Metric & Imperial with WHO & Asian-Indian Health Thresholds) | StudentTools',
    oldDesc: 'Calculate your Body Mass Index (BMI) in metric or imperial units. View WHO category and healthy weight range based on your height.',
    newDesc: 'Calculate your Body Mass Index (BMI) in 2025 using metric or imperial units. Includes WHO categories and Asian-Indian healthy weight thresholds.',
  },
  {
    file: 'calculators/scientific-calculator/page.tsx',
    oldTitle: 'Scientific Calculator Online (Trig, Log, Powers & Safe Expression Parser) | StudentTools',
    newTitle: 'Scientific Calculator Online 2025 (Trig, Log, Powers & Safe Expression Parser) | StudentTools',
    oldDesc: 'Free online scientific calculator with trigonometric functions (DEG/RAD), logarithms, exponents, roots, and a zero-eval safe expression parser.',
    newDesc: 'Free online scientific calculator with trigonometric functions (DEG/RAD), logarithms, exponents, roots, and a zero-eval safe expression parser — updated 2025.',
  },
  {
    file: 'calculators/unit-converter/page.tsx',
    oldTitle: 'Unit Converter (Length, Mass, Temperature, Area, Volume, Speed & Data) | StudentTools',
    newTitle: 'Unit Converter 2025 (Length, Mass, Temperature, Area, Volume, Speed & Data) | StudentTools',
    oldDesc: 'Convert between units of length, mass, temperature, area, volume, speed, and digital data storage. Clean, fast, mobile-first.',
    newDesc: 'Convert units of length, mass, temperature, area, volume, speed, and digital data storage in 2025. Clean, accurate, and mobile-first.',
  },
  {
    file: 'calculators/date/page.tsx',
    oldTitle: 'Date Calculator (Days Between Dates, Business Days & Date Add/Subtract) | StudentTools',
    newTitle: 'Date Calculator 2025 (Days Between Dates, Business Days & Date Add/Subtract) | StudentTools',
    oldDesc: 'Calculate the number of days, weeks, or months between any two dates. Also adds or subtracts days from a date and counts business days.',
    newDesc: 'Calculate days between dates in 2025, add or subtract days, count business days, and find date differences across weeks and months.',
  },
  {
    file: 'calculators/discount/page.tsx',
    oldTitle: 'Discount Calculator (Sale Price & Savings from Percentage Off) | StudentTools',
    newTitle: 'Discount Calculator 2025 (Sale Price & Savings from Percentage Off) | StudentTools',
    oldDesc: 'Calculate discounted sale price and total savings from a given percentage off on any original price. Simple and instant.',
    newDesc: 'Calculate discounted sale price and total savings from any percentage off in 2025. Instant result with original price, discount, and final price breakdown.',
  },
  {
    file: 'calculators/profit-loss/page.tsx',
    oldTitle: 'Profit & Loss Calculator (Amount, Percentage & Cost Price Margin) | StudentTools',
    newTitle: 'Profit & Loss Calculator 2025 (Amount, Percentage & Margin on Cost Price) | StudentTools',
    oldDesc: 'Calculate profit or loss amount, percentage, and selling price from cost price and markup or markdown values.',
    newDesc: 'Calculate profit or loss amount, percentage, and selling price from cost price and markup in 2025. Includes margin analysis with step-by-step working.',
  },
  {
    file: 'calculators/ratio/page.tsx',
    oldTitle: 'Ratio Calculator (Simplify to Lowest Terms, Decimal & Percentage) | StudentTools',
    newTitle: 'Ratio Calculator 2025 (Simplify to Lowest Terms, Decimal & Percentage) | StudentTools',
    oldDesc: 'Simplify any ratio to its lowest terms using GCD. Also displays the ratio as a decimal and as a percentage for both parts.',
    newDesc: 'Simplify any ratio to lowest terms using GCD in 2025. Displays ratio as a decimal and percentage for both parts with full working.',
  },
  {
    file: 'calculators/fraction/page.tsx',
    oldTitle: 'Fraction Calculator (Add, Subtract, Multiply & Divide with Steps) | StudentTools',
    newTitle: 'Fraction Calculator 2025 (Add, Subtract, Multiply & Divide with Step-by-Step) | StudentTools',
    oldDesc: 'Add, subtract, multiply, or divide any two fractions with full step-by-step working. Results shown in both simplified fraction and decimal form.',
    newDesc: 'Add, subtract, multiply, or divide any two fractions in 2025 with full step-by-step working. Results in simplified fraction and decimal form.',
  },
  {
    file: 'calculators/percentage-change/page.tsx',
    oldTitle: 'Percentage Change Calculator (Increase, Decrease & Step-by-Step Working) | StudentTools',
    newTitle: 'Percentage Change Calculator 2025 (Increase, Decrease & Step-by-Step Working) | StudentTools',
    oldDesc: 'Calculate percentage increase or decrease between any two values with clear step-by-step resolution and sign indicator.',
    newDesc: 'Calculate percentage increase or decrease between any two values in 2025 with clear step-by-step resolution and direction indicator.',
  },
]

let updated = 0
let skipped = 0

for (const { file, oldTitle, newTitle, oldDesc, newDesc } of updates) {
  const filePath = join(ROOT, file)
  let content
  try {
    content = readFileSync(filePath, 'utf-8')
  } catch {
    console.log(`⚠️  SKIP (not found): ${file}`)
    skipped++
    continue
  }

  // Replace title (handles both " and & encoding)
  const updatedContent = content
    .replaceAll(oldTitle, newTitle)
    .replaceAll(oldTitle.replace(/&/g, '&amp;'), newTitle.replace(/&/g, '&amp;'))
    .replaceAll(oldDesc, newDesc)
    .replaceAll(oldDesc.replace(/&/g, '&amp;'), newDesc.replace(/&/g, '&amp;'))

  if (updatedContent === content) {
    console.log(`⚠️  NO CHANGE (title may differ): ${file}`)
    skipped++
    continue
  }

  writeFileSync(filePath, updatedContent, 'utf-8')
  console.log(`✅ Updated: ${file}`)
  updated++
}

console.log(`\n🎯 Done: ${updated} updated, ${skipped} skipped.`)
