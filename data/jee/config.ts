import { JeeSessionConfig } from './types'

export const JEE_MARKING_SCHEME = {
  CORRECT: 4,
  INCORRECT: -1,
  UNATTEMPTED: 0,
  TOTAL_QUESTIONS: 75,
  MAX_MARKS: 300,
  SUBJECTS: ['Physics', 'Chemistry', 'Mathematics'] as const,
  QUESTIONS_PER_SUBJECT: 25,
  MAX_MARKS_PER_SUBJECT: 100,
}

export const ESTIMATED_TOTAL_CANDIDATES_DEFAULT = 1450000

export const UPCOMING_JEE_SESSIONS: JeeSessionConfig[] = [
  {
    sessionName: 'JEE Main 2027 Session 1',
    examDate: '2027-01-24T09:00:00+05:30',
    isTentative: true,
    registrationDeadline: '2026-12-04T23:59:00+05:30',
    officialWebsite: 'https://jeemain.nta.ac.in',
  },
  {
    sessionName: 'JEE Main 2027 Session 2',
    examDate: '2027-04-03T09:00:00+05:30',
    isTentative: true,
    registrationDeadline: '2027-03-02T23:59:00+05:30',
    officialWebsite: 'https://jeemain.nta.ac.in',
  },
  {
    sessionName: 'JEE Advanced 2027',
    examDate: '2027-05-23T09:00:00+05:30',
    isTentative: true,
    registrationDeadline: '2027-05-07T17:00:00+05:30',
    officialWebsite: 'https://jeeadv.ac.in',
  },
]
