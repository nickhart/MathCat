import { Problem, ValidationResult, ValidationError } from "@/types/math"

/**
 * Represents a single cell in the area model grid
 */
export interface AreaModelCell {
  /** Row index */
  row: number
  /** Column index */
  col: number
  /** Row header value (place value from multiplier) */
  rowValue: number
  /** Column header value (place value from multiplicand) */
  colValue: number
  /** Expected product for this cell */
  expected: number
}

/**
 * User inputs for Area Model multiplication
 */
export interface AreaModelInputs {
  /** Cell values (keyed by "row-col") */
  cells: Record<string, number | null>
  /** Final sum */
  sum: number | null
}

/**
 * Expected values for Area Model multiplication
 */
export interface AreaModelExpected {
  /** Expected grid cells with their values */
  cells: AreaModelCell[]
  /** Place value components for multiplicand */
  multiplicandParts: number[]
  /** Place value components for multiplier */
  multiplierParts: number[]
  /** Expected final sum */
  sum: number
}

/**
 * Break a number into place value components
 * Example: 123 → [100, 20, 3]
 */
export function getPlaceValueComponents(num: number): number[] {
  const components: number[] = []
  let place = 0
  let n = num

  while (n > 0) {
    const digit = n % 10
    if (digit > 0) {
      components.unshift(digit * Math.pow(10, place))
    }
    n = Math.floor(n / 10)
    place++
  }

  return components.length > 0 ? components : [0]
}

/**
 * Calculate expected area model grid for multiplication
 */
export function calculateExpectedAreaModel(problem: Problem): AreaModelExpected {
  if (problem.operation !== "multiplication") {
    throw new Error("Area Model validator only supports multiplication")
  }

  const [multiplicand, multiplier] = problem.operands

  const multiplicandParts = getPlaceValueComponents(multiplicand)
  const multiplierParts = getPlaceValueComponents(multiplier)

  // Create grid cells
  const cells: AreaModelCell[] = []

  multiplierParts.forEach((rowValue, rowIndex) => {
    multiplicandParts.forEach((colValue, colIndex) => {
      cells.push({
        row: rowIndex,
        col: colIndex,
        rowValue,
        colValue,
        expected: rowValue * colValue,
      })
    })
  })

  const sum = multiplicand * multiplier

  return {
    cells,
    multiplicandParts,
    multiplierParts,
    sum,
  }
}

/**
 * Validate Area Model multiplication solution
 */
export function validateAreaModel(problem: Problem, inputs: AreaModelInputs): ValidationResult {
  if (problem.operation !== "multiplication") {
    return {
      isCorrect: false,
      errors: [
        {
          field: "operation",
          expected: "multiplication",
          actual: problem.operation,
          message: "Area Model validator only supports multiplication",
        },
      ],
    }
  }

  const expected = calculateExpectedAreaModel(problem)
  const errors: ValidationError[] = []

  // Validate each cell
  for (const cell of expected.cells) {
    const key = `${cell.row}-${cell.col}`
    const userValue = inputs.cells[key]

    if (userValue === null || userValue === undefined) {
      errors.push({
        field: `cell-${key}`,
        expected: cell.expected,
        actual: userValue,
        message: `Cell (${cell.rowValue} × ${cell.colValue}) is missing`,
      })
    } else if (userValue !== cell.expected) {
      errors.push({
        field: `cell-${key}`,
        expected: cell.expected,
        actual: userValue,
        message: `Cell (${cell.rowValue} × ${cell.colValue}) is incorrect`,
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
 * Check if Area Model solution is complete (all fields filled)
 */
export function isAreaModelComplete(problem: Problem, inputs: AreaModelInputs): boolean {
  const expected = calculateExpectedAreaModel(problem)

  // Check all cells are filled
  const allCellsFilled = expected.cells.every((cell) => {
    const key = `${cell.row}-${cell.col}`
    const value = inputs.cells[key]
    return value !== null && value !== undefined
  })

  // Check sum is filled
  const sumFilled = inputs.sum !== null && inputs.sum !== undefined

  return allCellsFilled && sumFilled
}
