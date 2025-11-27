"use client"

import {
  useRef,
  useEffect,
  KeyboardEvent,
  ClipboardEvent,
  forwardRef,
  useImperativeHandle,
} from "react"
import { cn } from "@/lib/utils/cn"

export interface DigitGridRef {
  /** Focus a specific cell by index */
  focusCell: (index: number) => void
}

export interface DigitGridProps {
  /** Current value as string of digits (e.g., "1234") */
  value: string
  /** Callback when value changes */
  onChange: (value: string) => void
  /** Number of input cells to render */
  numCells: number
  /** Indices where spacer cells should appear (non-interactive) */
  spacerIndices?: number[]
  /** Disable all inputs */
  disabled?: boolean
  /** Auto-focus first cell on mount */
  autoFocus?: boolean
  /** Direction to auto-advance focus after entering a digit */
  autoAdvanceDirection?: "left" | "right" | "none"
  /** Which cell to focus when grid receives focus via tab */
  focusOnTab?: "first" | "last"
  /** Validation state for the entire row */
  validation?: "correct" | "incorrect" | null
  /** Show validation styling (green/red borders) */
  showValidation?: boolean
  /** Additional classes for container */
  className?: string
  /** Additional classes for individual cells */
  cellClassName?: string
  /** ARIA label for the grid */
  ariaLabel?: string
  /** Callback when a digit is entered at a specific cell index */
  onCellChange?: (index: number, value: string) => void
  /** Callback when any cell in the grid receives focus */
  onGridFocus?: () => void
}

