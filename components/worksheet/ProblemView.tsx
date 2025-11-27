"use client"

import { useState } from "react"
import Link from "next/link"
import { Problem } from "@/types/math"
import { SolvingMethod } from "@/types/math"
import { WorksheetSettings } from "@/types/worksheet"
import { cn } from "@/lib/utils/cn"
import { ArrowLeft } from "lucide-react"
import { PartialProductsView, AreaModelView } from "./methods"

export interface ProblemViewProps {
  problem: Problem
  worksheetId: string
  settings: WorksheetSettings
  initialMethod?: SolvingMethod
  onComplete?: (isCorrect: boolean, method: SolvingMethod) => void
}

export function ProblemView({
  problem,
  worksheetId: _worksheetId,
  settings,
  initialMethod,
  onComplete,
}: ProblemViewProps) {
  const [selectedMethod, setSelectedMethod] = useState<SolvingMethod>(
    initialMethod || settings.allowedMethods[0] || "partial-products"
  )

  const handleMethodChange = (method: SolvingMethod) => {
    setSelectedMethod(method)
  }

  const handleProblemComplete = (isCorrect: boolean) => {
    if (onComplete) {
      onComplete(isCorrect, selectedMethod)
    }
  }

  const methodLabels: Record<SolvingMethod, string> = {
    "partial-products": "Partial Products",
    "area-model": "Area Model",
    "classic-algorithm": "Classic Algorithm",
    "long-division": "Long Division",
    "short-division": "Short Division",
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <Link
              href="/worksheet"
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
        <div className="bg-white border-b">
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
      <div className="max-w-6xl mx-auto px-6 py-8">
        <ProblemMethodView
          problem={problem}
          method={selectedMethod}
          onComplete={handleProblemComplete}
        />
      </div>
    </div>
  )
}

interface ProblemMethodViewProps {
  problem: Problem
  method: SolvingMethod
  onComplete?: (isCorrect: boolean) => void
}

function ProblemMethodView({ problem, method, onComplete }: ProblemMethodViewProps) {
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
          onComplete={onComplete}
        />
      )

    case "area-model":
      return (
        <AreaModelView
          multiplicand={multiplicand}
          multiplier={multiplier}
          onComplete={onComplete}
        />
      )

    case "classic-algorithm":
      return (
        <div className="text-center p-8 text-muted-foreground">
          Classic Algorithm view will be implemented soon
        </div>
      )

    default:
      return (
        <div className="text-center p-8 text-muted-foreground">
          Method &quot;{method}&quot; is not yet implemented
        </div>
      )
  }
}
