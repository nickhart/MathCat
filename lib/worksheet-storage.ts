import { WorksheetProgress, SectionProgress } from "@/types/worksheet"
import { ProblemState } from "@/types/math"

const STORAGE_KEY_PREFIX = "mathcat_worksheet_"

/**
 * Get the storage key for a specific worksheet
 */
function getStorageKey(worksheetId: string): string {
  return `${STORAGE_KEY_PREFIX}${worksheetId}`
}

/**
 * Load worksheet progress from localStorage
 */
export function loadWorksheetProgress(worksheetId: string): WorksheetProgress | null {
  if (typeof window === "undefined") return null

  try {
    const stored = localStorage.getItem(getStorageKey(worksheetId))
    if (!stored) return null
    return JSON.parse(stored) as WorksheetProgress
  } catch (error) {
    console.error("Failed to load worksheet progress:", error)
    return null
  }
}

/**
 * Save worksheet progress to localStorage
 */
export function saveWorksheetProgress(progress: WorksheetProgress): void {
  if (typeof window === "undefined") return

  try {
    localStorage.setItem(getStorageKey(progress.worksheetId), JSON.stringify(progress))
  } catch (error) {
    console.error("Failed to save worksheet progress:", error)
  }
}

/**
 * Initialize new worksheet progress
 */
export function initializeWorksheetProgress(worksheetId: string): WorksheetProgress {
  return {
    worksheetId,
    problemStates: {},
    currentProblemId: null,
    startedAt: new Date().toISOString(),
    sectionProgress: {},
  }
}

/**
 * Update problem state and recalculate section progress
 */
export function updateProblemState(
  progress: WorksheetProgress,
  problemId: string,
  problemState: ProblemState,
  sectionId?: string,
  sectionProblemIds?: string[]
): WorksheetProgress {
  const updatedProgress = {
    ...progress,
    problemStates: {
      ...progress.problemStates,
      [problemId]: problemState,
    },
  }

  // Update section progress if section is provided
  if (sectionId && sectionProblemIds) {
    updatedProgress.sectionProgress = {
      ...updatedProgress.sectionProgress,
      [sectionId]: calculateSectionProgress(updatedProgress, sectionId, sectionProblemIds),
    }
  }

  return updatedProgress
}

/**
 * Calculate section progress based on completed problems
 */
function calculateSectionProgress(
  progress: WorksheetProgress,
  sectionId: string,
  problemIds: string[]
): SectionProgress {
  const completed = problemIds.filter((id) => {
    const state = progress.problemStates[id]
    return state?.isComplete && state?.isCorrect === true
  }).length

  const isComplete = completed === problemIds.length
  const sectionProgress: SectionProgress = {
    sectionId,
    completed,
    total: problemIds.length,
  }

  if (isComplete) {
    sectionProgress.completedAt = new Date().toISOString()
  }

  return sectionProgress
}

/**
 * Check if all problems in a section are complete and correct
 */
export function isSectionComplete(progress: WorksheetProgress, problemIds: string[]): boolean {
  return problemIds.every((id) => {
    const state = progress.problemStates[id]
    return state?.isComplete && state?.isCorrect === true
  })
}

/**
 * Calculate overall worksheet progress percentage
 */
export function calculateWorksheetProgress(
  progress: WorksheetProgress,
  totalProblems: number
): number {
  const completed = Object.values(progress.problemStates).filter(
    (state) => state.isComplete && state.isCorrect === true
  ).length

  return totalProblems > 0 ? Math.round((completed / totalProblems) * 100) : 0
}

/**
 * Clear worksheet progress from localStorage
 */
export function clearWorksheetProgress(worksheetId: string): void {
  if (typeof window === "undefined") return

  try {
    localStorage.removeItem(getStorageKey(worksheetId))
  } catch (error) {
    console.error("Failed to clear worksheet progress:", error)
  }
}
