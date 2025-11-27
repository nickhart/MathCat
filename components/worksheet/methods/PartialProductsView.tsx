"use client"

import { MultiplicationPartialProductsGrid } from "@/components/math/MultiplicationPartialProductsGrid"

export interface PartialProductsViewProps {
  multiplicand: number
  multiplier: number
  onComplete?: (isCorrect: boolean) => void
}

export function PartialProductsView({
  multiplicand,
  multiplier,
  onComplete,
}: PartialProductsViewProps) {
  return (
    <MultiplicationPartialProductsGrid
      multiplicand={multiplicand}
      multiplier={multiplier}
      onComplete={onComplete}
      showValidation={true}
      showAllCells={false}
    />
  )
}
