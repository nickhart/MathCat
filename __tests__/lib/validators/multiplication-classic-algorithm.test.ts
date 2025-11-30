import {
  calculateExpectedClassicAlgorithm,
  validateClassicAlgorithm,
  isClassicAlgorithmComplete,
} from "@/lib/validators/multiplication-classic-algorithm"
import { Problem } from "@/types/math"

describe("multiplication-classic-algorithm validator", () => {
  const problem: Problem = {
    id: "test-1",
    operation: "multiplication",
    operands: [23, 45],
    difficulty: "medium",
    correctAnswer: 1035,
  }

  describe("calculateExpectedClassicAlgorithm", () => {
    it("should calculate expected partial products and sum for 23 × 45", () => {
      const expected = calculateExpectedClassicAlgorithm(problem)

      // 23 × 5 = 115 (ones place)
      // 23 × 40 = 920 (tens place)
      expect(expected.partials).toEqual([115, 920])
      expect(expected.sum).toBe(1035)
    })

    it("should handle single-digit multiplier", () => {
      const singleDigitProblem: Problem = {
        id: "test-2",
        operation: "multiplication",
        operands: [23, 5],
        difficulty: "easy",
        correctAnswer: 115,
      }

      const expected = calculateExpectedClassicAlgorithm(singleDigitProblem)

      expect(expected.partials).toEqual([115])
      expect(expected.sum).toBe(115)
    })

    it("should handle three-digit multiplier", () => {
      const threeDigitProblem: Problem = {
        id: "test-3",
        operation: "multiplication",
        operands: [123, 456],
        difficulty: "bonkers",
        correctAnswer: 56088,
      }

      const expected = calculateExpectedClassicAlgorithm(threeDigitProblem)

      // 123 × 6 = 738
      // 123 × 50 = 6150
      // 123 × 400 = 49200
      expect(expected.partials).toEqual([738, 6150, 49200])
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

      expect(() => calculateExpectedClassicAlgorithm(divisionProblem)).toThrow(
        "Classic Algorithm validator only supports multiplication"
      )
    })
  })

  describe("validateClassicAlgorithm", () => {
    it("should validate correct solution", () => {
      const result = validateClassicAlgorithm(problem, {
        partials: [115, 920],
        sum: 1035,
      })

      expect(result.isCorrect).toBe(true)
      expect(result.errors).toBeUndefined()
    })

    it("should detect incorrect partial product", () => {
      const result = validateClassicAlgorithm(problem, {
        partials: [100, 920], // First partial is wrong
        sum: 1035,
      })

      expect(result.isCorrect).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors).toHaveLength(1)
      expect(result.errors![0].field).toBe("partial-0")
      expect(result.errors![0].expected).toBe(115)
      expect(result.errors![0].actual).toBe(100)
    })

    it("should detect incorrect sum", () => {
      const result = validateClassicAlgorithm(problem, {
        partials: [115, 920],
        sum: 1000, // Wrong sum
      })

      expect(result.isCorrect).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors).toHaveLength(1)
      expect(result.errors![0].field).toBe("sum")
      expect(result.errors![0].expected).toBe(1035)
      expect(result.errors![0].actual).toBe(1000)
    })

    it("should detect missing partial product", () => {
      const result = validateClassicAlgorithm(problem, {
        partials: [115, null], // Second partial is missing
        sum: 1035,
      })

      expect(result.isCorrect).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors).toHaveLength(1)
      expect(result.errors![0].field).toBe("partial-1")
      expect(result.errors![0].message).toContain("missing")
    })

    it("should detect missing sum", () => {
      const result = validateClassicAlgorithm(problem, {
        partials: [115, 920],
        sum: null,
      })

      expect(result.isCorrect).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors).toHaveLength(1)
      expect(result.errors![0].field).toBe("sum")
      expect(result.errors![0].message).toContain("missing")
    })

    it("should detect multiple errors", () => {
      const result = validateClassicAlgorithm(problem, {
        partials: [100, 900], // Both partials wrong
        sum: 1000, // Sum also wrong
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

      const result = validateClassicAlgorithm(divisionProblem, {
        partials: [],
        sum: null,
      })

      expect(result.isCorrect).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors![0].field).toBe("operation")
    })
  })

  describe("isClassicAlgorithmComplete", () => {
    it("should return true when all fields are filled", () => {
      const complete = isClassicAlgorithmComplete(problem, {
        partials: [115, 920],
        sum: 1035,
      })

      expect(complete).toBe(true)
    })

    it("should return false when partial is missing", () => {
      const complete = isClassicAlgorithmComplete(problem, {
        partials: [115, null],
        sum: 1035,
      })

      expect(complete).toBe(false)
    })

    it("should return false when sum is missing", () => {
      const complete = isClassicAlgorithmComplete(problem, {
        partials: [115, 920],
        sum: null,
      })

      expect(complete).toBe(false)
    })

    it("should return false when all fields are missing", () => {
      const complete = isClassicAlgorithmComplete(problem, {
        partials: [null, null],
        sum: null,
      })

      expect(complete).toBe(false)
    })
  })

  describe("edge cases", () => {
    it("should handle multiplication with zero in multiplier", () => {
      const problemWithZero: Problem = {
        id: "test-6",
        operation: "multiplication",
        operands: [23, 40],
        difficulty: "medium",
        correctAnswer: 920,
      }

      const expected = calculateExpectedClassicAlgorithm(problemWithZero)

      // 23 × 0 = 0 (ones place)
      // 23 × 40 = 920 (tens place)
      expect(expected.partials).toEqual([0, 920])
      expect(expected.sum).toBe(920)
    })

    it("should handle large numbers", () => {
      const largeProblem: Problem = {
        id: "test-7",
        operation: "multiplication",
        operands: [9999, 999],
        difficulty: "bonkers",
        correctAnswer: 9989001,
      }

      const expected = calculateExpectedClassicAlgorithm(largeProblem)

      // 9999 × 9 = 89991
      // 9999 × 90 = 899910
      // 9999 × 900 = 8999100
      expect(expected.partials).toEqual([89991, 899910, 8999100])
      expect(expected.sum).toBe(9989001)
    })
  })
})
