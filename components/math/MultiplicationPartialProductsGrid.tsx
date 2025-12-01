"use client"

import { cn } from "@/lib/utils/cn"
import { AdditionGrid, AdditionGridRow } from "@/components/math/AdditionGrid"

export interface MultiplicationPartialProductsGridUserInputs {
  additionInputs: any
}

export interface MultiplicationPartialProductsGridProps {
  multiplicand: number
  multiplier: number
  initialUserInputs?: MultiplicationPartialProductsGridUserInputs
  onComplete?: (
    isCorrect: boolean,
    userInputs?: MultiplicationPartialProductsGridUserInputs
  ) => void
  onStateChange?: (userInputs?: MultiplicationPartialProductsGridUserInputs) => void
  showValidation?: boolean
  showAllCells?: boolean
  className?: string
}

export function MultiplicationPartialProductsGrid({
  multiplicand,
  multiplier,
  initialUserInputs,
  onComplete,
  onStateChange,
  showValidation = true,
  showAllCells = false,
  className,
}: MultiplicationPartialProductsGridProps) {
  // Calculate partial products
  const calculatePartialProducts = (): AdditionGridRow[] => {
    const products: AdditionGridRow[] = []
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

        <AdditionGrid
          rows={partialProducts}
          expectedSum={expectedSum}
          initialUserInputs={initialUserInputs?.additionInputs}
          onComplete={(isCorrect, additionInputs) => {
            if (onComplete) {
              const userInputs: MultiplicationPartialProductsGridUserInputs = {
                additionInputs,
              }
              onComplete(isCorrect, userInputs)
            }
          }}
          onStateChange={(additionInputs) => {
            if (onStateChange) {
              const userInputs: MultiplicationPartialProductsGridUserInputs = {
                additionInputs,
              }
              onStateChange(userInputs)
            }
          }}
          showValidation={showValidation}
          showAllCells={showAllCells}
        />
      </div>
    </div>
  )
}
