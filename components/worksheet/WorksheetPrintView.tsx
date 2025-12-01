"use client"

import { Worksheet, WorksheetProgress } from "@/types/worksheet"
import { Problem } from "@/types/math"

export interface WorksheetPrintViewProps {
  worksheet: Worksheet
  progress: WorksheetProgress
}

export function WorksheetPrintView({ worksheet, progress }: WorksheetPrintViewProps) {
  const allProblems = worksheet.sections?.flatMap((s) => s.problems) || worksheet.problems

  return (
    <div className="max-w-7xl mx-auto p-8 print:p-4">
      {/* Header with Student Info */}
      <div className="mb-6 pb-3 border-b-2 border-gray-800">
        <h1 className="text-2xl font-bold mb-3">{worksheet.title}</h1>
        <div className="flex justify-between items-center text-base">
          <div>
            <span className="font-semibold">Name:</span>{" "}
            <span className="ml-2">{progress.studentName || ""}</span>
          </div>
          <div>
            <span className="font-semibold">Date:</span>{" "}
            <span className="ml-2">{progress.submissionDate || ""}</span>
          </div>
        </div>
      </div>

      {/* Problems by Section */}
      {worksheet.sections && worksheet.sections.length > 0 ? (
        <div className="space-y-8">
          {worksheet.sections.map((section, sectionIdx) => {
            const sectionProblems = section.problems.map((problem, probIdx) => ({
              problem,
              number:
                sectionIdx === 0
                  ? probIdx + 1
                  : worksheet
                      .sections!.slice(0, sectionIdx)
                      .reduce((sum, s) => sum + s.problems.length, 0) +
                    probIdx +
                    1,
            }))

            return (
              <div key={section.id} className="print:page-break-inside-avoid">
                <h2 className="text-lg font-bold mb-4 pb-2 border-b border-gray-400">
                  {section.title}
                </h2>
                <div className="grid grid-cols-2 gap-x-8 gap-y-6">
                  {sectionProblems.map(({ problem, number }) => (
                    <ProblemWorkDisplay
                      key={problem.id}
                      problem={problem}
                      problemNumber={number}
                      progress={progress}
                    />
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* No sections - flat list */
        <div className="grid grid-cols-2 gap-x-8 gap-y-6">
          {allProblems.map((problem, idx) => (
            <ProblemWorkDisplay
              key={problem.id}
              problem={problem}
              problemNumber={idx + 1}
              progress={progress}
            />
          ))}
        </div>
      )}
    </div>
  )
}

interface ProblemWorkDisplayProps {
  problem: Problem
  problemNumber: number
  progress: WorksheetProgress
}

function ProblemWorkDisplay({ problem, problemNumber, progress }: ProblemWorkDisplayProps) {
  const state = progress.problemStates[problem.id]

  if (!state || problem.operation !== "multiplication") {
    return null
  }

  const [multiplicand, multiplier] = problem.operands

  return (
    <div className="print:page-break-inside-avoid">
      <div className="flex items-baseline gap-2 mb-2">
        <span className="font-semibold text-sm">{problemNumber}.</span>
        <span className="font-mono text-base font-bold">
          {multiplicand} × {multiplier}
        </span>
        {state.isComplete && <span className="text-xs ml-2">{state.isCorrect ? "✓" : "✗"}</span>}
      </div>

      {/* Render work based on method */}
      {state.currentMethod === "partial-products" && (
        <PartialProductsWorkDisplay
          multiplicand={multiplicand}
          multiplier={multiplier}
          userInputs={state.userInputs}
          isCorrect={state.isCorrect || false}
        />
      )}

      {state.currentMethod === "classic-algorithm" && (
        <ClassicAlgorithmWorkDisplay
          multiplicand={multiplicand}
          multiplier={multiplier}
          userInputs={state.userInputs}
          isCorrect={state.isCorrect || false}
        />
      )}

      {state.currentMethod === "area-model" && (
        <AreaModelWorkDisplay
          multiplicand={multiplicand}
          multiplier={multiplier}
          userInputs={state.userInputs}
          isCorrect={state.isCorrect || false}
        />
      )}
    </div>
  )
}

interface WorkDisplayProps {
  multiplicand: number
  multiplier: number
  userInputs: any
  isCorrect: boolean
}

function PartialProductsWorkDisplay({
  multiplicand,
  multiplier,
  userInputs,
  isCorrect: _isCorrect,
}: WorkDisplayProps) {
  if (!userInputs || !userInputs.inputs) {
    return <div className="font-mono text-sm text-gray-600">No work saved</div>
  }

  const { inputs, sumInput } = userInputs
  const maxWidth = (multiplicand * multiplier).toString().length + 3

  return (
    <div className="font-mono text-xs leading-relaxed">
      {/* Partial product rows */}
      {Object.entries(inputs).map(([idx, value]: [string, any]) => (
        <div key={idx} className="text-right" style={{ width: `${maxWidth}ch` }}>
          {String(value || "___").padStart(maxWidth)}
        </div>
      ))}

      {/* Line */}
      <div className="border-t border-gray-800 my-1" style={{ width: `${maxWidth}ch` }} />

      {/* Sum */}
      <div className="text-right font-bold" style={{ width: `${maxWidth}ch` }}>
        {String(sumInput || "___").padStart(maxWidth)}
      </div>
    </div>
  )
}

function ClassicAlgorithmWorkDisplay({
  multiplicand,
  multiplier,
  userInputs,
  isCorrect: _isCorrect,
}: WorkDisplayProps) {
  if (!userInputs || !userInputs.partialInputs) {
    return <div className="font-mono text-sm text-gray-600">No work saved</div>
  }

  const { partialInputs, sumInput } = userInputs
  const multiplicandStr = multiplicand.toString()
  const multiplierStr = multiplier.toString()
  const maxWidth =
    Math.max(
      multiplicandStr.length,
      multiplierStr.length,
      (multiplicand * multiplier).toString().length
    ) + 3

  return (
    <div className="font-mono text-xs leading-relaxed">
      {/* Problem */}
      <div className="text-right" style={{ width: `${maxWidth}ch` }}>
        {multiplicandStr.padStart(maxWidth)}
      </div>
      <div className="text-right" style={{ width: `${maxWidth}ch` }}>
        {"× " + multiplierStr.padStart(maxWidth - 2)}
      </div>
      <div className="border-t border-gray-800" style={{ width: `${maxWidth}ch` }} />

      {/* Partial products */}
      {Object.entries(partialInputs).map(([idx, value]: [string, any]) => (
        <div key={idx} className="text-right" style={{ width: `${maxWidth}ch` }}>
          {String(value || "___").padStart(maxWidth)}
        </div>
      ))}

      {Object.keys(partialInputs).length > 1 && (
        <div className="border-t border-gray-800 my-1" style={{ width: `${maxWidth}ch` }} />
      )}

      {/* Final sum */}
      <div className="text-right font-bold" style={{ width: `${maxWidth}ch` }}>
        {String(sumInput || "___").padStart(maxWidth)}
      </div>
    </div>
  )
}

function AreaModelWorkDisplay({
  multiplicand,
  multiplier,
  userInputs,
  isCorrect: _isCorrect,
}: WorkDisplayProps) {
  if (!userInputs || !userInputs.additionInputs || !userInputs.additionInputs.inputs) {
    return <div className="font-mono text-sm text-gray-600">No work saved</div>
  }

  const { additionInputs } = userInputs
  const { inputs, sumInput } = additionInputs
  const maxWidth = (multiplicand * multiplier).toString().length + 3

  return (
    <div className="font-mono text-xs leading-relaxed">
      {/* Area products */}
      {Object.entries(inputs).map(([idx, value]: [string, any]) => (
        <div key={idx} className="text-right" style={{ width: `${maxWidth}ch` }}>
          {String(value || "___").padStart(maxWidth)}
        </div>
      ))}

      {/* Line */}
      <div className="border-t border-gray-800 my-1" style={{ width: `${maxWidth}ch` }} />

      {/* Sum */}
      <div className="text-right font-bold" style={{ width: `${maxWidth}ch` }}>
        {String(sumInput || "___").padStart(maxWidth)}
      </div>
    </div>
  )
}
