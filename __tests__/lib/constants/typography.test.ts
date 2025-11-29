import { MATH_TYPOGRAPHY } from "@/lib/constants/typography"

describe("typography", () => {
  describe("MATH_TYPOGRAPHY", () => {
    it("should have fontFamily defined", () => {
      expect(MATH_TYPOGRAPHY.fontFamily).toBeDefined()
      expect(typeof MATH_TYPOGRAPHY.fontFamily).toBe("string")
      expect(MATH_TYPOGRAPHY.fontFamily).toContain("JetBrains Mono")
    })

    it("should have fontSize object with main, carry, and label", () => {
      expect(MATH_TYPOGRAPHY.fontSize).toBeDefined()
      expect(MATH_TYPOGRAPHY.fontSize.main).toBe("18px")
      expect(MATH_TYPOGRAPHY.fontSize.carry).toBe("12px")
      expect(MATH_TYPOGRAPHY.fontSize.label).toBe("14px")
    })

    it("should have padding object with main and carry", () => {
      expect(MATH_TYPOGRAPHY.padding).toBeDefined()
      expect(MATH_TYPOGRAPHY.padding.main).toBe("0.75rem")
      expect(MATH_TYPOGRAPHY.padding.carry).toBe("0.25rem")
    })
  })
})
