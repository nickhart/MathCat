import { Problem, ProblemState, SolvingMethod } from "./math"

export interface Worksheet {
  id: string
  title: string
  description?: string
  problems: Problem[]
  createdAt: string
  settings: WorksheetSettings
}

export interface WorksheetSettings {
  showMethodSelector: boolean
  allowedMethods: SolvingMethod[]
  showHints: boolean
  timeLimit?: number
}

export interface WorksheetState {
  worksheetId: string
  problemStates: Record<string, ProblemState>
  currentProblemIndex: number
  startedAt: string
  completedAt?: string
}
