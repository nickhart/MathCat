import { Worksheet, WorksheetProgress } from "./worksheet"

export interface ProgressStats {
  exercisesCompleted: number
  worksheetsCompleted: number
  currentWorksheet?: {
    id: string
    progress: WorksheetProgress
  }
  lastAccessed: string
}

export interface CurrentWorksheet {
  worksheet: Worksheet
  progress: WorksheetProgress
}
