"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Worksheet, WorksheetProgress } from "@/types/worksheet"
import { Problem, ProblemState, SolvingMethod } from "@/types/math"
import { ProblemView } from "@/components/worksheet/ProblemView"
import { SectionComplete } from "@/components/worksheet/SectionComplete"
import {
  loadWorksheetProgress,
  saveWorksheetProgress,
  updateProblemState,
  isSectionComplete,
} from "@/lib/worksheet-storage"
import sampleWorksheet from "@/data/sample-worksheet.json"

export default function ProblemPage() {
  const params = useParams()
  const router = useRouter()
  const problemId = params.problemId as string

  const [progress, setProgress] = useState<WorksheetProgress | null>(null)
  const [problem, setProblem] = useState<Problem | null>(null)
  const [showCelebration, setShowCelebration] = useState(false)
  const [completedSectionTitle, setCompletedSectionTitle] = useState("")
  const worksheet = sampleWorksheet as Worksheet

  useEffect(() => {
    // Find the problem
    const foundProblem = worksheet.problems.find((p) => p.id === problemId)
    if (!foundProblem) {
      // Redirect to worksheet if problem not found
      router.push("/worksheet")
      return
    }
    setProblem(foundProblem)

    // Load progress
    const loadedProgress = loadWorksheetProgress(worksheet.id)
    if (loadedProgress) {
      setProgress(loadedProgress)
    }
  }, [problemId, worksheet, router])

  const handleComplete = (isCorrect: boolean, method: SolvingMethod) => {
    if (!progress || !problem) return

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

  if (!problem || !progress) {
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
  const isProblemComplete = problemState?.isComplete && problemState?.isCorrect === true

  return (
    <>
      <ProblemView
        problem={problem}
        worksheetId={worksheet.id}
        settings={worksheet.settings}
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
