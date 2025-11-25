"use client"

import { useState, useEffect, useRef } from "react"
import { cn } from "@/lib/utils/cn"
import { CatValidator } from "@/components/feedback/CatValidator"

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

  // Determine max number of digits needed
  const maxDigits = expectedSum.toString().length

  // Break each partial product into digits by place value
  const getDigitsByPlace = (num: number): Record<number, number> => {
    const digits: Record<number, number> = {}
    let place = 0
    let n = num

    while (n > 0) {
      digits[place] = n % 10
      n = Math.floor(n / 10)
      place++
    }

    return digits
  }

  // State: store user inputs for each partial product digit and carry digits
  const [productDigits, setProductDigits] = useState<Record<string, string>>({})
  const [carryDigits, setCarryDigits] = useState<Record<number, string>>({})
  const [sumDigits, setSumDigits] = useState<Record<number, string>>({})

  // Refs for focus management
  const inputRefs = useRef<Record<string, HTMLInputElement | null>>({})

  // Validation
  const [isComplete, setIsComplete] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

  // Check if all fields are filled and validate
  useEffect(() => {
    // Check if all product digits are filled
    let allProductsFilled = true
    partialProducts.forEach((product, rowIndex) => {
      const expectedDigits = getDigitsByPlace(product.value)
      Object.keys(expectedDigits).forEach((place) => {
        const key = `product-${rowIndex}-${place}`
        if (!productDigits[key] || productDigits[key].trim() === "") {
          allProductsFilled = false
        }
      })
    })

    // Check if all sum digits are filled
    let allSumFilled = true
    for (let place = 0; place < maxDigits; place++) {
      if (!sumDigits[place] || sumDigits[place].trim() === "") {
        allSumFilled = false
        break
      }
    }

    setIsComplete(allProductsFilled && allSumFilled)

    if (allProductsFilled && allSumFilled) {
      // Validate products
      let productsCorrect = true
      partialProducts.forEach((product, rowIndex) => {
        const expectedDigits = getDigitsByPlace(product.value)
        Object.keys(expectedDigits).forEach((placeStr) => {
          const place = parseInt(placeStr)
          const key = `product-${rowIndex}-${place}`
          if (parseInt(productDigits[key]) !== expectedDigits[place]) {
            productsCorrect = false
          }
        })
      })

      // Validate sum
      const userSum = Array.from({ length: maxDigits }, (_, i) => maxDigits - 1 - i)
        .map((place) => sumDigits[place] || "0")
        .join("")
      const sumCorrect = parseInt(userSum) === expectedSum

      const correct = productsCorrect && sumCorrect
      setIsCorrect(correct)

      if (onComplete) {
        onComplete(correct)
      }
    } else {
      setIsCorrect(null)
    }
  }, [productDigits, sumDigits, partialProducts, maxDigits, expectedSum, onComplete])

  const handleProductDigitChange = (
    rowIndex: number,
    place: number,
    value: string,
    nextPlace?: number
  ) => {
    if (value === "" || /^\d$/.test(value)) {
      const key = `product-${rowIndex}-${place}`
      setProductDigits((prev) => ({ ...prev, [key]: value }))

      // Auto-focus next field (to the left, higher place value)
      if (value !== "" && nextPlace !== undefined) {
        const nextKey = `product-${rowIndex}-${nextPlace}`
        inputRefs.current[nextKey]?.focus()
      }
    }
  }

  const handleCarryDigitChange = (place: number, value: string, nextPlace?: number) => {
    if (value === "" || /^\d$/.test(value)) {
      setCarryDigits((prev) => ({ ...prev, [place]: value }))

      // Auto-focus next field
      if (value !== "" && nextPlace !== undefined) {
        const nextKey = `carry-${nextPlace}`
        inputRefs.current[nextKey]?.focus()
      }
    }
  }

  const handleSumDigitChange = (place: number, value: string, nextPlace?: number) => {
    if (value === "" || /^\d$/.test(value)) {
      setSumDigits((prev) => ({ ...prev, [place]: value }))

      // Auto-focus next field
      if (value !== "" && nextPlace !== undefined) {
        const nextKey = `sum-${nextPlace}`
        inputRefs.current[nextKey]?.focus()
      }
    }
  }

  // Helper to check if a digit is correct
  const isProductDigitCorrect = (rowIndex: number, place: number): boolean => {
    const product = partialProducts[rowIndex]
    const expectedDigits = getDigitsByPlace(product.value)
    const key = `product-${rowIndex}-${place}`
    const userValue = productDigits[key]

    if (!userValue || userValue.trim() === "") return false

    return parseInt(userValue) === (expectedDigits[place] || 0)
  }

  const isSumDigitCorrect = (place: number): boolean => {
    const userValue = sumDigits[place]
    if (!userValue || userValue.trim() === "") return false

    const expectedSum = multiplicand * multiplier
    const expectedDigits = getDigitsByPlace(expectedSum)

    return parseInt(userValue) === (expectedDigits[place] || 0)
  }

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="flex justify-between items-start gap-8">
        {/* Problem display */}
        <div className="flex-1">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Partial Products Method (Columnar)</h3>
            <p className="text-4xl font-mono">
              {multiplicand} × {multiplier}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Add the partial products column by column (right to left)
            </p>
          </div>

          {/* Columnar grid */}
          <div className="inline-block">
            <div className="flex flex-col font-mono text-lg">
              {/* Labels for partial products */}
              <div className="flex justify-end items-center gap-2 mb-2">
                <div className="text-sm text-muted-foreground w-32 text-right">
                  Partial Products:
                </div>
                {Array.from({ length: maxDigits }, (_, i) => (
                  <div key={i} className="w-12 text-center text-xs text-muted-foreground">
                    {Math.pow(10, maxDigits - 1 - i) >= 1000
                      ? `${Math.pow(10, maxDigits - 1 - i) / 1000}k`
                      : Math.pow(10, maxDigits - 1 - i)}
                  </div>
                ))}
              </div>

              {/* Partial product rows */}
              {partialProducts.map((product, rowIndex) => {
                const productDigitsMap = getDigitsByPlace(product.value)

                return (
                  <div key={rowIndex} className="flex justify-end items-center gap-2 mb-1">
                    {/* Label */}
                    <div className="text-sm text-muted-foreground w-32 text-right">
                      {product.label}
                    </div>

                    {/* Digit inputs */}
                    {Array.from({ length: maxDigits }, (_, i) => {
                      const place = maxDigits - 1 - i
                      const expectedDigit = productDigitsMap[place]
                      const hasDigit = expectedDigit !== undefined
                      const key = `product-${rowIndex}-${place}`
                      const userValue = productDigits[key] || ""
                      const isFilled = userValue.trim() !== ""
                      const isCorrectValue = isProductDigitCorrect(rowIndex, place)

                      if (!hasDigit) {
                        return <div key={place} className="w-12" />
                      }

                      return (
                        <input
                          key={place}
                          ref={(el) => {
                            inputRefs.current[key] = el
                          }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={userValue}
                          onChange={(e) =>
                            handleProductDigitChange(
                              rowIndex,
                              place,
                              e.target.value,
                              place + 1 < maxDigits ? place + 1 : undefined
                            )
                          }
                          className={cn(
                            "w-12 h-12 text-center text-lg font-mono border-2 rounded",
                            "focus:outline-none focus:ring-2 focus:ring-primary",
                            showValidation &&
                              isFilled &&
                              isCorrectValue &&
                              "border-green-500 bg-green-50",
                            showValidation &&
                              isFilled &&
                              !isCorrectValue &&
                              "border-red-500 bg-red-50"
                          )}
                        />
                      )
                    })}
                  </div>
                )
              })}

              {/* Horizontal line */}
              <div className="flex justify-end items-center gap-2 my-3">
                <div className="w-32" />
                {Array.from({ length: maxDigits }, (_, i) => (
                  <div key={i} className="w-12 border-t-2 border-gray-800" />
                ))}
              </div>

              {/* Carry row */}
              <div className="flex justify-end items-center gap-2 mb-1">
                <div className="text-xs text-muted-foreground w-32 text-right">Carry:</div>
                {Array.from({ length: maxDigits }, (_, i) => {
                  const place = maxDigits - 1 - i
                  // No carry for ones place
                  if (place === 0) {
                    return <div key={place} className="w-12" />
                  }

                  const key = `carry-${place}`
                  const userValue = carryDigits[place] || ""

                  return (
                    <input
                      key={place}
                      ref={(el) => {
                        inputRefs.current[key] = el
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={userValue}
                      onChange={(e) =>
                        handleCarryDigitChange(
                          place,
                          e.target.value,
                          place + 1 < maxDigits ? place + 1 : undefined
                        )
                      }
                      className="w-12 h-10 text-center text-sm font-mono border border-dashed border-gray-400 rounded bg-blue-50/30 focus:outline-none focus:ring-2 focus:ring-blue-400"
                      placeholder="0"
                    />
                  )
                })}
              </div>

              {/* Sum row */}
              <div className="flex justify-end items-center gap-2">
                <div className="text-sm font-semibold w-32 text-right">Sum:</div>
                {Array.from({ length: maxDigits }, (_, i) => {
                  const place = maxDigits - 1 - i
                  const key = `sum-${place}`
                  const userValue = sumDigits[place] || ""
                  const isFilled = userValue.trim() !== ""
                  const isCorrectValue = isSumDigitCorrect(place)

                  return (
                    <input
                      key={place}
                      ref={(el) => {
                        inputRefs.current[key] = el
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={userValue}
                      onChange={(e) =>
                        handleSumDigitChange(
                          place,
                          e.target.value,
                          place + 1 < maxDigits ? place + 1 : undefined
                        )
                      }
                      className={cn(
                        "w-12 h-12 text-center text-lg font-mono font-semibold border-2 rounded",
                        "focus:outline-none focus:ring-2 focus:ring-primary",
                        showValidation &&
                          isFilled &&
                          isCorrectValue &&
                          "border-green-500 bg-green-50",
                        showValidation && isFilled && !isCorrectValue && "border-red-500 bg-red-50"
                      )}
                    />
                  )
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Cat validator */}
        <div className="flex-shrink-0">
          <CatValidator isComplete={isComplete} isCorrect={isCorrect} />
        </div>
      </div>
    </div>
  )
}
