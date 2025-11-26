"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils/cn"
import { DigitGrid } from "@/components/math/DigitGrid"

export interface MultiplicationPartialProductsGridProps {
  multiplicand: number
  multiplier: number
  onComplete?: (isCorrect: boolean) => void
  showValidation?: boolean
  showAllCells?: boolean
  className?: string
}

interface PartialProduct {
  value: number
  label: string
}

export function MultiplicationPartialProductsGrid({
  multiplicand,
  multiplier,
  onComplete,
  showValidation = true,
  showAllCells = false,
  className,
}: MultiplicationPartialProductsGridProps) {
  // Calculate partial products
  const calculatePartialProducts = (): PartialProduct[] => {
    const products: PartialProduct[] = []
    const multiplicandStr = multiplicand.toString()
    const multiplierStr = multiplier.toString()

    // Break into place values
    for (let i = multiplierStr.length - 1; i >= 0; i--) {
      const mPlierDigit = parseInt(multiplierStr[i])
      if (mPlierDigit === 0) continue
      const mPlierPlace = multiplierStr.length - 1 - i

      for (let j = multiplicandStr.length - 1; j >= 0; j--) {
        const mCandDigit = parseInt(multiplicandStr[j])
        if (mCandDigit === 0) continue
        const mCandPlace = multiplicandStr.length - 1 - j

        const value = mCandDigit * mPlierDigit * Math.pow(10, mCandPlace + mPlierPlace)
        const mCandValue = mCandDigit * Math.pow(10, mCandPlace)
        const mPlierValue = mPlierDigit * Math.pow(10, mPlierPlace)

        products.push({
          value,
          label: `${mCandValue} × ${mPlierValue}`,
        })
      }
    }

    return products.sort((a, b) => a.value - b.value)
  }

  const partialProducts = calculatePartialProducts()
  const expectedSum = multiplicand * multiplier

  // State for user inputs
  const [inputs, setInputs] = useState<Record<number, string>>({})
  const [carryDigits, setCarryDigits] = useState("")
  const [sumInput, setSumInput] = useState("")

  // Validation state
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isComplete, setIsComplete] = useState(false)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // Determine max digits needed
  const maxDigits = expectedSum.toString().length

  // Check completion and correctness
  useEffect(() => {
    const allPartialsFilled = partialProducts.every((_, index) => {
      const value = inputs[index]
      // Complete means all cells filled (no spaces)
      return value !== undefined && value !== "" && !value.includes(" ")
    })

    const sumFilled = sumInput !== "" && !sumInput.includes(" ")

    setIsComplete(allPartialsFilled && sumFilled)

    if (allPartialsFilled && sumFilled) {
      const allPartialsCorrect = partialProducts.every((product, index) => {
        return parseInt(inputs[index] || "0") === product.value
      })

      const sumCorrect = parseInt(sumInput || "0") === expectedSum

      const correct = allPartialsCorrect && sumCorrect
      setIsCorrect(correct)

      if (onComplete) {
        onComplete(correct)
      }
    } else {
      setIsCorrect(null)
    }
  }, [inputs, sumInput, partialProducts, expectedSum, onComplete])

  const handleInputChange = (index: number, value: string) => {
    setInputs((prev) => ({ ...prev, [index]: value }))
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
    const value = inputs[index]
    // Only validate if all cells are filled (no spaces)
    if (!value || value.includes(" ")) return null
    return parseInt(value) === partialProducts[index].value ? "correct" : "incorrect"
  }

  const getSumValidation = (): "correct" | "incorrect" | null => {
    if (!showValidation) return null
    // Only validate if all cells are filled (no spaces)
    if (!sumInput || sumInput.includes(" ")) return null
    return parseInt(sumInput) === expectedSum ? "correct" : "incorrect"
  }

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {/* Problem display */}
      <div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">Partial Products Method (Grid)</h3>
          <p className="text-4xl font-mono">
            {multiplicand} × {multiplier}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Enter each partial product using the digit grid, then add them up for the final sum
          </p>
        </div>

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

          {/* Partial product rows */}
          {partialProducts.map((product, index) => {
            // Calculate leading spacers for right-alignment
            const productDigits = product.value.toString().length
            const leadingSpacers = maxDigits + 1 - productDigits
            // When showAllCells is false, use spacers for leading positions
            // When true, only add spacer for leftmost column
            const spacerIndices = showAllCells
              ? [0]
              : Array.from({ length: leadingSpacers }, (_, i) => i)

            return (
              <div key={index} className="flex items-center gap-3">
                <label className="text-sm font-mono w-32 text-right text-muted-foreground">
                  {product.label} =
                </label>
                <DigitGrid
                  value={inputs[index] || ""}
                  onChange={(value) => handleInputChange(index, value)}
                  numCells={maxDigits + 1}
                  spacerIndices={spacerIndices}
                  validation={getRowValidation(index)}
                  showValidation={showValidation}
                  ariaLabel={`Partial product ${index + 1}: ${product.label}`}
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
            <label className="text-xs text-muted-foreground w-32 text-right">
              Carry (optional):
            </label>
            <DigitGrid
              value={carryDigits}
              onChange={setCarryDigits}
              numCells={maxDigits + 1}
              spacerIndices={[maxDigits]}
              cellClassName="text-xs h-8 border-dashed bg-blue-50/30"
              ariaLabel="Carry digits for addition"
            />
          </div>

          {/* Sum row */}
          <div className="flex items-center gap-3">
            <label className="text-lg font-mono w-32 text-right font-semibold">Sum =</label>
            <DigitGrid
              value={sumInput}
              onChange={setSumInput}
              numCells={maxDigits + 1}
              autoAdvanceDirection="left"
              validation={getSumValidation()}
              showValidation={showValidation}
              ariaLabel="Sum of partial products"
            />
          </div>
        </div>
      </div>
    </div>
  )
}
