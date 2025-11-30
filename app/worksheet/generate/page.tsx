"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { generateMixedProblems } from "@/lib/generators/problem-generator"
import { encodeWorksheetToURI } from "@/lib/worksheet-uri"
import { Worksheet, WorksheetSection, WorksheetSettings } from "@/types/worksheet"
import { DifficultyLevel } from "@/types/math"

export default function GenerateWorksheetPage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)

  // Problem counts per difficulty
  const [problemCounts, setProblemCounts] = useState({
    easy: 3,
    medium: 3,
    hard: 2,
    bonkers: 2,
  })

  // Which difficulties to include
  const [includeDifficulties, setIncludeDifficulties] = useState({
    easy: true,
    medium: true,
    hard: false,
    bonkers: false,
  })

  // Generator settings
  const [allowZeros, setAllowZeros] = useState(true)

  // Worksheet settings
  const [worksheetSettings, setWorksheetSettings] = useState<WorksheetSettings>({
    showMethodSelector: true,
    allowedMethods: ["partial-products", "area-model", "classic-algorithm"],
    showHints: false,
    showValidation: true,
    showAllCells: false,
    showPlaceholderZeros: false,
  })

  // Section-specific settings
  const [sectionSettings, setSectionSettings] = useState({
    easy: { showAllCells: false, showPlaceholderZeros: false },
    medium: { showAllCells: false, showPlaceholderZeros: false },
    hard: { showAllCells: true, showPlaceholderZeros: true },
    bonkers: { showAllCells: true, showPlaceholderZeros: true },
  })

  const handleGenerate = () => {
    setIsGenerating(true)

    try {
      // Build list of difficulties to generate
      const difficulties: { difficulty: DifficultyLevel; count: number }[] = []

      if (includeDifficulties.easy && problemCounts.easy > 0) {
        difficulties.push({ difficulty: "easy", count: problemCounts.easy })
      }
      if (includeDifficulties.medium && problemCounts.medium > 0) {
        difficulties.push({ difficulty: "medium", count: problemCounts.medium })
      }
      if (includeDifficulties.hard && problemCounts.hard > 0) {
        difficulties.push({ difficulty: "hard", count: problemCounts.hard })
      }
      if (includeDifficulties.bonkers && problemCounts.bonkers > 0) {
        difficulties.push({ difficulty: "bonkers", count: problemCounts.bonkers })
      }

      if (difficulties.length === 0) {
        alert("Please select at least one difficulty level with at least 1 problem")
        setIsGenerating(false)
        return
      }

      // Generate problems
      const problems = generateMixedProblems("multiplication", difficulties, { allowZeros })

      // Group problems into sections by difficulty
      const sections: WorksheetSection[] = []
      const problemsByDifficulty: Record<DifficultyLevel, typeof problems> = {
        easy: [],
        medium: [],
        hard: [],
        bonkers: [],
      }

      problems.forEach((problem) => {
        problemsByDifficulty[problem.difficulty].push(problem)
      })

      // Create sections
      const difficultyLabels: Record<DifficultyLevel, string> = {
        easy: "Easy (2×1 digit)",
        medium: "Medium (2×2 digit)",
        hard: "Hard (3×2 digit)",
        bonkers: "Bonkers (3×3+ digit)",
      }

      ;(["easy", "medium", "hard", "bonkers"] as DifficultyLevel[]).forEach((difficulty) => {
        const sectionProblems = problemsByDifficulty[difficulty]
        if (sectionProblems.length > 0) {
          sections.push({
            id: `section-${difficulty}`,
            title: difficultyLabels[difficulty],
            problems: sectionProblems,
            settings: sectionSettings[difficulty],
          })
        }
      })

      // Create worksheet
      const worksheet: Worksheet = {
        id: `generated-${Date.now()}`,
        title: "Generated Multiplication Worksheet",
        description: `${problems.length} multiplication problems across ${sections.length} difficulty levels`,
        sections,
        problems,
        createdAt: new Date().toISOString(),
        settings: worksheetSettings,
      }

      // Encode and navigate
      const encoded = encodeWorksheetToURI(worksheet)
      router.push(`/worksheet/shared/${encoded}`)
    } catch (error) {
      console.error("Failed to generate worksheet:", error)
      alert("Failed to generate worksheet. Please try again.")
      setIsGenerating(false)
    }
  }

  const totalProblems = Object.entries(includeDifficulties).reduce((sum, [key, included]) => {
    if (included) {
      return sum + problemCounts[key as DifficultyLevel]
    }
    return sum
  }, 0)

  return (
    <div className="container mx-auto p-8 max-w-4xl">
      <h1 className="text-4xl font-bold mb-2">Generate Random Worksheet</h1>
      <p className="text-muted-foreground mb-8">
        Create a custom multiplication worksheet with randomly generated problems
      </p>

      <div className="space-y-8">
        {/* Problem Counts by Difficulty */}
        <section className="bg-white border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Select Difficulty Levels</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Choose which difficulty levels to include and how many problems for each
          </p>

          <div className="space-y-4">
            {(["easy", "medium", "hard", "bonkers"] as DifficultyLevel[]).map((difficulty) => (
              <div key={difficulty} className="flex items-center gap-4">
                <input
                  type="checkbox"
                  id={`include-${difficulty}`}
                  checked={includeDifficulties[difficulty]}
                  onChange={(e) =>
                    setIncludeDifficulties({
                      ...includeDifficulties,
                      [difficulty]: e.target.checked,
                    })
                  }
                  className="w-4 h-4"
                />
                <label
                  htmlFor={`include-${difficulty}`}
                  className="flex-1 capitalize font-medium cursor-pointer"
                >
                  {difficulty === "easy" && "Easy (2×1 digit, e.g., 23 × 5)"}
                  {difficulty === "medium" && "Medium (2×2 digit, e.g., 23 × 45)"}
                  {difficulty === "hard" && "Hard (3×2 digit, e.g., 123 × 45)"}
                  {difficulty === "bonkers" && "Bonkers (3×3+ digit, e.g., 123 × 456)"}
                </label>
                <input
                  type="number"
                  min="0"
                  max="20"
                  value={problemCounts[difficulty]}
                  onChange={(e) =>
                    setProblemCounts({
                      ...problemCounts,
                      [difficulty]: parseInt(e.target.value) || 0,
                    })
                  }
                  disabled={!includeDifficulties[difficulty]}
                  className="w-20 px-3 py-2 border rounded disabled:bg-gray-100 disabled:text-gray-400"
                />
                <span className="text-sm text-muted-foreground w-16">problems</span>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <p className="text-sm font-semibold">
              Total: <span className="text-lg text-primary">{totalProblems}</span> problems
            </p>
          </div>
        </section>

        {/* Generator Options */}
        <section className="bg-white border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Generator Options</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="allow-zeros"
                checked={allowZeros}
                onChange={(e) => setAllowZeros(e.target.checked)}
                className="w-4 h-4"
              />
              <label htmlFor="allow-zeros" className="cursor-pointer">
                Allow zeros in numbers (e.g., 102, 305)
              </label>
            </div>
          </div>
        </section>

        {/* Worksheet Settings */}
        <section className="bg-white border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Worksheet Settings</h2>

          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="show-validation"
                checked={worksheetSettings.showValidation}
                onChange={(e) =>
                  setWorksheetSettings({
                    ...worksheetSettings,
                    showValidation: e.target.checked,
                  })
                }
                className="w-4 h-4"
              />
              <label htmlFor="show-validation" className="cursor-pointer">
                Show validation feedback (green/red borders)
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="show-hints"
                checked={worksheetSettings.showHints}
                onChange={(e) =>
                  setWorksheetSettings({ ...worksheetSettings, showHints: e.target.checked })
                }
                className="w-4 h-4"
              />
              <label htmlFor="show-hints" className="cursor-pointer">
                Show hints
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="show-method-selector"
                checked={worksheetSettings.showMethodSelector}
                onChange={(e) =>
                  setWorksheetSettings({
                    ...worksheetSettings,
                    showMethodSelector: e.target.checked,
                  })
                }
                className="w-4 h-4"
              />
              <label htmlFor="show-method-selector" className="cursor-pointer">
                Allow students to choose solving method
              </label>
            </div>
          </div>
        </section>

        {/* Section-specific Settings */}
        <section className="bg-white border rounded-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Difficulty-Specific Settings</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Configure how problems are displayed for each difficulty level
          </p>

          <div className="space-y-6">
            {(["easy", "medium", "hard", "bonkers"] as DifficultyLevel[]).map((difficulty) => (
              <div key={difficulty} className="border-l-4 border-primary pl-4">
                <h3 className="font-semibold capitalize mb-2">{difficulty}</h3>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`${difficulty}-show-all-cells`}
                      checked={sectionSettings[difficulty].showAllCells}
                      onChange={(e) =>
                        setSectionSettings({
                          ...sectionSettings,
                          [difficulty]: {
                            ...sectionSettings[difficulty],
                            showAllCells: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4"
                    />
                    <label
                      htmlFor={`${difficulty}-show-all-cells`}
                      className="text-sm cursor-pointer"
                    >
                      Show all cells (no placeholders)
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id={`${difficulty}-placeholder-zeros`}
                      checked={sectionSettings[difficulty].showPlaceholderZeros}
                      onChange={(e) =>
                        setSectionSettings({
                          ...sectionSettings,
                          [difficulty]: {
                            ...sectionSettings[difficulty],
                            showPlaceholderZeros: e.target.checked,
                          },
                        })
                      }
                      className="w-4 h-4"
                    />
                    <label
                      htmlFor={`${difficulty}-placeholder-zeros`}
                      className="text-sm cursor-pointer"
                    >
                      Show placeholder zeros (visual learning aid)
                    </label>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Generate Button */}
        <div className="flex gap-4">
          <button
            onClick={handleGenerate}
            disabled={isGenerating || totalProblems === 0}
            className="px-6 py-3 bg-primary text-white rounded-lg font-semibold hover:bg-primary/90 disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {isGenerating ? "Generating..." : `Generate Worksheet (${totalProblems} problems)`}
          </button>

          <button
            onClick={() => router.push("/")}
            className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
