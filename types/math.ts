export type Operation = "multiplication" | "division" | "fraction-decimal" | "decimal-fraction"

export type DifficultyLevel = "easy" | "medium" | "hard" | "bonkers"

export interface Problem {
  id: string
  operation: Operation
  operands: number[]
  difficulty: DifficultyLevel
  correctAnswer: number | string
}

export interface ProblemState {
  problemId: string
  currentMethod: SolvingMethod
  userInputs: Record<string, any>
  isComplete: boolean
  isCorrect: boolean | null
}

export type SolvingMethod =
  | "classic-algorithm"
  | "partial-products"
  | "area-model"
  | "long-division"
  | "short-division"

export interface MethodConfig {
  id: SolvingMethod
  name: string
  description: string
  supportedOperations: Operation[]
  component: React.ComponentType<MethodProps>
}

export interface MethodProps {
  multiplicand?: number
  multiplier?: number
  dividend?: number
  divisor?: number
  onComplete?: (isCorrect: boolean) => void
}

export interface ValidationResult {
  isCorrect: boolean
  errors?: ValidationError[]
}

export interface ValidationError {
  field: string
  expected: any
  actual: any
  message: string
}
