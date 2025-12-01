"use client"

import { useState } from "react"
import { cn } from "@/lib/utils/cn"
import { AdditionGrid, AdditionGridRow } from "@/components/math/AdditionGrid"

export interface MultiplicationAreaModelUserInputs {
  cellInputs: Record<string, string>
  additionInputs: any
}

export interface MultiplicationAreaModelProps {
  multiplicand: number
  multiplier: number
  initialUserInputs?: MultiplicationAreaModelUserInputs
  onComplete?: (isCorrect: boolean, userInputs?: MultiplicationAreaModelUserInputs) => void
  showValidation?: boolean
  showAllCells?: boolean
  className?: string
}

interface GridCell {
  row: number
  col: number
  rowValue: number
  colValue: number
  expected: number
}

export function MultiplicationAreaModel({
  multiplicand,
  multiplier,
  initialUserInputs,
  onComplete,
  showValidation = true,
  showAllCells = false,
  className,
}: MultiplicationAreaModelProps) {
  // Break number into place value components
  const getPlaceValueComponents = (num: number): number[] => {
    const components: number[] = []
    let place = 0
    let n = num

    while (n > 0) {
      const digit = n % 10
      if (digit > 0) {
        components.unshift(digit * Math.pow(10, place))
      }
      n = Math.floor(n / 10)
      place++
    }

    return components
  }

  const multiplicandParts = getPlaceValueComponents(multiplicand)
  const multiplierParts = getPlaceValueComponents(multiplier)

  // Create grid cells
  const createGrid = (): GridCell[] => {
    const cells: GridCell[] = []

    multiplierParts.forEach((rowValue, rowIndex) => {
      multiplicandParts.forEach((colValue, colIndex) => {
        cells.push({
          row: rowIndex,
          col: colIndex,
          rowValue,
          colValue,
          expected: rowValue * colValue,
        })
      })
    })

    return cells
  }

  const gridCells = createGrid()
  const expectedSum = multiplicand * multiplier
  const maxDigits = expectedSum.toString().length
  const totalCells = maxDigits + 1

  // State for selected cell (to highlight corresponding addition row)
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null)

  // State for user inputs in the area model grid
  const [cellInputs, setCellInputs] = useState<Record<string, string>>(
    initialUserInputs?.cellInputs || {}
  )

  // State to track addition grid inputs separately (to preserve DigitGrid format during editing)
  const [additionGridInputs, setAdditionGridInputs] = useState<Record<number, string>>({})

  // Convert grid cells to AdditionGridRow format with highlighting
  const additionRows: AdditionGridRow[] = gridCells.map((cell) => ({
    value: cell.expected,
    label: `${cell.rowValue} × ${cell.colValue}`,
    highlighted:
      selectedCell !== null && selectedCell.row === cell.row && selectedCell.col === cell.col,
  }))

  const handleCellChange = (row: number, col: number, value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      const key = `${row}-${col}`
      setCellInputs((prev) => ({ ...prev, [key]: value }))

      // Also update the corresponding addition grid input with right-aligned format
      const cellIndex = gridCells.findIndex((c) => c.row === row && c.col === col)
      if (cellIndex !== -1) {
        setAdditionGridInputs((prev) => ({
          ...prev,
          [cellIndex]: toRightAlignedString(value, totalCells),
        }))
      }
    }
  }

  const handleCellClick = (row: number, col: number) => {
    setSelectedCell({ row, col })
  }

  // Helper to convert a number string to right-aligned format for DigitGrid
  const toRightAlignedString = (value: string, totalCells: number): string => {
    if (!value || value.trim() === "") return ""
    // Remove any existing spaces
    const digits = value.replace(/\s/g, "")
    // Pad with leading spaces for right alignment
    return digits.padStart(totalCells, " ")
  }

  // Helper to extract just the number from a right-aligned DigitGrid string
  const fromRightAlignedString = (value: string): string => {
    if (!value) return ""
    // Remove all spaces
    return value.replace(/\s/g, "")
  }

  // Get row input values - use additionGridInputs if available, otherwise convert from cellInputs
  const rowInputValues: Record<number, string> = {}
  gridCells.forEach((cell, index) => {
    // If we have a value in additionGridInputs, use that (preserves DigitGrid format during editing)
    if (additionGridInputs[index] !== undefined) {
      rowInputValues[index] = additionGridInputs[index]
    } else {
      // Otherwise, convert from area model cell input
      const key = `${cell.row}-${cell.col}`
      const rawValue = cellInputs[key] || ""
      rowInputValues[index] = toRightAlignedString(rawValue, totalCells)
    }
  })

  // Handle changes from addition grid
  const handleAdditionRowChange = (rowIndex: number, value: string) => {
    const cell = gridCells[rowIndex]
    if (cell) {
      // Store the DigitGrid format directly (preserves spaces during editing)
      setAdditionGridInputs((prev) => ({ ...prev, [rowIndex]: value }))

      // Also sync the numeric value back to the area model cell
      const key = `${cell.row}-${cell.col}`
      const numericValue = fromRightAlignedString(value)
      setCellInputs((prev) => ({ ...prev, [key]: numericValue }))
    }
  }

  // Handle focus on addition grid row - highlight corresponding area model cell
  const handleAdditionRowFocus = (rowIndex: number) => {
    const cell = gridCells[rowIndex]
    if (cell) {
      setSelectedCell({ row: cell.row, col: cell.col })
    }
  }

  const getCellInput = (row: number, col: number): string => {
    const key = `${row}-${col}`
    return cellInputs[key] || ""
  }

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {/* Problem */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold mb-2">Area Model Method</h3>
        <p className="text-4xl font-mono">
          {multiplicand} × {multiplier}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Fill in each rectangle&apos;s area, then add them up using the digit grid
        </p>
      </div>

      {/* Responsive layout: stacked on small screens, side-by-side on large */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-12 items-start">
        {/* Area model grid */}
        <div className="flex-shrink-0">
          <div className="flex">
            {/* Top-left corner cell (empty) */}
            <div className="w-20 h-20 border-2 border-transparent" />

            {/* Column headers (multiplicand parts) */}
            {multiplicandParts.map((value, colIndex) => (
              <div
                key={`col-header-${colIndex}`}
                className="w-32 h-20 flex items-center justify-center font-bold text-lg border-b-2 border-gray-400"
              >
                {value}
              </div>
            ))}
          </div>

          {/* Grid rows */}
          {multiplierParts.map((rowValue, rowIndex) => (
            <div key={`row-${rowIndex}`} className="flex">
              {/* Row header (multiplier parts) */}
              <div className="w-20 h-32 flex items-center justify-center font-bold text-lg border-r-2 border-gray-400">
                {rowValue}
              </div>

              {/* Grid cells */}
              {multiplicandParts.map((colValue, colIndex) => {
                const cell = gridCells.find((c) => c.row === rowIndex && c.col === colIndex)!
                const userValue = getCellInput(rowIndex, colIndex)
                const isFilled = userValue.trim() !== ""
                const isCorrectValue = isFilled && parseInt(userValue) === cell.expected
                const isSelected =
                  selectedCell !== null &&
                  selectedCell.row === rowIndex &&
                  selectedCell.col === colIndex

                return (
                  <div
                    key={`cell-${rowIndex}-${colIndex}`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                    className={cn(
                      "w-32 h-32 border-2 p-2 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors",
                      isSelected
                        ? "border-primary bg-primary/10 ring-2 ring-primary ring-offset-2"
                        : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                    )}
                  >
                    <div className="text-xs text-muted-foreground">
                      {rowValue} × {colValue}
                    </div>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={userValue}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      onFocus={() => handleCellClick(rowIndex, colIndex)}
                      onClick={(e) => e.stopPropagation()}
                      className={cn(
                        "w-full px-2 py-1 text-center font-mono text-lg border-2 rounded",
                        "focus:outline-none focus:ring-2 focus:ring-primary",
                        showValidation &&
                          isFilled &&
                          isCorrectValue &&
                          "border-green-500 bg-green-50",
                        showValidation && isFilled && !isCorrectValue && "border-red-500 bg-red-50"
                      )}
                      placeholder="?"
                    />
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Addition grid for summing up the products */}
        <div className="flex-1 min-w-0">
          <h4 className="text-lg font-semibold mb-4">Add up all the areas:</h4>
          <AdditionGrid
            rows={additionRows}
            expectedSum={expectedSum}
            initialUserInputs={initialUserInputs?.additionInputs}
            onComplete={(isCorrect, additionInputs) => {
              if (onComplete) {
                const userInputs: MultiplicationAreaModelUserInputs = {
                  cellInputs,
                  additionInputs,
                }
                onComplete(isCorrect, userInputs)
              }
            }}
            showValidation={showValidation}
            showAllCells={showAllCells}
            rowInputValues={rowInputValues}
            onRowInputChange={handleAdditionRowChange}
            onRowFocus={handleAdditionRowFocus}
          />
        </div>
      </div>
    </div>
  )
}
