import { Worksheet, WorksheetState } from "./worksheet"

export interface ProgressStats {
  exercisesCompleted: number
  worksheetsCompleted: number
  currentWorksheet?: {
    id: string
    state: WorksheetState
  }
  lastAccessed: string
}

export interface CurrentWorksheet {
  worksheet: Worksheet
  state: WorksheetState
}
