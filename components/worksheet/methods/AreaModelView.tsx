"use client"

import { MultiplicationAreaModel } from "@/components/math/MultiplicationAreaModel"

export interface AreaModelViewProps {
  multiplicand: number
  multiplier: number
  onComplete?: (isCorrect: boolean) => void
}

export function AreaModelView({ multiplicand, multiplier, onComplete }: AreaModelViewProps) {
  return (
    <MultiplicationAreaModel
      multiplicand={multiplicand}
      multiplier={multiplier}
      onComplete={onComplete}
      showValidation={true}
    />
  )
}
