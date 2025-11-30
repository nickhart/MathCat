import { Problem, ValidationResult, ValidationError } from "@/types/math"

/**
 * User inputs for Classic Algorithm multiplication
 */
export interface ClassicAlgorithmInputs {
  /** Partial products (one for each multiplier digit) */
  partials: (number | null)[]
  /** Final sum */
  sum: number | null
  /** Optional: carry digits for each partial product row */
  partialCarries?: (number[] | null)[]
  /** Optional: carry digits for the final sum */
  sumCarries?: number[] | null
}

/**
 * Expected values for Classic Algorithm multiplication
 */
export interface ClassicAlgorithmExpected {
  /** Expected partial products */
  partials: number[]
  /** Expected final sum */
  sum: number
}

/**
 * Calculate expected values for Classic Algorithm multiplication
 */
export function calculateExpectedClassicAlgorithm(problem: Problem): ClassicAlgorithmExpected {
  if (problem.operation !== "multiplication") {
    throw new Error("Classic Algorithm validator only supports multiplication")
  }

  const [multiplicand, multiplier] = problem.operands

  // Get multiplier digits from right to left
  const getMultiplierDigits = (): number[] => {
    const digits: number[] = []
    let n = multiplier
    while (n > 0) {
      digits.push(n % 10)
      n = Math.floor(n / 10)
    }
    return digits.length > 0 ? digits : [0]
  }

  const multiplierDigits = getMultiplierDigits()

  // Calculate expected partial products
  const partials = multiplierDigits.map(
    (digit, index) => multiplicand * digit * Math.pow(10, index)
  )

  const sum = multiplicand * multiplier

  return { partials, sum }
}

/**
 * Validate Classic Algorithm multiplication solution
 */
export function validateClassicAlgorithm(
  problem: Problem,
  inputs: ClassicAlgorithmInputs
): ValidationResult {
  if (problem.operation !== "multiplication") {
    return {
      isCorrect: false,
      errors: [
        {
          field: "operation",
          expected: "multiplication",
          actual: problem.operation,
          message: "Classic Algorithm validator only supports multiplication",
        },
      ],
    }
  }

  const expected = calculateExpectedClassicAlgorithm(problem)
  const errors: ValidationError[] = []

  // Validate each partial product
  for (let i = 0; i < expected.partials.length; i++) {
    const userPartial = inputs.partials[i]
    const expectedPartial = expected.partials[i]

    if (userPartial === null || userPartial === undefined) {
      errors.push({
        field: `partial-${i}`,
        expected: expectedPartial,
        actual: userPartial,
        message: `Partial product ${i + 1} is missing`,
      })
    } else if (userPartial !== expectedPartial) {
      errors.push({
        field: `partial-${i}`,
        expected: expectedPartial,
        actual: userPartial,
        message: `Partial product ${i + 1} is incorrect`,
      })
    }
  }

  // Validate final sum
  if (inputs.sum === null || inputs.sum === undefined) {
    errors.push({
      field: "sum",
      expected: expected.sum,
      actual: inputs.sum,
      message: "Sum is missing",
    })
  } else if (inputs.sum !== expected.sum) {
    errors.push({
      field: "sum",
      expected: expected.sum,
      actual: inputs.sum,
      message: "Sum is incorrect",
    })
  }

  return {
    isCorrect: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined,
  }
}

/**
 * Check if Classic Algorithm solution is complete (all fields filled)
 */
export function isClassicAlgorithmComplete(
  problem: Problem,
  inputs: ClassicAlgorithmInputs
): boolean {
  const expected = calculateExpectedClassicAlgorithm(problem)

  // Check all partials are filled
  const allPartialsFilled = inputs.partials.every(
    (partial, i) => i < expected.partials.length && partial !== null && partial !== undefined
  )

  // Check sum is filled
  const sumFilled = inputs.sum !== null && inputs.sum !== undefined

  return allPartialsFilled && sumFilled
}
