"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Worksheet, WorksheetProgress } from "@/types/worksheet"
import { WorksheetPrintView } from "@/components/worksheet/WorksheetPrintView"
import { loadWorksheetProgress } from "@/lib/worksheet-storage"
import sampleWorksheet from "@/data/sample-worksheet.json"

export default function WorksheetPrintPage() {
  const router = useRouter()
  const [progress, setProgress] = useState<WorksheetProgress | null>(null)
  const [error, setError] = useState<string | null>(null)
  const worksheet = sampleWorksheet as Worksheet

  useEffect(() => {
    // Load progress
    const loadedProgress = loadWorksheetProgress(worksheet.id)
    if (!loadedProgress) {
      setError("No progress found. Please complete some problems first.")
      return
    }

    if (!loadedProgress.studentName) {
      setError("Please enter your name before printing.")
      return
    }

    setProgress(loadedProgress)

    // Auto-print after a short delay to allow rendering
    setTimeout(() => {
      window.print()
    }, 500)
  }, [worksheet.id])

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-yellow-900 mb-2">Cannot Print</h1>
          <p className="text-yellow-700">{error}</p>
          <button
            onClick={() => router.push("/worksheet")}
            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            Back to Worksheet
          </button>
        </div>
      </div>
    )
  }

  if (!progress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Preparing print view...</div>
      </div>
    )
  }

  return <WorksheetPrintView worksheet={worksheet} progress={progress} />
}
