"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { WorksheetProgress } from "@/types/worksheet"
import { Trash2, RefreshCw } from "lucide-react"

export default function DebugPage() {
  const [worksheets, setWorksheets] = useState<Array<{ id: string; progress: WorksheetProgress }>>(
    []
  )
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
    loadWorksheets()
  }, [])

  const loadWorksheets = () => {
    if (typeof window === "undefined") return

    const allWorksheets: Array<{ id: string; progress: WorksheetProgress }> = []

    // Iterate through localStorage to find all worksheet progress
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key?.startsWith("mathcat_worksheet_")) {
        const value = localStorage.getItem(key)
        if (value) {
          try {
            const progress = JSON.parse(value) as WorksheetProgress
            allWorksheets.push({ id: key, progress })
          } catch (e) {
            console.error("Failed to parse:", key, e)
          }
        }
      }
    }

    setWorksheets(allWorksheets)
  }

  const clearAllWorksheets = () => {
    if (!confirm("Are you sure you want to clear ALL worksheet progress? This cannot be undone.")) {
      return
    }

    worksheets.forEach(({ id }) => {
      localStorage.removeItem(id)
    })

    loadWorksheets()
  }

  const clearWorksheet = (id: string) => {
    if (!confirm(`Clear this worksheet? This cannot be undone.`)) {
      return
    }

    localStorage.removeItem(id)
    loadWorksheets()
  }

  if (!isClient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Debug Console</h1>
            <p className="text-gray-600">View and manage localStorage data</p>
          </div>
          <button
            onClick={loadWorksheets}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {worksheets.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
            <p className="text-gray-500">No worksheet progress found in localStorage</p>
          </div>
        ) : (
          <>
            <div className="mb-4 flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Found {worksheets.length} worksheet{worksheets.length === 1 ? "" : "s"}
              </p>
              <button
                onClick={clearAllWorksheets}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                Clear All Data
              </button>
            </div>

            <div className="space-y-4">
              {worksheets.map(({ id, progress }) => {
                const problemCount = Object.keys(progress.problemStates).length
                const completedCount = Object.values(progress.problemStates).filter(
                  (state) => state.isComplete && state.isCorrect
                ).length

                return (
                  <div
                    key={id}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">
                          Worksheet: {progress.worksheetId}
                        </h3>
                        {progress.studentName && (
                          <p className="text-sm text-gray-600 mb-1">
                            Student: {progress.studentName}
                          </p>
                        )}
                        {progress.submissionDate && (
                          <p className="text-sm text-gray-600 mb-1">
                            Date: {progress.submissionDate}
                          </p>
                        )}
                        <p className="text-sm text-gray-600">
                          Progress: {completedCount} / {problemCount} problems correct
                        </p>
                      </div>
                      <button
                        onClick={() => clearWorksheet(id)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                        Clear
                      </button>
                    </div>

                    <details className="mt-4">
                      <summary className="text-sm text-blue-600 cursor-pointer hover:text-blue-700">
                        View raw data
                      </summary>
                      <pre className="mt-2 p-4 bg-gray-50 rounded text-xs overflow-x-auto">
                        {JSON.stringify(progress, null, 2)}
                      </pre>
                    </details>
                  </div>
                )
              })}
            </div>
          </>
        )}

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <h3 className="text-sm font-semibold text-yellow-900 mb-2">⚠️ Warning</h3>
          <p className="text-sm text-yellow-800">
            Clearing data is permanent and cannot be undone. Make sure you have printed or exported
            any work you want to keep before clearing.
          </p>
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-blue-600 hover:text-blue-700 underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}
