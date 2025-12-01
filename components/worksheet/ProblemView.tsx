"use client"

import { useState } from "react"
import Link from "next/link"
import { Problem } from "@/types/math"
import { SolvingMethod } from "@/types/math"
import { WorksheetSettings } from "@/types/worksheet"
import { cn } from "@/lib/utils/cn"
import { ArrowLeft, ArrowRight } from "lucide-react"
import { PartialProductsView, AreaModelView, ClassicAlgorithmView } from "./methods"

export interface ProblemViewProps {
  problem: Problem
  worksheetId: string
  worksheetEncoded?: string
  settings: WorksheetSettings
  initialMethod?: SolvingMethod
  initialUserInputs?: any
  nextProblemId?: string | null
  isProblemComplete?: boolean
  onComplete?: (isCorrect: boolean, method: SolvingMethod, userInputs?: any) => void
  onMethodChange?: (method: SolvingMethod) => void
}

export function ProblemView({
  problem,
  worksheetId: _worksheetId,
  worksheetEncoded,
  settings,
  initialMethod,
  initialUserInputs,
  nextProblemId,
  isProblemComplete,
  onComplete,
  onMethodChange,
}: ProblemViewProps) {
  const [selectedMethod, setSelectedMethod] = useState<SolvingMethod>(
    initialMethod || settings.allowedMethods[0] || "partial-products"
  )

  const handleMethodChange = (method: SolvingMethod) => {
    setSelectedMethod(method)
    onMethodChange?.(method)
  }

  const handleProblemComplete = (isCorrect: boolean, userInputs?: any) => {
    if (onComplete) {
      onComplete(isCorrect, selectedMethod, userInputs)
    }
  }

  const methodLabels: Record<SolvingMethod, string> = {
    "partial-products": "Partial Products",
    "area-model": "Area Model",
    "classic-algorithm": "Classic Algorithm",
    "long-division": "Long Division",
    "short-division": "Short Division",
  }

  // Construct URLs based on whether this is a shared worksheet
  const worksheetUrl = worksheetEncoded ? `/worksheet/shared/${worksheetEncoded}` : "/worksheet"
  const nextProblemUrl = nextProblemId
    ? worksheetEncoded
      ? `/worksheet/shared/${worksheetEncoded}/problem/${nextProblemId}`
      : `/worksheet/problem/${nextProblemId}`
    : null

  return (
    <div className="min-h-screen bg-gray-50 print:bg-white print:min-h-0">
      {/* Header */}
      <div className="bg-white border-b shadow-sm print:hidden">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href={worksheetUrl}
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Worksheet
            </Link>
            <div className="text-sm text-muted-foreground">Problem {problem.id}</div>
          </div>
        </div>
      </div>

      {/* Method Selector */}
      {settings.showMethodSelector && settings.allowedMethods.length > 1 && (
        <div className="bg-white border-b print:hidden">
          <div className="max-w-6xl mx-auto px-6 py-4">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">Method:</span>
              <div className="flex gap-2">
                {settings.allowedMethods.map((method) => (
                  <button
                    key={method}
                    onClick={() => handleMethodChange(method)}
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      selectedMethod === method
                        ? "bg-primary text-primary-foreground"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    )}
                  >
                    {methodLabels[method]}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Problem Content */}
      <div className="max-w-6xl mx-auto px-6 py-8 print:px-0 print:py-4">
        <ProblemMethodView
          problem={problem}
          method={selectedMethod}
          settings={settings}
          initialUserInputs={initialUserInputs}
          onComplete={handleProblemComplete}
        />

        {/* Navigation Controls */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex items-center justify-between print:hidden">
          <Link
            href={worksheetUrl}
            className="flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Worksheet
          </Link>

          {isProblemComplete && nextProblemUrl ? (
            <Link
              href={nextProblemUrl}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Next Problem
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : isProblemComplete && !nextProblemId ? (
            <Link
              href={worksheetUrl}
              className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
            >
              All Done! Back to Worksheet
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <div className="text-sm text-muted-foreground">Complete the problem to continue</div>
          )}
        </div>
      </div>
    </div>
  )
}

interface ProblemMethodViewProps {
  problem: Problem
  method: SolvingMethod
  settings: WorksheetSettings
  initialUserInputs?: any
  onComplete?: (isCorrect: boolean, userInputs?: any) => void
}

function ProblemMethodView({
  problem,
  method,
  settings,
  initialUserInputs,
  onComplete,
}: ProblemMethodViewProps) {
  if (problem.operation !== "multiplication") {
    return (
      <div className="text-center p-8 text-muted-foreground">
        Operation &quot;{problem.operation}&quot; is not yet supported
      </div>
    )
  }

  const [multiplicand, multiplier] = problem.operands

  switch (method) {
    case "partial-products":
      return (
        <PartialProductsView
          multiplicand={multiplicand}
          multiplier={multiplier}
          initialUserInputs={initialUserInputs}
          onComplete={onComplete}
          showValidation={settings.showValidation}
          showAllCells={settings.showAllCells}
        />
      )

    case "area-model":
      return (
        <AreaModelView
          multiplicand={multiplicand}
          multiplier={multiplier}
          initialUserInputs={initialUserInputs}
          onComplete={onComplete}
          showValidation={settings.showValidation}
          showAllCells={settings.showAllCells}
        />
      )

    case "classic-algorithm":
      return (
        <ClassicAlgorithmView
          multiplicand={multiplicand}
          multiplier={multiplier}
          initialUserInputs={initialUserInputs}
          onComplete={onComplete}
          showValidation={settings.showValidation}
          showAllCells={settings.showAllCells}
        />
      )

    default:
      return (
        <div className="text-center p-8 text-muted-foreground">
          Method &quot;{method}&quot; is not yet implemented
        </div>
      )
  }
}
