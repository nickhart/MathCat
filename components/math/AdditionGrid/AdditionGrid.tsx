"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils/cn"
import { DigitGrid, DigitGridRef } from "@/components/math/DigitGrid"
import { CatValidator } from "@/components/feedback/CatValidator"

export interface AdditionGridRow {
  /** The expected numeric value for this row */
  value: number
  /** Display label for this row (e.g., "10 × 20") */
  label: string
  /** Optional: highlight this row (useful for connecting to area model boxes) */
  highlighted?: boolean
}

export interface AdditionGridProps {
  /** Array of rows to add together */
  rows: AdditionGridRow[]
  /** The expected sum of all rows */
  expectedSum: number
  /** Callback when user completes the problem */
  onComplete?: (isCorrect: boolean) => void
  /** Show validation feedback (green/red borders) */
  showValidation?: boolean
  /** Show all cells instead of using spacers for leading zeros */
  showAllCells?: boolean
  /** Additional classes for container */
  className?: string
  /** Optional: External control of row input values (for syncing with other UI) */
  rowInputValues?: Record<number, string>
  /** Optional: Callback when a row input changes */
  onRowInputChange?: (rowIndex: number, value: string) => void
  /** Optional: Callback when a row receives focus */
  onRowFocus?: (rowIndex: number) => void
}

