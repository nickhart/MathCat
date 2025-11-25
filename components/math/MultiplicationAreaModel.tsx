"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils/cn"
import { CatValidator } from "@/components/feedback/CatValidator"

export interface MultiplicationAreaModelProps {
  multiplicand: number
  multiplier: number
  onComplete?: (isCorrect: boolean) => void
  showValidation?: boolean
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
  onComplete,
  showValidation = true,
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

  // State for user inputs
  const [cellInputs, setCellInputs] = useState<Record<string, string>>({})
  const [sumInput, setSumInput] = useState("")

  // Validation state
  const [isComplete, setIsComplete] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // Check completion and correctness
  useEffect(() => {
    const allCellsFilled = gridCells.every((cell) => {
      const key = `${cell.row}-${cell.col}`
      const value = cellInputs[key]
      return value !== undefined && value.trim() !== ""
    })

    const sumFilled = sumInput.trim() !== ""

    setIsComplete(allCellsFilled && sumFilled)

    if (allCellsFilled && sumFilled) {
      const allCellsCorrect = gridCells.every((cell) => {
        const key = `${cell.row}-${cell.col}`
        return parseInt(cellInputs[key]) === cell.expected
      })

      const sumCorrect = parseInt(sumInput) === expectedSum

      const correct = allCellsCorrect && sumCorrect
      setIsCorrect(correct)

      if (onComplete) {
        onComplete(correct)
      }
    } else {
      setIsCorrect(null)
    }
  }, [cellInputs, sumInput, gridCells, expectedSum, onComplete])

  const handleCellChange = (row: number, col: number, value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      const key = `${row}-${col}`
      setCellInputs((prev) => ({ ...prev, [key]: value }))
    }
  }

  const handleSumChange = (value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      setSumInput(value)
    }
  }

  const getCellInput = (row: number, col: number): string => {
    const key = `${row}-${col}`
    return cellInputs[key] || ""
  }

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="flex justify-between items-start gap-8">
        {/* Problem and grid */}
        <div className="flex-1">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Area Model Method</h3>
            <p className="text-4xl font-mono">
              {multiplicand} × {multiplier}
            </p>
          </div>

          {/* Area model grid */}
          <div className="inline-block">
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

                  return (
                    <div
                      key={`cell-${rowIndex}-${colIndex}`}
                      className="w-32 h-32 border-2 border-gray-300 p-2 flex flex-col items-center justify-center gap-2"
                    >
                      <div className="text-xs text-muted-foreground">
                        {rowValue} × {colValue}
                      </div>
                      <input
                        type="text"
                        inputMode="numeric"
                        value={userValue}
                        onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                        className={cn(
                          "w-full px-2 py-1 text-center font-mono text-lg border-2 rounded",
                          "focus:outline-none focus:ring-2 focus:ring-primary",
                          showValidation &&
                            isFilled &&
                            isCorrectValue &&
                            "border-green-500 bg-green-50",
                          showValidation &&
                            isFilled &&
                            !isCorrectValue &&
                            "border-red-500 bg-red-50"
                        )}
                        placeholder="?"
                      />
                    </div>
                  )
                })}
              </div>
            ))}
          </div>

          {/* Sum */}
          <div className="mt-8 flex items-center gap-3">
            <label className="text-lg font-mono font-semibold">Total Area (Sum) =</label>
            <input
              type="text"
              inputMode="numeric"
              value={sumInput}
              onChange={(e) => handleSumChange(e.target.value)}
              className={cn(
                "w-40 px-3 py-2 text-lg font-mono border-2 rounded-md font-semibold",
                "focus:outline-none focus:ring-2 focus:ring-primary",
                showValidation &&
                  sumInput.trim() !== "" &&
                  parseInt(sumInput) === expectedSum &&
                  "border-green-500 bg-green-50",
                showValidation &&
                  sumInput.trim() !== "" &&
                  parseInt(sumInput) !== expectedSum &&
                  "border-red-500 bg-red-50"
              )}
              placeholder="?"
            />
          </div>
        </div>

        {/* Cat validator */}
        <div className="flex-shrink-0">
          <CatValidator isComplete={isComplete} isCorrect={isCorrect} />
        </div>
      </div>
    </div>
  )
}
