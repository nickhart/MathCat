"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Worksheet, WorksheetProgress } from "@/types/worksheet"
import { decodeWorksheetFromURI } from "@/lib/worksheet-uri"
import { loadWorksheetProgress, initializeWorksheetProgress } from "@/lib/worksheet-storage"
import { WorksheetOverview } from "@/components/worksheet/WorksheetOverview"

export default function SharedWorksheetPage() {
  const params = useParams()
  const router = useRouter()
  const [worksheet, setWorksheet] = useState<Worksheet | null>(null)
  const [progress, setProgress] = useState<WorksheetProgress | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const encoded = params.encoded as string
    if (!encoded) {
      setError("No worksheet data provided")
      return
    }

    // Decode worksheet from URI
    const decodedWorksheet = decodeWorksheetFromURI(encoded)
    if (!decodedWorksheet) {
      setError("Invalid worksheet data. The link may be corrupted or incomplete.")
      return
    }

    setWorksheet(decodedWorksheet)

    // Load or initialize progress for this worksheet
    let worksheetProgress = loadWorksheetProgress(decodedWorksheet.id)
    if (!worksheetProgress) {
      worksheetProgress = initializeWorksheetProgress(decodedWorksheet.id)
    }
    setProgress(worksheetProgress)
  }, [params.encoded])

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-red-900 mb-2">Error Loading Worksheet</h1>
          <p className="text-red-700">{error}</p>
          <button
            onClick={() => router.push("/")}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  if (!worksheet || !progress) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="flex items-center justify-center">
          <div className="text-lg text-muted-foreground">Loading worksheet...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p className="text-sm text-blue-900">
          📤 You&apos;re viewing a shared worksheet. Your progress is saved locally on this device.
        </p>
      </div>
      <WorksheetOverview worksheet={worksheet} progress={progress} />
    </div>
  )
}
