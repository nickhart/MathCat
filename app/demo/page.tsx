"use client"

import { useState } from "react"
import { MultiplicationPartialProductsGrid } from "@/components/math/MultiplicationPartialProductsGrid"
import { MultiplicationAreaModel } from "@/components/math/MultiplicationAreaModel"

const PRESET_PROBLEMS = [
  { multiplicand: 23, multiplier: 45, label: "23 × 45 (2×2 digits)" },
  { multiplicand: 123, multiplier: 45, label: "123 × 45 (3×2 digits)" },
  { multiplicand: 234, multiplier: 567, label: "234 × 567 (3×3 digits)" },
  { multiplicand: 12, multiplier: 34, label: "12 × 34 (2×2 digits - easy)" },
  { multiplicand: 156, multiplier: 24, label: "156 × 24 (3×2 digits)" },
  { multiplicand: 3456, multiplier: 78, label: "3456 × 78 (4×2 digits)" },
]

type MethodType = "partial-products" | "area-model"

export default function DemoPage() {
  const [method, setMethod] = useState<MethodType>("partial-products")
  const [multiplicand, setMultiplicand] = useState(23)
  const [multiplier, setMultiplier] = useState(45)
  const [customMultiplicand, setCustomMultiplicand] = useState("23")
  const [customMultiplier, setCustomMultiplier] = useState("45")
  const [showValidation, setShowValidation] = useState(false)
  const [showAllCells, setShowAllCells] = useState(false)

  const handlePresetChange = (preset: (typeof PRESET_PROBLEMS)[0]) => {
    setMultiplicand(preset.multiplicand)
    setMultiplier(preset.multiplier)
    setCustomMultiplicand(preset.multiplicand.toString())
    setCustomMultiplier(preset.multiplier.toString())
  }

  const handleCustomApply = () => {
    const mCand = parseInt(customMultiplicand)
    const mPlier = parseInt(customMultiplier)

    if (!isNaN(mCand) && !isNaN(mPlier) && mCand > 0 && mPlier > 0) {
      // Validate digit count (2-4 digits)
      const mCandDigits = customMultiplicand.length
      const mPlierDigits = customMultiplier.length

      if (mCandDigits >= 2 && mCandDigits <= 4 && mPlierDigits >= 2 && mPlierDigits <= 4) {
        setMultiplicand(mCand)
        setMultiplier(mPlier)
      } else {
        alert("Please enter numbers between 2-4 digits each")
      }
    }
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🐱 MathCat Multiplication Demo</h1>
          <p className="text-lg text-muted-foreground">
            Practice multiplication with different methods!
          </p>
        </div>

        {/* Controls */}
        <div className="bg-card border rounded-lg p-6 mb-8 space-y-6">
          {/* Method selector */}
          <div>
            <label className="block text-sm font-semibold mb-2">Choose Method:</label>
            <div className="flex gap-4">
              <button
                onClick={() => setMethod("partial-products")}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  method === "partial-products"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Partial Products
              </button>
              <button
                onClick={() => setMethod("area-model")}
                className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
                  method === "area-model"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted hover:bg-muted/80"
                }`}
              >
                Area Model
              </button>
            </div>
          </div>

          {/* Validation toggle */}
          <div>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={showValidation}
                onChange={(e) => setShowValidation(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
              />
              <span className="text-sm font-semibold">
                Show validation feedback (green/red borders)
              </span>
            </label>
            <p className="text-xs text-muted-foreground mt-1 ml-8">
              Turn this on to see immediate feedback as you type
            </p>
          </div>

          {/* Show all cells toggle (for Grid layout) */}
          {method === "partial-products" && (
            <div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAllCells}
                  onChange={(e) => setShowAllCells(e.target.checked)}
                  className="w-5 h-5 rounded border-gray-300 text-primary focus:ring-primary cursor-pointer"
                />
                <span className="text-sm font-semibold">Show all cells (no placeholders)</span>
              </label>
              <p className="text-xs text-muted-foreground mt-1 ml-8">
                Turn this on to show input cells for leading zeros instead of blank spaces
              </p>
            </div>
          )}

          {/* Preset problems */}
          <div>
            <label className="block text-sm font-semibold mb-2">Preset Problems:</label>
            <div className="flex flex-wrap gap-2">
              {PRESET_PROBLEMS.map((preset, index) => (
                <button
                  key={index}
                  onClick={() => handlePresetChange(preset)}
                  className="px-4 py-2 bg-muted hover:bg-muted/80 rounded-md text-sm font-mono transition-colors"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Custom problem */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              Custom Problem (2-4 digits each):
            </label>
            <div className="flex gap-3 items-center">
              <input
                type="text"
                inputMode="numeric"
                value={customMultiplicand}
                onChange={(e) => {
                  if (e.target.value === "" || /^\d{1,4}$/.test(e.target.value)) {
                    setCustomMultiplicand(e.target.value)
                  }
                }}
                className="w-28 px-3 py-2 border-2 rounded-md font-mono text-lg"
                placeholder="23"
              />
              <span className="text-2xl font-bold">×</span>
              <input
                type="text"
                inputMode="numeric"
                value={customMultiplier}
                onChange={(e) => {
                  if (e.target.value === "" || /^\d{1,4}$/.test(e.target.value)) {
                    setCustomMultiplier(e.target.value)
                  }
                }}
                className="w-28 px-3 py-2 border-2 rounded-md font-mono text-lg"
                placeholder="45"
              />
              <button
                onClick={handleCustomApply}
                className="px-6 py-2 bg-primary text-primary-foreground rounded-md font-semibold hover:bg-primary/90 transition-colors"
              >
                Apply
              </button>
            </div>
          </div>
        </div>

        {/* Current problem display */}
        <div className="bg-card border rounded-lg p-8">
          {method === "partial-products" && (
            <MultiplicationPartialProductsGrid
              key={`ppg-${multiplicand}-${multiplier}`}
              multiplicand={multiplicand}
              multiplier={multiplier}
              showValidation={showValidation}
              showAllCells={showAllCells}
            />
          )}

          {method === "area-model" && (
            <MultiplicationAreaModel
              key={`am-${multiplicand}-${multiplier}`}
              multiplicand={multiplicand}
              multiplier={multiplier}
              showValidation={showValidation}
            />
          )}
        </div>

        {/* Info */}
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            The cat will tell you how you&apos;re doing! Keep working until the cat celebrates your
            success! 🎉
          </p>
        </div>
      </div>
    </div>
  )
}
