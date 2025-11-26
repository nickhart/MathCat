/**
 * Typography constants for math components
 * Ensures consistent font rendering across columnar layouts
 */
export const MATH_TYPOGRAPHY = {
  /**
   * Monospace font stack optimized for character alignment
   * JetBrains Mono is preferred for its excellent box-drawing and consistent character widths
   */
  fontFamily:
    '"JetBrains Mono", "SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, "Courier New", monospace',

  /**
   * Font sizes for different math UI elements
   */
  fontSize: {
    main: "18px", // Main input fields (text-lg equivalent)
    carry: "12px", // Carry digit inputs
    label: "14px", // Labels and headers
  },

  /**
   * Padding values for inputs
   */
  padding: {
    main: "0.75rem", // 12px at 16px base (matches px-3)
    carry: "0.25rem", // 4px for small carry inputs
  },
} as const
