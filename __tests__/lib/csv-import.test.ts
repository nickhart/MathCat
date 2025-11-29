import { parseCSVToWorksheet, generateExampleCSV } from "@/lib/csv-import"

describe("csv-import", () => {
  describe("parseCSVToWorksheet", () => {
    it("should parse valid CSV with header", () => {
      const csv = `section,operand1,operand2,difficulty
Two-Digit,12,3,easy
Two-Digit,45,7,medium`

      const worksheet = parseCSVToWorksheet(csv, "Test Worksheet", "Description")

      expect(worksheet).toBeDefined()
      expect(worksheet?.title).toBe("Test Worksheet")
      expect(worksheet?.description).toBe("Description")
      expect(worksheet?.problems).toHaveLength(2)
      expect(worksheet?.sections).toHaveLength(1)
      expect(worksheet?.sections?.[0].title).toBe("Two-Digit")
      expect(worksheet?.sections?.[0].problems).toHaveLength(2)
    })

    it("should parse valid CSV without header", () => {
      const csv = `Two-Digit,12,3,easy
Two-Digit,45,7,medium`

      const worksheet = parseCSVToWorksheet(csv, "Test Worksheet")

      expect(worksheet).toBeDefined()
      expect(worksheet?.problems).toHaveLength(2)
    })

    it("should handle multiple sections", () => {
      const csv = `section,operand1,operand2,difficulty
Easy,12,3,easy
Easy,15,4,easy
Hard,234,56,hard`

      const worksheet = parseCSVToWorksheet(csv, "Test Worksheet")

      expect(worksheet?.sections).toHaveLength(2)
      expect(worksheet?.sections?.[0].title).toBe("Easy")
      expect(worksheet?.sections?.[0].problems).toHaveLength(2)
      expect(worksheet?.sections?.[1].title).toBe("Hard")
      expect(worksheet?.sections?.[1].problems).toHaveLength(1)
    })

    it("should calculate correct answers", () => {
      const csv = `section,operand1,operand2,difficulty
Test,12,3,easy`

      const worksheet = parseCSVToWorksheet(csv, "Test Worksheet")

      expect(worksheet?.problems[0].correctAnswer).toBe(36)
    })

    it("should use default difficulty when not provided", () => {
      const csv = `section,operand1,operand2
Test,12,3`

      const worksheet = parseCSVToWorksheet(csv, "Test Worksheet")

      expect(worksheet?.problems[0].difficulty).toBe("medium")
    })

    it("should skip invalid rows", () => {
      const csv = `section,operand1,operand2,difficulty
Test,12,3,easy
Test,invalid,7,medium
Test,45,8,hard`

      const worksheet = parseCSVToWorksheet(csv, "Test Worksheet")

      expect(worksheet?.problems).toHaveLength(2)
    })

    it("should return null for empty CSV", () => {
      const worksheet = parseCSVToWorksheet("", "Test Worksheet")

      expect(worksheet).toBeNull()
    })

    it("should return null for CSV with no valid rows", () => {
      const csv = `section,operand1,operand2
Test,invalid,text`

      const worksheet = parseCSVToWorksheet(csv, "Test Worksheet")

      expect(worksheet).toBeNull()
    })

    it("should include worksheet settings", () => {
      const csv = `section,operand1,operand2,difficulty
Test,12,3,easy`

      const worksheet = parseCSVToWorksheet(csv, "Test Worksheet")

      expect(worksheet?.settings).toBeDefined()
      expect(worksheet?.settings.showMethodSelector).toBe(true)
      expect(worksheet?.settings.showValidation).toBe(true)
      expect(worksheet?.settings.showAllCells).toBe(false)
      expect(worksheet?.settings.showPlaceholderZeros).toBe(false)
    })

    it("should handle edge case with single problem", () => {
      const csv = `section,operand1,operand2,difficulty
Test,99,99,hard`

      const worksheet = parseCSVToWorksheet(csv, "Single Problem")

      expect(worksheet).toBeDefined()
      expect(worksheet?.problems).toHaveLength(1)
      expect(worksheet?.problems[0].correctAnswer).toBe(9801)
      expect(worksheet?.problems[0].difficulty).toBe("hard")
    })

    it("should trim whitespace from values", () => {
      const csv = `section,operand1,operand2,difficulty
  Test  ,  12  ,  3  ,  easy  `

      const worksheet = parseCSVToWorksheet(csv, "Whitespace Test")

      expect(worksheet?.sections?.[0].title).toBe("Test")
      expect(worksheet?.problems[0].operands).toEqual([12, 3])
      expect(worksheet?.problems[0].difficulty).toBe("easy")
    })
  })

  describe("generateExampleCSV", () => {
    it("should generate valid CSV example", () => {
      const csv = generateExampleCSV()

      expect(csv).toContain("section,operand1,operand2,difficulty")
      expect(csv).toContain("Two-Digit by One-Digit")
      expect(csv).toContain("Two-Digit by Two-Digit")
      expect(csv).toContain("Three-Digit by Two-Digit")
    })

    it("should be parseable", () => {
      const csv = generateExampleCSV()
      const worksheet = parseCSVToWorksheet(csv, "Example")

      expect(worksheet).toBeDefined()
      expect(worksheet?.problems.length).toBeGreaterThan(0)
    })
  })
})
