import { Problem, ProblemState, SolvingMethod } from "./math"

export interface WorksheetSection {
  id: string
  title: string
  problems: Problem[]
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
}

export interface SectionProgress {
  sectionId: string
  completed: number
  total: number
  completedAt?: string
}