export const DigitGrid = forwardRef<DigitGridRef, DigitGridProps>(function DigitGrid(
  {
    value,
    onChange,
    numCells,
    spacerIndices = [],
    disabled = false,
    autoFocus = false,
    autoAdvanceDirection = "right",
    focusOnTab = "first",
    validation = null,
    showValidation = false,
    className,
    cellClassName,
    ariaLabel,
    onCellChange,
    onGridFocus,
  },
  ref
) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  // Expose focusCell method to parent via ref
  useImperativeHandle(ref, () => ({
    focusCell: (index: number) => {
      if (index >= 0 && index < numCells && !spacerIndices.includes(index)) {
        inputRefs.current[index]?.focus()
      }
    },
  }))

  // Initialize refs array
  useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, numCells)
  }, [numCells])

  // Auto-focus first non-spacer cell on mount
  useEffect(() => {
    if (autoFocus && !disabled) {
      const firstInputIndex = getNextInputIndex(-1, 1)
      if (firstInputIndex !== -1) {
        inputRefs.current[firstInputIndex]?.focus()
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoFocus, disabled, spacerIndices])

  // Normalize value to fixed length, using space as placeholder for empty cells
  const normalizedValue = value.padEnd(numCells, " ")

  // Convert value string to array (space = empty cell)
  const digits = normalizedValue
    .slice(0, numCells)
    .split("")
    .map((c) => (c === " " ? "" : c))

  // Get next/previous input index, skipping spacers
  const getNextInputIndex = (currentIndex: number, direction: 1 | -1): number => {
    let nextIndex = currentIndex + direction
    while (nextIndex >= 0 && nextIndex < numCells) {
      if (!spacerIndices.includes(nextIndex)) {
        return nextIndex
      }
      nextIndex += direction
    }
    return -1
  }

  // Handle input change
  const handleChange = (index: number, newValue: string) => {
    // Only allow single digit
    if (newValue.length > 1) {
      newValue = newValue.slice(-1)
    }

    // Only allow digits
    if (newValue !== "" && !/^\d$/.test(newValue)) {
      return
    }

    // Update value at specific position
    const newDigits = [...digits]
    newDigits[index] = newValue

    // Convert back to string, using space for empty cells, trim trailing spaces
    const newValueStr = newDigits
      .map((d) => (d === "" ? " " : d))
      .join("")
      .replace(/\s+$/, "")
    onChange(newValueStr)

    // Call onCellChange callback if provided
    if (onCellChange) {
      onCellChange(index, newValue)
    }

    // Auto-advance to next/previous cell if digit was entered
    if (newValue !== "" && autoAdvanceDirection !== "none") {
      const direction = autoAdvanceDirection === "right" ? 1 : -1
      const nextIndex = getNextInputIndex(index, direction)
      if (nextIndex !== -1) {
        inputRefs.current[nextIndex]?.focus()
      }
    }
  }

  // Handle key down
  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    const currentValue = digits[index] || ""

    // Backspace on empty cell - move to previous
    if (e.key === "Backspace" && currentValue === "") {
      e.preventDefault()
      const prevIndex = getNextInputIndex(index, -1)
      if (prevIndex !== -1) {
        inputRefs.current[prevIndex]?.focus()
      }
    }

    // Arrow Left - move to previous cell
    if (e.key === "ArrowLeft") {
      e.preventDefault()
      const prevIndex = getNextInputIndex(index, -1)
      if (prevIndex !== -1) {
        inputRefs.current[prevIndex]?.focus()
      }
    }

    // Arrow Right - move to next cell
    if (e.key === "ArrowRight") {
      e.preventDefault()
      const nextIndex = getNextInputIndex(index, 1)
      if (nextIndex !== -1) {
        inputRefs.current[nextIndex]?.focus()
      }
    }
  }

  // Handle paste
  const handlePaste = (index: number, e: ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedText = e.clipboardData.getData("text")
    const pastedDigits = pastedText.replace(/\D/g, "").split("") // Only digits

    // Fill cells from current position onward
    const newDigits = [...digits]
    let currentIndex = index

    for (const digit of pastedDigits) {
      // Skip spacers
      while (spacerIndices.includes(currentIndex) && currentIndex < numCells) {
        currentIndex++
      }

      if (currentIndex >= numCells) break

      newDigits[currentIndex] = digit
      currentIndex++
    }

    // Convert back to string, using space for empty cells, trim trailing spaces
    const newValueStr = newDigits
      .map((d) => (d === "" ? " " : d))
      .join("")
      .replace(/\s+$/, "")
    onChange(newValueStr)

    // Focus the cell after last pasted digit
    const nextIndex = getNextInputIndex(currentIndex - 1, 1)
    if (nextIndex !== -1) {
      inputRefs.current[nextIndex]?.focus()
    }
  }

  // Determine validation classes
  const getValidationClasses = () => {
    if (!showValidation || validation === null) return ""
    if (validation === "correct") return "border-green-500 bg-green-50"
    if (validation === "incorrect") return "border-red-500 bg-red-50"
    return ""
  }

  const validationClasses = getValidationClasses()

  // Handle container focus to focus the appropriate cell
  const handleContainerFocus = (e: React.FocusEvent<HTMLDivElement>) => {
    // Only handle if the container itself received focus (not bubbling from child)
    if (e.target === e.currentTarget) {
      const targetIndex =
        focusOnTab === "last" ? getNextInputIndex(numCells, -1) : getNextInputIndex(-1, 1)
      if (targetIndex !== -1) {
        inputRefs.current[targetIndex]?.focus()
      }
    }
  }

  return (
    <div
      className={cn("flex gap-0", className)}
      role="group"
      aria-label={ariaLabel || "Digit input grid"}
      tabIndex={0}
      onFocus={handleContainerFocus}
    >
      {Array.from({ length: numCells }, (_, index) => {
        const isSpacer = spacerIndices.includes(index)

        if (isSpacer) {
          return <div key={index} className="w-12 h-12" aria-hidden="true" />
        }

        const cellValue = digits[index] || ""

        return (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={cellValue}
            onChange={(e) => handleChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={(e) => handlePaste(index, e)}
            disabled={disabled}
            tabIndex={-1}
            onFocus={(e) => {
              e.target.select()
              if (onGridFocus) {
                onGridFocus()
              }
            }}
            className={cn(
              "w-12 h-12 text-center text-lg font-mono border-2 rounded-md",
              "focus:outline-none focus:border-primary",
              "transition-colors",
              validationClasses,
              cellClassName
            )}
            aria-label={`Digit ${index + 1}`}
            aria-invalid={validation === "incorrect" ? "true" : "false"}
          />
        )
      })}
    </div>
  )
})
