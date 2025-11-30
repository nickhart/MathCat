import { Problem, DifficultyLevel, Operation } from "@/types/math"

/**
 * Configuration for problem generation constraints
 */
export interface GeneratorConfig {
  /** Allow zeros in operands (default: true) */
  allowZeros?: boolean
  /** Allow leading zeros in multi-digit numbers (default: false) */
  allowLeadingZeros?: boolean
  /** Custom range for operands (overrides difficulty defaults) */
  customRange?: {
    min: number
    max: number
  }
}

/**
 * Difficulty constraints for multiplication problems
 */
const MULTIPLICATION_DIFFICULTY_CONSTRAINTS = {
  easy: {
    // 2×1 digit (e.g., 12 × 3)
    multiplicand: { minDigits: 2, maxDigits: 2 },
    multiplier: { minDigits: 1, maxDigits: 1 },
  },
  medium: {
    // 2×2 digit (e.g., 12 × 34)
    multiplicand: { minDigits: 2, maxDigits: 2 },
    multiplier: { minDigits: 2, maxDigits: 2 },
  },
  hard: {
    // 3×2 digit (e.g., 123 × 45)
    multiplicand: { minDigits: 3, maxDigits: 3 },
    multiplier: { minDigits: 2, maxDigits: 2 },
  },
  bonkers: {
    // 3×3 digit or larger (e.g., 123 × 456)
    multiplicand: { minDigits: 3, maxDigits: 4 },
    multiplier: { minDigits: 3, maxDigits: 3 },
  },
} as const

/**
 * Generate a random integer between min and max (inclusive)
 */
function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * Generate a random number with specified digit constraints
 */
function generateNumberWithDigits(
  minDigits: number,
  maxDigits: number,
  config: GeneratorConfig = {}
): number {
  const { allowZeros = true, allowLeadingZeros = false } = config

  const numDigits = randomInt(minDigits, maxDigits)
  const min = Math.pow(10, numDigits - 1) // e.g., 100 for 3 digits
  const max = Math.pow(10, numDigits) - 1 // e.g., 999 for 3 digits

  let number: number

  do {
    number = randomInt(min, max)

    // Check for leading zero constraint (shouldn't happen with our min/max, but just in case)
    if (!allowLeadingZeros && number.toString()[0] === "0") {
      continue
    }

    // Check for zeros in the number
    if (!allowZeros && number.toString().includes("0")) {
      continue
    }

    break
  } while (true)

  return number
}

/**
 * Generate a multiplication problem with specified difficulty
 */
export function generateMultiplicationProblem(
  difficulty: DifficultyLevel,
  config: GeneratorConfig = {}
): Problem {
  const constraints = MULTIPLICATION_DIFFICULTY_CONSTRAINTS[difficulty]

  let multiplicand: number
  let multiplier: number

  if (config.customRange) {
    // Use custom range if provided
    multiplicand = randomInt(config.customRange.min, config.customRange.max)
    multiplier = randomInt(config.customRange.min, config.customRange.max)
  } else {
    // Use difficulty-based constraints
    multiplicand = generateNumberWithDigits(
      constraints.multiplicand.minDigits,
      constraints.multiplicand.maxDigits,
      config
    )
    multiplier = generateNumberWithDigits(
      constraints.multiplier.minDigits,
      constraints.multiplier.maxDigits,
      config
    )
  }

  const correctAnswer = multiplicand * multiplier

  return {
    id: `gen-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    operation: "multiplication",
    operands: [multiplicand, multiplier],
    difficulty,
    correctAnswer,
  }
}

/**
 * Generate multiple problems with specified difficulty
 */
export function generateMultiplicationProblems(
  count: number,
  difficulty: DifficultyLevel,
  config: GeneratorConfig = {}
): Problem[] {
  const problems: Problem[] = []

  for (let i = 0; i < count; i++) {
    problems.push(generateMultiplicationProblem(difficulty, config))
  }

  return problems
}

/**
 * Generate a problem with specified operation and difficulty
 * (Currently only supports multiplication, will expand for division, etc.)
 */
export function generateProblem(
  operation: Operation,
  difficulty: DifficultyLevel,
  config: GeneratorConfig = {}
): Problem {
  switch (operation) {
    case "multiplication":
      return generateMultiplicationProblem(difficulty, config)
    case "division":
    case "fraction-decimal":
    case "decimal-fraction":
      throw new Error(`Problem generation for ${operation} not yet implemented`)
    default:
      throw new Error(`Unknown operation: ${operation}`)
  }
}

/**
 * Generate multiple problems with mixed difficulties
 */
export function generateMixedProblems(
  operation: Operation,
  difficulties: { difficulty: DifficultyLevel; count: number }[],
  config: GeneratorConfig = {}
): Problem[] {
  const problems: Problem[] = []

  for (const { difficulty, count } of difficulties) {
    for (let i = 0; i < count; i++) {
      problems.push(generateProblem(operation, difficulty, config))
    }
  }

  return problems
}
