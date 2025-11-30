import {
  generateMultiplicationProblem,
  generateMultiplicationProblems,
  generateProblem,
  generateMixedProblems,
} from "@/lib/generators/problem-generator"
import { DifficultyLevel } from "@/types/math"

describe("problem-generator", () => {
  describe("generateMultiplicationProblem", () => {
    describe("easy difficulty", () => {
      it("should generate 2×1 digit problems", () => {
        for (let i = 0; i < 10; i++) {
          const problem = generateMultiplicationProblem("easy")

          expect(problem.operation).toBe("multiplication")
          expect(problem.difficulty).toBe("easy")
          expect(problem.operands).toHaveLength(2)

          const [multiplicand, multiplier] = problem.operands

          // 2 digit multiplicand (10-99)
          expect(multiplicand).toBeGreaterThanOrEqual(10)
          expect(multiplicand).toBeLessThanOrEqual(99)

          // 1 digit multiplier (1-9)
          expect(multiplier).toBeGreaterThanOrEqual(1)
          expect(multiplier).toBeLessThanOrEqual(9)

          // Correct answer
          expect(problem.correctAnswer).toBe(multiplicand * multiplier)
        }
      })
    })

    describe("medium difficulty", () => {
      it("should generate 2×2 digit problems", () => {
        for (let i = 0; i < 10; i++) {
          const problem = generateMultiplicationProblem("medium")

          expect(problem.operation).toBe("multiplication")
          expect(problem.difficulty).toBe("medium")

          const [multiplicand, multiplier] = problem.operands

          // Both 2 digits (10-99)
          expect(multiplicand).toBeGreaterThanOrEqual(10)
          expect(multiplicand).toBeLessThanOrEqual(99)
          expect(multiplier).toBeGreaterThanOrEqual(10)
          expect(multiplier).toBeLessThanOrEqual(99)

          expect(problem.correctAnswer).toBe(multiplicand * multiplier)
        }
      })
    })

    describe("hard difficulty", () => {
      it("should generate 3×2 digit problems", () => {
        for (let i = 0; i < 10; i++) {
          const problem = generateMultiplicationProblem("hard")

          expect(problem.operation).toBe("multiplication")
          expect(problem.difficulty).toBe("hard")

          const [multiplicand, multiplier] = problem.operands

          // 3 digit multiplicand (100-999)
          expect(multiplicand).toBeGreaterThanOrEqual(100)
          expect(multiplicand).toBeLessThanOrEqual(999)

          // 2 digit multiplier (10-99)
          expect(multiplier).toBeGreaterThanOrEqual(10)
          expect(multiplier).toBeLessThanOrEqual(99)

          expect(problem.correctAnswer).toBe(multiplicand * multiplier)
        }
      })
    })

    describe("bonkers difficulty", () => {
      it("should generate 3-4×3 digit problems", () => {
        for (let i = 0; i < 10; i++) {
          const problem = generateMultiplicationProblem("bonkers")

          expect(problem.operation).toBe("multiplication")
          expect(problem.difficulty).toBe("bonkers")

          const [multiplicand, multiplier] = problem.operands

          // 3-4 digit multiplicand (100-9999)
          expect(multiplicand).toBeGreaterThanOrEqual(100)
          expect(multiplicand).toBeLessThanOrEqual(9999)

          // 3 digit multiplier (100-999)
          expect(multiplier).toBeGreaterThanOrEqual(100)
          expect(multiplier).toBeLessThanOrEqual(999)

          expect(problem.correctAnswer).toBe(multiplicand * multiplier)
        }
      })
    })

    describe("allowZeros config", () => {
      it("should allow zeros when allowZeros is true", () => {
        // Run multiple times to increase chance of getting a zero
        let foundZero = false
        for (let i = 0; i < 100; i++) {
          const problem = generateMultiplicationProblem("medium", { allowZeros: true })
          const [multiplicand, multiplier] = problem.operands

          if (multiplicand.toString().includes("0") || multiplier.toString().includes("0")) {
            foundZero = true
            break
          }
        }

        // Note: This test might occasionally fail due to randomness
        // but with 100 iterations it should almost always pass
        expect(foundZero).toBe(true)
      })

      it("should not include zeros when allowZeros is false", () => {
        for (let i = 0; i < 20; i++) {
          const problem = generateMultiplicationProblem("medium", { allowZeros: false })
          const [multiplicand, multiplier] = problem.operands

          expect(multiplicand.toString()).not.toContain("0")
          expect(multiplier.toString()).not.toContain("0")
        }
      })
    })

    describe("customRange config", () => {
      it("should respect custom range", () => {
        for (let i = 0; i < 10; i++) {
          const problem = generateMultiplicationProblem("easy", {
            customRange: { min: 5, max: 15 },
          })

          const [multiplicand, multiplier] = problem.operands

          expect(multiplicand).toBeGreaterThanOrEqual(5)
          expect(multiplicand).toBeLessThanOrEqual(15)
          expect(multiplier).toBeGreaterThanOrEqual(5)
          expect(multiplier).toBeLessThanOrEqual(15)
        }
      })
    })

    it("should generate unique problem IDs", () => {
      const problem1 = generateMultiplicationProblem("easy")
      const problem2 = generateMultiplicationProblem("easy")

      expect(problem1.id).toBeDefined()
      expect(problem2.id).toBeDefined()
      expect(problem1.id).not.toBe(problem2.id)
    })
  })

  describe("generateMultiplicationProblems", () => {
    it("should generate the specified number of problems", () => {
      const problems = generateMultiplicationProblems(5, "medium")

      expect(problems).toHaveLength(5)
      problems.forEach((problem) => {
        expect(problem.operation).toBe("multiplication")
        expect(problem.difficulty).toBe("medium")
      })
    })

    it("should generate unique problems", () => {
      const problems = generateMultiplicationProblems(10, "easy")
      const ids = problems.map((p) => p.id)
      const uniqueIds = new Set(ids)

      expect(uniqueIds.size).toBe(10)
    })
  })

  describe("generateProblem", () => {
    it("should generate multiplication problems", () => {
      const problem = generateProblem("multiplication", "medium")

      expect(problem.operation).toBe("multiplication")
      expect(problem.difficulty).toBe("medium")
    })

    it("should throw error for unsupported operations", () => {
      expect(() => generateProblem("division", "easy")).toThrow(
        "Problem generation for division not yet implemented"
      )
    })
  })

  describe("generateMixedProblems", () => {
    it("should generate mixed difficulty problems", () => {
      const problems = generateMixedProblems("multiplication", [
        { difficulty: "easy", count: 2 },
        { difficulty: "medium", count: 3 },
        { difficulty: "hard", count: 1 },
      ])

      expect(problems).toHaveLength(6)

      const easyProblems = problems.filter((p) => p.difficulty === "easy")
      const mediumProblems = problems.filter((p) => p.difficulty === "medium")
      const hardProblems = problems.filter((p) => p.difficulty === "hard")

      expect(easyProblems).toHaveLength(2)
      expect(mediumProblems).toHaveLength(3)
      expect(hardProblems).toHaveLength(1)
    })
  })
})
