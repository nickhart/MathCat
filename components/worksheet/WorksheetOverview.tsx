"use client"

import { useState } from "react"
import Link from "next/link"
import { Worksheet, WorksheetProgress, WorksheetSection } from "@/types/worksheet"
import { Problem } from "@/types/math"
import { cn } from "@/lib/utils/cn"
import { CheckCircle2, Circle, Share2, Check } from "lucide-react"
import { copyShareableURL } from "@/lib/worksheet-uri"

export interface WorksheetOverviewProps {
  worksheet: Worksheet
  progress: WorksheetProgress
}

export function WorksheetOverview({ worksheet, progress }: WorksheetOverviewProps) {
  const [shareStatus, setShareStatus] = useState<"idle" | "copying" | "copied">("idle")

  const handleShare = async () => {
    setShareStatus("copying")
    const success = await copyShareableURL(worksheet)
    if (success) {
      setShareStatus("copied")
      setTimeout(() => setShareStatus("idle"), 2000)
    } else {
      setShareStatus("idle")
    }
  }

  const getSectionProgress = (section: WorksheetSection) => {
    const completed = section.problems.filter((problem) => {
      const state = progress.problemStates[problem.id]
      return state?.isComplete && state?.isCorrect === true
    }).length
    return {
      completed,
      total: section.problems.length,
      percentage: Math.round((completed / section.problems.length) * 100),
    }
  }

  const getProblemStatus = (problem: Problem) => {
    const state = progress.problemStates[problem.id]
    if (!state || !state.isComplete) return "incomplete"
    return state.isCorrect ? "correct" : "incorrect"
  }

  const overallProgress = () => {
    const allProblems = worksheet.sections?.flatMap((s) => s.problems) || worksheet.problems
    const completed = allProblems.filter((problem) => {
      const state = progress.problemStates[problem.id]
      return state?.isComplete && state?.isCorrect === true
    }).length
    return {
      completed,
      total: allProblems.length,
      percentage: Math.round((completed / allProblems.length) * 100),
    }
  }

  const overall = overallProgress()

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-4xl font-bold">{worksheet.title}</h1>
            {worksheet.description && (
              <p className="text-lg text-muted-foreground">{worksheet.description}</p>
            )}
          </div>
          <button
            onClick={handleShare}
            disabled={shareStatus === "copying"}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-colors",
              shareStatus === "copied"
                ? "bg-green-600 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
            )}
          >
            {shareStatus === "copied" ? (
              <>
                <Check className="w-4 h-4" />
                Copied!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                Share
              </>
            )}
          </button>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="font-semibold">
            Progress: {overall.completed} / {overall.total} ({overall.percentage}%)
          </div>
          <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden max-w-xs">
            <div
              className="h-full bg-green-500 transition-all duration-300"
              style={{ width: `${overall.percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Sections */}
      {worksheet.sections && worksheet.sections.length > 0 ? (
        <div className="space-y-6">
          {worksheet.sections.map((section) => {
            const sectionProg = getSectionProgress(section)
            const isComplete = sectionProg.completed === sectionProg.total

            return (
              <div
                key={section.id}
                className={cn(
                  "border-2 rounded-lg p-6 space-y-4",
                  isComplete ? "border-green-500 bg-green-50" : "border-gray-300"
                )}
              >
                {/* Section header */}
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold flex items-center gap-2">
                    {isComplete && <CheckCircle2 className="w-6 h-6 text-green-600" />}
                    {section.title}
                  </h2>
                  <div className="text-sm font-medium text-muted-foreground">
                    {sectionProg.completed} / {sectionProg.total} complete
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${sectionProg.percentage}%` }}
                  />
                </div>

                {/* Problems grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {section.problems.map((problem) => {
                    const status = getProblemStatus(problem)
                    return (
                      <Link
                        key={problem.id}
                        href={`/worksheet/problem/${problem.id}`}
                        className={cn(
                          "border-2 rounded-lg p-4 hover:shadow-md transition-all",
                          status === "correct" && "border-green-500 bg-green-50 hover:bg-green-100",
                          status === "incorrect" && "border-red-500 bg-red-50 hover:bg-red-100",
                          status === "incomplete" &&
                            "border-gray-300 bg-white hover:bg-gray-50 hover:border-primary"
                        )}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="font-mono text-lg">
                              {problem.operands[0]} × {problem.operands[1]}
                            </div>
                            <div className="text-xs text-muted-foreground capitalize">
                              {problem.difficulty}
                            </div>
                          </div>
                          {status === "correct" ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                          ) : (
                            <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* No sections - flat list */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {worksheet.problems.map((problem) => {
            const status = getProblemStatus(problem)
            return (
              <Link
                key={problem.id}
                href={`/worksheet/problem/${problem.id}`}
                className={cn(
                  "border-2 rounded-lg p-4 hover:shadow-md transition-all",
                  status === "correct" && "border-green-500 bg-green-50 hover:bg-green-100",
                  status === "incorrect" && "border-red-500 bg-red-50 hover:bg-red-100",
                  status === "incomplete" &&
                    "border-gray-300 bg-white hover:bg-gray-50 hover:border-primary"
                )}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="font-mono text-lg">
                      {problem.operands[0]} × {problem.operands[1]}
                    </div>
                    <div className="text-xs text-muted-foreground capitalize">
                      {problem.difficulty}
                    </div>
                  </div>
                  {status === "correct" ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <Circle className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
