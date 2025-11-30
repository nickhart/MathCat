import {
  calculateExpectedPartialProducts,
  validatePartialProducts,
  isPartialProductsComplete,
} from "@/lib/validators/multiplication-partial-products"
import { Problem } from "@/types/math"

describe("multiplication-partial-products validator", () => {
  const problem: Problem = {
    id: "test-1",
    operation: "multiplication",
    operands: [23, 45],
    difficulty: "medium",
    correctAnswer: 1035,
  }

  describe("calculateExpectedPartialProducts", () => {
    it("should calculate expected partial products for 23 × 45", () => {
      const expected = calculateExpectedPartialProducts(problem)

      // 3 × 5 = 15
      // 20 × 5 = 100
      // 3 × 40 = 120
      // 20 × 40 = 800
      // Sorted by value
      expect(expected.partials).toHaveLength(4)
      expect(expected.partials[0]).toEqual({ value: 15, label: "3 × 5" })
      expect(expected.partials[1]).toEqual({ value: 100, label: "20 × 5" })
      expect(expected.partials[2]).toEqual({ value: 120, label: "3 × 40" })
      expect(expected.partials[3]).toEqual({ value: 800, label: "20 × 40" })
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

      const expected = calculateExpectedPartialProducts(singleDigitProblem)

      // 3 × 5 = 15
      // 20 × 5 = 100
      expect(expected.partials).toHaveLength(2)
      expect(expected.partials[0]).toEqual({ value: 15, label: "3 × 5" })
      expect(expected.partials[1]).toEqual({ value: 100, label: "20 × 5" })
      expect(expected.sum).toBe(115)
    })

    it("should skip zeros in partial products", () => {
      const problemWithZero: Problem = {
        id: "test-3",
        operation: "multiplication",
        operands: [102, 305],
        difficulty: "hard",
        correctAnswer: 31110,
      }

      const expected = calculateExpectedPartialProducts(problemWithZero)

      // Should skip 0 digits
      // 2 × 5 = 10
      // 100 × 5 = 500
      // 2 × 300 = 600
      // 100 × 300 = 30000
      expect(expected.partials).toHaveLength(4)
      expect(expected.partials.map((p) => p.value)).toEqual([10, 500, 600, 30000])
      expect(expected.sum).toBe(31110)
    })

    it("should throw error for non-multiplication problems", () => {
      const divisionProblem: Problem = {
        id: "test-4",
        operation: "division",
        operands: [100, 5],
        difficulty: "medium",
        correctAnswer: 20,
      }

      expect(() => calculateExpectedPartialProducts(divisionProblem)).toThrow(
        "Partial Products validator only supports multiplication"
      )
    })
  })

  describe("validatePartialProducts", () => {
    it("should validate correct solution", () => {
      const result = validatePartialProducts(problem, {
        partials: [15, 100, 120, 800],
        sum: 1035,
      })

      expect(result.isCorrect).toBe(true)
      expect(result.errors).toBeUndefined()
    })

    it("should detect incorrect partial product", () => {
      const result = validatePartialProducts(problem, {
        partials: [10, 100, 120, 800], // First partial is wrong
        sum: 1035,
      })

      expect(result.isCorrect).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors).toHaveLength(1)
      expect(result.errors![0].field).toBe("partial-0")
      expect(result.errors![0].expected).toBe(15)
      expect(result.errors![0].actual).toBe(10)
    })

    it("should detect incorrect sum", () => {
      const result = validatePartialProducts(problem, {
        partials: [15, 100, 120, 800],
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
      const result = validatePartialProducts(problem, {
        partials: [15, null, 120, 800], // Second partial is missing
        sum: 1035,
      })

      expect(result.isCorrect).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors).toHaveLength(1)
      expect(result.errors![0].field).toBe("partial-1")
      expect(result.errors![0].message).toContain("missing")
    })

    it("should detect missing sum", () => {
      const result = validatePartialProducts(problem, {
        partials: [15, 100, 120, 800],
        sum: null,
      })

      expect(result.isCorrect).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors).toHaveLength(1)
      expect(result.errors![0].field).toBe("sum")
      expect(result.errors![0].message).toContain("missing")
    })

    it("should detect wrong number of partial products", () => {
      const result = validatePartialProducts(problem, {
        partials: [15, 100, 120], // Missing one partial
        sum: 1035,
      })

      expect(result.isCorrect).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors!.length).toBeGreaterThan(0)
      expect(result.errors![0].message).toContain("Expected 4 partial products")
    })

    it("should detect extra partial products", () => {
      const result = validatePartialProducts(problem, {
        partials: [15, 100, 120, 800, 50], // Extra partial
        sum: 1035,
      })

      expect(result.isCorrect).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors!.length).toBeGreaterThan(0)
    })

    it("should detect multiple errors", () => {
      const result = validatePartialProducts(problem, {
        partials: [10, 90, 120, 800], // Two partials wrong
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

      const result = validatePartialProducts(divisionProblem, {
        partials: [],
        sum: null,
      })

      expect(result.isCorrect).toBe(false)
      expect(result.errors).toBeDefined()
      expect(result.errors![0].field).toBe("operation")
    })
  })

  describe("isPartialProductsComplete", () => {
    it("should return true when all fields are filled", () => {
      const complete = isPartialProductsComplete(problem, {
        partials: [15, 100, 120, 800],
        sum: 1035,
      })

      expect(complete).toBe(true)
    })

    it("should return false when partial is missing", () => {
      const complete = isPartialProductsComplete(problem, {
        partials: [15, null, 120, 800],
        sum: 1035,
      })

      expect(complete).toBe(false)
    })

    it("should return false when sum is missing", () => {
      const complete = isPartialProductsComplete(problem, {
        partials: [15, 100, 120, 800],
        sum: null,
      })

      expect(complete).toBe(false)
    })

    it("should return false when wrong number of partials", () => {
      const complete = isPartialProductsComplete(problem, {
        partials: [15, 100, 120], // Missing one
        sum: 1035,
      })

      expect(complete).toBe(false)
    })
  })

  describe("edge cases", () => {
    it("should handle three-digit multiplication", () => {
      const largeProblem: Problem = {
        id: "test-6",
        operation: "multiplication",
        operands: [123, 456],
        difficulty: "bonkers",
        correctAnswer: 56088,
      }

      const expected = calculateExpectedPartialProducts(largeProblem)

      // 3 × 6 = 18
      // 20 × 6 = 120
      // 100 × 6 = 600
      // 3 × 50 = 150
      // 20 × 50 = 1000
      // 100 × 50 = 5000
      // 3 × 400 = 1200
      // 20 × 400 = 8000
      // 100 × 400 = 40000
      expect(expected.partials).toHaveLength(9)
      expect(expected.sum).toBe(56088)
    })

    it("should handle multiplication by 11", () => {
      const problem11: Problem = {
        id: "test-7",
        operation: "multiplication",
        operands: [23, 11],
        difficulty: "easy",
        correctAnswer: 253,
      }

      const expected = calculateExpectedPartialProducts(problem11)

      // 3 × 1 = 3
      // 20 × 1 = 20
      // 3 × 10 = 30
      // 20 × 10 = 200
      expect(expected.partials).toHaveLength(4)
      expect(expected.partials.map((p) => p.value)).toEqual([3, 20, 30, 200])
      expect(expected.sum).toBe(253)
    })
  })
})
