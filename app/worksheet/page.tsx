"use client"

import { useEffect, useState } from "react"
import { Worksheet, WorksheetProgress } from "@/types/worksheet"
import { WorksheetOverview } from "@/components/worksheet/WorksheetOverview"
import {
  loadWorksheetProgress,
  initializeWorksheetProgress,
  saveWorksheetProgress,
} from "@/lib/worksheet-storage"
import sampleWorksheet from "@/data/sample-worksheet.json"

export default function WorksheetPage() {
  const [progress, setProgress] = useState<WorksheetProgress | null>(null)
  const worksheet = sampleWorksheet as Worksheet

  useEffect(() => {
    // Load or initialize progress
    let loadedProgress = loadWorksheetProgress(worksheet.id)
    if (!loadedProgress) {
      loadedProgress = initializeWorksheetProgress(worksheet.id)
      saveWorksheetProgress(loadedProgress)
    }
    setProgress(loadedProgress)
  }, [worksheet.id])

  if (!progress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading worksheet...</div>
      </div>
    )
  }

  return <WorksheetOverview worksheet={worksheet} progress={progress} />
}