export function AdditionGrid({
  rows,
  expectedSum,
  onComplete,
  showValidation = true,
  showAllCells = false,
  className,
  rowInputValues,
  onRowInputChange,
  onRowFocus,
}: AdditionGridProps) {
  // Ref for sum row to enable programmatic focus
  const sumRowRef = useRef<DigitGridRef>(null)

  // State for user inputs
  const [inputs, setInputs] = useState<Record<number, string>>({})
  const [carryDigits, setCarryDigits] = useState("")
  const [sumInput, setSumInput] = useState("")

  // Validation state
  const [isComplete, setIsComplete] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // Determine max digits needed
  const maxDigits = expectedSum.toString().length

  // Check completion and correctness
  useEffect(() => {
    const allRowsFilled = rows.every((_, index) => {
      const value = rowInputValues !== undefined ? rowInputValues[index] : inputs[index]
      // Complete means all digits entered (value without spaces is non-empty)
      const trimmed = value?.replace(/\s/g, "") || ""
      return trimmed !== ""
    })

    const sumTrimmed = sumInput.replace(/\s/g, "")
    const sumFilled = sumTrimmed !== ""

    setIsComplete(allRowsFilled && sumFilled)

    if (allRowsFilled && sumFilled) {
      const allRowsCorrect = rows.every((row, index) => {
        const value = rowInputValues !== undefined ? rowInputValues[index] : inputs[index]
        const trimmed = value?.replace(/\s/g, "") || "0"
        return parseInt(trimmed) === row.value
      })

      const sumCorrect = parseInt(sumTrimmed) === expectedSum

      const correct = allRowsCorrect && sumCorrect
      setIsCorrect(correct)

      if (onComplete) {
        onComplete(correct)
      }
    } else {
      setIsCorrect(null)
    }
  }, [inputs, sumInput, rows, expectedSum, onComplete, rowInputValues])

  const handleInputChange = (index: number, value: string) => {
    if (onRowInputChange) {
      onRowInputChange(index, value)
    } else {
      setInputs((prev) => ({ ...prev, [index]: value }))
    }
  }

  // Use external values if provided, otherwise use internal state
  const getRowInput = (index: number): string => {
    if (rowInputValues !== undefined) {
      return rowInputValues[index] || ""
    }
    return inputs[index] || ""
  }

  // Handle carry digit change - focus corresponding sum cell
  const handleCarryDigitChange = (index: number, value: string) => {
    // When a carry digit is entered, focus the corresponding cell in the sum row
    if (value !== "" && sumRowRef.current) {
      sumRowRef.current.focusCell(index)
    }
  }

  // Helper to format large place values
  const formatPlaceValue = (value: number): string => {
    if (value >= 1_000_000_000) return `${value / 1_000_000_000}b`
    if (value >= 1_000_000) return `${value / 1_000_000}m`
    if (value >= 1_000) return `${value / 1_000}k`
    return value.toString()
  }

  // Determine validation state for each row
  const getRowValidation = (index: number): "correct" | "incorrect" | null => {
    if (!showValidation) return null
    const value = getRowInput(index)
    const trimmed = value?.replace(/\s/g, "") || ""
    if (trimmed === "") return null
    return parseInt(trimmed) === rows[index].value ? "correct" : "incorrect"
  }

  const getSumValidation = (): "correct" | "incorrect" | null => {
    if (!showValidation) return null
    const trimmed = sumInput.replace(/\s/g, "")
    if (trimmed === "") return null
    return parseInt(trimmed) === expectedSum ? "correct" : "incorrect"
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Grid layout */}
      <div className="space-y-1">
        {/* Place value headers */}
        <div className="flex items-center gap-3 mb-2">
          <div className="w-32 text-sm text-muted-foreground text-right">Place Values:</div>
          <div className="flex gap-0">
            {Array.from({ length: maxDigits + 1 }, (_, i) => {
              const placeValue = Math.pow(10, maxDigits - i)
              return (
                <div key={i} className="w-12 text-center text-xs text-muted-foreground">
                  {formatPlaceValue(placeValue)}
                </div>
              )
            })}
          </div>
        </div>

        {/* Number rows */}
        {rows.map((row, index) => {
          // Calculate leading spacers for right-alignment
          const rowDigits = row.value.toString().length
          const leadingSpacers = maxDigits + 1 - rowDigits
          // When showAllCells is false, use spacers for leading positions
          // When true, only add spacer for leftmost column
          const spacerIndices = showAllCells
            ? [0]
            : Array.from({ length: leadingSpacers }, (_, i) => i)

          return (
            <div key={index} className="flex items-center gap-3">
              <label className="text-sm font-mono w-32 text-right text-muted-foreground">
                {row.label} =
              </label>
              <DigitGrid
                value={getRowInput(index)}
                onChange={(value) => handleInputChange(index, value)}
                numCells={maxDigits + 1}
                spacerIndices={spacerIndices}
                validation={getRowValidation(index)}
                showValidation={showValidation}
                ariaLabel={`Row ${index + 1}: ${row.label}`}
                className={cn(row.highlighted && "ring-2 ring-primary ring-offset-2 rounded-md")}
                onGridFocus={() => onRowFocus?.(index)}
              />
            </div>
          )
        })}

        {/* Horizontal line */}
        <div className="flex items-center gap-3 my-4">
          <div className="w-32" />
          <div
            className="border-t-2 border-gray-800"
            style={{ width: `${(maxDigits + 1) * 48}px` }}
          />
        </div>

        {/* Carry row (optional) */}
        <div className="flex items-center gap-3 mb-2">
          <label className="text-xs text-muted-foreground w-32 text-right">Carry (optional):</label>
          <DigitGrid
            value={carryDigits}
            onChange={setCarryDigits}
            numCells={maxDigits + 1}
            spacerIndices={[maxDigits]}
            cellClassName="text-xs border-dashed bg-blue-50/30"
            ariaLabel="Carry digits for addition"
            autoAdvanceDirection="none"
            onCellChange={handleCarryDigitChange}
          />
        </div>

        {/* Sum row */}
        <div className="flex items-center gap-3">
          <label className="text-lg font-mono w-32 text-right font-semibold">Sum =</label>
          <DigitGrid
            ref={sumRowRef}
            value={sumInput}
            onChange={setSumInput}
            numCells={maxDigits + 1}
            autoAdvanceDirection="left"
            validation={getSumValidation()}
            showValidation={showValidation}
            ariaLabel="Sum of all rows"
          />
        </div>

        {/* Cat validator */}
        <div className="flex items-center gap-3 mt-8">
          <div className="w-32" />
          <CatValidator isComplete={isComplete} isCorrect={isCorrect} />
        </div>
      </div>
    </div>
  )
}
