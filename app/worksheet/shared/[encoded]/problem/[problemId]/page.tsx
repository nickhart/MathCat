"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Worksheet, WorksheetProgress } from "@/types/worksheet"
import { Problem, ProblemState, SolvingMethod } from "@/types/math"
import { ProblemView } from "@/components/worksheet/ProblemView"
import { SectionComplete } from "@/components/worksheet/SectionComplete"
import { decodeWorksheetFromURI } from "@/lib/worksheet-uri"
import {
  loadWorksheetProgress,
  initializeWorksheetProgress,
  saveWorksheetProgress,
  updateProblemState,
  isSectionComplete,
  mergeWorksheetSettings,
} from "@/lib/worksheet-storage"

export default function SharedWorksheetProblemPage() {
  const params = useParams()
  const router = useRouter()
  const problemId = params.problemId as string
  const encoded = params.encoded as string

  const [worksheet, setWorksheet] = useState<Worksheet | null>(null)
  const [progress, setProgress] = useState<WorksheetProgress | null>(null)
  const [problem, setProblem] = useState<Problem | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [completedSectionTitle, setCompletedSectionTitle] = useState("")
  const [justCompleted, setJustCompleted] = useState(false)

  useEffect(() => {
    // Decode worksheet from URI
    const decodedWorksheet = decodeWorksheetFromURI(encoded)
    if (!decodedWorksheet) {
      router.push("/")
      return
    }
    setWorksheet(decodedWorksheet)

    // Reset completion state when problem changes
    setJustCompleted(false)

    // Find the problem
    const foundProblem = decodedWorksheet.problems.find((p) => p.id === problemId)
    if (!foundProblem) {
      // Redirect back to worksheet if problem not found
      router.push(`/worksheet/shared/${encoded}`)
      return
    }
    setProblem(foundProblem)

    // Load or initialize progress
    let loadedProgress = loadWorksheetProgress(decodedWorksheet.id)
    if (!loadedProgress) {
      loadedProgress = initializeWorksheetProgress(decodedWorksheet.id)
    }
    setProgress(loadedProgress)
  }, [problemId, encoded, router])

  const handleComplete = (isCorrect: boolean, method: SolvingMethod) => {
    if (!progress || !problem || !worksheet) return

    // Find which section this problem belongs to
    const section = worksheet.sections?.find((s) => s.problems.some((p) => p.id === problemId))
    const sectionProblemIds = section?.problems.map((p) => p.id)

    // Create problem state
    const problemState: ProblemState = {
      problemId: problem.id,
      currentMethod: method,
      userInputs: {},
      isComplete: true,
      isCorrect,
    }

    // Update progress
    const updatedProgress = updateProblemState(
      progress,
      problemId,
      problemState,
      section?.id,
      sectionProblemIds
    )
    updatedProgress.currentProblemId = problemId

    // Save progress
    saveWorksheetProgress(updatedProgress)
    setProgress(updatedProgress)

    // Mark as just completed if correct
    if (isCorrect) {
      setJustCompleted(true)
    }

    // Check if section is now complete
    if (isCorrect && section && sectionProblemIds) {
      const sectionJustCompleted = isSectionComplete(updatedProgress, sectionProblemIds)
      if (sectionJustCompleted) {
        // Show celebration
        setCompletedSectionTitle(section.title)
        setShowCelebration(true)
      }
    }
  }

  if (!problem || !progress || !worksheet) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading problem...</div>
      </div>
    )
  }

  const initialMethod = progress.problemStates[problemId]?.currentMethod

  // Find current section and next problem
  const section = worksheet.sections?.find((s) => s.problems.some((p) => p.id === problemId))
  let nextProblemId: string | null = null

  if (section) {
    const sectionProblems = section.problems
    const currentIndex = sectionProblems.findIndex((p) => p.id === problemId)
    if (currentIndex !== -1 && currentIndex < sectionProblems.length - 1) {
      nextProblemId = sectionProblems[currentIndex + 1].id
    }
  }

  // Check if problem is complete and correct
  const problemState = progress.problemStates[problemId]
  const isProblemComplete =
    justCompleted || (problemState?.isComplete && problemState?.isCorrect === true)

  // Merge worksheet settings with section-specific settings
  const mergedSettings = mergeWorksheetSettings(worksheet.settings, section)

  return (
    <>
      <ProblemView
        problem={problem}
        worksheetId={worksheet.id}
        worksheetEncoded={encoded}
        settings={mergedSettings}
        initialMethod={initialMethod}
        nextProblemId={nextProblemId}
        isProblemComplete={isProblemComplete}
        onComplete={handleComplete}
      />
      <SectionComplete
        sectionTitle={completedSectionTitle}
        show={showCelebration}
        onDismiss={() => setShowCelebration(false)}
      />
    </>
  )
}
