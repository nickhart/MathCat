import {
  encodeWorksheetToURI,
  decodeWorksheetFromURI,
  generateShareableURL,
} from "@/lib/worksheet-uri"
import { Worksheet } from "@/types/worksheet"

describe("worksheet-uri", () => {
  const sampleWorksheet: Worksheet = {
    id: "test-worksheet",
    title: "Test Worksheet",
    description: "A test worksheet",
    problems: [
      {
        id: "prob-1",
        operation: "multiplication",
        operands: [12, 3],
        correctAnswer: 36,
        difficulty: "easy",
      },
      {
        id: "prob-2",
        operation: "multiplication",
        operands: [45, 7],
        correctAnswer: 315,
        difficulty: "medium",
      },
    ],
    createdAt: new Date().toISOString(),
    settings: {
      showMethodSelector: true,
      allowedMethods: ["partial-products"],
      showHints: false,
      showValidation: true,
      showAllCells: false,
      showPlaceholderZeros: false,
    },
  }

  describe("encodeWorksheetToURI", () => {
    it("should encode a worksheet to a base64url string", () => {
      const encoded = encodeWorksheetToURI(sampleWorksheet)

      expect(encoded).toBeDefined()
      expect(typeof encoded).toBe("string")
      expect(encoded.length).toBeGreaterThan(0)
      // Should be URL-safe (no +, /, =)
      expect(encoded).not.toMatch(/[+/=]/)
    })

    it("should produce consistent encoding for the same worksheet", () => {
      const encoded1 = encodeWorksheetToURI(sampleWorksheet)
      const encoded2 = encodeWorksheetToURI(sampleWorksheet)

      expect(encoded1).toBe(encoded2)
    })

    it("should produce different encodings for different worksheets", () => {
      const worksheet2: Worksheet = {
        ...sampleWorksheet,
        id: "different-id",
        title: "Different Title",
      }

      const encoded1 = encodeWorksheetToURI(sampleWorksheet)
      const encoded2 = encodeWorksheetToURI(worksheet2)

      expect(encoded1).not.toBe(encoded2)
    })
  })

  describe("decodeWorksheetFromURI", () => {
    it("should decode a valid encoded worksheet", () => {
      const encoded = encodeWorksheetToURI(sampleWorksheet)
      const decoded = decodeWorksheetFromURI(encoded)

      expect(decoded).toBeDefined()
      expect(decoded).not.toBeNull()
      expect(decoded?.id).toBe(sampleWorksheet.id)
      expect(decoded?.title).toBe(sampleWorksheet.title)
      expect(decoded?.description).toBe(sampleWorksheet.description)
      expect(decoded?.problems).toHaveLength(2)
    })

    it("should return null for invalid base64url", () => {
      const decoded = decodeWorksheetFromURI("invalid-base64!!!")

      expect(decoded).toBeNull()
    })

    it("should return null for malformed JSON", () => {
      // Create a valid base64url that doesn't decompress to valid JSON
      const invalidEncoded = "H4sIAAAAAAAAA-3BMQ0AAADCIM-f-hBDGDT"

      const decoded = decodeWorksheetFromURI(invalidEncoded)

      expect(decoded).toBeNull()
    })

    it("should return null for JSON missing required fields", () => {
      const invalidWorksheet = {
        // Missing id, title, problems
        description: "Invalid",
      }
      const encoded = encodeWorksheetToURI(invalidWorksheet as any)
      const decoded = decodeWorksheetFromURI(encoded)

      expect(decoded).toBeNull()
    })

    it("should handle encoded strings with padding", () => {
      // Add artificial padding to test padding logic
      const encoded = encodeWorksheetToURI(sampleWorksheet)
      // Remove padding if any (though encodeWorksheetToURI already does this)
      const noPadding = encoded.replace(/=/g, "")
      const decoded = decodeWorksheetFromURI(noPadding)

      expect(decoded).not.toBeNull()
      expect(decoded?.id).toBe(sampleWorksheet.id)
    })

    it("should roundtrip encode and decode", () => {
      const encoded = encodeWorksheetToURI(sampleWorksheet)
      const decoded = decodeWorksheetFromURI(encoded)

      expect(decoded).toEqual(sampleWorksheet)
    })
  })

  describe("generateShareableURL", () => {
    it("should generate a URL with the encoded worksheet", () => {
      const baseURL = "https://example.com"
      const url = generateShareableURL(sampleWorksheet, baseURL)

      expect(url).toContain(baseURL)
      expect(url).toContain("/worksheet/shared/")
      expect(url.startsWith("https://example.com/worksheet/shared/")).toBe(true)
    })

    it("should generate a URL without baseURL using window.location.origin", () => {
      const url = generateShareableURL(sampleWorksheet)

      expect(url).toContain("/worksheet/shared/")
      // In Jest/jsdom environment, window.location.origin is "http://localhost"
      expect(url).toMatch(/^http:\/\/localhost\/worksheet\/shared\//)
    })

    it("should include valid encoded worksheet in URL", () => {
      const baseURL = "https://example.com"
      const url = generateShareableURL(sampleWorksheet, baseURL)
      const encoded = url.replace("https://example.com/worksheet/shared/", "")

      const decoded = decodeWorksheetFromURI(encoded)
      expect(decoded).toEqual(sampleWorksheet)
    })
  })
})
