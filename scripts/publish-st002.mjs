import fs from 'fs'

const newArticle = {
  id: 'art_st002_jee_raw_score_response_sheet',
  topic_id: 'ST002',
  title: 'How to Calculate Raw Score from JEE Main Response Sheet (Step-by-Step 2026)',
  slug: 'how-to-calculate-jee-main-raw-score-response-sheet',
  excerpt: 'Complete step-by-step guide to downloading your NTA JEE Main response sheet, cross-referencing the provisional answer key, handling bonus questions and key challenges, and tallying your accurate raw score before the official results.',
  meta_title: 'How to Calculate Raw Score from JEE Main Response Sheet 2026 | Step-by-Step Guide',
  meta_description: 'Step-by-step guide: Download NTA JEE Main 2026 response sheet, cross-reference provisional answer key, handle bonus and dropped questions, and calculate your exact raw score. With worked examples.',
  primary_keyword: 'how to calculate jee main raw score',
  secondary_keywords: [
    'jee main response sheet download',
    'nta answer key marks calculation',
    'jee raw marks formula',
    'jee main provisional answer key 2026',
    'how to check jee marks before result',
    'jee bonus question marks'
  ],
  category: 'JEE',
  topic_cluster: 'Marks & Scoring',
  article_type: 'How-To',
  search_intent: 'How-To',
  reading_time_minutes: 8,
  content_hash: 'hash_st002_v1',
  status: 'PUBLISHED',
  published_at: new Date().toISOString(),
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
  related_tools: [
    {
      name: 'JEE Marks Calculator',
      route: '/jee/marks-calculator',
      description: 'Enter your correct and incorrect answer counts to instantly calculate your raw JEE Main score with subject-wise breakdown and accuracy analysis.'
    },
    {
      name: 'JEE Marks to Percentile Calculator',
      route: '/jee/marks-to-percentile',
      description: 'Estimate your NTA percentile and All India Rank from your raw JEE Main score across historical shift distributions.'
    }
  ],
  faq: [
    {
      question: 'When does NTA release the JEE Main response sheet?',
      answer: 'NTA typically releases the JEE Main response sheet within 2 to 3 days of the last shift of each session. Candidates can download it from jeemain.nta.nic.in using their application number and date of birth.'
    },
    {
      question: 'How do I calculate my JEE Main score from the response sheet?',
      answer: 'After downloading your response sheet and the provisional answer key, count questions where your response matches the key (Correct = +4 marks) and questions where they differ (Incorrect = −1 mark). Apply the formula: Raw Score = (Correct × 4) − (Incorrect × 1). Leave unattempted questions (marked as "*" or blank) with 0 marks.'
    },
    {
      question: 'What is a bonus question in JEE Main and how does it affect marks?',
      answer: 'A bonus question (also called a dropped or grace-marked question) is one where NTA discovers that the provisional answer key had an error after candidate objections, or where a question is found to be faulty or have multiple correct answers. For such questions, all candidates who attempted them receive full +4 marks, and candidates who left them blank also receive +4 marks, regardless of their original response.'
    },
    {
      question: 'What does "* " mean in the JEE Main response sheet?',
      answer: 'An asterisk (*) in the response column of your JEE Main response sheet indicates that you did not attempt that question. It carries 0 marks and no negative penalty. Some sheets show a blank cell instead of an asterisk for unattempted questions.'
    },
    {
      question: 'Can I challenge the JEE Main answer key?',
      answer: 'Yes. NTA opens a challenge window (usually 2 to 3 days after the provisional answer key is released) during which candidates can raise objections against specific answers by paying a fee of ₹200 per question. If the challenge is accepted, the fee is refunded and marks are adjusted in the final result.'
    }
  ],
  content: `After completing JEE Main, most candidates anxiously wait for NTA to publish the official result. But there is no reason to wait in the dark. Within 2 to 3 days of your exam, NTA releases two critical documents on the official portal: your **Response Sheet** (showing every answer you marked) and the **Provisional Answer Key** (showing NTA's correct answers). Together, these two documents let you calculate your **accurate raw score** before the official result is declared.

This step-by-step guide walks you through the entire process — from downloading the documents to tallying your final score, handling bonus questions, and using the StudentTools JEE Marks Calculator for instant verification.

---

## What You Need Before Starting

| Document | What It Is | Where to Get It |
| :--- | :--- | :--- |
| **Response Sheet** | Lists every question ID and your marked response for each question | jeemain.nta.nic.in → "View Response Sheet" |
| **Provisional Answer Key** | Lists NTA's official correct answer for each question ID | jeemain.nta.nic.in → "View Answer Key" |
| **NTA Question Paper** | The full question paper with question IDs mapped to question text | jeemain.nta.nic.in → "View Question Paper" |

> **Important:** Both documents use **Question ID numbers**, not the sequential numbering (Q.1, Q.2, etc.) that appeared on your screen. Always match by Question ID, not by question order.

---

## Step 1: Download Your Response Sheet

1. Open a browser and go to **[jeemain.nta.nic.in](https://jeemain.nta.nic.in)**.
2. Click on **"View JEE Main 2026 Response Sheet"** (the link appears after NTA releases it, typically 2–3 days post-exam).
3. Log in using:
   - **Application Number** (found on your admit card)
   - **Date of Birth** (in DD/MM/YYYY format)
4. Select your **Session** (Session 1 or Session 2) and **Shift** (if applicable).
5. Click **Download** to save the response sheet PDF to your device.

### What Your Response Sheet Looks Like

Your response sheet will be a PDF table with columns like:

| Question ID | Correct Option (as per Key) | Your Response | Status |
| :--- | :--- | :--- | :--- |
| 301821 | A | A | Correct |
| 301822 | C | B | Incorrect |
| 301823 | B | * | Not Attempted |
| 301824 | D | D | Correct |
| 301825 | — | C | *To be determined* |

> **Note on the "Status" Column:** Some versions of NTA's response sheet show a "Status" column that pre-fills Correct/Incorrect/Not Attempted. However, **do not rely on this automatically** — always cross-verify manually, especially for questions that were later reviewed (bonus or dropped questions).

---

## Step 2: Download the Provisional Answer Key

1. On the same portal (jeemain.nta.nic.in), look for **"View Provisional Answer Key"**.
2. Select the correct **Paper** (Paper 1 for B.E./B.Tech.) and **Set** (your question paper set, indicated as Set A, B, C, D or similar codes).
3. Download the answer key PDF.

### Matching the Answer Key to Your Response Sheet

The answer key lists **Question IDs** alongside the correct answer option (A, B, C, or D for MCQs; numerical value for Section B). Your response sheet also lists the same Question IDs with your chosen option.

**Match each row by Question ID:**
- If your response = correct option → **+4 marks**
- If your response ≠ correct option (and not "*") → **−1 mark**
- If your response = "*" or blank → **0 marks**

---

## Step 3: Tally Your Raw Score

### The Formula

\`\`\`text
Raw Score = (Correct Answers × 4) − (Incorrect Answers × 1)
\`\`\`

Or algebraically:

\`\`\`text
Score = 4C − I
\`\`\`

Where:
- **C** = Number of questions where your response matches the answer key
- **I** = Number of questions where your response does not match (excluding unattempted)
- **Unattempted** = Number of "*" or blank entries → contributes **0 marks**

### Worked Tally Example

Suppose you go through all 75 questions on your response sheet and get the following count:

| Category | Count | Marks per Question | Total Marks |
| :--- | :--- | :--- | :--- |
| Correct Responses | 48 | +4 | **+192** |
| Incorrect Responses | 9 | −1 | **−9** |
| Unattempted ("*") | 18 | 0 | **0** |
| **Total** | **75** | — | **= 183 / 300** |

**Subject-wise check:** Add up the counts for Physics questions (Q IDs in the Physics block), Chemistry questions, and Mathematics questions separately to identify your weakest subject.

---

## Step 4: Handle Bonus Questions and Dropped Questions

This is the most misunderstood part of the JEE Main score calculation. After the provisional answer key is released, NTA opens an **objection window** where candidates (and coaching institutes) raise challenges. Based on the expert review, NTA may:

### Case 1: Answer Key Correction
NTA changes the correct answer for a question (e.g., from Option B to Option C). In this case:
- All candidates who originally marked Option C now get **+4 marks**.
- All candidates who originally marked Option B now get **−1 mark** (they are no longer "correct").
- Candidates who marked Option A or D are unchanged.

### Case 2: Bonus / Grace Marks (Question Dropped)
NTA declares a question **invalid** (ambiguous, multiple correct answers, translation error, or factual error). In this case:
- **All candidates who attempted the question** receive **+4 marks**, regardless of what they marked.
- **Candidates who left it blank** also receive **+4 marks**.

> **Practical Implication:** If there are 3 bonus questions in your paper, every candidate gains an extra **+12 marks** over their manually-tallied score. Always wait for the **Final Answer Key** (released after the objection window closes) for the most accurate calculation.

### How to Check for Bonus Questions
After the objection window closes, NTA publishes the **Final Answer Key**. Questions that were dropped or changed will be clearly marked or annotated in the final key PDF. Compare your provisional calculation with the final key to adjust your score.

---

## Step 5: Verify Using the JEE Main Marks Calculator

After manually tallying your score, verify it instantly using the [JEE Main Marks Calculator](/jee/marks-calculator) on StudentTools:

1. **Choose Mode:** Select "Overall" to enter total correct and incorrect counts across all 75 questions, or switch to "Subject-Wise" to enter Physics, Chemistry, and Mathematics separately.
2. **Enter Correct Answers ($C$):** Type in the total number of questions that matched the answer key (e.g., 48).
3. **Enter Incorrect Answers ($I$):** Type in the total number of questions you marked wrong (e.g., 9).
4. **Read Your Results Instantly:**
   - **Raw Score:** $(48 \\times 4) - 9 = 183 / 300$
   - **Accuracy Rate:** $48 / 57 = 84.2\\%$
   - **Unattempted Count:** $75 - 57 = 18$
5. **Review Subject-Wise Analysis:** If you entered subject-wise data, see which subject contributed the most negative marks.

> **Pro Tip:** After each JEE Main mock test, repeat this same process with your mock test response to build discipline in distinguishing "wrong answer" from "unattempted".

---

## Common Mistakes to Avoid During Manual Calculation

### 1. Confusing Question ID with Question Number
Your screen showed Q.1, Q.2, Q.3 etc. in sequence. But the NTA response sheet and answer key use **internal Question IDs** (e.g., 301821, 301822). Never tally by serial number — always use the Question ID column.

### 2. Forgetting Section B Numerical Negative Marking
Many students instinctively give themselves full marks for numerical questions they "attempted" without checking the response sheet. Section B (Integer/Decimal answers) also carries **−1 for incorrect responses**. Always cross-reference the numerical value in your response against the key.

### 3. Using the Provisional Key for Final Score Calculation
The provisional key may change after the objection window closes. Your pre-result score estimate based on the provisional key could differ from the final score by up to **20 marks or more** in sessions with multiple contested questions. Use the provisional key for an estimate, then recalculate once the final key is published.

### 4. Calculating Section A and B Separately but Wrongly
Paper 1 is structured as follows:
- **Section A:** Attempt all 20 questions per subject (60 total, all mandatory).
- **Section B:** Attempt any 5 out of 10 integer questions per subject (5 × 3 subjects = 15 total).

Some candidates forget that they must answer exactly 5 Section B questions per subject. If the system records more than 5 responses for Section B in a subject (due to changing answers), NTA's system counts only the **last 5 responses in the order they were saved**, not the first 5 or the best 5.

### 5. Missing Unattempted Questions Marked as "Visited"
In NTA's CBT interface, "Visited but Not Answered" (shown in red/maroon) is different from "Not Visited" (shown in white/grey). **Both are treated identically** in scoring — as unattempted, earning 0 marks. You do NOT lose a mark for visiting a question without answering it.

---

## Quick Reference Score Calculation Table

Use this table to quickly estimate your raw score range before completing the full manual tally:

| Questions Attempted | Correct % | Correct | Wrong | Raw Score |
| :--- | :--- | :--- | :--- | :--- |
| 75 (Full Attempt) | 90% | 68 | 7 | **265** |
| 70 | 85% | 60 | 10 | **230** |
| 65 | 82% | 53 | 12 | **200** |
| 60 | 80% | 48 | 12 | **180** |
| 55 | 78% | 43 | 12 | **160** |
| 50 | 75% | 38 | 12 | **140** |

> For accurate calculation with your exact numbers, use the [JEE Marks Calculator](/jee/marks-calculator).

---

## What Happens Next: From Raw Score to Percentile

Once you know your raw score, the next step is estimating your **NTA Percentile Score** and **All India Rank (AIR)**. NTA does not release rank based directly on raw marks — your raw score is normalized across all candidates who appeared in your session and shift.

- Use the [JEE Marks to Percentile Calculator](/jee/marks-to-percentile) to estimate your percentile based on historical shift distributions.
- Monitor the official result at jeemain.nta.nic.in after NTA releases it (typically 15–20 days after the last shift of the session).`
}

