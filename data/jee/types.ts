export type Category = 'OPEN' | 'EWS' | 'OBC-NCL' | 'SC' | 'ST' | 'OPEN-PwD'
export type Quota = 'AI' | 'HS' | 'OS'
export type Gender = 'Gender-Neutral' | 'Female-only'
export type InstituteType = 'IIT' | 'NIT' | 'IIIT' | 'GFTI'

export interface CutoffRecord {
  year: number
  counselling: 'JoSAA' | 'CSAB'
  round: number
  institute: string
  instituteType: InstituteType
  state: string
  branch: string
  quota: Quota
  category: Category
  gender: Gender
  openingRank: number
  closingRank: number
}

export interface JeeSessionConfig {
  sessionName: string
  examDate: string // ISO string
  isTentative: boolean
  registrationDeadline?: string
  officialWebsite: string
}
