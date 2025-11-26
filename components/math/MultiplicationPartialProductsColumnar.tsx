"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils/cn"
import { CatValidator } from "@/components/feedback/CatValidator"
import { MATH_TYPOGRAPHY } from "@/lib/constants/typography"

export interface MultiplicationPartialProductsColumnarProps {
  multiplicand: number
  multiplier: number
  onComplete?: (isCorrect: boolean) => void
  showValidation?: boolean
  className?: string
}

interface PartialProduct {
  value: number
  label: string
}

export function MultiplicationPartialProductsColumnar({
  multiplicand,
  multiplier,
  onComplete,
  showValidation = true,
  className,
}: MultiplicationPartialProductsColumnarProps) {
  // Calculate partial products
  const calculatePartialProducts = (): PartialProduct[] => {
    const products: PartialProduct[] = []
    const multiplicandStr = multiplicand.toString()
    const multiplierStr = multiplier.toString()

    // Break into place values
    for (let i = multiplierStr.length - 1; i >= 0; i--) {
      const mPlierDigit = parseInt(multiplierStr[i])
      if (mPlierDigit === 0) continue
      const mPlierPlace = multiplierStr.length - 1 - i

      for (let j = multiplicandStr.length - 1; j >= 0; j--) {
        const mCandDigit = parseInt(multiplicandStr[j])
        if (mCandDigit === 0) continue
        const mCandPlace = multiplicandStr.length - 1 - j

        const value = mCandDigit * mPlierDigit * Math.pow(10, mCandPlace + mPlierPlace)
        const mCandValue = mCandDigit * Math.pow(10, mCandPlace)
        const mPlierValue = mPlierDigit * Math.pow(10, mPlierPlace)

        products.push({
          value,
          label: `${mCandValue} × ${mPlierValue}`,
        })
      }
    }

    return products.sort((a, b) => a.value - b.value)
  }

  const partialProducts = calculatePartialProducts()
  const expectedSum = multiplicand * multiplier

  // State for user inputs
  const [inputs, setInputs] = useState<Record<number, string>>({})
  const [sumInput, setSumInput] = useState("")
  const [carryDigits, setCarryDigits] = useState<Record<number, string>>({})

  // Validation state
  const [isComplete, setIsComplete] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // Ref and state for character width measurement
  const sumInputRef = useRef<HTMLInputElement>(null)
  const [charWidth, setCharWidth] = useState<number | null>(null)

  // Check completion and correctness
  useEffect(() => {
    const allPartialsFilled = partialProducts.every((_, index) => {
      const value = inputs[index]
      return value !== undefined && value.trim() !== ""
    })

    const sumFilled = sumInput.trim() !== ""

    setIsComplete(allPartialsFilled && sumFilled)

    if (allPartialsFilled && sumFilled) {
      const allPartialsCorrect = partialProducts.every((product, index) => {
        return parseInt(inputs[index]) === product.value
      })

      const sumCorrect = parseInt(sumInput) === expectedSum

      const correct = allPartialsCorrect && sumCorrect
      setIsCorrect(correct)

      if (onComplete) {
        onComplete(correct)
      }
    } else {
      setIsCorrect(null)
    }
  }, [inputs, sumInput, partialProducts, expectedSum, onComplete])

  // Measure actual character width for precise alignment
  useEffect(() => {
    if (!sumInputRef.current) return

    const computedStyle = window.getComputedStyle(sumInputRef.current)

    // Create temporary span to measure character width
    const tempSpan = document.createElement("span")
    tempSpan.textContent = "0".repeat(10) // Measure 10 chars for better precision
    tempSpan.style.cssText = `
      position: absolute;
      visibility: hidden;
      font-family: ${computedStyle.fontFamily};
      font-size: ${computedStyle.fontSize};
      font-weight: ${computedStyle.fontWeight};
      letter-spacing: 0;
    `
    document.body.appendChild(tempSpan)

    const avgWidth = tempSpan.getBoundingClientRect().width / 10
    setCharWidth(avgWidth)

    document.body.removeChild(tempSpan)
  }, [])

  const handleInputChange = (index: number, value: string) => {
    // Only allow numbers
    if (value === "" || /^\d+$/.test(value)) {
      setInputs((prev) => ({ ...prev, [index]: value }))
    }
  }

  const handleSumChange = (value: string) => {
    if (value === "" || /^\d+$/.test(value)) {
      setSumInput(value)
    }
  }

  const handleCarryChange = (place: number, value: string) => {
    // Only allow single digit
    if (value === "" || /^\d$/.test(value)) {
      setCarryDigits((prev) => ({ ...prev, [place]: value }))
    }
  }

  // Helper to format large place values
  const formatPlaceValue = (value: number): string => {
    if (value >= 1_000_000_000) return `${value / 1_000_000_000}b`
    if (value >= 1_000_000) return `${value / 1_000_000}m`
    if (value >= 1_000) return `${value / 1_000}k`
    return value.toString()
  }

  // Determine max width needed for inputs
  const maxDigits = expectedSum.toString().length

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      {/* Problem display */}
      <div>
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-2">Partial Products Method (Columnar)</h3>
          <p className="text-4xl font-mono">
            {multiplicand} × {multiplier}
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Enter each partial product, then add them up for the final sum
          </p>
        </div>

        {/* Columnar layout */}
        <div className="space-y-1">
          {/* Place value headers */}
          <div className="flex items-center gap-3 mb-2">
            <div className="w-32 text-sm text-muted-foreground text-right">Partial Products:</div>
            <div
              className="flex"
              style={{
                fontFamily: MATH_TYPOGRAPHY.fontFamily,
                fontSize: MATH_TYPOGRAPHY.fontSize.main,
                width: charWidth ? `${maxDigits * charWidth + 24}px` : `${maxDigits}ch`,
                paddingLeft: MATH_TYPOGRAPHY.padding.main,
                paddingRight: MATH_TYPOGRAPHY.padding.main,
                gap: "0",
              }}
            >
              {Array.from({ length: maxDigits }, (_, i) => {
                const placeValue = Math.pow(10, maxDigits - 1 - i)
                return (
                  <div
                    key={i}
                    className="text-center text-xs text-muted-foreground"
                    style={{ width: charWidth ? `${charWidth}px` : "1ch" }}
                  >
                    {formatPlaceValue(placeValue)}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Partial product rows */}
          {partialProducts.map((product, index) => {
            const userValue = inputs[index] || ""
            const isFilled = userValue.trim() !== ""
            const isCorrectValue = isFilled && parseInt(userValue) === product.value

            return (
              <div key={index} className="flex items-center gap-3">
                <label className="text-sm font-mono w-32 text-right text-muted-foreground">
                  {product.label} =
                </label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={userValue}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  className={cn(
                    "py-2 border-2 rounded-md",
                    "focus:outline-none focus:ring-2 focus:ring-primary",
                    showValidation && isFilled && isCorrectValue && "border-green-500 bg-green-50",
                    showValidation && isFilled && !isCorrectValue && "border-red-500 bg-red-50"
                  )}
                  style={{
                    fontFamily: MATH_TYPOGRAPHY.fontFamily,
                    fontSize: MATH_TYPOGRAPHY.fontSize.main,
                    width: charWidth
                      ? `${maxDigits * charWidth + 24}px`
                      : `calc(${maxDigits + 2}ch + 1.5rem)`,
                    padding: MATH_TYPOGRAPHY.padding.main,
                    paddingLeft: MATH_TYPOGRAPHY.padding.main,
                    paddingRight: MATH_TYPOGRAPHY.padding.main,
                    letterSpacing: "0",
                    textAlign: "right",
                  }}
                  placeholder="?"
                />
              </div>
            )
          })}

          {/* Horizontal line */}
          <div className="flex items-center gap-3 my-4">
            <div className="w-32" />
            <div
              className="border-t-2 border-gray-800"
              style={{
                width: charWidth
                  ? `${maxDigits * charWidth + 24}px`
                  : `calc(${maxDigits + 2}ch + 1.5rem)`,
              }}
            />
          </div>

          {/* Carry row */}
          <div className="flex items-center gap-3 mb-2">
            <div className="text-xs text-muted-foreground w-32 text-right">Carry (optional):</div>
            <div
              className="flex"
              style={{
                fontFamily: MATH_TYPOGRAPHY.fontFamily,
                fontSize: MATH_TYPOGRAPHY.fontSize.main,
                width: charWidth ? `${maxDigits * charWidth + 24}px` : `${maxDigits}ch`,
                paddingLeft: MATH_TYPOGRAPHY.padding.main,
                paddingRight: MATH_TYPOGRAPHY.padding.main,
                gap: "0",
              }}
            >
              {Array.from({ length: maxDigits }, (_, i) => {
                const place = maxDigits - 1 - i

                // No carry for ones place (rightmost)
                if (place === 0) {
                  return (
                    <div key={place} style={{ width: charWidth ? `${charWidth}px` : "18px" }} />
                  )
                }

                const userValue = carryDigits[place] || ""

                return (
                  <input
                    key={place}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={userValue}
                    onChange={(e) => handleCarryChange(place, e.target.value)}
                    className="h-6 text-center border border-dashed border-gray-400 rounded bg-blue-50/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    style={{
                      fontFamily: MATH_TYPOGRAPHY.fontFamily,
                      fontSize: MATH_TYPOGRAPHY.fontSize.carry,
                      width: charWidth ? `${charWidth}px` : "18px",
                      padding: "2px",
                      letterSpacing: "0",
                    }}
                    placeholder="0"
                  />
                )
              })}
            </div>
          </div>

          {/* Sum row with Cat validator */}
          <div className="flex items-center gap-3">
            <label className="text-lg font-mono w-32 text-right font-semibold">Sum =</label>
            <input
              ref={sumInputRef}
              type="text"
              inputMode="numeric"
              value={sumInput}
              onChange={(e) => handleSumChange(e.target.value)}
              className={cn(
                "py-2 border-2 rounded-md font-semibold",
                "focus:outline-none focus:ring-2 focus:ring-primary",
                showValidation &&
                  sumInput.trim() !== "" &&
                  parseInt(sumInput) === expectedSum &&
                  "border-green-500 bg-green-50",
                showValidation &&
                  sumInput.trim() !== "" &&
                  parseInt(sumInput) !== expectedSum &&
                  "border-red-500 bg-red-50"
              )}
              style={{
                fontFamily: MATH_TYPOGRAPHY.fontFamily,
                fontSize: MATH_TYPOGRAPHY.fontSize.main,
                width: charWidth
                  ? `${maxDigits * charWidth + 24}px`
                  : `calc(${maxDigits + 2}ch + 1.5rem)`,
                padding: MATH_TYPOGRAPHY.padding.main,
                paddingLeft: MATH_TYPOGRAPHY.padding.main,
                paddingRight: MATH_TYPOGRAPHY.padding.main,
                letterSpacing: "0",
                textAlign: "right",
              }}
              placeholder="?"
            />

            {/* Cat validator */}
            <div className="ml-6">
              <CatValidator isComplete={isComplete} isCorrect={isCorrect} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