const articles = JSON.parse(fs.readFileSync('data/publishedArticles.json', 'utf8'))

// Check if it already exists
const existingIndex = articles.findIndex(a => a.id === 'art_st002_jee_raw_score_response_sheet' || a.topic_id === 'ST002')
if (existingIndex !== -1) {
  articles[existingIndex] = newArticle
  console.log('Updated existing ST002 article')
} else {
  articles.push(newArticle)
  console.log('Added new ST002 article')
}

fs.writeFileSync('data/publishedArticles.json', JSON.stringify(articles, null, 2), 'utf8')
console.log('✅ publishedArticles.json updated successfully!')
console.log('Total articles:', articles.length)

// Also update topicsDatabase.json to mark ST002 as PUBLISHED
const topics = JSON.parse(fs.readFileSync('data/topicsDatabase.json', 'utf8'))
const topicIndex = topics.findIndex(t => t.topic_id === 'ST002')
if (topicIndex !== -1) {
  topics[topicIndex].status = 'PUBLISHED'
  topics[topicIndex].published_url = 'https://studenttools.cyou/blog/how-to-calculate-jee-main-raw-score-response-sheet'
  topics[topicIndex].published_at = newArticle.published_at
  topics[topicIndex].content_hash = newArticle.content_hash
  fs.writeFileSync('data/topicsDatabase.json', JSON.stringify(topics, null, 2), 'utf8')
  console.log('✅ topicsDatabase.json - ST002 marked as PUBLISHED')
}
