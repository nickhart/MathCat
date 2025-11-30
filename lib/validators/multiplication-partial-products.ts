import { Problem, ValidationResult, ValidationError } from "@/types/math"

/**
 * Represents a single partial product with its label
 */
export interface PartialProduct {
  /** The numeric value of the partial product */
  value: number
  /** Display label (e.g., "20 × 40") */
  label: string
}

/**
 * User inputs for Partial Products multiplication
 */
export interface PartialProductsInputs {
  /** User's partial products */
  partials: (number | null)[]
  /** Final sum */
  sum: number | null
}

/**
 * Expected values for Partial Products multiplication
 */
export interface PartialProductsExpected {
  /** Expected partial products with labels */
  partials: PartialProduct[]
  /** Expected final sum */
  sum: number
}

/**
 * Calculate expected partial products for multiplication
 */
export function calculateExpectedPartialProducts(problem: Problem): PartialProductsExpected {
  if (problem.operation !== "multiplication") {
    throw new Error("Partial Products validator only supports multiplication")
  }

  const [multiplicand, multiplier] = problem.operands
  const multiplicandStr = multiplicand.toString()
  const multiplierStr = multiplier.toString()

  const products: PartialProduct[] = []

  // Break into place values and calculate all partial products
  for (let i = multiplierStr.length - 1; i >= 0; i--) {
    const mPlierDigit = parseInt(multiplierStr[i])
    if (mPlierDigit === 0) continue
    const mPlierPlace = multiplierStr.length - 1 - i

    for (let j = multiplicandStr.length - 1; j >= 0; j--) {
      const mCandDigit = parseInt(multiplicandStr[j])
      if (mCandDigit === 0) continue
      const mCandPlace = multiplicandStr.length - 1 - j

      const value = mCandDigit * mPlierDigit * Math.pow(10, mCandPlace + mPlierPlace)
      const mCandValue = mCandDigit * Math.pow(10, mCandPlace)
      const mPlierValue = mPlierDigit * Math.pow(10, mPlierPlace)

      products.push({
        value,
        label: `${mCandValue} × ${mPlierValue}`,
      })
    }
  }

  // Sort by value (smallest to largest) for consistent ordering
  products.sort((a, b) => a.value - b.value)

  const sum = multiplicand * multiplier

  return { partials: products, sum }
}

/**
 * Validate Partial Products multiplication solution
 */
export function validatePartialProducts(
  problem: Problem,
  inputs: PartialProductsInputs
): ValidationResult {
  if (problem.operation !== "multiplication") {
    return {
      isCorrect: false,
      errors: [
        {
          field: "operation",
          expected: "multiplication",
          actual: problem.operation,
          message: "Partial Products validator only supports multiplication",
        },
      ],
    }
  }

  const expected = calculateExpectedPartialProducts(problem)
  const errors: ValidationError[] = []

  // Check if user has the correct number of partial products
  if (inputs.partials.length !== expected.partials.length) {
    errors.push({
      field: "partials",
      expected: expected.partials.length,
      actual: inputs.partials.length,
      message: `Expected ${expected.partials.length} partial products, got ${inputs.partials.length}`,
    })
  }

  // Validate each partial product
  const maxLength = Math.max(inputs.partials.length, expected.partials.length)
  for (let i = 0; i < maxLength; i++) {
    const userPartial = inputs.partials[i]
    const expectedPartial = expected.partials[i]

    if (expectedPartial === undefined) {
      // User has more partials than expected
      errors.push({
        field: `partial-${i}`,
        expected: "none",
        actual: userPartial,
        message: `Extra partial product at position ${i + 1}`,
      })
    } else if (userPartial === null || userPartial === undefined) {
      errors.push({
        field: `partial-${i}`,
        expected: expectedPartial.value,
        actual: userPartial,
        message: `Partial product ${i + 1} (${expectedPartial.label}) is missing`,
      })
    } else if (userPartial !== expectedPartial.value) {
      errors.push({
        field: `partial-${i}`,
        expected: expectedPartial.value,
        actual: userPartial,
        message: `Partial product ${i + 1} (${expectedPartial.label}) is incorrect`,
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
 * Check if Partial Products solution is complete (all fields filled)
 */
export function isPartialProductsComplete(
  problem: Problem,
  inputs: PartialProductsInputs
): boolean {
  const expected = calculateExpectedPartialProducts(problem)

  // Check all partials are filled
  const allPartialsFilled =
    inputs.partials.length === expected.partials.length &&
    inputs.partials.every((partial) => partial !== null && partial !== undefined)

  // Check sum is filled
  const sumFilled = inputs.sum !== null && inputs.sum !== undefined

  return allPartialsFilled && sumFilled
}
