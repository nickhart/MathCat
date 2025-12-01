"use client"

import { MultiplicationPartialProductsGrid } from "@/components/math/MultiplicationPartialProductsGrid"

export interface PartialProductsViewProps {
  multiplicand: number
  multiplier: number
  initialUserInputs?: any
  onComplete?: (isCorrect: boolean, userInputs?: any) => void
  showValidation?: boolean
  showAllCells?: boolean
}

export function PartialProductsView({
  multiplicand,
  multiplier,
  initialUserInputs,
  onComplete,
  showValidation = true,
  showAllCells = false,
}: PartialProductsViewProps) {
  return (
    <MultiplicationPartialProductsGrid
      multiplicand={multiplicand}
      multiplier={multiplier}
      initialUserInputs={initialUserInputs}
      onComplete={onComplete}
      showValidation={showValidation}
      showAllCells={showAllCells}
    />
  )
}
