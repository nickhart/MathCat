"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils/cn"
import { DigitGrid, DigitGridRef } from "@/components/math/DigitGrid"
import { CatValidator } from "@/components/feedback/CatValidator"

export interface MultiplicationClassicAlgorithmUserInputs {
  /** User input for each partial product row */
  partialInputs: Record<number, string>
  /** Carry digits for each partial product */
  partialCarryDigits: Record<number, string>
  /** Carry digits for final sum */
  sumCarryDigits: string
  /** Final sum input */
  sumInput: string
}

export interface MultiplicationClassicAlgorithmProps {
  multiplicand: number
  multiplier: number
  initialUserInputs?: MultiplicationClassicAlgorithmUserInputs
  onComplete?: (isCorrect: boolean, userInputs: MultiplicationClassicAlgorithmUserInputs) => void
  showValidation?: boolean
  showAllCells?: boolean
  showPartialCarryRows?: boolean
  className?: string
}

export function MultiplicationClassicAlgorithm({
  multiplicand,
  multiplier,
  initialUserInputs,
  onComplete,
  showValidation = true,
  showAllCells = false,
  showPartialCarryRows = false,
  className,
}: MultiplicationClassicAlgorithmProps) {
  // Break multiplier into individual digits (right to left)
  const getMultiplierDigits = (): number[] => {
    const digits: number[] = []
    let n = multiplier
    while (n > 0) {
      digits.push(n % 10)
      n = Math.floor(n / 10)
    }
    return digits.length > 0 ? digits : [0]
  }

  // Break number into individual digits (left to right for display)
  const getDigits = (num: number): number[] => {
    return num.toString().split("").map(Number)
  }

  const multiplicandDigits = getDigits(multiplicand)
  const multiplierDigits = getDigits(multiplier)
  const multiplierDigitsReversed = getMultiplierDigits() // [ones, tens, hundreds, ...]

  // Calculate grid dimensions
  const numMultiplicandDigits = multiplicandDigits.length
  const numMultiplierDigits = multiplierDigitsReversed.length
  const maxDigits = numMultiplicandDigits + numMultiplierDigits + 1 // Extra column for potential overflow

  // Expected values
  const expectedSum = multiplicand * multiplier
  // For validation, compare to the product without place value shift (e.g., 492 not 4920)
  const expectedPartialsWithoutShift = multiplierDigitsReversed.map((digit) => multiplicand * digit)

  // Refs for keyboard navigation
  const partialRefs = useRef<(DigitGridRef | null)[]>([])
  const partialCarryRefs = useRef<(DigitGridRef | null)[]>([])
  const sumCarryRowRef = useRef<DigitGridRef>(null)
  const sumRowRef = useRef<DigitGridRef>(null)

  // Initialize refs arrays
  useEffect(() => {
    partialRefs.current = partialRefs.current.slice(0, numMultiplierDigits)
    partialCarryRefs.current = partialCarryRefs.current.slice(0, numMultiplierDigits)
  }, [numMultiplierDigits])

  // Ref to track last completion state
  const lastCompletionState = useRef<boolean | null>(null)
  const onCompleteRef = useRef(onComplete)
  useEffect(() => {
    onCompleteRef.current = onComplete
  }, [onComplete])

  // State for user inputs
  const [partialInputs, setPartialInputs] = useState<Record<number, string>>(
    initialUserInputs?.partialInputs || {}
  )
  const [partialCarryDigits, setPartialCarryDigits] = useState<Record<number, string>>(
    initialUserInputs?.partialCarryDigits || {}
  )
  const [sumCarryDigits, setSumCarryDigits] = useState(initialUserInputs?.sumCarryDigits || "")
  const [sumInput, setSumInput] = useState(initialUserInputs?.sumInput || "")

  // Validation state
  const [isComplete, setIsComplete] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // Check completion and correctness
  useEffect(() => {
    const allPartialsFilled = multiplierDigitsReversed.every((_, index) => {
      const value = partialInputs[index] || ""
      const trimmed = value.replace(/\s/g, "")
      return trimmed !== ""
    })

    const sumTrimmed = sumInput.replace(/\s/g, "")
    const sumFilled = sumTrimmed !== ""

    const nowComplete = allPartialsFilled && sumFilled

    if (nowComplete) {
      const allPartialsCorrect = multiplierDigitsReversed.every((_, index) => {
        const value = partialInputs[index] || ""
        const trimmed = value.replace(/\s/g, "") || "0"
        // Always compare against the unshifted value since we're showing zeros as disabled cells
        const expected = expectedPartialsWithoutShift[index]
        return parseInt(trimmed) === expected
      })

      const sumCorrect = parseInt(sumTrimmed) === expectedSum

      const correct = allPartialsCorrect && sumCorrect

      setIsComplete(true)
      setIsCorrect(correct)

      if (onCompleteRef.current && lastCompletionState.current !== correct) {
        lastCompletionState.current = correct
        const userInputs: MultiplicationClassicAlgorithmUserInputs = {
          partialInputs,
          partialCarryDigits,
          sumCarryDigits,
          sumInput,
        }
        onCompleteRef.current(correct, userInputs)
      }
    } else {
      setIsComplete(false)
      setIsCorrect(null)
      lastCompletionState.current = null
    }
  }, [
    partialInputs,
    sumInput,
    multiplierDigitsReversed,
    expectedPartialsWithoutShift,
    expectedSum,
    partialCarryDigits,
    sumCarryDigits,
  ])

  // Keyboard navigation handlers
  const handlePartialCarryEnterAtEnd = (partialIndex: number) => {
    // Focus the corresponding partial row
    partialRefs.current[partialIndex]?.focusCell(0)
  }

  const handlePartialEnterAtEnd = (partialIndex: number) => {
    const nextIndex = partialIndex + 1
    if (nextIndex < numMultiplierDigits) {
      // Move to next partial's carry row if showing, otherwise to partial itself
      if (showPartialCarryRows) {
        partialCarryRefs.current[nextIndex]?.focusCell(0)
      } else {
        partialRefs.current[nextIndex]?.focusCell(0)
      }
    } else {
      // Last partial, move to sum carry row
      sumCarryRowRef.current?.focusCell(0)
    }
  }

  const handleSumCarryRowEnterAtEnd = () => {
    if (sumRowRef.current) {
      sumRowRef.current.focusCell(maxDigits - 1)
    }
  }

  // Helper to get leading spacer indices for right-aligned row
  const getLeadingSpacerIndices = (digitCount: number, shiftLeft: number = 0): number[] => {
    if (showAllCells) {
      return [] // No spacers when showing all cells
    }
    const leadingSpacers = maxDigits - digitCount - shiftLeft
    return Array.from({ length: leadingSpacers }, (_, i) => i)
  }

  // Helper to get trailing zero indices for shifted partials (pre-filled with "0" and disabled)
  const getTrailingZeroIndices = (shiftLeft: number): number[] => {
    if (shiftLeft === 0) return []
    // Trailing positions are the last `shiftLeft` cells
    return Array.from({ length: shiftLeft }, (_, i) => maxDigits - shiftLeft + i)
  }

  // Validation helpers
  const getPartialValidation = (index: number): "correct" | "incorrect" | null => {
    if (!showValidation) return null
    const value = partialInputs[index] || ""
    const trimmed = value.replace(/\s/g, "")
    if (trimmed === "") return null
    // Always compare against the unshifted value (e.g., 492 not 4920)
    // since we're showing zeros as disabled cells now
    const expected = expectedPartialsWithoutShift[index]
    return parseInt(trimmed) === expected ? "correct" : "incorrect"
  }

  const getSumValidation = (): "correct" | "incorrect" | null => {
    if (!showValidation) return null
    const trimmed = sumInput.replace(/\s/g, "")
    if (trimmed === "") return null
    return parseInt(trimmed) === expectedSum ? "correct" : "incorrect"
  }

  // Helper to format a number as a right-aligned string for DigitGrid
  const toRightAlignedString = (num: number, totalCells: number): string => {
    const str = num.toString()
    return str.padStart(totalCells, " ")
  }

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      {/* Problem description */}
      <div className="mb-4">
        <h3 className="text-2xl font-bold mb-2">Classic Algorithm</h3>
        <p className="text-4xl font-mono">
          {multiplicand} × {multiplier}
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          Fill in each partial product, then add them up
        </p>
      </div>

      {/* Grid layout */}
      <div className="space-y-1">
        {/* Multiplicand row */}
        <div className="flex items-center gap-3">
          <div className="w-32" />
          <DigitGrid
            value={toRightAlignedString(multiplicand, maxDigits)}
            onChange={() => {}} // Read-only
            numCells={maxDigits}
            disabled
            ariaLabel="Multiplicand"
            cellClassName="bg-gray-50"
          />
        </div>

        {/* Multiplier row with × symbol */}
        <div className="flex items-center gap-3">
          <div className="w-32 text-right text-2xl font-bold">×</div>
          <DigitGrid
            value={toRightAlignedString(multiplier, maxDigits)}
            onChange={() => {}} // Read-only
            numCells={maxDigits}
            disabled
            ariaLabel="Multiplier"
            cellClassName="bg-gray-50"
          />
        </div>

        {/* Horizontal line */}
        <div className="flex items-center gap-3 my-2">
          <div className="w-32" />
          <div className="border-t-2 border-gray-800" style={{ width: `${maxDigits * 48}px` }} />
        </div>

        {/* Partial product rows with optional carry rows */}
        {multiplierDigitsReversed.map((digit, index) => {
          const shiftLeft = index
          const leadingSpacers = getLeadingSpacerIndices(
            numMultiplicandDigits + 1, // Partial can be one digit longer
            shiftLeft
          )
          const trailingZeroIndices = getTrailingZeroIndices(shiftLeft)

          // Build value string with trailing zeros pre-filled
          let partialValue = partialInputs[index] || ""
          if (shiftLeft > 0) {
            // Append zeros to the right for place value
            const zerosToAdd = "0".repeat(shiftLeft)
            const trimmed = partialValue.replace(/\s/g, "")
            if (trimmed) {
              partialValue = trimmed + zerosToAdd
              partialValue = partialValue.padStart(maxDigits, " ")
            } else {
              // Just the zeros, right-aligned
              partialValue = zerosToAdd.padStart(maxDigits, " ")
            }
          }

          const multiplierDigitFromRight = multiplierDigits[multiplierDigits.length - 1 - index]

          return (
            <div key={index} className="space-y-1">
              {/* Optional carry row for this partial */}
              {showPartialCarryRows && (
                <div className="flex items-center gap-3">
                  <label className="text-xs text-muted-foreground w-32 text-right">
                    Carry (optional):
                  </label>
                  <DigitGrid
                    ref={(el) => {
                      partialCarryRefs.current[index] = el
                    }}
                    value={partialCarryDigits[index] || ""}
                    onChange={(value) =>
                      setPartialCarryDigits((prev) => ({ ...prev, [index]: value }))
                    }
                    numCells={maxDigits}
                    spacerIndices={[...trailingZeroIndices, maxDigits - 1]} // Trail spacers + last cell
                    cellClassName="text-xs border-dashed bg-blue-50/30"
                    ariaLabel={`Carry digits for partial ${index + 1}`}
                    autoAdvanceDirection="none"
                    onEnterAtEnd={() => handlePartialCarryEnterAtEnd(index)}
                  />
                </div>
              )}

              {/* Partial product row */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-mono w-32 text-right text-muted-foreground">
                  {multiplicand} × {multiplierDigitFromRight} =
                </label>
                <div className="flex flex-col">
                  <DigitGrid
                    ref={(el) => {
                      partialRefs.current[index] = el
                    }}
                    value={partialValue}
                    onChange={(value) => {
                      // Strip trailing zeros before saving
                      let cleanValue = value
                      if (shiftLeft > 0) {
                        // Remove the trailing zeros
                        cleanValue = value.replace(/\s/g, "")
                        if (cleanValue.endsWith("0".repeat(shiftLeft))) {
                          cleanValue = cleanValue.slice(0, -shiftLeft)
                        }
                        cleanValue = cleanValue.padStart(maxDigits - shiftLeft, " ")
                      }
                      setPartialInputs((prev) => ({ ...prev, [index]: cleanValue }))
                    }}
                    numCells={maxDigits}
                    spacerIndices={leadingSpacers}
                    disabledIndices={trailingZeroIndices}
                    validation={getPartialValidation(index)}
                    showValidation={showValidation}
                    autoAdvanceDirection="left"
                    focusOnTab="last"
                    ariaLabel={`Partial product: ${multiplicand} times ${multiplierDigitFromRight}`}
                    onEnterAtEnd={() => handlePartialEnterAtEnd(index)}
                  />
                  {/* Direction indicator */}
                  <div className="flex gap-0 mt-1">
                    {Array.from({ length: maxDigits }, (_, i) => (
                      <div
                        key={i}
                        className="w-12 text-center text-xs text-blue-600"
                        aria-hidden="true"
                      >
                        {leadingSpacers.includes(i) || trailingZeroIndices.includes(i)
                          ? ""
                          : i === 0
                            ? ""
                            : "←"}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}

        {/* Horizontal line */}
        <div className="flex items-center gap-3 my-4">
          <div className="w-32" />
          <div className="border-t-2 border-gray-800" style={{ width: `${maxDigits * 48}px` }} />
        </div>

        {/* Carry row for sum (optional) */}
        <div className="flex items-center gap-3 mb-2">
          <label className="text-xs text-muted-foreground w-32 text-right">Carry (optional):</label>
          <DigitGrid
            ref={sumCarryRowRef}
            value={sumCarryDigits}
            onChange={setSumCarryDigits}
            numCells={maxDigits}
            spacerIndices={[maxDigits - 1]} // Last cell (1's column) is a spacer
            cellClassName="text-xs border-dashed bg-blue-50/30"
            ariaLabel="Carry digits for addition"
            autoAdvanceDirection="none"
            onEnterAtEnd={handleSumCarryRowEnterAtEnd}
          />
        </div>

        {/* Sum row */}
        <div className="flex items-center gap-3">
          <label className="text-lg font-mono w-32 text-right font-semibold">Sum =</label>
          <div className="flex flex-col">
            <DigitGrid
              ref={sumRowRef}
              value={sumInput}
              onChange={setSumInput}
              numCells={maxDigits}
              autoAdvanceDirection="left"
              focusOnTab="last"
              validation={getSumValidation()}
              showValidation={showValidation}
              ariaLabel="Sum of all partial products"
            />
            {/* Direction indicator */}
            <div className="flex gap-0 mt-1">
              {Array.from({ length: maxDigits }, (_, i) => (
                <div key={i} className="w-12 text-center text-xs text-blue-600" aria-hidden="true">
                  {i === 0 ? "" : "←"}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Cat validator */}
        <div className="flex items-center gap-3 mt-8">
          <div className="w-32" />
          <CatValidator isComplete={isComplete} isCorrect={isCorrect} />
        </div>
      </div>
    </div>
  )
}
