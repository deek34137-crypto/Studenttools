// data/toolContent.ts
// Comprehensive educational content, formulas, steps, examples, assumptions, disclaimers, and FAQs for all 38 tools.

export interface FaqItem {
  question: string
  answer: string
}

export interface CalculatorContent {
  formulaTitle: string
  formulaDescription: string
  formulaCode?: string
  calculationSteps: string[]
  example: {
    scenario: string
    inputs: string
    calculation: string
    outcome: string
  }
  assumptions: string[]
  disclaimer: string
  faqs: FaqItem[]
}

export const TOOL_CONTENT: Record<string, CalculatorContent> = {
  "jee-marks-to-percentile": {
    "formulaTitle": "JEE Main Normalization & Percentile Formula",
    "formulaDescription": "The National Testing Agency (NTA) computes percentile scores using a multi-session normalization method based on the relative performance of all candidates who appeared in that specific exam shift.",
    "formulaCode": "Percentile (P) = (Total candidates in shift with raw marks <= Candidate score / Total candidates appeared in shift) * 100",
    "calculationSteps": [
      "Raw marks are calculated from the official answer key (+4 for correct, -1 for incorrect, 0 for unattempted).",
      "The candidate's raw score is compared against all scores in the same examination session/shift.",
      "The number of students scoring equal to or lower than the candidate is determined.",
      "The percentile is calculated to 7 decimal places to avoid ties in the merit list."
    ],
    "example": {
      "scenario": "Scoring 185 marks in a Moderate difficulty shift of JEE Main",
      "inputs": "Raw Marks: 185 / 300 | Shift Difficulty: Moderate",
      "calculation": "Normalized historical benchmark for moderate shift yields 99.05 - 99.30 range.",
      "outcome": "Estimated Percentile: ~99.15% (Approx CRL Rank: ~12,000)"
    },
    "assumptions": [
      "Total test takers across all shifts estimated at ~14.5 to 15.0 Lakh candidates.",
      "Shift difficulty follows standard statistical distribution where moderate shifts require ~180 marks for 99th percentile.",
      "Equal candidate distribution across exam sessions."
    ],
    "disclaimer": "Percentile scores provided are indicative estimates based on past multi-year NTA trends. Actual percentiles depend on your shift-specific score distribution and official NTA normalization. Always consult official scorecards at jeemain.nta.nic.in.",
    "faqs": [
      {
        "question": "What is a good percentile in JEE Main for NIT admission?",
        "answer": "For top NITs (Trichy, Surathkal, Warangal) in branches like CSE, IT, or ECE, General category students typically need a 98.5+ to 99.5+ percentile. For newer NITs or core branches, percentiles between 95 and 97 can secure admission depending on state quota."
      },
      {
        "question": "Why do two students with the same marks get different percentiles?",
        "answer": "JEE Main is conducted across multiple shifts of varying difficulty. NTA normalizes scores per shift so candidates are not penalized for appearing in a tougher exam session."
      },
      {
        "question": "How many marks are required to qualify for JEE Advanced?",
        "answer": "The qualifying percentile for JEE Advanced typically hovers around 90-93 percentile for General category, 78-82 for EWS, 76-80 for OBC-NCL, and 50-55 for SC candidates."
      }
    ]
  },
  "jee-percentile-to-rank": {
    "formulaTitle": "JEE Main Percentile to All India Rank (CRL) Formula",
    "formulaDescription": "Your All India Rank (CRL) is derived from your NTA percentile by calculating how many unique candidates scored higher than you across all sessions.",
    "formulaCode": "Estimated CRL Rank = Math.floor(((100 - Percentile) / 100) * Total Unique Candidates) + 1",
    "calculationSteps": [
      "Subtract your NTA percentile from 100 to determine the top percentage of test takers.",
      "Multiply by the total number of unique candidates who appeared across both Session 1 and Session 2.",
      "Add 1 to determine your exact rank standing.",
      "For Category Rank, apply the statutory reservation seat and candidate proportion factor (OBC ~27%, EWS ~10%, SC ~15%, ST ~7.5%)."
    ],
    "example": {
      "scenario": "Candidate with 99.20 percentile and 14,50,000 unique test takers",
      "inputs": "NTA Percentile: 99.20 | Total Candidates: 14,50,000",
      "calculation": "((100 - 99.20) / 100) * 1,450,000 + 1 = 0.008 * 1,450,000 + 1 = 11,600 + 1",
      "outcome": "Estimated All India CRL Rank: ~11,601 (Margin of error ±500)"
    },
    "assumptions": [
      "Total unique candidates across both sessions estimated at 14,50,000.",
      "NTA tie-breaking rules (higher marks in Math > Physics > Chem > Age) are not simulated."
    ],
    "disclaimer": "Rank predictions are mathematical projections. Final official All India Common Rank List (CRL) and Category ranks are announced exclusively by the NTA after Session 2 results are declared.",
    "faqs": [
      {
        "question": "Which percentile is considered if I appeared in both Session 1 and Session 2?",
        "answer": "NTA merges both sessions and takes the better of your two overall percentile scores for calculating your final All India Rank."
      },
      {
        "question": "How accurate is the percentile to rank formula?",
        "answer": "It is highly accurate (within 1-3%) when the total number of unique candidates is known accurately."
      },
      {
        "question": "What is CRL in JEE Main?",
        "answer": "CRL stands for Common Rank List. It is the unreserved All India merit list of all students who took the exam regardless of their category."
      }
    ]
  },
  "jee-college-predictor": {
    "formulaTitle": "JoSAA Counselling Cutoff Matching & Rank Allocation Methodology",
    "formulaDescription": "Our predictor models official JoSAA seat allocation logic: comparing your JEE Main CRL Rank against OPEN seats, your Category Rank against reserved seats (OBC, SC, ST, EWS, PwD), and resolving Home State (HS) vs Other State (OS) quotas.",
    "formulaCode": "Admission Status: Evaluated Rank <= Closing Rank (Filtered by Institute Type, Quota HS/OS/AI, Gender Pool, and Round)",
    "calculationSteps": [
      "Determine evaluated rank: Candidate CRL rank is matched against OPEN seats; for reserved categories, Category Rank is matched against category-specific closing ranks.",
      "Resolve Home State (HS) vs Other State (OS) quota eligibility based on candidate's 12th board state of eligibility.",
      "Filter by gender pool: female candidates are evaluated across both Female-only (supernumerary) and Gender-Neutral seat pools.",
      "Classify opportunities into transparent historical bands: Within closing rank, Near historical cutoff, or Outside closing range."
    ],
    "example": {
      "scenario": "SC Candidate with CRL Rank 150,000 and SC Category Rank 450",
      "inputs": "CRL: 150,000 | SC Rank: 450 | State: Delhi | Quota: Auto (HS/OS)",
      "calculation": "Matches SC Category Rank 450 against SC cutoffs (e.g. NIT Delhi CSE SC Closing: 890), plus CRL against OPEN cutoffs.",
      "outcome": "Within Closing Rank: NIT Delhi CSE (SC Quota, +440 rank cushion) | Near Cutoff: NIT Trichy CSE (SC Quota)"
    },
    "assumptions": [
      "Seat allocations follow official JoSAA opening and closing rank patterns.",
      "Round 6 cutoffs represent the final allotment benchmark prior to CSAB special spot rounds."
    ],
    "disclaimer": "College prediction is an advisory estimation based on historical JoSAA records. Actual cutoffs fluctuate annually depending on applicant preferences, seat matrix additions, and exam normalization.",
    "faqs": [
      {
        "question": "Does JoSAA evaluate CRL or Category Rank for reserved seats?",
        "answer": "For OPEN (General) seats, JoSAA evaluates the All India Common Rank List (CRL). For reserved category seats (OBC-NCL, SC, ST, GEN-EWS, PwD), JoSAA explicitly evaluates the candidate's respective Category Rank against category closing ranks."
      },
      {
        "question": "How do Home State (HS) and Other State (OS) quotas work in NITs?",
        "answer": "In National Institutes of Technology (NITs), 50% of the seats are earmarked for Home State (HS) candidates who passed their Class 12 board examination in the state where the NIT is located. The remaining 50% are Other State (OS) seats open to candidates from all other Indian states."
      },
      {
        "question": "How does the Female-only seat pool work in JoSAA?",
        "answer": "To ensure female representation (at least 20%), JoSAA creates supernumerary Female-only seats. Female candidates are eligible to compete in both the Female-only pool and the Gender-Neutral pool, maximizing their admission prospects."
      },
      {
        "question": "Can I predict IIT cutoffs using my JEE Main rank?",
        "answer": "No. Indian Institutes of Technology (IITs) allocate seats exclusively through JEE Advanced ranks. Our predictor includes IIT historical cutoffs for students entering their JEE Advanced ranks."
      }
    ]
  },
  "jee-cutoff": {
    "formulaTitle": "JoSAA Opening & Closing Rank Analysis",
    "formulaDescription": "Opening Rank (OR) is the highest rank admitted to a branch in a particular round, while Closing Rank (CR) is the lowest rank admitted.",
    "formulaCode": "Cutoff Window = [Opening Rank, Closing Rank] for (Institute, Branch, Quota, Category)",
    "calculationSteps": [
      "Select Institute Name (e.g. NIT Trichy, NIT Surathkal, IIIT Allahabad).",
      "Filter by 4-Year B.Tech specialization (Computer Science, ECE, Mechanical, etc.).",
      "Select Quota (Home State vs Other State) and reservation Category.",
      "Analyze opening and closing rank dynamics across counselling rounds."
    ],
    "example": {
      "scenario": "Checking NIT Trichy Computer Science (OS Quota, OPEN Category)",
      "inputs": "Institute: NIT Trichy | Branch: CSE | Quota: Other State | Category: OPEN",
      "calculation": "Opening Rank: ~1,500 | Closing Rank: ~5,164 in JoSAA Final Round",
      "outcome": "Cutoff Range: 1,500 - 5,164"
    },
    "assumptions": [
      "Data reflects official JoSAA published closing ranks.",
      "Gender-neutral seat pool data is displayed by default."
    ],
    "disclaimer": "Cutoffs change each year based on applicant preferences, seat matrix revisions, and new campus expansions. Always refer to josaa.nic.in for official updates.",
    "faqs": [
      {
        "question": "What does Closing Rank mean in JoSAA?",
        "answer": "The Closing Rank is the All India Rank of the last candidate who was allotted a seat in that specific branch, institute, and category during that round."
      },
      {
        "question": "Do cutoffs change between Round 1 and Round 6?",
        "answer": "Yes. Cutoff ranks typically expand (relax) from Round 1 to Round 6 as higher-ranked candidates withdraw, upgrade to IITs, or accept alternate seats."
      },
      {
        "question": "Where can I find official cutoff PDFs?",
        "answer": "Official cutoffs are published after every round on the official JoSAA portal at josaa.nic.in/archive."
      }
    ]
  },
  "jee-marks-calculator": {
    "formulaTitle": "JEE Main Marking Scheme Formula",
    "formulaDescription": "Computes total raw score and accuracy percentage according to the official National Testing Agency marking scheme for Paper 1 (B.E./B.Tech).",
    "formulaCode": "Total Score = (Correct Answers * 4) - (Incorrect Answers * 1) - (Unattempted * 0)",
    "calculationSteps": [
      "Multiply the count of correct answers by +4.",
      "Multiply the count of wrong/incorrect answers by -1 (penalty).",
      "Add the values to determine the net score out of 300.",
      "Calculate Accuracy % = (Correct Answers / Total Attempted Questions) * 100."
    ],
    "example": {
      "scenario": "Attempted 65 questions out of 75: 55 Correct, 10 Incorrect, 10 Unattempted",
      "inputs": "Correct: 55 | Incorrect: 10 | Unattempted: 10",
      "calculation": "(55 * 4) - (10 * 1) = 220 - 10 = 210 marks. Accuracy = (55 / 65) * 100 = 84.62%",
      "outcome": "Total Score: 210 / 300 | Accuracy: 84.62%"
    },
    "assumptions": [
      "Marking scheme: +4 marks for correct, -1 mark for incorrect, 0 for unattempted.",
      "Applies to both Section A (Multiple Choice Questions) and Section B (Numerical Value Questions)."
    ],
    "disclaimer": "This calculator computes raw scores based on your reported answers. Final scores and percentiles are determined solely by NTA after evaluating challenged answer keys.",
    "faqs": [
      {
        "question": "Is there negative marking for numerical questions in JEE Main?",
        "answer": "Yes. NTA applies a -1 mark penalty for incorrect answers in both MCQs and numerical value questions."
      },
      {
        "question": "What is the maximum mark in JEE Main Paper 1?",
        "answer": "The maximum score is 300 marks (75 questions to be answered out of 90: 25 each in Physics, Chemistry, and Mathematics)."
      },
      {
        "question": "What is considered a safe raw score for a 99 percentile?",
        "answer": "Depending on paper difficulty, a raw score of 175 to 215 marks is typically required for 99+ percentile in moderate shifts."
      }
    ]
  },
  "jee-countdown": {
    "formulaTitle": "Real-Time Exam Countdown Algorithm",
    "formulaDescription": "Calculates the remaining time until the scheduled examination dates in Indian Standard Time (IST - UTC+5:30).",
    "formulaCode": "Remaining Milliseconds = Target Date Timestamp - Current Client Timestamp",
    "calculationSteps": [
      "Synchronize client time with official UTC epoch.",
      "Target exam commencement date at 09:00 AM IST on the day of Session 1.",
      "Deconstruct difference into days, hours, minutes, and seconds."
    ],
    "example": {
      "scenario": "Tracking time until JEE Main 2027 Session 1",
      "inputs": "Target Exam Date: Mid-January 2027",
      "calculation": "Calculates remaining delta across days, hours, minutes, and seconds dynamically.",
      "outcome": "Live dynamic ticking timer with preparation milestones."
    },
    "assumptions": [
      "Exam session dates adhere to tentative NTA academic calendars.",
      "System operates on Indian Standard Time (IST)."
    ],
    "disclaimer": "Exam dates are based on NTA notifications and tentative press releases. Users should monitor jeemain.nta.nic.in for official schedule confirmations.",
    "faqs": [
      {
        "question": "When is JEE Main Session 1 typically conducted?",
        "answer": "NTA usually conducts JEE Main Session 1 in the last two weeks of January."
      },
      {
        "question": "When is JEE Main Session 2 held?",
        "answer": "Session 2 is generally scheduled during the first and second weeks of April."
      },
      {
        "question": "Can I appear in both Session 1 and Session 2?",
        "answer": "Yes, candidates can appear in either one or both sessions. The best of the two NTA percentile scores is used for ranking."
      }
    ]
  },
  "student-cgpa-to-percentage": {
    "formulaTitle": "CGPA to Percentage Conversion Formulas",
    "formulaDescription": "Converts Cumulative Grade Point Average (CGPA) on a 10-point scale to equivalent percentage using standard educational board guidelines.",
    "formulaCode": "CBSE / Standard: % = CGPA * 9.5 | 10x Scale: % = CGPA * 10 | VTU: % = (CGPA - 0.75) * 10 | Mumbai Univ: % = 7.1 * CGPA + 11",
    "calculationSteps": [
      "Select your university or academic board standard from the dropdown.",
      "Enter your cumulative CGPA (between 0.00 and 10.00).",
      "Apply the board-specified mathematical multiplier or linear transformation.",
      "View the equivalent percentage rounded to two decimal places."
    ],
    "example": {
      "scenario": "CBSE student with an 8.6 CGPA on 10-point scale",
      "inputs": "CGPA: 8.6 | Formula: CBSE (9.5 multiplier)",
      "calculation": "Percentage = 8.6 * 9.5 = 81.70%",
      "outcome": "Equivalent Percentage: 81.70%"
    },
    "assumptions": [
      "Calculations assume standard 10-point GPA grading scales.",
      "CBSE standard uses official 9.5 multiplier established to align top grades with percentiles."
    ],
    "disclaimer": "Different universities, recruitment bodies, and government exam commissions may mandate their own specific conversion certificates. Verify conversion rules on the reverse side of your official marksheet.",
    "faqs": [
      {
        "question": "Why does CBSE multiply CGPA by 9.5 instead of 10?",
        "answer": "CBSE observed that the average marks secured by candidates in the top score band (Grade Point 10) was approximately 95%. Multiplying by 9.5 provides a realistic percentage representation."
      },
      {
        "question": "How do I convert 7.8 CGPA to percentage for CBSE?",
        "answer": "Using the CBSE formula: 7.8 * 9.5 = 74.10%."
      },
      {
        "question": "Do engineering universities accept the 9.5 multiplier?",
        "answer": "Most engineering colleges provide their own conversion formula in their academic regulations (such as (CGPA - 0.75) * 10 or CGPA * 10). Check your university guidelines."
      }
    ]
  },
  "student-percentage-calculator": {
    "formulaTitle": "Comprehensive Percentage Mathematics",
    "formulaDescription": "Calculates standard percentage ratios, percentage increase/decrease, and relative percentage differences.",
    "formulaCode": "X of Y: (X / Y) * 100 | Increase/Decrease: ((New - Old) / Old) * 100",
    "calculationSteps": [
      "For basic percentage: Divide the part value by the total base value and multiply by 100.",
      "For percentage change: Subtract original value from new value, divide by original value, and multiply by 100.",
      "Handle zero denominator guards to ensure zero division error immunity."
    ],
    "example": {
      "scenario": "Calculating marks percentage: 468 marks obtained out of 500 maximum",
      "inputs": "Obtained (X): 468 | Total (Y): 500",
      "calculation": "(468 / 500) * 100 = 0.936 * 100 = 93.60%",
      "outcome": "Percentage: 93.60%"
    },
    "assumptions": [
      "Base values cannot be zero.",
      "All calculations carry precision up to 2 decimal places."
    ],
    "disclaimer": "Calculations are mathematical evaluations. Rounding may occur at the second decimal place.",
    "faqs": [
      {
        "question": "How do I calculate percentage of marks quickly?",
        "answer": "Divide the total marks you scored by the maximum possible marks, then multiply by 100."
      },
      {
        "question": "What is the formula for percentage increase?",
        "answer": "Percentage Increase = ((New Value - Original Value) / Original Value) * 100."
      },
      {
        "question": "What if the base total is zero?",
        "answer": "Division by zero is mathematically undefined. The calculator guards against this by requiring a positive total value."
      }
    ]
  },
  "student-marks-percentage": {
    "formulaTitle": "Multi-Subject Marks & Grade Aggregation",
    "formulaDescription": "Aggregates marks obtained across dynamic individual subjects to calculate total aggregate score, overall percentage, and letter grade.",
    "formulaCode": "Overall Percentage = (Sum of Marks Obtained across all subjects / Sum of Maximum Marks across all subjects) * 100",
    "calculationSteps": [
      "Add each subject with its name, obtained score, and maximum possible marks.",
      "Sum all obtained marks to find total score.",
      "Sum all maximum marks to find total maximum score.",
      "Divide total obtained by total maximum and multiply by 100."
    ],
    "example": {
      "scenario": "5 Subjects in Class 12: 92, 85, 88, 90, 95 (each out of 100)",
      "inputs": "Total Obtained: 450 | Total Maximum: 500",
      "calculation": "(450 / 500) * 100 = 90.00%",
      "outcome": "Overall Percentage: 90.00% | Grade: Distinction / A+"
    },
    "assumptions": [
      "Each subject score is less than or equal to its maximum mark.",
      "All subjects carry equal academic weight unless credit weighting is applied."
    ],
    "disclaimer": "Grading boundaries (A+, A, B, etc.) are standard academic ranges and may vary depending on your specific state or central education board.",
    "faqs": [
      {
        "question": "Can I add more subjects dynamically?",
        "answer": "Yes, you can add or remove as many subjects as needed (5, 6, 7 or more) using the Add Subject button."
      },
      {
        "question": "Does this calculator support best-of-five rules?",
        "answer": "You can enter all your subjects and exclude your additional sixth subject if your board calculates aggregate on best 5 subjects."
      },
      {
        "question": "How do I calculate marks percentage if practicals are separate?",
        "answer": "Add theory and practical marks together as one subject score (e.g. 65 theory + 28 practical = 93 / 100)."
      }
    ]
  },
  "student-gpa-calculator": {
    "formulaTitle": "Semester Grade Point Average (SGPA) Formula",
    "formulaDescription": "Computes credit-weighted Grade Point Average where each course grade point is multiplied by its assigned academic credit hours.",
    "formulaCode": "SGPA = Sum of (Course Credits * Grade Points) / Total Semester Credits",
    "calculationSteps": [
      "Enter course title, credit hours (e.g. 4 credits for core theory, 2 for lab), and grade obtained.",
      "Multiply course credits by numerical grade point (e.g., A = 10, B = 8, etc.).",
      "Sum the total quality credit points across all courses.",
      "Divide total quality points by total enrolled credit hours."
    ],
    "example": {
      "scenario": "4 Courses: Course 1 (4 credits, Grade 10), Course 2 (4 credits, Grade 9), Course 3 (3 credits, Grade 8), Lab (2 credits, Grade 10)",
      "inputs": "Total Points: (4*10) + (4*9) + (3*8) + (2*10) = 40 + 36 + 24 + 20 = 120 | Total Credits: 13",
      "calculation": "SGPA = 120 / 13 = 9.23",
      "outcome": "SGPA: 9.23 on a 10.0 scale"
    },
    "assumptions": [
      "Standard 10-point Indian university grading scale (O/A+ = 10, A = 9, B+ = 8, B = 7, C = 6, P = 5, F = 0).",
      "Audit or non-credit courses are excluded."
    ],
    "disclaimer": "University grading scales may assign different numerical points to letter grades (e.g., A+ = 9 vs 10). Adjust grade points to match your college regulations.",
    "faqs": [
      {
        "question": "What is the difference between SGPA and CGPA?",
        "answer": "SGPA is the Grade Point Average for a single semester, while CGPA is the cumulative average of all completed semesters."
      },
      {
        "question": "How do course credits affect my GPA?",
        "answer": "Courses with higher credit hours (e.g., 4 credits) have a proportionally larger impact on your overall GPA than 1 or 2 credit labs."
      },
      {
        "question": "How do I convert SGPA to percentage?",
        "answer": "Most universities follow the standard formula: Percentage = (SGPA - 0.75) * 10 or SGPA * 10."
      }
    ]
  },
  "student-attendance-calculator": {
    "formulaTitle": "Attendance Tracking & 75% Rule Mathematics",
    "formulaDescription": "Calculates your current attendance percentage and determines the exact number of future classes you must attend to meet criteria or how many you can safely bunk.",
    "formulaCode": "Current % = (Attended / Total) * 100 | Classes Needed = Math.ceil((Target * Total - Attended) / (1 - Target)) | Bunks Allowed = Math.floor((Attended - Target * Total) / Target)",
    "calculationSteps": [
      "Enter total classes conducted to date and total classes you attended.",
      "Compute current percentage: (Attended / Total) * 100.",
      "If below target criteria (e.g. 75%), calculate consecutive future lectures you must attend.",
      "If above target criteria, calculate how many upcoming lectures you can safely miss without dipping below threshold."
    ],
    "example": {
      "scenario": "Attended 48 out of 70 classes conducted, target is 75% attendance",
      "inputs": "Attended: 48 | Total: 70 | Target: 75% (0.75)",
      "calculation": "Current % = (48 / 70) * 100 = 68.57%. Classes needed = ceil((0.75 * 70 - 48) / (1 - 0.75)) = ceil((52.5 - 48) / 0.25) = ceil(18) = 18 classes.",
      "outcome": "Current Attendance: 68.57% | Must attend 18 consecutive classes without absence"
    },
    "assumptions": [
      "Future classes are attended consecutively with 100% attendance until target is reached.",
      "Target attendance threshold is typically 75% or 85% as mandated by UGC/colleges."
    ],
    "disclaimer": "Medical leave policies and institutional attendance relaxations vary by institution. Always consult your college administration or student handbook.",
    "faqs": [
      {
        "question": "Why is 75% attendance mandatory in Indian colleges?",
        "answer": "The University Grants Commission (UGC) and All India Council for Technical Education (AICTE) mandate a minimum 75% attendance to be eligible for end-semester examinations."
      },
      {
        "question": "Can I miss a class if my attendance is exactly 75%?",
        "answer": "No. If you miss a single class when at exactly 75%, your attendance will immediately drop below the mandatory 75% threshold."
      },
      {
        "question": "Does this calculator support duty leaves or medical leaves?",
        "answer": "You can add approved duty leaves or medical attendance directly to your attended classes count."
      }
    ]
  },
  "student-required-marks": {
    "formulaTitle": "Required Final Exam Marks Formula",
    "formulaDescription": "Computes the minimum marks you need in your remaining assessments or final semester examination to achieve your target overall percentage.",
    "formulaCode": "Required Marks = (Target % * Total Course Max Marks / 100) - Current Marks Scored",
    "calculationSteps": [
      "Enter total maximum marks for the entire course or academic year.",
      "Enter marks already secured in internal tests, assignments, or mid-terms.",
      "Specify your desired overall target percentage (e.g., 60% for first class, 75% for distinction).",
      "Determine remaining exam marks pool and verify feasibility."
    ],
    "example": {
      "scenario": "Course total is 100 marks. Scored 32 / 40 in internals. Target is 80% overall.",
      "inputs": "Max Marks: 100 | Current Scored: 32 / 40 | Remaining: 60 | Target: 80%",
      "calculation": "Total marks needed = 80% of 100 = 80 marks. Marks needed in final = 80 - 32 = 48 marks out of 60.",
      "outcome": "Need 48 out of 60 marks (80.00% in final exam)"
    },
    "assumptions": [
      "Remaining marks cannot exceed the maximum allotted to upcoming assessments.",
      "No negative scaling or moderation is applied."
    ],
    "disclaimer": "Subject-specific passing criteria (such as mandatory 35% or 40% in final theory exam independently) must also be fulfilled regardless of overall aggregate.",
    "faqs": [
      {
        "question": "What happens if the calculator shows more than 100% required?",
        "answer": "That means even scoring full marks (100%) in remaining exams will not achieve your target percentage due to lower scores in past assessments."
      },
      {
        "question": "How do I pass if there are separate theory and practical minimums?",
        "answer": "Ensure you meet both the individual theory passing threshold (usually 35-40%) and your aggregate target."
      },
      {
        "question": "Can I use this for university semester finals?",
        "answer": "Yes. Input your internal assessment marks and compute the score needed in end-semester exams."
      }
    ]
  },
  "student-average-marks": {
    "formulaTitle": "Arithmetic Mean & Weighted Average Formulas",
    "formulaDescription": "Computes simple average score or weighted average marks when exams and assignments carry different percentage contributions.",
    "formulaCode": "Simple Average = Sum(Marks) / N | Weighted Average = Sum(Marks * Weight) / Sum(Weights)",
    "calculationSteps": [
      "Enter the score and weight for each assessment or subject.",
      "For simple average, sum all scores and divide by total subject count.",
      "For weighted average, multiply each score by its assigned weight, sum the products, and divide by the total weight sum."
    ],
    "example": {
      "scenario": "Assignments (Weight 20%, Score 85), Midterm (Weight 30%, Score 75), Final Exam (Weight 50%, Score 90)",
      "inputs": "Assessment weights: 20%, 30%, 50% | Scores: 85, 75, 90",
      "calculation": "(85 * 20 + 75 * 30 + 90 * 50) / 100 = (1700 + 2250 + 4500) / 100 = 8450 / 100 = 84.50",
      "outcome": "Weighted Average Mark: 84.50%"
    },
    "assumptions": [
      "Weights are positive numbers summing to 100% (or normalized automatically).",
      "All scores are on the same numerical scale."
    ],
    "disclaimer": "Institutional grading schemes may include curve normalization or relative grading percentiles not captured by simple arithmetic means.",
    "faqs": [
      {
        "question": "What is the difference between simple and weighted average?",
        "answer": "A simple average treats every exam equally. A weighted average gives more importance to exams that carry higher percentage value (like finals vs weekly quizzes)."
      },
      {
        "question": "Do my weights need to add up to 100 exactly?",
        "answer": "Our calculator automatically normalizes weights by dividing by the sum of weights, but using 100% is standard practice."
      },
      {
        "question": "Can I calculate grade point average using this tool?",
        "answer": "Yes, if you enter grade points as scores and course credits as weights, it computes your exact GPA."
      }
    ]
  },
  "student-study-hours": {
    "formulaTitle": "Study Schedule Allocation & Priority Budgeting",
    "formulaDescription": "Calculates total available study hours before your upcoming examination deadline and distributes time proportionally across subjects based on difficulty priorities.",
    "formulaCode": "Total Study Time = Days Left * Daily Study Hours | Subject Allocation = Total Study Time * (Priority Weight / Sum of Weights)",
    "calculationSteps": [
      "Select your exam start date to find days remaining.",
      "Specify your realistic daily study capacity (e.g. 4 to 8 hours per day).",
      "Assign priority ratings (High = 3, Medium = 2, Low = 1) to each syllabus subject.",
      "Distribute the study hour budget proportionately across subjects."
    ],
    "example": {
      "scenario": "30 days remaining for exams, studying 6 hours per day across 3 subjects (Physics: High, Math: High, Chem: Medium)",
      "inputs": "Days: 30 | Daily Hours: 6 | Total Budget: 180 hours | Priorities: Phys (3), Math (3), Chem (2) -> Sum = 8",
      "calculation": "Physics: (3/8)*180 = 67.5 hrs | Math: (3/8)*180 = 67.5 hrs | Chem: (2/8)*180 = 45 hrs",
      "outcome": "Total Hours: 180 hrs | High Priority: 67.5 hrs each | Medium Priority: 45 hrs"
    },
    "assumptions": [
      "Study hours reflect active focused learning time excluding breaks.",
      "Daily capacity remains consistent throughout the countdown period."
    ],
    "disclaimer": "Revision pacing depends on individual retention and previous preparation. Build buffer days before the exam for mock tests and rest.",
    "faqs": [
      {
        "question": "How many hours should a student study daily for competitive exams?",
        "answer": "Quality and consistency matter more than sheer hours. Most successful aspirants maintain 6 to 8 hours of focused, distraction-free study daily."
      },
      {
        "question": "How often should I take breaks during long study sessions?",
        "answer": "The Pomodoro Technique (50 minutes study followed by a 10-minute break) is proven to maintain mental stamina and focus."
      },
      {
        "question": "Should I prioritize weak subjects first?",
        "answer": "Yes. Allocate high priority to challenging topics early in your schedule so you have sufficient time for revision and doubt clearance."
      }
    ]
  },
  "career-ctc-to-in-hand": {
    "formulaTitle": "Indian CTC to In-Hand Take-Home Salary Breakdown",
    "formulaDescription": "Simulates typical corporate compensation structures in India, converting annual Cost to Company (CTC) into realistic monthly in-hand take-home salary after statutory deductions.",
    "formulaCode": "Monthly In-Hand = (Gross Salary - Employee PF - Professional Tax - Estimated Monthly TDS) / 12",
    "calculationSteps": [
      "Calculate Basic Pay (typically 40% to 50% of CTC).",
      "Calculate HRA (House Rent Allowance, typically 40% to 50% of Basic Pay).",
      "Deduct Employee PF (12% of Basic, capped at ₹1,800/mo or uncapped based on company policy).",
      "Deduct statutory Professional Tax (PT ~₹200/month in most states).",
      "Deduct Employer PF and Gratuity (~4.81% of Basic) which form part of CTC but are not paid out monthly.",
      "Estimate TDS (Income Tax) under the selected tax regime (New vs Old)."
    ],
    "example": {
      "scenario": "Annual CTC of ₹12,00,000 (12 LPA) under New Tax Regime",
      "inputs": "CTC: ₹12,00,000 | Basic: 40% (₹4,80,000) | PF: Statutory capped",
      "calculation": "Gross: ~₹11,10,000 | Deductions: Employee PF (₹21,600) + PT (₹2,400) + TDS (~₹60,000)",
      "outcome": "Estimated Monthly Take-Home: ~₹85,000 - ₹88,000 / month"
    },
    "assumptions": [
      "Basic salary is assumed at 40% of CTC unless customized.",
      "Employee PF is 12% of basic pay.",
      "Professional Tax is standard ₹200/month (₹2,400/year).",
      "Tax calculation applies New Tax Regime standard deduction of ₹75,000."
    ],
    "disclaimer": "Actual salary slips vary by employer due to variable pay, flexible benefit plans (FBP), corporate medical insurance, and performance bonuses. Check your official offer letter for exact terms.",
    "faqs": [
      {
        "question": "Why is in-hand salary so much lower than CTC?",
        "answer": "Cost to Company (CTC) includes employer contributions like Employer PF (12%), Gratuity (4.81%), insurance premiums, and variable bonuses that are not part of your monthly paycheck."
      },
      {
        "question": "What is the standard deduction in salary for FY 2024-25 and FY 2025-26?",
        "answer": "The Union Budget enhanced the standard deduction under the New Tax Regime to ₹75,000 for salaried employees (up from ₹50,000)."
      },
      {
        "question": "Is PF deduction mandatory for all employees in India?",
        "answer": "EPF is mandatory for employees in registered establishments with Basic Pay up to ₹15,000/month. For higher basic pay, companies may allow capping at ₹1,800 or deduction on actual basic."
      }
    ]
  },
  "career-monthly-to-annual-salary": {
    "formulaTitle": "Monthly to Annual & Hourly Pay Conversion",
    "formulaDescription": "Converts monthly net or gross earnings into comprehensive annual, quarterly, bi-weekly, weekly, daily, and hourly earnings rates.",
    "formulaCode": "Annual = Monthly * 12 | Quarterly = Annual / 4 | Weekly = Annual / 52 | Daily = Annual / 260 | Hourly = Daily / 8",
    "calculationSteps": [
      "Multiply monthly income by 12 to determine Annual Salary.",
      "Divide annual salary by 52 to calculate standard Weekly Pay.",
      "Divide by 260 working days (5 days/week * 52 weeks) to calculate Daily Earnings.",
      "Divide daily earnings by 8 standard working hours to find Hourly Rate."
    ],
    "example": {
      "scenario": "Monthly gross salary of ₹75,000",
      "inputs": "Monthly: ₹75,000",
      "calculation": "Annual = 75,000 * 12 = ₹9,00,000 | Weekly = 9,00,000 / 52 = ₹17,308 | Hourly = 9,00,000 / (260 * 8) = ₹432.69",
      "outcome": "Annual Salary: ₹9,00,000 | Weekly: ₹17,308 | Hourly Rate: ₹432.69"
    },
    "assumptions": [
      "Standard work year consists of 52 weeks and 260 working days (5-day work week).",
      "Daily work schedule is 8 productive working hours."
    ],
    "disclaimer": "Calculations represent gross or net pro-rata distributions depending on whether gross or net monthly pay is entered.",
    "faqs": [
      {
        "question": "How do I convert monthly pay into annual LPA?",
        "answer": "Multiply monthly salary by 12 and divide by 1,00,000. For example, ₹50,000/month * 12 = ₹6,00,000 = 6 LPA."
      },
      {
        "question": "Does this include annual performance bonuses?",
        "answer": "This converts regular fixed monthly pay. If you have an annual bonus, add it separately to the final annual gross figure."
      },
      {
        "question": "How is hourly rate calculated for freelance projects?",
        "answer": "Annual salary is divided by total billable hours in a year (typically 2,080 hours for 40 hrs/week * 52 weeks)."
      }
    ]
  },
  "career-annual-to-monthly-salary": {
    "formulaTitle": "Annual Package (LPA) to Monthly Pay Breakdown",
    "formulaDescription": "Deconstructs your annual Cost to Company (LPA) into gross monthly, weekly, and daily equivalents.",
    "formulaCode": "Monthly Gross = Annual CTC / 12 | Bi-Weekly = Annual CTC / 26 | Weekly = Annual CTC / 52",
    "calculationSteps": [
      "Convert LPA (Lakhs Per Annum) to numeric value (e.g. 10 LPA = ₹10,00,000).",
      "Divide total by 12 to find regular gross monthly paycheck.",
      "Compute weekly and daily equivalents based on 52 weeks per calendar year."
    ],
    "example": {
      "scenario": "Annual package of 10 LPA (₹10,00,000)",
      "inputs": "Annual CTC: ₹10,00,000",
      "calculation": "Monthly Gross = 10,00,000 / 12 = ₹83,333.33 | Weekly = 10,00,000 / 52 = ₹19,230.77",
      "outcome": "Monthly Gross: ₹83,333.33"
    },
    "assumptions": [
      "Salary is distributed across 12 equal monthly installments.",
      "Does not account for unequal bonus payouts or retainers."
    ],
    "disclaimer": "Monthly gross is before tax (TDS) and statutory provident fund deductions. For actual take-home pay, use our CTC to In-Hand Calculator.",
    "faqs": [
      {
        "question": "What is 1 LPA in monthly salary?",
        "answer": "1 LPA (₹1,00,000/year) equals approximately ₹8,333.33 gross per month before tax."
      },
      {
        "question": "What is 6 LPA monthly in hand?",
        "answer": "6 LPA is ₹50,000 gross per month. After standard PF and PT deductions, in-hand is approximately ₹43,000 to ₹45,000 per month."
      },
      {
        "question": "Is gross salary the same as in-hand salary?",
        "answer": "No. Gross salary is your total earnings before any deductions. In-hand is what is credited to your bank account after PF, PT, and income tax (TDS)."
      }
    ]
  },
  "career-salary-hike": {
    "formulaTitle": "Salary Appraisal & Hike Percentage Formula",
    "formulaDescription": "Calculates your revised annual CTC and monthly salary following an appraisal hike or job transition increment.",
    "formulaCode": "Revised Salary = Current Salary * (1 + Hike% / 100) | Absolute Hike = Revised Salary - Current Salary",
    "calculationSteps": [
      "Enter current annual or monthly compensation.",
      "Enter proposed hike percentage (e.g. 15% for annual appraisal or 30% for job switch).",
      "Multiply current salary by the percentage increase.",
      "Add hike amount to current salary to determine revised package."
    ],
    "example": {
      "scenario": "Current CTC of ₹8,00,000 receiving a 25% switch hike",
      "inputs": "Current Salary: ₹8,00,000 | Hike: 25%",
      "calculation": "Hike Amount = 8,00,000 * 0.25 = ₹2,00,000 | Revised Salary = 8,00,000 + 2,00,000 = ₹10,00,000",
      "outcome": "Revised CTC: ₹10,00,000 (10 LPA) | Monthly Gain: ₹16,667"
    },
    "assumptions": [
      "Hike percentage applies uniformly to total fixed CTC.",
      "Variable pay structures remain proportionately identical unless renegotiated."
    ],
    "disclaimer": "Net in-hand increment may be lower due to higher income tax tax slab brackets on the incremental amount.",
    "faqs": [
      {
        "question": "What is an average salary hike during annual appraisal in India?",
        "answer": "Standard annual appraisals in Indian IT and corporate sectors typically range from 7% to 12% for average performers and 15% to 20% for top performers."
      },
      {
        "question": "What is a typical salary hike for a job switch in India?",
        "answer": "Job switches typically command hikes between 25% and 40%, depending on skill demand, candidate experience, and market conditions."
      },
      {
        "question": "How do I calculate what percentage hike I received?",
        "answer": "Use our Increment Calculator: ((New Salary - Old Salary) / Old Salary) * 100."
      }
    ]
  },
  "career-increment-calculator": {
    "formulaTitle": "Percentage Increment & Growth Formula",
    "formulaDescription": "Calculates the exact percentage raise and absolute monetary gain between your previous salary and new compensation offer.",
    "formulaCode": "Percentage Increment = ((New Salary - Old Salary) / Old Salary) * 100",
    "calculationSteps": [
      "Enter your old/previous salary amount.",
      "Enter your new/offered salary amount.",
      "Subtract old salary from new salary to find the absolute gain.",
      "Divide absolute gain by old salary and multiply by 100."
    ],
    "example": {
      "scenario": "Old salary was ₹6,00,000 and new offer is ₹8,40,000",
      "inputs": "Old Salary: ₹6,00,000 | New Salary: ₹8,40,000",
      "calculation": "Absolute Gain = ₹2,40,000. Increment % = (2,40,000 / 6,00,000) * 100 = 40.00%",
      "outcome": "Hike Received: 40.00% | Monthly Increase: ₹20,000"
    },
    "assumptions": [
      "Both salary figures are on the same time basis (both annual CTC or both monthly gross).",
      "Currencies are identical."
    ],
    "disclaimer": "Evaluate whether the new offer includes non-cash ESOPs, retention bonuses, or deferred joining bonuses when comparing compensation.",
    "faqs": [
      {
        "question": "How is percentage hike calculated from old and new salary?",
        "answer": "Subtract old salary from new salary, divide the result by old salary, and multiply by 100."
      },
      {
        "question": "What if my new salary is lower?",
        "answer": "The calculator will report a negative percentage indicating a pay cut or reduction."
      },
      {
        "question": "How does tax affect my salary increment?",
        "answer": "The additional increment is taxed at your highest marginal tax slab rate (e.g. 20% or 30%), so your take-home increases by less than the gross hike."
      }
    ]
  },
  "career-pf-calculator": {
    "formulaTitle": "EPF & EPS Statutory Contribution Formulas",
    "formulaDescription": "Calculates monthly Employee Provident Fund (EPF), Employee Pension Scheme (EPS), and employer contributions, compounding multi-year accumulations at official EPFO interest rates.",
    "formulaCode": "Employee EPF = 12% of Basic | Employer EPF = 3.67% of Basic | Employer EPS = 8.33% of Basic (capped at ₹1,250 on ₹15k wage ceiling)",
    "calculationSteps": [
      "Calculate 12% of basic wage for employee provident fund contribution.",
      "Bifurcate employer contribution (12% total) into 8.33% EPS (pension) and 3.67% EPF (provident fund).",
      "Compound the accumulated EPF balance at the prevailing annual EPFO interest rate (e.g. 8.25% p.a.).",
      "Apply annual salary increments to project retirement corpus over 5 to 35 years."
    ],
    "example": {
      "scenario": "Monthly Basic Salary of ₹30,000, 8.25% EPFO interest rate over 15 years",
      "inputs": "Basic: ₹30,000 | EPF Rate: 8.25% | Period: 15 Years | Annual Wage Hike: 5%",
      "calculation": "Monthly Employee EPF: ₹3,600 | Employer EPF: ~₹2,350 | Compound interest calculated monthly.",
      "outcome": "Estimated Corpus after 15 Years: ~₹28,50,000+ (Total invested ~₹14,00,000)"
    },
    "assumptions": [
      "EPFO declared interest rate (8.25% for FY 2023-24 / FY 2024-25) is compounded annually on monthly running balances.",
      "EPS wage ceiling is ₹15,000/month (max ₹1,250/month diverted to pension fund) as per EPFO statutory rules."
    ],
    "disclaimer": "EPFO declares interest rates annually subject to Ministry of Finance ratification. Voluntary Provident Fund (VPF) and taxability of PF interest above ₹2.5 lakh/year should be considered.",
    "faqs": [
      {
        "question": "What is the current EPF interest rate in India?",
        "answer": "The EPFO declared an interest rate of 8.25% per annum for recent financial years."
      },
      {
        "question": "Is EPF interest taxable?",
        "answer": "Employee contributions to EPF up to ₹2.5 lakh per financial year generate tax-free interest. Interest on employee contributions exceeding ₹2.5 lakh annually is taxable as per income tax slabs."
      },
      {
        "question": "Can I withdraw my EPF balance before retirement?",
        "answer": "Partial withdrawals are permitted for specific life events (house purchase, medical emergencies, higher education, marriage) after completing specified service periods."
      }
    ]
  },
  "career-bonus-calculator": {
    "formulaTitle": "Performance Bonus & Net Payout Calculation",
    "formulaDescription": "Calculates performance bonus or annual variable incentive as a percentage of base salary or fixed amount, estimating net in-hand payout after TDS deductions.",
    "formulaCode": "Gross Bonus = (Salary * Bonus % / 100) or Fixed Amount | Net Bonus = Gross Bonus * (1 - TDS % / 100)",
    "calculationSteps": [
      "Enter base salary and bonus percentage or flat bonus figure.",
      "Compute gross bonus payout.",
      "Estimate tax withholding (TDS) based on your income tax slab (typically 10%, 20%, or 30%).",
      "Subtract TDS to determine estimated net payout credited to your account."
    ],
    "example": {
      "scenario": "Annual salary of ₹10,00,000 with a 10% performance bonus and 20% estimated TDS",
      "inputs": "Salary: ₹10,00,000 | Bonus: 10% | TDS: 20%",
      "calculation": "Gross Bonus = 10,00,000 * 0.10 = ₹1,00,000 | TDS Deducted = ₹20,000 | Net Bonus = ₹80,000",
      "outcome": "Gross Bonus: ₹1,00,000 | Net Take-Home Bonus: ₹80,000"
    },
    "assumptions": [
      "TDS is deducted at source by the employer according to the employee's marginal tax bracket.",
      "No additional surcharge applied unless total income exceeds ₹50 Lakhs."
    ],
    "disclaimer": "Actual bonus payouts are subject to company performance multipliers, individual performance appraisal ratings, and employer discretion.",
    "faqs": [
      {
        "question": "Why is bonus taxed at a higher rate in salary slips?",
        "answer": "Bonus is taxed at your highest marginal tax slab because it is added on top of your existing annual taxable income."
      },
      {
        "question": "Is annual performance bonus guaranteed?",
        "answer": "Variable pay or performance bonuses are typically contingent on company revenue targets and personal key performance indicators (KPIs)."
      },
      {
        "question": "Can I claim tax exemptions on bonus?",
        "answer": "No, cash bonuses are fully taxable as perquisite salary income under Indian tax laws."
      }
    ]
  },
  "career-internship-stipend": {
    "formulaTitle": "Internship Stipend & Total Earnings Formula",
    "formulaDescription": "Calculates total expected stipend proceeds from monthly, weekly, or hourly compensation across your internship tenure.",
    "formulaCode": "Total Earnings = Compensation Rate * Duration Units (Months / Weeks / Hours)",
    "calculationSteps": [
      "Select pay frequency (Monthly stipend, Weekly rate, or Hourly wage).",
      "Enter internship duration (e.g. 2 months or 8 weeks).",
      "Multiply rate by duration to determine total stipend earnings.",
      "Calculate average weekly and daily earnings breakdown."
    ],
    "example": {
      "scenario": "Summer intern earning ₹25,000/month for a 3-month tenure",
      "inputs": "Rate: ₹25,000/month | Duration: 3 months",
      "calculation": "Total Stipend = 25,000 * 3 = ₹75,000",
      "outcome": "Total Gross Earnings: ₹75,000"
    },
    "assumptions": [
      "Stipend rates assume 100% attendance during working days.",
      "TDS is typically not deducted if stipend is below standard taxable thresholds."
    ],
    "disclaimer": "Section 10(16) of the Income Tax Act exempts scholarships granted to meet the cost of education from tax. Corporate internships with employment contracts may be taxable.",
    "faqs": [
      {
        "question": "Is internship stipend taxable in India?",
        "answer": "If the stipend is given purely as a scholarship to support education/research, it may be exempt under Section 10(16). If provided by a company as consideration for services rendered, it is taxable as salary/income from other sources if total income exceeds the basic exemption limit."
      },
      {
        "question": "What is a typical tech internship stipend in India?",
        "answer": "Tech internships at product companies range from ₹25,000 to ₹1,00,000+ per month, while startups and service firms typically offer ₹10,000 to ₹25,000/month."
      },
      {
        "question": "Can students file ITR to claim TDS refund on stipend?",
        "answer": "Yes! If the company deducted 10% TDS under Section 194J or 192 and your total income is below taxable limits, you can file an ITR to claim a 100% refund."
      }
    ]
  },
  "finance-emi-calculator": {
    "formulaTitle": "Standard Equated Monthly Installment (EMI) Formula",
    "formulaDescription": "Calculates monthly loan repayment installments and interest amortization using the standard mathematical reducing-balance formula used by all Indian banks.",
    "formulaCode": "EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1] (where P = Principal, r = Monthly Interest Rate, n = Tenure in Months)",
    "calculationSteps": [
      "Convert annual interest rate to monthly rate: r = (Annual Rate / 12) / 100.",
      "Convert loan tenure in years to total months: n = Years * 12.",
      "Compute (1 + r)^n factor.",
      "Multiply by principal and evaluate numerator / denominator ratio to find monthly EMI.",
      "Compute Total Interest = (EMI * n) - Principal."
    ],
    "example": {
      "scenario": "Education or Home Loan of ₹20,00,000 at 9.5% interest for 10 years (120 months)",
      "inputs": "Principal: ₹20,00,000 | Interest: 9.5% p.a. | Tenure: 10 Years (120 Months)",
      "calculation": "r = 0.095/12 = 0.007917 | EMI = [2000000 * 0.007917 * (1.007917)^120] / [(1.007917)^120 - 1] = ₹25,873",
      "outcome": "Monthly EMI: ₹25,873 | Total Interest: ₹11,04,749 | Total Repayment: ₹31,04,749"
    },
    "assumptions": [
      "Interest is compounded monthly on a reducing balance basis.",
      "Fixed interest rate throughout loan tenure."
    ],
    "disclaimer": "Does not include bank processing fees, documentation charges, stamp duty, or pre-payment penalties. Floating interest rates may adjust EMI or tenure over time.",
    "faqs": [
      {
        "question": "What is a reducing balance interest loan?",
        "answer": "In a reducing balance loan, interest is charged only on the outstanding principal balance each month rather than the initial principal, decreasing total interest paid."
      },
      {
        "question": "Can I claim tax deduction on education loan EMI?",
        "answer": "Yes. Under Section 80E of the Indian Income Tax Act, the entire interest paid on higher education loans is 100% tax deductible for up to 8 consecutive years with no upper cap."
      },
      {
        "question": "How can I reduce my loan EMI?",
        "answer": "You can reduce EMI by increasing your down payment, opting for a longer tenure, or negotiating a lower interest rate with your lender."
      }
    ]
  },
  "finance-sip-calculator": {
    "formulaTitle": "Mutual Fund SIP Future Value Compounding Formula",
    "formulaDescription": "Projects the maturity corpus of a Systematic Investment Plan (SIP) in equity mutual funds with monthly compounding.",
    "formulaCode": "M = P * [((1 + i)^n - 1) / i] * (1 + i) (where P = Monthly SIP, i = Monthly Return Rate, n = Total Months)",
    "calculationSteps": [
      "Convert expected annual return rate to monthly rate: i = Expected Return / 12 / 100.",
      "Calculate total investment periods: n = Investment Tenure in Years * 12.",
      "Compute geometric compound multiplier [((1 + i)^n - 1) / i] * (1 + i).",
      "Multiply by monthly installment P to obtain estimated future maturity value.",
      "Subtract total invested capital (P * n) to calculate estimated wealth gain."
    ],
    "example": {
      "scenario": "Monthly SIP of ₹5,000 for 15 years at an expected 12% annual return",
      "inputs": "Monthly SIP: ₹5,000 | Tenure: 15 Years (180 months) | Expected Return: 12% p.a.",
      "calculation": "Total Invested = 5,000 * 180 = ₹9,00,000 | Maturity Value = ~₹25,22,880",
      "outcome": "Invested: ₹9,00,000 | Estimated Wealth Gain: ₹16,22,880 | Total Corpus: ₹25,22,880"
    },
    "assumptions": [
      "Investments are made on the 1st of every month consistently.",
      "Returns are compounded monthly at a constant rate."
    ],
    "disclaimer": "Mutual fund investments are subject to market risks. Historical returns do not guarantee future returns. Equity markets experience volatility.",
    "faqs": [
      {
        "question": "What is a realistic expected return for equity mutual funds in India?",
        "answer": "Over long periods (10+ years), broad market Indian equity indices (Nifty 50, Sensex) have historically delivered 11% to 13% CAGR."
      },
      {
        "question": "What is the minimum amount needed to start an SIP?",
        "answer": "Many mutual funds allow you to start an SIP with as little as ₹500 or ₹1,000 per month."
      },
      {
        "question": "How are mutual fund SIP gains taxed in India?",
        "answer": "Equity mutual fund gains held for over 12 months are subject to Long-Term Capital Gains (LTCG) tax at 12.5% on gains exceeding ₹1.25 lakh per financial year."
      }
    ]
  },
  "finance-gst-calculator": {
    "formulaTitle": "Goods & Services Tax (GST) Formulas & Bifurcation",
    "formulaDescription": "Computes GST amount and final invoice price for both exclusive and inclusive pricing models, bifurcating taxes into Central GST (CGST) and State GST (SGST) or Integrated GST (IGST).",
    "formulaCode": "Exclusive: GST = Amount * (Rate / 100), Total = Amount + GST | Inclusive: Base = Total / (1 + Rate / 100), GST = Total - Base | CGST = GST / 2, SGST = GST / 2",
    "calculationSteps": [
      "Select calculation mode: GST Exclusive (adding tax to price) or GST Inclusive (extracting tax from final price).",
      "Select standard GST rate slab (5%, 12%, 18%, or 28%).",
      "Apply formula to compute total GST component.",
      "Bifurcate GST into 50% CGST and 50% SGST for intra-state supply, or 100% IGST for inter-state supply."
    ],
    "example": {
      "scenario": "Electronic gadget priced at ₹10,000 with 18% GST (Exclusive)",
      "inputs": "Amount: ₹10,000 | GST Rate: 18% | Mode: Exclusive",
      "calculation": "GST Amount = 10,000 * 0.18 = ₹1,800 | CGST (9%) = ₹900 | SGST (9%) = ₹900 | Total Invoice = ₹11,800",
      "outcome": "Total Bill: ₹11,800 | Total GST: ₹1,800 (CGST: ₹900, SGST: ₹900)"
    },
    "assumptions": [
      "Standard Indian GST slabs: 0%, 5%, 12%, 18%, 28%.",
      "Intra-state transactions divide GST equally into CGST and SGST."
    ],
    "disclaimer": "Different goods and services are classified under specific HSN / SAC codes with varying GST rates. Verify current notification schedules on cbic-gst.gov.in.",
    "faqs": [
      {
        "question": "What is the difference between GST inclusive and exclusive?",
        "answer": "GST Exclusive means the price displayed does not include tax; tax is added on top. GST Inclusive means the displayed price already contains the tax component."
      },
      {
        "question": "What are CGST, SGST, and IGST?",
        "answer": "CGST (Central GST) and SGST (State GST) apply to sales within the same state (50% each). IGST (Integrated GST) applies to sales between different states."
      },
      {
        "question": "What GST rate applies to education and books in India?",
        "answer": "Most educational services by schools and colleges and printed books are exempt from GST (0% rate)."
      }
    ]
  },
  "finance-fd-calculator": {
    "formulaTitle": "Bank Fixed Deposit (FD) Quarterly Compounding Formula",
    "formulaDescription": "Computes maturity amount and total interest earned on fixed deposit accounts using quarterly compounding standard across commercial and public sector banks in India.",
    "formulaCode": "A = P * (1 + r / 400)^(4 * t) (where P = Principal, r = Annual Interest Rate %, t = Tenure in Years)",
    "calculationSteps": [
      "Enter principal deposit amount and annual interest rate (e.g. 7.25% p.a.).",
      "Enter tenure in years, months, or days.",
      "Compound interest 4 times per year (quarterly compounding).",
      "Compute Maturity Amount A and Total Interest = A - P."
    ],
    "example": {
      "scenario": "Fixed deposit of ₹1,00,000 for 3 years at 7.00% interest",
      "inputs": "Principal: ₹1,00,000 | Rate: 7.00% p.a. | Tenure: 3 Years",
      "calculation": "A = 100000 * (1 + 7/400)^(4 * 3) = 100000 * (1.0175)^12 = ₹1,23,144",
      "outcome": "Maturity Amount: ₹1,23,144 | Interest Earned: ₹23,144"
    },
    "assumptions": [
      "Indian banks compound FD interest quarterly as per Reserve Bank of India (RBI) guidelines.",
      "Senior citizens typically receive an additional 0.50% interest."
    ],
    "disclaimer": "FD interest earned is taxable under \"Income from Other Sources\". Banks deduct TDS under Section 194A if annual interest exceeds ₹40,000 (₹50,000 for senior citizens).",
    "faqs": [
      {
        "question": "How often is interest compounded on bank FDs in India?",
        "answer": "Most Indian commercial banks (SBI, HDFC, ICICI) compound interest on fixed deposits every quarter (every 3 months)."
      },
      {
        "question": "Do senior citizens get higher FD interest rates?",
        "answer": "Yes, Indian banks typically offer senior citizens (age 60 and above) an extra 0.50% to 0.75% interest over standard card rates."
      },
      {
        "question": "What is a 5-year Tax Saving FD?",
        "answer": "Under Section 80C, investments up to ₹1.5 lakh in designated 5-year tax-saving FDs are tax-deductible. These have a mandatory 5-year lock-in period."
      }
    ]
  },
  "finance-rd-calculator": {
    "formulaTitle": "Recurring Deposit (RD) Maturity Formula",
    "formulaDescription": "Computes total maturity proceeds and accumulated compound interest on monthly recurring bank deposits using Indian banking quarterly compounding conventions.",
    "formulaCode": "Maturity Value calculated by summing compound growth of each monthly installment: M = Sum of [P * (1 + r/400)^(4 * (n - i + 1) / 12)] for each month i",
    "calculationSteps": [
      "Enter regular monthly installment amount P.",
      "Enter annual interest rate and total deposit tenure in months.",
      "Calculate compounding for each monthly deposit from its payment date to maturity.",
      "Sum all accumulated installments to determine total maturity value."
    ],
    "example": {
      "scenario": "Monthly deposit of ₹5,000 for 2 years (24 months) at 6.8% interest",
      "inputs": "Monthly Deposit: ₹5,000 | Tenure: 24 Months | Rate: 6.80% p.a.",
      "calculation": "Total Deposited = 5,000 * 24 = ₹1,20,000 | Maturity Value = ~₹1,28,842",
      "outcome": "Total Deposited: ₹1,20,000 | Interest Earned: ₹8,842 | Maturity Value: ₹1,28,842"
    },
    "assumptions": [
      "Deposits are made punctually on the due date every month.",
      "Interest is compounded quarterly."
    ],
    "disclaimer": "Premature withdrawals or delayed installments may attract penalty interest deductions as per bank rules.",
    "faqs": [
      {
        "question": "What is the minimum tenure for a Recurring Deposit?",
        "answer": "Most Indian banks offer RD tenures starting from 6 months up to a maximum of 10 years."
      },
      {
        "question": "Is interest earned on Recurring Deposits taxable?",
        "answer": "Yes. Interest earned on RDs is fully taxable as per your income tax slab, and banks deduct TDS if total interest exceeds statutory thresholds."
      },
      {
        "question": "Can I change my monthly deposit amount during the RD tenure?",
        "answer": "No. The monthly installment amount is fixed at the time of opening the RD account."
      }
    ]
  },
  "finance-tax-calculator": {
    "formulaTitle": "Indian Income Tax Slabs & Regime Comparison (FY 2024-25 & FY 2025-26)",
    "formulaDescription": "Calculates tax liability comparing the New Tax Regime (Section 115BAC) against the Old Tax Regime, incorporating the ₹75,000 standard deduction, Section 87A full rebate up to ₹7 Lakhs, and 4% Health & Education Cess.",
    "formulaCode": "New Regime Slabs: 0-3L: Nil | 3-7L: 5% | 7-10L: 10% | 10-12L: 15% | 12-15L: 20% | >15L: 30% + 4% Cess (Rebate u/s 87A if taxable income <= ₹7,00,000)",
    "calculationSteps": [
      "Calculate Gross Total Income from salary, business, interest, and other sources.",
      "Apply statutory standard deduction (₹75,000 for salaried in New Regime, ₹50,000 in Old Regime).",
      "For Old Regime, deduct eligible Section 80C, 80D, and HRA exemptions.",
      "Calculate tax on each slab bracket.",
      "Apply Section 87A rebate (zero tax if net taxable income is up to ₹7,00,000 in New Regime or ₹5,00,000 in Old Regime).",
      "Add 4% Health and Education Cess to net tax."
    ],
    "example": {
      "scenario": "Salaried employee earning ₹9,00,000 annual income under New Tax Regime",
      "inputs": "Gross Salary: ₹9,00,000 | Standard Deduction: ₹75,000 | Taxable Income: ₹8,25,000",
      "calculation": "Slab 0-3L: ₹0 | 3-7L: ₹20,000 | 7-8.25L: ₹12,500 | Base Tax: ₹32,500 | Cess (4%): ₹1,300",
      "outcome": "Total Income Tax: ₹33,800 | Net Effective Tax Rate: 3.76%"
    },
    "assumptions": [
      "Salaried individuals receive standard deduction of ₹75,000 under New Tax Regime as per Finance Act.",
      "Section 87A rebate provides full tax waiver for taxable income up to ₹7,00,000 in New Regime."
    ],
    "disclaimer": "Tax calculations are indicative simulations. Consult a qualified Chartered Accountant (CA) or certified tax advisor for official tax filing and complex deductions.",
    "faqs": [
      {
        "question": "Up to what salary is income completely tax-free under New Tax Regime?",
        "answer": "With the standard deduction of ₹75,000 and Section 87A rebate up to ₹7,00,000 taxable income, salaried individuals earning up to ₹7,75,000 pay zero income tax."
      },
      {
        "question": "Which regime is better: New or Old?",
        "answer": "For most taxpayers without heavy deductions (home loan interest, 80C, 80D), the New Tax Regime offers lower slab rates and higher rebate limits. If you have deductions exceeding ₹3.75 to ₹4 Lakhs, the Old Regime may be beneficial."
      },
      {
        "question": "What is Health & Education Cess in India?",
        "answer": "A mandatory 4% cess is levied on the total income tax amount payable across all tax regimes."
      }
    ]
  },
  "calculators-age": {
    "formulaTitle": "Precise Chronological Age Calculation",
    "formulaDescription": "Computes exact chronological age in completed years, months, and days from your date of birth, accounting for leap years, variable calendar month days, and next birthday countdown.",
    "formulaCode": "Age = Difference(Target Date - Date of Birth) resolved in Y Years, M Months, D Days",
    "calculationSteps": [
      "Compare target day with birth day. If negative, borrow days from the previous month.",
      "Compare target month with birth month. If negative, borrow 12 months from target year.",
      "Subtract birth year from target year to obtain completed years.",
      "Calculate total days lived and days remaining until your next birthday."
    ],
    "example": {
      "scenario": "Born on August 15, 2002, calculated as of September 15, 2026",
      "inputs": "Date of Birth: 15-Aug-2002 | Current Date: 15-Sep-2026",
      "calculation": "2026 - 2002 = 24 years | Sep - Aug = 1 month | 15 - 15 = 0 days",
      "outcome": "Age: 24 Years, 1 Month, 0 Days (8,797 Total Days Lived)"
    },
    "assumptions": [
      "Uses the Gregorian calendar.",
      "Correctly accounts for leap years (e.g. February having 29 days in 2024, 2028)."
    ],
    "disclaimer": "Official age for government eligibility (UPSC, NDA, SSC, banking exams) is calculated on a specific cut-off date specified in each official recruitment notice.",
    "faqs": [
      {
        "question": "How is age calculated for government exam eligibility?",
        "answer": "Government bodies (UPSC, SSC, IBPS) specify a reference eligibility date (e.g., 1st August or 1st January of the exam year). Enter that date as your Target Date to check eligibility."
      },
      {
        "question": "Does this calculator count leap years accurately?",
        "answer": "Yes. Our algorithm checks calendar month lengths and leap years so the day count is 100% accurate."
      },
      {
        "question": "How many days are in a year for total days lived?",
        "answer": "Actual calendar days lived are computed by taking the exact timestamp epoch difference."
      }
    ]
  },
  "calculators-bmi": {
    "formulaTitle": "Body Mass Index (BMI) & Weight Range Formulas",
    "formulaDescription": "Calculates Body Mass Index using the standard World Health Organization (WHO) formula and compares against international and Asian-Indian health thresholds.",
    "formulaCode": "Metric: BMI = Weight (kg) / [Height (m)]^2 | Imperial: BMI = [Weight (lbs) * 703] / [Height (inches)]^2",
    "calculationSteps": [
      "Convert height in centimeters to meters: Height (m) = Height (cm) / 100.",
      "Square the height in meters.",
      "Divide weight in kilograms by height squared.",
      "Classify into WHO Category: Underweight (<18.5), Normal (18.5-24.9), Overweight (25-29.9), Obese (>=30)."
    ],
    "example": {
      "scenario": "Height 175 cm (1.75 m) and Weight 70 kg",
      "inputs": "Height: 175 cm | Weight: 70 kg",
      "calculation": "BMI = 70 / (1.75 * 1.75) = 70 / 3.0625 = 22.86 kg/m²",
      "outcome": "BMI: 22.86 kg/m² | Category: Normal Weight (Healthy)"
    },
    "assumptions": [
      "Adult formula applies to individuals aged 18 and older.",
      "Healthy weight range corresponds to BMI between 18.5 and 24.9."
    ],
    "disclaimer": "BMI is an epidemiological screening tool and does not directly measure body fat percentage, muscle mass, or metabolic health. Consult a physician or registered dietitian for clinical health assessments.",
    "faqs": [
      {
        "question": "What is a healthy BMI for Indian adults?",
        "answer": "The WHO and Ministry of Health in India recommend a lower cut-off for Asian populations due to higher body fat percentage at lower BMIs: Normal is 18.5 to 22.9, Overweight is 23 to 24.9, and Obese is >= 25."
      },
      {
        "question": "Does BMI distinguish between muscle and fat?",
        "answer": "No. Muscular athletes and bodybuilders may register as overweight or obese on BMI scales despite having low body fat."
      },
      {
        "question": "How do I calculate my ideal body weight?",
        "answer": "Our calculator computes the minimum and maximum healthy weights for your height corresponding to a normal BMI of 18.5 to 24.9."
      }
    ]
  },
  "calculators-scientific-calculator": {
    "formulaTitle": "Safe Mathematical Expression Parser",
    "formulaDescription": "Evaluates complex algebraic, trigonometric, logarithmic, and transcendental expressions using a recursive-descent parser adhering to operator precedence (PEMDAS/BODMAS) with zero security vulnerabilities.",
    "formulaCode": "PEMDAS: Parentheses > Exponents/Roots > Multiplication/Division > Addition/Subtraction",
    "calculationSteps": [
      "Tokenize the input expression into numeric literals, functions, and operators.",
      "Support angle modes: Degrees (DEG) and Radians (RAD) for sine, cosine, and tangent.",
      "Evaluate nested sub-expressions within parentheses recursively.",
      "Provide instant precision results with zero use of insecure JavaScript eval()."
    ],
    "example": {
      "scenario": "Evaluate expression: 25 + sin(30 deg) * sqrt(16)",
      "inputs": "Expression: 25 + sin(30) * sqrt(16) [Degree Mode]",
      "calculation": "sin(30°) = 0.5 | sqrt(16) = 4 | 0.5 * 4 = 2 | 25 + 2 = 27",
      "outcome": "Result: 27"
    },
    "assumptions": [
      "Trigonometric functions accept angles in degrees or radians based on user selection.",
      "Factorials are computed for non-negative integers."
    ],
    "disclaimer": "Floating point rounding is performed at standard IEEE 754 double precision limits.",
    "faqs": [
      {
        "question": "How do I switch between Degree and Radian modes?",
        "answer": "Click the DEG / RAD toggle button at the top of the calculator display."
      },
      {
        "question": "Is this scientific calculator safe for exam practice?",
        "answer": "Yes, it accurately simulates the functions allowed on standard scientific calculators used in academic examinations."
      },
      {
        "question": "Does it support scientific notation?",
        "answer": "Yes, large or very small numbers are formatted in scientific exponential notation (e.g. 1.5e+8)."
      }
    ]
  },
  "calculators-unit-converter": {
    "formulaTitle": "Multi-Domain Dimensional Unit Conversion Formulas",
    "formulaDescription": "Converts measurements across seven core physical domains: Length, Mass/Weight, Temperature, Area, Volume, Speed, and Digital Storage using international SI conversion factors.",
    "formulaCode": "Target Value = (Input Value * Source-to-Base Factor) / Target-to-Base Factor (Special affine formula for Temperature)",
    "calculationSteps": [
      "Convert the input value to the standard SI base unit of that category (e.g. meters for length, kilograms for mass).",
      "For temperature: Convert Celsius, Fahrenheit, and Kelvin using linear thermodynamic equations (F = C * 9/5 + 32).",
      "Convert the base unit value to the destination unit.",
      "Format output with appropriate significant figures."
    ],
    "example": {
      "scenario": "Convert 5.5 Kilometers to Miles",
      "inputs": "Value: 5.5 | Source: Kilometer | Target: Mile",
      "calculation": "5.5 km = 5,500 meters. 1 mile = 1,609.344 meters. 5,500 / 1,609.344 = 3.4175 miles",
      "outcome": "Result: 3.4175 Miles"
    },
    "assumptions": [
      "Conversion factors adhere to National Institute of Standards and Technology (NIST) reference tables.",
      "Digital storage units use standard binary prefix conventions (1 KB = 1,024 Bytes or 1,000 Bytes)."
    ],
    "disclaimer": "Standard international conversion constants are used. Local real estate land measurement units (like Bigha or Ground) vary by state.",
    "faqs": [
      {
        "question": "How many feet are in a meter?",
        "answer": "1 meter equals approximately 3.28084 feet."
      },
      {
        "question": "How do I convert Celsius to Fahrenheit?",
        "answer": "Multiply Celsius by 9/5 (1.8) and add 32. For example, 25°C = 25 * 1.8 + 32 = 77°F."
      },
      {
        "question": "How many acres are in 1 hectare?",
        "answer": "1 hectare equals approximately 2.47105 acres."
      }
    ]
  },
  "calculators-date": {
    "formulaTitle": "Date Difference & Duration Algorithms",
    "formulaDescription": "Calculates the exact time difference between two dates in total days, weeks, months, and business days (excluding weekends), or adds/subtracts days to compute a future or past date.",
    "formulaCode": "Days Difference = Math.floor((Date2 - Date1) / (1000 * 60 * 60 * 24))",
    "calculationSteps": [
      "Parse starting date and ending date into UTC timestamps to avoid daylight savings discrepancies.",
      "Calculate absolute difference in calendar days.",
      "Filter and count weekdays (Monday through Friday) to determine Business Days.",
      "For Add/Subtract mode: Add or subtract N days from starting date to determine the resultant date."
    ],
    "example": {
      "scenario": "Days between January 1, 2026 and August 15, 2026",
      "inputs": "Start Date: 2026-01-01 | End Date: 2026-08-15",
      "calculation": "Difference = 226 calendar days = 32 weeks and 2 days = 162 business days",
      "outcome": "Total: 226 Days (162 Business Days)"
    },
    "assumptions": [
      "Business days exclude Saturdays and Sundays.",
      "National gazetted public holidays are not subtracted unless customized."
    ],
    "disclaimer": "Legal notice deadlines or statutory limitation periods should be verified against specific court or administrative business day rules.",
    "faqs": [
      {
        "question": "What is considered a business day?",
        "answer": "A business day is typically any weekday (Monday to Friday), excluding weekend days (Saturday and Sunday)."
      },
      {
        "question": "Can I add business days only?",
        "answer": "Our calculator computes total business days between dates. Use the add days function to project future deadlines."
      },
      {
        "question": "Does the date difference include the start date?",
        "answer": "Standard date subtraction measures the span between dates (e.g. Monday to Tuesday is 1 day)."
      }
    ]
  },
  "calculators-discount": {
    "formulaTitle": "Percentage Discount & Sale Price Formula",
    "formulaDescription": "Calculates the discounted selling price and total monetary savings from a percentage discount or shopping promotional deal.",
    "formulaCode": "Savings = Original Price * (Discount % / 100) | Final Price = Original Price - Savings",
    "calculationSteps": [
      "Enter the original list price (MRP).",
      "Enter the discount percentage offered (e.g. 20% off).",
      "Multiply list price by discount percentage to calculate total money saved.",
      "Subtract savings from list price to find the final payable price."
    ],
    "example": {
      "scenario": "MRP of ₹2,499 with a 30% festive discount",
      "inputs": "Original Price: ₹2,499 | Discount: 30%",
      "calculation": "Savings = 2,499 * 0.30 = ₹749.70 | Final Price = 2,499 - 749.70 = ₹1,749.30",
      "outcome": "Final Sale Price: ₹1,749.30 | Total Saved: ₹749.70"
    },
    "assumptions": [
      "Discount applies to the pre-discount listed price.",
      "Additional taxes (if applicable) are calculated on the discounted price."
    ],
    "disclaimer": "Store return policies, cashback offers, and bank credit card instant discounts may modify the final bill.",
    "faqs": [
      {
        "question": "How do I calculate 20% off easily in my head?",
        "answer": "Move the decimal point one place to the left to find 10%, then double that number. For ₹800: 10% is ₹80, so 20% is ₹160. Final price: 800 - 160 = ₹640."
      },
      {
        "question": "What does \"Buy 1 Get 1 Free\" mean in percentage discount?",
        "answer": "Buy 1 Get 1 Free (BOGO) equals an effective 50% discount on the total purchase."
      },
      {
        "question": "How are successive discounts (e.g. 20% + 10% off) calculated?",
        "answer": "Successive discounts are not simply added (20+10=30%). The 10% is applied to the already discounted price, giving an effective 28% discount."
      }
    ]
  },
  "calculators-profit-loss": {
    "formulaTitle": "Cost Price, Selling Price & Margin Formulas",
    "formulaDescription": "Determines whether a commercial transaction resulted in a profit or loss, calculating absolute profit/loss amount and margin percentage relative to Cost Price.",
    "formulaCode": "Profit = SP - CP (if SP > CP) | Loss = CP - SP (if SP < CP) | Profit % = (Profit / CP) * 100 | Loss % = (Loss / CP) * 100",
    "calculationSteps": [
      "Compare Selling Price (SP) against Cost Price (CP).",
      "If SP > CP: Profit = SP - CP. Calculate Profit Percentage on CP.",
      "If SP < CP: Loss = CP - SP. Calculate Loss Percentage on CP.",
      "If SP = CP: Transaction is at Break-Even (Zero Profit, Zero Loss)."
    ],
    "example": {
      "scenario": "Bought goods for ₹8,000 and sold for ₹10,400",
      "inputs": "Cost Price (CP): ₹8,00,000? No: CP: ₹8,000 | Selling Price (SP): ₹10,400",
      "calculation": "Profit = 10,400 - 8,000 = ₹2,400 | Profit % = (2,400 / 8,000) * 100 = 30.00%",
      "outcome": "Profit: ₹2,400 | Profit Percentage: 30.00%"
    },
    "assumptions": [
      "Profit and Loss percentages are always calculated relative to Cost Price (CP) unless specified as profit margin on selling price.",
      "Overhead expenses (shipping, handling) should be included in Cost Price."
    ],
    "disclaimer": "Does not account for business income tax or sales commission fees.",
    "faqs": [
      {
        "question": "Why is profit percentage calculated on Cost Price instead of Selling Price?",
        "answer": "In standard financial accounting and academic mathematics, profit percentage represents return on investment (Cost Price)."
      },
      {
        "question": "What is the difference between markup and profit margin?",
        "answer": "Markup is profit divided by Cost Price. Profit Margin is profit divided by Selling Price."
      },
      {
        "question": "What is Break-Even Point?",
        "answer": "Break-even occurs when Selling Price exactly equals Cost Price, resulting in neither profit nor loss."
      }
    ]
  },
  "calculators-ratio": {
    "formulaTitle": "Ratio Simplification & Equivalence Mathematics",
    "formulaDescription": "Simplifies mathematical ratios (A:B) into lowest integer terms using the Greatest Common Divisor (GCD/HCF), computing decimal ratio values and percentage shares.",
    "formulaCode": "Simplified Ratio = (A / GCD(A, B)) : (B / GCD(A, B)) | Fraction = A / (A + B)",
    "calculationSteps": [
      "Find the Greatest Common Divisor (GCD) of the two ratio terms using Euclidean algorithm.",
      "Divide both terms by the GCD to find the simplified ratio in lowest terms.",
      "Calculate decimal quotient: A / B.",
      "Calculate part-to-whole percentages: [A / (A+B)] * 100 and [B / (A+B)] * 100."
    ],
    "example": {
      "scenario": "Simplify the ratio 48 : 72",
      "inputs": "Ratio: 48 : 72",
      "calculation": "GCD of 48 and 72 is 24. 48 / 24 = 2, 72 / 24 = 3.",
      "outcome": "Simplified Ratio: 2 : 3 | Decimal: 0.6667 | Proportions: 40% and 60%"
    },
    "assumptions": [
      "Both terms in the ratio must be non-zero positive numbers.",
      "Ratios with decimals are multiplied by powers of 10 before simplification."
    ],
    "disclaimer": "Ratios represent proportional relationships, not absolute quantities.",
    "faqs": [
      {
        "question": "What is an equivalent ratio?",
        "answer": "Equivalent ratios are ratios that express the same relationship between numbers (for example, 2:3, 4:6, and 48:72 are all equivalent)."
      },
      {
        "question": "How do I scale a ratio?",
        "answer": "Multiply or divide both terms of the ratio by the same non-zero number."
      },
      {
        "question": "What is an aspect ratio in screens?",
        "answer": "An aspect ratio describes the proportional relationship between the width and height of an image or screen (such as 16:9 for widescreen video)."
      }
    ]
  },
  "calculators-fraction": {
    "formulaTitle": "Fraction Arithmetic & Lowest-Term Reduction",
    "formulaDescription": "Executes addition, subtraction, multiplication, and division across proper, improper, and mixed fractions, simplifying results to lowest terms.",
    "formulaCode": "Add: (a/b) + (c/d) = (ad + bc) / bd | Multiply: (a/b) * (c/d) = ac / bd | Divide: (a/b) / (c/d) = ad / bc",
    "calculationSteps": [
      "For addition/subtraction: Find common denominator bd, cross-multiply numerators, and perform operation.",
      "For multiplication: Multiply numerators together and denominators together.",
      "For division: Multiply first fraction by the reciprocal (inverse) of the second fraction.",
      "Reduce the resulting fraction to lowest terms by dividing by GCD.",
      "Convert improper fractions to mixed numbers."
    ],
    "example": {
      "scenario": "Add two fractions: 3/4 + 2/5",
      "inputs": "Fraction 1: 3/4 | Fraction 2: 2/5 | Operation: Addition",
      "calculation": "(3 * 5 + 2 * 4) / (4 * 5) = (15 + 8) / 20 = 23 / 20 = 1 3/20",
      "outcome": "Improper Fraction: 23/20 | Mixed Number: 1 3/20 | Decimal: 1.15"
    },
    "assumptions": [
      "Denominators cannot be zero.",
      "Input fractions can be proper (numerator < denominator) or improper."
    ],
    "disclaimer": "Calculations maintain exact integer fraction representations without decimal rounding until explicitly requested.",
    "faqs": [
      {
        "question": "How do you divide two fractions?",
        "answer": "To divide fractions, flip the second fraction (find its reciprocal) and multiply it by the first fraction."
      },
      {
        "question": "What is a mixed fraction?",
        "answer": "A mixed fraction (or mixed number) is a whole number combined with a proper fraction, such as 1 3/4."
      },
      {
        "question": "Why can denominator not be zero?",
        "answer": "Division by zero is mathematically undefined."
      }
    ]
  },
  "calculators-percentage-change": {
    "formulaTitle": "Percentage Increase & Decrease Formula",
    "formulaDescription": "Calculates the relative percentage change between an initial original value and a final revised value, identifying whether it represents growth or reduction.",
    "formulaCode": "Percentage Change = [ (Final Value - Initial Value) / |Initial Value| ] * 100",
    "calculationSteps": [
      "Subtract the initial value from the final value to find the absolute difference.",
      "Divide the difference by the absolute initial value.",
      "Multiply by 100 to convert into percentage.",
      "A positive result indicates a Percentage Increase; a negative result indicates a Percentage Decrease."
    ],
    "example": {
      "scenario": "Score increased from 64 marks in test 1 to 80 marks in test 2",
      "inputs": "Initial Value: 64 | Final Value: 80",
      "calculation": "Difference = 80 - 64 = +16. Percentage Change = (16 / 64) * 100 = +25.00%",
      "outcome": "Percentage Increase: +25.00%"
    },
    "assumptions": [
      "Initial value cannot be zero (percentage change from zero is undefined).",
      "Both values share identical units."
    ],
    "disclaimer": "Percentage changes are asymmetric: a 50% increase followed by a 50% decrease results in a net 25% drop from the original value.",
    "faqs": [
      {
        "question": "What is the formula for percentage decrease?",
        "answer": "Percentage Decrease = ((Original Value - New Value) / Original Value) * 100."
      },
      {
        "question": "Why does a 20% increase followed by a 20% decrease not return to the original number?",
        "answer": "Because the 20% decrease is calculated on a larger base value. For example: 100 + 20% = 120. 120 - 20% = 96."
      },
      {
        "question": "Can percentage increase exceed 100%?",
        "answer": "Yes! If a number doubles (e.g. from 50 to 100), that is a 100% increase. If it triples (50 to 150), that is a 200% increase."
      }
    ]
  }
};

export function getToolContent(toolId: string): CalculatorContent | undefined {
  return TOOL_CONTENT[toolId];
}
