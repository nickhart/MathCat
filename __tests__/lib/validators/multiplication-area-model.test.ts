import {
  getPlaceValueComponents,
  calculateExpectedAreaModel,
  validateAreaModel,
  isAreaModelComplete,
} from "@/lib/validators/multiplication-area-model"
import { Problem } from "@/types/math"

describe("multiplication-area-model validator", () => {
  const problem: Problem = {
    id: "test-1",
    operation: "multiplication",
    operands: [23, 45],
    difficulty: "medium",
    correctAnswer: 1035,
  }

  describe("getPlaceValueComponents", () => {
    it("should break 23 into [20, 3]", () => {
      expect(getPlaceValueComponents(23)).toEqual([20, 3])
    })

    it("should break 45 into [40, 5]", () => {
      expect(getPlaceValueComponents(45)).toEqual([40, 5])
    })

    it("should break 123 into [100, 20, 3]", () => {
      expect(getPlaceValueComponents(123)).toEqual([100, 20, 3])
    })

    it("should handle numbers with zeros", () => {
      expect(getPlaceValueComponents(102)).toEqual([100, 2])
      expect(getPlaceValueComponents(305)).toEqual([300, 5])
    })

    it("should handle single digit", () => {
      expect(getPlaceValueComponents(7)).toEqual([7])
    })

    it("should handle zero", () => {
      expect(getPlaceValueComponents(0)).toEqual([0])
    })
  })

  describe("calculateExpectedAreaModel", () => {
    it("should calculate expected cells for 23 × 45", () => {
      const expected = calculateExpectedAreaModel(problem)

      expect(expected.multiplicandParts).toEqual([20, 3])
      expect(expected.multiplierParts).toEqual([40, 5])
      expect(expected.sum).toBe(1035)

      // Should have 2x2 = 4 cells
      expect(expected.cells).toHaveLength(4)

      // Check each cell
      // Row 0, Col 0: 40 × 20 = 800
      expect(expected.cells[0]).toEqual({
        row: 0,
        col: 0,
        rowValue: 40,
        colValue: 20,
        expected: 800,
      })

      // Row 0, Col 1: 40 × 3 = 120
      expect(expected.cells[1]).toEqual({
        row: 0,
        col: 1,
        rowValue: 40,
        colValue: 3,
        expected: 120,
      })

      // Row 1, Col 0: 5 × 20 = 100
      expect(expected.cells[2]).toEqual({
        row: 1,
        col: 0,
        rowValue: 5,
        colValue: 20,
        expected: 100,
      })

      // Row 1, Col 1: 5 × 3 = 15
      expect(expected.cells[3]).toEqual({
        row: 1,
        col: 1,
        rowValue: 5,
        colValue: 3,
        expected: 15,
      })
    })

    it("should handle single-digit multiplier", () => {
      const singleDigitProblem: Problem = {
        id: "test-2",
        operation: "multiplication",
        operands: [23, 5],
        difficulty: "easy",
        correctAnswer: 115,
      }

      const expected = calculateExpectedAreaModel(singleDigitProblem)

      expect(expected.multiplicandParts).toEqual([20, 3])
      expect(expected.multiplierParts).toEqual([5])

      // Should have 1x2 = 2 cells
      expect(expected.cells).toHaveLength(2)
      expect(expected.cells[0].expected).toBe(100) // 5 × 20
      expect(expected.cells[1].expected).toBe(15) // 5 × 3
      expect(expected.sum).toBe(115)
    })

    it("should handle three-digit multiplication", () => {
      const largeProblem: Problem = {
        id: "test-3",
        operation: "multiplication",
        operands: [123, 456],
        difficulty: "bonkers",
        correctAnswer: 56088,
      }

      const expected = calculateExpectedAreaModel(largeProblem)

      expect(expected.multiplicandParts).toEqual([100, 20, 3])
      expect(expected.multiplierParts).toEqual([400, 50, 6])

      // Should have 3x3 = 9 cells
      expect(expected.cells).toHaveLength(9)
      expect(expected.sum).toBe(56088)
    })

    it("should throw error for non-multiplication problems", () => {
      const divisionProblem: Problem = {
        id: "test-4",
        operation: "division",
        operands: [100, 5],
        difficulty: "medium",
        correctAnswer: 20,
      }

      expect(() => calculateExpectedAreaModel(divisionProblem)).toThrow(
        "Area Model validator only supports multiplication"
      )
    })
  })

  describe("validateAreaModel", () => {
    it("should validate correct solution", () => {
      const result = validateAreaModel(problem, {
        cells: {
          "0-0": 800,
          "0-1": 120,
          "1-0": 100,
          "1-1": 15,
        },
        sum: 1035,
      })

      expect(result.isCorrect).toBe(true)
      expect(result.errors).toBeUndefined()
    })

    it("should detect incorrect cell value", () => {
      const result = validateAreaModel(problem, {
        cells: {
          "0-0": 700, // Wrong value
          "0-1": 120,
          "1-0": 100,
          "1-1": 15,
        },
        sum: 1035,
      })

      expect(result.isCorrect).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors).toHaveLength(1)
      expect(result.errors![0].field).toBe("cell-0-0")
      expect(result.errors![0].expected).toBe(800)
      expect(result.errors![0].actual).toBe(700)
    })

    it("should detect incorrect sum", () => {
      const result = validateAreaModel(problem, {
        cells: {
          "0-0": 800,
          "0-1": 120,
          "1-0": 100,
          "1-1": 15,
        },
        sum: 1000, // Wrong sum
      })

      expect(result.isCorrect).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors).toHaveLength(1)
      expect(result.errors![0].field).toBe("sum")
      expect(result.errors![0].expected).toBe(1035)
      expect(result.errors![0].actual).toBe(1000)
    })

    it("should detect missing cell", () => {
      const result = validateAreaModel(problem, {
        cells: {
          "0-0": 800,
          "0-1": 120,
          "1-0": 100,
          // "1-1" is missing
        },
        sum: 1035,
      })

      expect(result.isCorrect).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors).toHaveLength(1)
      expect(result.errors![0].field).toBe("cell-1-1")
      expect(result.errors![0].message).toContain("missing")
    })

    it("should detect missing sum", () => {
      const result = validateAreaModel(problem, {
        cells: {
          "0-0": 800,
          "0-1": 120,
          "1-0": 100,
          "1-1": 15,
        },
        sum: null,
      })

      expect(result.isCorrect).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors).toHaveLength(1)
      expect(result.errors![0].field).toBe("sum")
      expect(result.errors![0].message).toContain("missing")
    })

    it("should detect multiple errors", () => {
      const result = validateAreaModel(problem, {
        cells: {
          "0-0": 700, // Wrong
          "0-1": 100, // Wrong
          "1-0": 100,
          "1-1": 15,
        },
        sum: 1000, // Wrong
      })

      expect(result.isCorrect).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors).toHaveLength(3)
    })

    it("should return error for non-multiplication operation", () => {
      const divisionProblem: Problem = {
        id: "test-5",
        operation: "division",
        operands: [100, 5],
        difficulty: "medium",
        correctAnswer: 20,
      }

      const result = validateAreaModel(divisionProblem, {
        cells: {},
        sum: null,
      })

      expect(result.isCorrect).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors![0].field).toBe("operation")
    })
  })

  describe("isAreaModelComplete", () => {
    it("should return true when all fields are filled", () => {
      const complete = isAreaModelComplete(problem, {
        cells: {
          "0-0": 800,
          "0-1": 120,
          "1-0": 100,
          "1-1": 15,
        },
        sum: 1035,
      })

      expect(complete).toBe(true)
    })

    it("should return false when cell is missing", () => {
      const complete = isAreaModelComplete(problem, {
        cells: {
          "0-0": 800,
          "0-1": 120,
          "1-0": 100,
          // "1-1" is missing
        },
        sum: 1035,
      })

      expect(complete).toBe(false)
    })

    it("should return false when sum is missing", () => {
      const complete = isAreaModelComplete(problem, {
        cells: {
          "0-0": 800,
          "0-1": 120,
          "1-0": 100,
          "1-1": 15,
        },
        sum: null,
      })

      expect(complete).toBe(false)
    })

    it("should return false when all fields are missing", () => {
      const complete = isAreaModelComplete(problem, {
        cells: {},
        sum: null,
      })

      expect(complete).toBe(false)
    })
  })

  describe("edge cases", () => {
    it("should handle multiplication with zeros", () => {
      const problemWithZero: Problem = {
        id: "test-6",
        operation: "multiplication",
        operands: [102, 305],
        difficulty: "hard",
        correctAnswer: 31110,
      }

      const expected = calculateExpectedAreaModel(problemWithZero)

      // 102 → [100, 2], 305 → [300, 5]
      expect(expected.multiplicandParts).toEqual([100, 2])
      expect(expected.multiplierParts).toEqual([300, 5])

      // Should have 2x2 = 4 cells
      expect(expected.cells).toHaveLength(4)
      expect(expected.sum).toBe(31110)
    })

    it("should handle large numbers", () => {
      const largeProblem: Problem = {
        id: "test-7",
        operation: "multiplication",
        operands: [9999, 999],
        difficulty: "bonkers",
        correctAnswer: 9989001,
      }

      const expected = calculateExpectedAreaModel(largeProblem)

      // 9999 → [9000, 900, 90, 9]
      // 999 → [900, 90, 9]
      expect(expected.multiplicandParts).toEqual([9000, 900, 90, 9])
      expect(expected.multiplierParts).toEqual([900, 90, 9])

      // Should have 4x3 = 12 cells
      expect(expected.cells).toHaveLength(12)
      expect(expected.sum).toBe(9989001)
    })
  })
})
