"use client"

import { MultiplicationPartialProductsGrid } from "@/components/math/MultiplicationPartialProductsGrid"

export interface PartialProductsViewProps {
  multiplicand: number
  multiplier: number
  onComplete?: (isCorrect: boolean) => void
  showValidation?: boolean
  showAllCells?: boolean
}

export function PartialProductsView({
  multiplicand,
  multiplier,
  onComplete,
  showValidation = true,
  showAllCells = false,
}: PartialProductsViewProps) {
  return (
    <MultiplicationPartialProductsGrid
      multiplicand={multiplicand}
      multiplier={multiplier}
      onComplete={onComplete}
      showValidation={showValidation}
      showAllCells={showAllCells}
    />
  )
}
