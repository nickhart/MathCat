"use client"

import { MultiplicationAreaModel } from "@/components/math/MultiplicationAreaModel"

export interface AreaModelViewProps {
  multiplicand: number
  multiplier: number
  initialUserInputs?: any
  onComplete?: (isCorrect: boolean, userInputs?: any) => void
  showValidation?: boolean
  showAllCells?: boolean
}

export function AreaModelView({
  multiplicand,
  multiplier,
  initialUserInputs,
  onComplete,
  showValidation = true,
  showAllCells = false,
}: AreaModelViewProps) {
  return (
    <MultiplicationAreaModel
      multiplicand={multiplicand}
      multiplier={multiplier}
      initialUserInputs={initialUserInputs}
      onComplete={onComplete}
      showValidation={showValidation}
      showAllCells={showAllCells}
    />
  )
}
