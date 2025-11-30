"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Worksheet, WorksheetProgress } from "@/types/worksheet"
import { decodeWorksheetFromURI } from "@/lib/worksheet-uri"
import { loadWorksheetProgress } from "@/lib/worksheet-storage"
import { WorksheetPrintView } from "@/components/worksheet/WorksheetPrintView"

export default function SharedWorksheetPrintPage() {
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

    // Load progress
    const loadedProgress = loadWorksheetProgress(decodedWorksheet.id)
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
  }, [params.encoded])

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <h1 className="text-2xl font-bold text-yellow-900 mb-2">Cannot Print</h1>
          <p className="text-yellow-700">{error}</p>
          <button
            onClick={() => router.push(`/worksheet/shared/${params.encoded}`)}
            className="mt-4 px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
          >
            Back to Worksheet
          </button>
        </div>
      </div>
    )
  }

  if (!worksheet || !progress) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Preparing print view...</div>
      </div>
    )
  }

  return <WorksheetPrintView worksheet={worksheet} progress={progress} />
}
