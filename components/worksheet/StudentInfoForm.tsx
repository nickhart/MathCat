"use client"

import { useEffect, useState } from "react"
import { WorksheetProgress } from "@/types/worksheet"

export interface StudentInfoFormProps {
  progress: WorksheetProgress
  onUpdate: (updates: Partial<WorksheetProgress>) => void
}

/**
 * Format current date as M/D/YY
 * TODO: Make format configurable
 */
function formatDate(date: Date): string {
  const month = date.getMonth() + 1 // 0-indexed
  const day = date.getDate()
  const year = date.getFullYear() % 100 // Last 2 digits

  return `${month}/${day}/${year}`
}

export function StudentInfoForm({ progress, onUpdate }: StudentInfoFormProps) {
  const [studentName, setStudentName] = useState(progress.studentName || "")
  const [submissionDate] = useState(progress.submissionDate || formatDate(new Date()))

  // Auto-set submission date if not already set
  useEffect(() => {
    if (!progress.submissionDate) {
      onUpdate({ submissionDate })
    }
  }, [progress.submissionDate, submissionDate, onUpdate])

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value
    setStudentName(newName)
    onUpdate({ studentName: newName })
  }

  return (
    <div className="bg-white border rounded-lg p-6 print:border-0 print:p-0">
      <div className="grid md:grid-cols-2 gap-4">
        {/* Student Name */}
        <div>
          <label htmlFor="student-name" className="block text-sm font-semibold mb-2">
            Student Name <span className="text-red-500">*</span>
          </label>
          <input
            id="student-name"
            type="text"
            value={studentName}
            onChange={handleNameChange}
            placeholder="Enter your name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary print:border-0 print:p-0 print:text-lg print:font-semibold"
            required
          />
          {!studentName && (
            <p className="text-sm text-muted-foreground mt-1 print:hidden">
              Required to print worksheet
            </p>
          )}
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-semibold mb-2">Date</label>
          <div className="w-full px-4 py-2 bg-gray-50 border rounded-lg text-gray-700 print:border-0 print:p-0 print:bg-transparent print:text-lg print:font-semibold">
            {submissionDate}
          </div>
        </div>
      </div>

      {/* Print-only header */}
      <div className="hidden print:block mt-4 border-b-2 border-gray-300 pb-4">
        <div className="flex justify-between items-center">
          <div>
            <span className="font-semibold">Name:</span> {studentName || "_________________"}
          </div>
          <div>
            <span className="font-semibold">Date:</span> {submissionDate}
          </div>
        </div>
      </div>
    </div>
  )
}
