# StudentTools — Production Platform (studenttools.cyou)

A fast, mobile-first, client-side platform providing free calculators, educational tools, JEE/exam tools, career/salary tools, finance calculators, and everyday utilities for Indian students, competitive exam aspirants, and working professionals.

🌐 **Production Domain:** [https://studenttools.cyou](https://studenttools.cyou)

---

## 🚀 Key Architectural Principles

1. **100% Client-Side Calculations:** All 38 mathematical, financial, and academic engines run entirely in the user's web browser. Zero server computation cost, zero database latency, zero cold starts, and absolute user data privacy.
2. **Zero Insecure `eval()`:** The online Scientific Calculator features an AST recursive-descent expression parser with operator precedence (PEMDAS) and mathematical functions.
3. **Safety & Robustness:** Every formula is hardened against edge cases (`NaN`, `Infinity`, division-by-zero, negative values where inappropriate, and extreme scales).
4. **Tailored for Indian Context:**
   - **JEE:** Multi-shift normalization, All India CRL rank estimation (~14.5 Lakh candidate baseline), JoSAA round 6 closing ranks, +4 / -1 negative marking.
   - **Student:** CBSE 9.5x multiplier, 10x scale, VTU `(CGPA - 0.75)*10`, Mumbai University formulas, and UGC 75% attendance bunk calculator.
   - **Career:** In-hand salary simulation with Basic (40-50%), HRA, Employee PF (12%), statutory Professional Tax (~₹200/mo), and TDS.
   - **Finance:** Union Budget New Tax Regime slabs (FY 2024-25 & FY 2025-26) with ₹75,000 standard deduction, Section 87A full rebate up to ₹7,00,000 taxable income, reducing-balance loan EMI amortization, SIP compound wealth projection, and CGST/SGST/IGST breakdown.
   - **Everyday:** Chronological age with leap-year handling and birthday countdown, WHO & Asian-Indian BMI thresholds, unit conversions across 7 dimensions, business day date math, discount savings, and profit/loss margins.
5. **SEO & AdSense Architecture:**
   - Dynamic `sitemap.xml` with all 49 canonical URLs.
   - Optimized `robots.txt`.
   - Structured JSON-LD schemas (`WebApplication`, `BreadcrumbList`, and `FAQPage`) on all tool pages.
   - Standardized 14-part Calculator Layout (Breadcrumbs, H1, description, interactive tool, result cards, methodology, formulas, step-by-step example, assumptions, disclaimers, FAQs, and related tools).
   - CLS-safe `AdPlaceholder` slots strictly isolated from interactive controls.

---

## 🛠️ Tool Catalog (38 Tools Across 5 Categories)

### 1. JEE & Competitive Exams (6 Tools)
- `/jee/marks-to-percentile` — Shift-wise difficulty normalization (Easy / Moderate / Tough).
- `/jee/percentile-to-rank` — All India CRL and Category rank estimator.
- `/jee/college-predictor` — NIT, IIIT, and GFTI recommendation engine using JoSAA cutoffs.
- `/jee/cutoff` — JoSAA opening and closing ranks explorer.
- `/jee/marks-calculator` — Raw score computation (+4 / -1) with subject-wise accuracy analytics.
- `/jee/countdown` — Real-time dynamic Indian Standard Time (IST) countdown timer.

### 2. Student & Academic Tools (8 Tools)
- `/student/cgpa-to-percentage` — CBSE (9.5x), 10x, VTU, and Mumbai University conversions.
- `/student/percentage-calculator` — Universal X of Y, percentage increase, decrease, and difference.
- `/student/marks-percentage` — Multi-subject marks percentage and grade aggregator.
- `/student/gpa-calculator` — Semester GPA (SGPA) with course credits and letter grades.
- `/student/attendance-calculator` — Attendance %, classes required for 75%, and safe bunks allowed.
- `/student/required-marks` — Target percentage planner for upcoming final exams.
- `/student/average-marks` — Simple arithmetic and weighted mean scores.
- `/student/study-hours` — Revision time allocation by subject difficulty priority.

### 3. Career & Salary Tools (8 Tools)
- `/career/ctc-to-in-hand` — CTC to monthly in-hand take-home salary after PF, PT, and TDS.
- `/career/monthly-to-annual-salary` — Monthly pay to annual, weekly, daily, and hourly rates.
- `/career/annual-to-monthly-salary` — Annual LPA to monthly gross paycheck.
- `/career/salary-hike` — Revised compensation and monthly gain from hike %.
- `/career/increment-calculator` — Percentage hike received between old and new salary.
- `/career/pf-calculator` — Employee/Employer EPF and EPS contribution with compound interest.
- `/career/bonus-calculator` — Performance bonus and net take-home after TDS.
- `/career/internship-stipend` — Total stipend projection across duration and working schedule.

### 4. Finance Calculators (6 Tools)
- `/finance/emi-calculator` — Reducing-balance loan EMI with yearly amortization breakdown.
- `/finance/sip-calculator` — Mutual fund SIP compound wealth projector.
- `/finance/gst-calculator` — Inclusive/exclusive prices with 50:50 CGST and SGST split.
- `/finance/fd-calculator` — Fixed Deposit maturity with quarterly compounding.
- `/finance/rd-calculator` — Recurring Deposit monthly installment compounding.
- `/finance/tax-calculator` — Income Tax comparison (New vs Old Regime FY 2024-25 & 2025-26).

### 5. Everyday & General Calculators (10 Tools)
- `/calculators/age` — Exact age in years, months, days, total days lived, and next birthday.
- `/calculators/bmi` — Metric & imperial Body Mass Index and healthy weight ranges.
- `/calculators/scientific-calculator` — Safe scientific calculator with trig (DEG/RAD), log, roots, and powers.
- `/calculators/unit-converter` — Length, Mass, Temp, Area, Volume, Speed, and Data storage.
- `/calculators/date` — Days between dates, business days, and date add/subtract.
- `/calculators/discount` — Final sale price and savings amount from % discount.
- `/calculators/profit-loss` — Profit/loss amount and margin percentage on Cost Price.
- `/calculators/ratio` — Ratio simplification to lowest terms using GCD, decimals, and %.
- `/calculators/fraction` — Addition, subtraction, multiplication, and division of fractions.
- `/calculators/percentage-change` — Percentage increase or decrease with step-by-step resolution.

---

## 💻 Tech Stack

- **Framework:** [Next.js 14 (App Router)](https://nextjs.org/)
- **Language:** [TypeScript 5](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS 3](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Testing:** [Vitest 2](https://vitest.dev/)
- **Deployment:** Zero-config Vercel / Cloudflare Pages / Node.js static hosting

---

## 🏃 Local Development & Verification

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Run Test Suite
Runs all 71 unit and edge-case tests across all calculation engines:
\`\`\`bash
npm run test
\`\`\`

### 3. Run Development Server
\`\`\`bash
npm run dev
\`\`\`
Visit \`http://localhost:3000\` in your browser.

### 4. Run Production Build
Validates TypeScript compilation, ESLint rules, and statically prerenders all 54 routes:
\`\`\`bash
npm run build
npm run start
\`\`\`

---

## 📜 Compliance & Transparency Pages
- [About Us](/about) — Platform mission, client-side computation guarantee, editorial standards.
- [Privacy Policy](/privacy) — Zero data storage, cookies, and AdSense compliance.
- [Terms of Use](/terms) — Terms of service, intellectual property, and acceptable usage.
- [Disclaimer](/disclaimer) — Legal and educational disclaimers for exam predictions, financial advice, and health screening.
- [Contact](/contact) — Support, feedback, and anomaly reporting.

---

## 📄 License
MIT License. Built for students, aspirants, and everyday utility users.
