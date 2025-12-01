"use client"

import { MultiplicationClassicAlgorithm } from "@/components/math/MultiplicationClassicAlgorithm"

export interface ClassicAlgorithmViewProps {
  multiplicand: number
  multiplier: number
  initialUserInputs?: any
  onComplete?: (isCorrect: boolean, userInputs?: any) => void
  showValidation?: boolean
  showAllCells?: boolean
}

export function ClassicAlgorithmView({
  multiplicand,
  multiplier,
  initialUserInputs,
  onComplete,
  showValidation = true,
  showAllCells = false,
}: ClassicAlgorithmViewProps) {
  return (
    <MultiplicationClassicAlgorithm
      multiplicand={multiplicand}
      multiplier={multiplier}
      initialUserInputs={initialUserInputs}
      onComplete={onComplete}
      showValidation={showValidation}
      showAllCells={showAllCells}
    />
  )
}
