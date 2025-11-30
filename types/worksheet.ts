import { Problem, ProblemState, SolvingMethod } from "./math"

export interface WorksheetSection {
  id: string
  title: string
  problems: Problem[]
  settings?: Partial<WorksheetSettings>
}

export interface Worksheet {
  id: string
  title: string
  description?: string
  sections?: WorksheetSection[]
  problems: Problem[]
  createdAt: string
  settings: WorksheetSettings
}

export interface WorksheetSettings {
  showMethodSelector: boolean
  allowedMethods: SolvingMethod[]
  showHints: boolean
  showValidation?: boolean
  showAllCells?: boolean
  showPlaceholderZeros?: boolean
  timeLimit?: number
  requireSequentialCompletion?: boolean
}

export interface WorksheetProgress {
  worksheetId: string
  problemStates: Record<string, ProblemState>
  currentProblemId: string | null
  startedAt: string
  completedAt?: string
  sectionProgress: Record<string, SectionProgress>
  studentName?: string
  submissionDate?: string
}

export interface SectionProgress {
  sectionId: string
  completed: number
  total: number
  completedAt?: string
}
