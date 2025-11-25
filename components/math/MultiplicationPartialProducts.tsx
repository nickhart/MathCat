"use client"

import { useState, useEffect } from "react"
import { cn } from "@/lib/utils/cn"
import { CatValidator } from "@/components/feedback/CatValidator"

export interface MultiplicationPartialProductsProps {
  multiplicand: number
  multiplier: number
  onComplete?: (isCorrect: boolean) => void
  showValidation?: boolean
  className?: string
}

interface PartialProduct {
  multiplicandDigit: number
  multiplicandPlace: number
  multiplierDigit: number
  multiplierPlace: number
  expected: number
  label: string
}

export function MultiplicationPartialProducts({
  multiplicand,
  multiplier,
  onComplete,
  showValidation = true,
  className,
}: MultiplicationPartialProductsProps) {
  // Break number into place values
  const getPlaceValues = (num: number): { digit: number; place: number }[] => {
    const digits: { digit: number; place: number }[] = []
    let place = 0
    let n = num

    while (n > 0) {
      const digit = n % 10
      if (digit > 0) {
        // Only include non-zero digits
        digits.push({ digit, place })
      }
      n = Math.floor(n / 10)
      place++
    }

    return digits
  }

  // Calculate all partial products
  const calculatePartialProducts = (): PartialProduct[] => {
    const multiplicandPlaces = getPlaceValues(multiplicand)
    const multiplierPlaces = getPlaceValues(multiplier)
    const products: PartialProduct[] = []

    for (const mPlier of multiplierPlaces) {
      for (const mCand of multiplicandPlaces) {
        const expected = mCand.digit * mPlier.digit * Math.pow(10, mCand.place + mPlier.place)

        products.push({
          multiplicandDigit: mCand.digit,
          multiplicandPlace: mCand.place,
          multiplierDigit: mPlier.digit,
          multiplierPlace: mPlier.place,
          expected,
          label: `${mCand.digit * Math.pow(10, mCand.place)} × ${mPlier.digit * Math.pow(10, mPlier.place)}`,
        })
      }
    }

    return products.sort((a, b) => a.expected - b.expected)
  }

  const partialProducts = calculatePartialProducts()
  const expectedSum = multiplicand * multiplier

  // State for user inputs
  const [inputs, setInputs] = useState<Record<number, string>>({})
  const [sumInput, setSumInput] = useState("")

  // Validation state
  const [isComplete, setIsComplete] = useState(false)
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null)

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
        return parseInt(inputs[index]) === product.expected
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

  return (
    <div className={cn("flex flex-col gap-8", className)}>
      <div className="flex justify-between items-start gap-8">
        {/* Problem and inputs */}
        <div className="flex-1">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold mb-2">Partial Products Method</h3>
            <p className="text-4xl font-mono">
              {multiplicand} × {multiplier}
            </p>
          </div>

          {/* Partial products inputs */}
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground font-semibold mb-4">
              Calculate each partial product:
            </p>
            {partialProducts.map((product, index) => {
              const userValue = inputs[index] || ""
              const isFilled = userValue.trim() !== ""
              const isCorrectValue = isFilled && parseInt(userValue) === product.expected

              return (
                <div key={index} className="flex items-center gap-3">
                  <label className="text-lg font-mono w-32 text-right">{product.label} =</label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={userValue}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    className={cn(
                      "w-32 px-3 py-2 text-lg font-mono border-2 rounded-md",
                      "focus:outline-none focus:ring-2 focus:ring-primary",
                      showValidation &&
                        isFilled &&
                        isCorrectValue &&
                        "border-green-500 bg-green-50",
                      showValidation && isFilled && !isCorrectValue && "border-red-500 bg-red-50"
                    )}
                    placeholder="?"
                  />
                </div>
              )
            })}

            {/* Sum */}
            <div className="mt-6 pt-6 border-t-2 border-gray-300">
              <div className="flex items-center gap-3">
                <label className="text-lg font-mono w-32 text-right font-semibold">Sum =</label>
                <input
                  type="text"
                  inputMode="numeric"
                  value={sumInput}
                  onChange={(e) => handleSumChange(e.target.value)}
                  className={cn(
                    "w-32 px-3 py-2 text-lg font-mono border-2 rounded-md font-semibold",
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
                  placeholder="?"
                />
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
