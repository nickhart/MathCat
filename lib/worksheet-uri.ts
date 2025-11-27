import { Worksheet } from "@/types/worksheet"

/**
 * Encode a worksheet to a URL-safe string
 * Uses base64url encoding (RFC 4648 §5)
 */
export function encodeWorksheetToURI(worksheet: Worksheet): string {
  const json = JSON.stringify(worksheet)
  // Convert to base64
  const base64 = Buffer.from(json).toString("base64")
  // Make URL-safe: replace + with -, / with _, remove =
  const base64url = base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
  return base64url
}

/**
 * Decode a worksheet from a URL-safe string
 * Returns null if decoding fails
 */
export function decodeWorksheetFromURI(encoded: string): Worksheet | null {
  try {
    // Convert from URL-safe base64 to standard base64
    let base64 = encoded.replace(/-/g, "+").replace(/_/g, "/")
    // Add padding if needed
    while (base64.length % 4) {
      base64 += "="
    }
    // Decode from base64
    const json = Buffer.from(base64, "base64").toString("utf-8")
    const worksheet = JSON.parse(json) as Worksheet

    // Basic validation
    if (!worksheet.id || !worksheet.title || !Array.isArray(worksheet.problems)) {
      return null
    }

    return worksheet
  } catch (error) {
    console.error("Failed to decode worksheet from URI:", error)
    return null
  }
}

/**
 * Generate a shareable URL for a worksheet
 */
export function generateShareableURL(worksheet: Worksheet, baseURL?: string): string {
  const encoded = encodeWorksheetToURI(worksheet)
  const base = baseURL || (typeof window !== "undefined" ? window.location.origin : "")
  return `${base}/worksheet/shared/${encoded}`
}

/**
 * Copy shareable URL to clipboard
 * Returns true if successful
 */
export async function copyShareableURL(worksheet: Worksheet): Promise<boolean> {
  try {
    const url = generateShareableURL(worksheet)
    await navigator.clipboard.writeText(url)
    return true
  } catch (error) {
    console.error("Failed to copy URL to clipboard:", error)
    return false
  }
}
