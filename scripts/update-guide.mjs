import fs from 'fs'

const updatedArticle = {
  id: 'art_st001_jee_negative_marking',
  topic_id: 'ST001',
  title: 'How JEE Main Negative Marking Affects Your Total Score (2026 Strategy Guide)',
  slug: 'how-jee-main-negative-marking-affects-score',
  excerpt: 'Master the NTA JEE Main 2026 marking scheme (+4/-1). Discover the true 5-mark opportunity cost of wrong answers, option elimination mathematics, Section B numerical penalties, and how negative marks degrade your percentile.',
  meta_title: 'How JEE Main Negative Marking Affects Total Score & Percentile (2026)',
  meta_description: 'Comprehensive guide to JEE Main 2026 marking scheme (+4/-1). Understand the hidden 5-mark penalty, option elimination math, Section B rules, and mock test strategy.',
  primary_keyword: 'jee main negative marking',
  secondary_keywords: [
    'jee marking scheme 2026',
    'negative marking impact on percentile',
    'jee scoring rules',
    '4 marks minus 1',
    'jee raw score calculation',
    'jee section b numerical negative marking'
  ],
  category: 'JEE',
  topic_cluster: 'Marks & Scoring',
  article_type: 'Explanation',
  search_intent: 'Educational',
  reading_time_minutes: 8,
  content_hash: 'hash_st001_revised_v2',
  status: 'PUBLISHED',
  published_at: '2026-09-19T10:00:00.000Z',
  created_at: '2026-09-19T10:00:00.000Z',
  updated_at: new Date().toISOString(),
  related_tools: [
    {
      name: 'JEE Marks Calculator',
      route: '/jee/marks-calculator',
      description: 'Calculate your raw JEE score with subject-wise breakdown, negative deduction analysis, and accuracy percentage.'
    },
    {
      name: 'JEE Marks to Percentile Calculator',
      route: '/jee/marks-to-percentile',
      description: 'Estimate your shift-adjusted NTA percentile and qualifying status from raw test marks.'
    }
  ],
  faq: [
    {
      question: 'How much does 1 incorrect answer actually cost in JEE Main?',
      answer: 'While the official penalty is −1 mark, the true opportunity cost is 5 marks. If you had solved the question correctly, you would have earned +4 marks. Because you got it wrong, you received −1 mark. The net swing between a correct answer and an incorrect answer is 4 − (−1) = 5 marks.'
    },
    {
      question: 'Is there negative marking in JEE Main Section B numerical questions?',
      answer: 'Yes. Under the official NTA guidelines, Section B (numerical-value questions) carries negative marking: +4 marks for correct answers, −1 mark for incorrect answers, and 0 marks for unattempted questions. Candidates must never guess numerical values blindly.'
    },
    {
      question: 'How does negative marking impact my NTA percentile score?',
      answer: 'Negative marking directly lowers your raw score. Because thousands of candidates cluster within narrow score bands (especially between 140 and 200 marks), losing just 2 to 3 marks due to negative marking can lower your percentile by 0.5% to 1.5%, shifting your All India Rank by 10,000 to 25,000 positions.'
    },
    {
      question: 'When is it mathematically worth guessing an MCQ in JEE Main?',
      answer: 'If you can eliminate at least one option with certainty, the expected value (EV) of guessing becomes positive (+0.67 marks for 3 choices, +1.5 marks for 2 choices). If you have no idea and all 4 options are equally likely, blind guessing has an expected value of only +0.25 marks, which carries high variance and is not recommended under time pressure.'
    },
    {
      question: 'What is a good accuracy percentage for JEE Main mock tests?',
      answer: 'A competitive JEE Main accuracy target is 85% to 90%. For instance, attempting 60 questions with 88% accuracy (53 correct, 7 wrong) yields 205 marks, whereas attempting 60 questions with 70% accuracy (42 correct, 18 wrong) drops your score to just 150 marks.'
    }
  ],
  content: `In the National Testing Agency (NTA) Joint Entrance Examination (JEE Main Paper 1 for B.E./B.Tech.), every question attempted carries substantial stakes: **+4 marks for every correct response**, **−1 mark for every incorrect response**, and **0 marks for unanswered questions**.

While this "+4 / −1" formula looks straightforward on paper, negative marking is the single most common reason high-potential students fall short of their dream National Institutes of Technology (NITs) and Indian Institutes of Information Technology (IIITs). In competitive exams where 1.2 to 1.4 million candidates compete, a microscopic margin of 2 to 4 raw marks can swing your All India Rank (AIR) by over 15,000 places.

This comprehensive guide breaks down the official 2026 NTA marking framework, reveals the mathematical reality of the **"5-mark opportunity penalty",** evaluates the statistical probability of guessing, and outlines an actionable 3-pass exam-day strategy to protect your score.

---

## Official NTA JEE Main 2026 Marking Scheme

For JEE Main Paper 1 (B.E./B.Tech.), the examination is conducted as a Computer-Based Test (CBT) consisting of **75 questions worth a total of 300 marks**. The paper is split equally across Mathematics, Physics, and Chemistry.

| Response Category | Marks Awarded | Impact on Raw Score |
| :--- | :--- | :--- |
| **Correct Answer** | **+4 Marks** | Adds 4 marks to total |
| **Incorrect Answer** | **−1 Mark** | Deducts 1 mark from accumulated score |
| **Unanswered / Marked for Review (without answer)** | **0 Marks** | Zero deduction; neutral |

### Section A vs Section B Rules (Crucial Update)

Each subject contains two distinct sections:
1. **Section A (Multiple Choice Questions - MCQs):** 20 mandatory questions per subject (60 questions total). Each question has 4 options with exactly one correct choice.
2. **Section B (Numerical-Value Questions):** Candidates must attempt 5 out of 10 numerical questions per subject (15 questions total). The answer must be entered as a numerical value rounded according to instructions.

> **Important NTA Rule Reminder:** Under current NTA regulations, **negative marking applies equally to both Section A (MCQs) and Section B (Numerical Questions)**. Prior to 2022, numerical questions had zero negative marking, leading many aspirants to make wild guesses. Today, submitting a wrong numerical answer costs you −1 mark just like an MCQ.

---

## The JEE Main Raw Marks Formula

Your raw score is calculated using the following deterministic equation:

\`\`\`text
Raw Marks = (Correct Answers × 4) − (Incorrect Answers × 1)
\`\`\`

Or algebraically:

\`\`\`text
Score = 4C − I
\`\`\`

Where:
- **C** = Number of correct answers (0 to 75)
- **I** = Number of incorrect answers ($I \\le 75 - C$)
- **Unattempted** = $75 - (C + I)$ (contributes 0 marks)

### Worked Numerical Example

Consider a candidate who attempts 62 out of 75 questions in a full-length mock exam:
- **Correct ($C$):** 52 questions
- **Incorrect ($I$):** 10 questions
- **Unattempted:** 13 questions

Calculating the net score:
- **Gross Marks Earned:** $52 \\times 4 = 208$ marks
- **Negative Deduction:** $10 \\times 1 = 10$ marks
- **Net Raw Score:** $208 - 10 = \\mathbf{198 / 300}$
- **Accuracy Rate:** $\\frac{52}{62} \\times 100 = \\mathbf{83.87\\%}$

If this student had avoided those 10 incorrect guesses and left them blank, their score would have been **208 / 300**. Those 10 wrong attempts erased 10 hard-earned marks, which in JEE Main corresponds to roughly a 1.2 percentile drop.

---

## The Hidden 5-Mark Penalty: Opportunity Cost Explained

Most aspirants evaluate mistakes by saying: *"It is only a 1-mark loss."* This cognitive bias is dangerous. In competitive examinations, a wrong answer does not cost you 1 mark—**it costs you 5 marks in opportunity value**.

### The Mathematical Proof

Consider two alternate realities for any given question:
- **Scenario 1 (You solve it correctly):** You receive $+4$ marks.
- **Scenario 2 (You make an erroneous attempt):** You receive $−1$ mark.

The net difference between getting a question right versus getting it wrong is:

$$\\text{Score Differential} = (+4) - (-1) = \\mathbf{5 \\text{ Marks}}$$

Every single wrong answer represents a **5-mark swing** relative to your potential peak.

### Compounding Impact of Careless Mistakes

| Incorrect Answers | Direct Penalty | Opportunity Lost | Typical Rank Shift (160–200 Band) |
| :--- | :--- | :--- | :--- |
| **2 Mistakes** | −2 Marks | **10 Marks** | ~3,000 – 6,000 Ranks |
| **5 Mistakes** | −5 Marks | **25 Marks** | ~12,000 – 22,000 Ranks |
| **10 Mistakes** | −10 Marks | **50 Marks** | ~35,000 – 55,000 Ranks |
| **15 Mistakes** | −15 Marks | **75 Marks** | Over 80,000 Ranks |

A difference of 25 marks (5 converted questions) routinely separates admission into Computer Science Engineering at NIT Trichy or Surathkal from having to settle for a non-circuital branch at a newer NIT.

---

## Case Study: Equal Attempts, Vastly Different Ranks

To see the devastating impact of negative marking in practice, compare four candidates who all attempted exactly **60 questions (worth 240 gross marks)** in the same shift:

| Student Profile | Attempts | Correct ($C$) | Wrong ($I$) | Accuracy | Raw Score / 300 | Estimated Percentile |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Candidate A (Precision Master)** | 60 | 56 | 4 | 93.3% | **220 / 300** | **99.4%ile** |
| **Candidate B (Balanced Aspirant)** | 60 | 50 | 10 | 83.3% | **190 / 300** | **98.2%ile** |
| **Candidate C (Over-Aggressive)** | 60 | 44 | 16 | 73.3% | **160 / 300** | **96.1%ile** |
| **Candidate D (Reckless Guesser)** | 60 | 36 | 24 | 60.0% | **120 / 300** | **91.5%ile** |

### Key Takeaways from the Data:
1. **Candidate A vs Candidate D:** Both students selected answers for 60 questions. Yet Candidate A scored **100 marks higher** simply by maintaining disciplined accuracy.
2. **The 99th Percentile Barrier:** Candidate B missed the coveted 99th percentile cutoff solely because of 10 negative marks. Leaving just 5 doubtful questions blank would have lifted Candidate B above 195 marks.

---

## The Mathematics of Guessing: Expected Value (EV) Analysis

Is guessing ever mathematically justified in JEE Main? We can answer this using the statistical concept of **Expected Value (EV)**.

Let $p$ be your probability of choosing the correct answer. The expected mark gain from attempting the question is:

$$\\text{EV} = [p \\times (+4)] - [(1 - p) \\times 1] = 5p - 1$$

For an attempt to yield a positive expectation ($\\text{EV} > 0$):

$$5p - 1 > 0 \\implies p > \\frac{1}{5} = \\mathbf{0.20 \\text{ (20\\%)}}$$

Let us analyze the 4 common real-exam guessing scenarios:

| Guessing Scenario | Number of Options | Probability ($p$) | Expected Value per Question | Recommendation |
| :--- | :--- | :--- | :--- | :--- |
| **Section B Numerical** | $\\infty$ | $\\approx 0\\%$ | **−1.00 Marks** | **NEVER GUESS**. Instant penalty. |
| **Pure Blind Guess (MCQ)** | 4 Choices | 25.0% | **+0.25 Marks** | **Avoid.** High variance destroys timed exams. |
| **1 Option Eliminated** | 3 Choices | 33.3% | **+0.67 Marks** | **Calculated Risk.** Worth taking if backed by intuition. |
| **2 Options Eliminated** | 2 Choices | 50.0% | **+1.50 Marks** | **ALWAYS ATTEMPT.** Highly profitable over multiple questions. |

### Why Pure Blind Guessing Fails Despite Positive EV (+0.25)
Theoretically, $+0.25$ marks is positive. However, expected value assumes hundreds of repeated trials (the Law of Large Numbers). In a single 75-question exam with 5 to 8 blind guesses, **statistical variance dominates**. If you get 6 wrong and only 1 right, you lose:
$$(1 \\times 4) - (6 \\times 1) = -2 \\text{ marks}$$
In competitive exams, unhedged downside variance is catastrophic. **Rule of thumb: Only guess when you can definitively eliminate at least 2 incorrect options.**

---

## Negative Marking and Shift Normalization (NTA Percentile)

A common point of confusion among students is how raw negative marks translate into their final **NTA Score (Percentile)**.

NTA does not publish rank based on raw marks directly. Instead, scores are normalized across shifts of varying difficulty using the percentile formula:

$$\\text{Percentile} = 100 \\times \\frac{\\text{Number of candidates with raw score } \\le \\text{ Your raw score}}{\\text{Total candidates appeared in that shift}}$$

### Shift Difficulty Amplifies Negative Marking
- **In an Easy Shift:** The score distribution shifts upward. Scores between 180 and 220 are extremely dense. A single negative mark deduction can push you behind 1,500 to 3,000 candidates who answered the same question correctly or left it blank.
- **In a Difficult Shift:** Raw cutoffs drop. A raw score of 170 might earn a 99 percentile. In this environment, preserving marks by leaving tough questions unattempted is the winning strategy.

Use our [JEE Marks to Percentile Calculator](/jee/marks-to-percentile) to model how different raw marks convert to percentile ranges across historical shifts.

---

## Tactical 3-Pass Exam-Day Strategy to Prevent Negative Marks

To eliminate careless deductions and maximize your raw score, adopt the battle-tested **3-Pass Strategy** used by top percentile scorers:

\`\`\`text
Exam Timeline (180 Minutes Total)
├── Pass 1 (0 to 55 Mins)   : The "Green Zone" (Direct Sure-Shots, 100% Accuracy)
├── Pass 2 (55 to 140 Mins) : The "Yellow Zone" (Calculations & 50-50 Eliminations)
└── Pass 3 (140 to 180 Mins): The "Verification Zone" (Auditing & Zero Blind Guesses)
\`\`\`

### Pass 1: The Green Zone (Minutes 0 to 55)
- Scan through all 75 questions rapidly across Physics, Chemistry, and Mathematics.
- Attempt **only questions you can solve with 100% certainty in under 90 seconds** (e.g., NCERT-direct Inorganic Chemistry, straightforward formula-based Physics).
- Strictly skip any question that requires lengthy algebra or whose concept is hazy.
- **Goal:** Bank 25 to 35 sure-shot correct answers with zero negative marks.

### Pass 2: The Yellow Zone (Minutes 55 to 140)
- Return to questions tagged as solvable but requiring 2 to 4 minutes of calculation.
- Apply option elimination techniques: check dimensional analysis, test extreme boundary values ($x = 0$, $x \\to \\infty$), and eliminate physically impossible options.
- If you reduce an MCQ down to **2 viable options**, mark your best deduction.
- If you cannot eliminate at least 2 options after 3 minutes, click **Clear Response** and move on.

### Pass 3: The Verification Zone (Minutes 140 to 180)
- Spend the final 40 minutes reviewing your answers.
- Audit your calculations for common negative-marking traps:
  - Unit conversions (e.g., cm to m, eV to Joules, grams to kg).
  - Sign conventions (especially in Optics, Thermodynamics, and Electrostatics).
  - Reading traps: Did the question ask for *"Which of the following is NOT correct?"*
- **The Golden Rule of the Final 10 Minutes:** Never make a rushed, speculative attempt in the closing minutes of the exam. A panic guess rarely yields +4 and almost always costs you 1 mark.

---

## How to Calculate Your Score Using StudentTools

Auditing your mock test performance after every full syllabus test is vital to identify whether your score ceiling is caused by syllabus gaps or negative mark leakages.

Use the free [JEE Main Marks Calculator](/jee/marks-calculator) on StudentTools:
1. **Enter Correct Questions ($C$):** Input your total confirmed correct answers (e.g., 50).
2. **Enter Incorrect Questions ($I$):** Input the number of questions answered incorrectly (e.g., 10).
3. **Analyze Subject-Wise Performance:** Switch between Overall mode and Subject-Wise mode (Physics, Chemistry, Maths) to pinpoint which subject is leaking the most marks to negative penalties.
4. **Track Accuracy Rate:** The tool automatically calculates your net score ($200 - 10 = 190 / 300$) and your accuracy percentage ($83.3\\%$).

Regularly tracking your accuracy ensures that as your attempt count increases, your negative deductions remain below 10 marks per paper.`
}

const articles = JSON.parse(fs.readFileSync('data/publishedArticles.json', 'utf8'))
const index = articles.findIndex(a => a.id === 'art_st001_jee_negative_marking' || a.slug === 'how-jee-main-negative-marking-affects-score')

if (index !== -1) {
  articles[index] = updatedArticle
} else {
  articles.unshift(updatedArticle)
}

fs.writeFileSync('data/publishedArticles.json', JSON.stringify(articles, null, 2), 'utf8')
console.log('Successfully updated publishedArticles.json with rewritten guide!')
