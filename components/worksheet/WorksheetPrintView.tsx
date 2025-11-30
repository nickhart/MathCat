"use client"

import { Worksheet, WorksheetProgress } from "@/types/worksheet"
import { Problem } from "@/types/math"
import { PartialProductsView, AreaModelView, ClassicAlgorithmView } from "./methods"

export interface WorksheetPrintViewProps {
  worksheet: Worksheet
  progress: WorksheetProgress
}

export function WorksheetPrintView({ worksheet, progress }: WorksheetPrintViewProps) {
  const allProblems = worksheet.sections?.flatMap((s) => s.problems) || worksheet.problems

  return (
    <div className="max-w-7xl mx-auto p-8 print:p-0">
      {/* Header with Student Info - Print Only */}
      <div className="mb-8 pb-4 border-b-2 border-gray-800 print:mb-6">
        <h1 className="text-3xl font-bold mb-4 print:text-2xl">{worksheet.title}</h1>
        <div className="flex justify-between items-center">
          <div className="flex gap-8">
            <div>
              <span className="font-semibold">Name:</span>{" "}
              <span className="ml-2 border-b border-gray-400 inline-block min-w-[200px]">
                {progress.studentName || ""}
              </span>
            </div>
            <div>
              <span className="font-semibold">Date:</span>{" "}
              <span className="ml-2">{progress.submissionDate || ""}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Problems by Section */}
      {worksheet.sections && worksheet.sections.length > 0 ? (
        <div className="space-y-12 print:space-y-8">
          {worksheet.sections.map((section) => (
            <div key={section.id} className="print:page-break-inside-avoid">
              <h2 className="text-2xl font-bold mb-6 print:text-xl print:mb-4">{section.title}</h2>
              <div className="space-y-10 print:space-y-6">
                {section.problems.map((problem) => (
                  <ProblemWorkDisplay
                    key={problem.id}
                    problem={problem}
                    progress={progress}
                    settings={section.settings || worksheet.settings}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* No sections - flat list */
        <div className="space-y-10 print:space-y-6">
          {allProblems.map((problem) => (
            <ProblemWorkDisplay
              key={problem.id}
              problem={problem}
              progress={progress}
              settings={worksheet.settings}
            />
          ))}
        </div>
      )}

      {/* Print footer with page numbers */}
      <div className="hidden print:block mt-8 pt-4 border-t border-gray-300 text-center text-sm text-gray-600">
        {worksheet.title}
      </div>
    </div>
  )
}

interface ProblemWorkDisplayProps {
  problem: Problem
  progress: WorksheetProgress
  settings: any
}

function ProblemWorkDisplay({ problem, progress, settings }: ProblemWorkDisplayProps) {
  const state = progress.problemStates[problem.id]

  if (!state || problem.operation !== "multiplication") {
    return null
  }

  const [multiplicand, multiplier] = problem.operands
  const method = state.currentMethod

  const methodLabels = {
    "partial-products": "Partial Products",
    "area-model": "Area Model",
    "classic-algorithm": "Classic Algorithm",
  } as const

  return (
    <div className="border-2 border-gray-300 rounded-lg p-6 print:border-gray-400 print:p-4 print:page-break-inside-avoid">
      {/* Problem Header */}
      <div className="flex items-center justify-between mb-4 pb-2 border-b border-gray-300">
        <div className="flex items-center gap-4">
          <span className="text-lg font-semibold">Problem {problem.id}</span>
          <span className="text-2xl font-mono font-bold">
            {multiplicand} × {multiplier}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          Method: {methodLabels[method as keyof typeof methodLabels] || method}
        </div>
      </div>

      {/* Render the work based on method */}
      <div className="mt-4">
        {method === "partial-products" && (
          <PartialProductsView
            multiplicand={multiplicand}
            multiplier={multiplier}
            showValidation={false}
            showAllCells={settings.showAllCells}
          />
        )}
        {method === "area-model" && (
          <AreaModelView
            multiplicand={multiplicand}
            multiplier={multiplier}
            showValidation={false}
            showAllCells={settings.showAllCells}
          />
        )}
        {method === "classic-algorithm" && (
          <ClassicAlgorithmView
            multiplicand={multiplicand}
            multiplier={multiplier}
            showValidation={false}
            showAllCells={settings.showAllCells}
            showPlaceholderZeros={settings.showPlaceholderZeros}
          />
        )}
      </div>

      {/* Show correct/incorrect indicator */}
      {state.isComplete && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div
            className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
              state.isCorrect
                ? "bg-green-100 text-green-800 print:bg-transparent print:border print:border-green-600"
                : "bg-red-100 text-red-800 print:bg-transparent print:border print:border-red-600"
            }`}
          >
            {state.isCorrect ? "✓ Correct" : "✗ Needs Review"}
          </div>
        </div>
      )}
    </div>
  )
}
