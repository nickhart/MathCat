import { Worksheet, WorksheetSection } from "@/types/worksheet"
import { Problem } from "@/types/math"

/**
 * CSV Format:
 * section,operand1,operand2,difficulty
 *
 * Example:
 * Two-Digit by One-Digit,12,3,easy
 * Two-Digit by One-Digit,45,7,medium
 * Two-Digit by Two-Digit,23,15,medium
 * Two-Digit by Two-Digit,67,89,hard
 */

interface CSVRow {
  section: string
  operand1: number
  operand2: number
  difficulty?: "easy" | "medium" | "hard"
}

/**
 * Parse CSV text into worksheet
 */
export function parseCSVToWorksheet(
  csvText: string,
  worksheetTitle: string,
  worksheetDescription?: string
): Worksheet | null {
  try {
    const lines = csvText.trim().split("\n")
    if (lines.length === 0) return null

    // Check if first line is header
    const firstLine = lines[0].toLowerCase()
    const hasHeader =
      firstLine.includes("section") ||
      firstLine.includes("operand") ||
      firstLine.includes("difficulty")

    const dataLines = hasHeader ? lines.slice(1) : lines
    const rows: CSVRow[] = []

    for (const line of dataLines) {
      if (!line.trim()) continue

      const parts = line.split(",").map((p) => p.trim())
      if (parts.length < 3) continue

      const section = parts[0] || "Problems"
      const operand1 = parseInt(parts[1])
      const operand2 = parseInt(parts[2])
      const difficulty = (parts[3]?.toLowerCase() as "easy" | "medium" | "hard") || "medium"

      if (isNaN(operand1) || isNaN(operand2)) continue

      rows.push({ section, operand1, operand2, difficulty })
    }

    if (rows.length === 0) return null

    // Group by section
    const sectionMap = new Map<string, CSVRow[]>()
    for (const row of rows) {
      const existing = sectionMap.get(row.section) || []
      existing.push(row)
      sectionMap.set(row.section, existing)
    }

    // Create worksheet
    const worksheetId = `worksheet-${Date.now()}`
    const sections: WorksheetSection[] = []
    let problemCounter = 0

    for (const [sectionName, sectionRows] of sectionMap.entries()) {
      const problems: Problem[] = sectionRows.map((row) => {
        problemCounter++
        return {
          id: `problem-${worksheetId}-${problemCounter}`,
          operation: "multiplication" as const,
          operands: [row.operand1, row.operand2],
          correctAnswer: row.operand1 * row.operand2,
          difficulty: row.difficulty || "medium",
        }
      })

      sections.push({
        id: `section-${worksheetId}-${sections.length + 1}`,
        title: sectionName,
        problems,
      })
    }

    const worksheet: Worksheet = {
      id: worksheetId,
      title: worksheetTitle,
      description: worksheetDescription,
      sections,
      problems: sections.flatMap((s) => s.problems),
      createdAt: new Date().toISOString(),
      settings: {
        showMethodSelector: true,
        allowedMethods: ["partial-products", "area-model"],
        showHints: false,
        showValidation: true,
        showAllCells: false,
        showPlaceholderZeros: false,
      },
    }

    return worksheet
  } catch (error) {
    console.error("Failed to parse CSV:", error)
    return null
  }
}

/**
 * Generate example CSV content
 */
export function generateExampleCSV(): string {
  return `section,operand1,operand2,difficulty
Two-Digit by One-Digit,12,3,easy
Two-Digit by One-Digit,45,7,medium
Two-Digit by One-Digit,78,9,hard
Two-Digit by Two-Digit,23,15,medium
Two-Digit by Two-Digit,34,28,hard
Two-Digit by Two-Digit,67,89,hard
Three-Digit by Two-Digit,234,56,hard
Three-Digit by Two-Digit,456,78,hard`
}

/**
 * Download example CSV file
 */
export function downloadExampleCSV(): void {
  const csv = generateExampleCSV()
  const blob = new Blob([csv], { type: "text/csv" })
  const url = URL.createObjectURL(blob)
  const a = document.createElement("a")
  a.href = url
  a.download = "mathcat-worksheet-example.csv"
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
