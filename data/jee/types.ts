export type Category = 'OPEN' | 'EWS' | 'OBC-NCL' | 'SC' | 'ST' | 'OPEN-PwD'
export type Quota = 'AI' | 'HS' | 'OS'
export type Gender = 'Gender-Neutral' | 'Female-only'
export type InstituteType = 'IIT' | 'NIT' | 'IIIT' | 'GFTI'

export type BranchCategory =
  | 'CSE'
  | 'AI'
  | 'IT'
  | 'ECE'
  | 'EE'
  | 'ME'
  | 'CE'
  | 'Chemical'
  | 'Biotechnology'
  | 'Production'
  | 'Metallurgy'
  | 'Aerospace'
  | 'Architecture'
  | 'Other'

export type HistoricalCutoffBand = 'WITHIN_CUTOFF' | 'NEAR_CUTOFF' | 'OUTSIDE_CUTOFF'

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

export interface CollegePredictorParams {
  crlRank: number
  categoryRank?: number
  category?: Category
  homeState?: string
  quota?: Quota | 'AUTO' | 'ALL'
  gender?: Gender
  preferredBranch?: string
  branchCategory?: string
  instituteType?: InstituteType | 'ALL' | ''
  round?: number | 'ALL'
  year?: number
}

export interface CollegePredictionItem {
  record: CutoffRecord
  band: HistoricalCutoffBand
  bandLabel: string
  evaluatedRank: number
  evaluatedRankType: 'CRL' | 'Category Rank'
  rankDiff: number
  statusDescription: string
  // Legacy compatibility
  chance: 'High' | 'Moderate' | 'Borderline' | 'Low'
  recommendation: string
}

export interface JeeSessionConfig {
  sessionName: string
  examDate: string // ISO string
  isTentative: boolean
  registrationDeadline?: string
  officialWebsite: string
}

