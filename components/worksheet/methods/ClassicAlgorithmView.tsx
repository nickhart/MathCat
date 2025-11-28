"use client"

import { MultiplicationClassicAlgorithm } from "@/components/math/MultiplicationClassicAlgorithm"

export interface ClassicAlgorithmViewProps {
  multiplicand: number
  multiplier: number
  onComplete?: (isCorrect: boolean) => void
  showValidation?: boolean
  showAllCells?: boolean
  showPlaceholderZeros?: boolean
}

export function ClassicAlgorithmView({
  multiplicand,
  multiplier,
  onComplete,
  showValidation = true,
  showAllCells = false,
  showPlaceholderZeros = false,
}: ClassicAlgorithmViewProps) {
  return (
    <MultiplicationClassicAlgorithm
      multiplicand={multiplicand}
      multiplier={multiplier}
      onComplete={onComplete}
      showValidation={showValidation}
      showAllCells={showAllCells}
      showPlaceholderZeros={showPlaceholderZeros}
    />
  )
}
