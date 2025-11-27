"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils/cn"
import { CheckCircle2, Sparkles } from "lucide-react"

export interface SectionCompleteProps {
  sectionTitle: string
  show: boolean
  onDismiss?: () => void
}

export function SectionComplete({ sectionTitle, show, onDismiss }: SectionCompleteProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setIsVisible(true)
      // Auto-dismiss after 3 seconds
      const timer = setTimeout(() => {
        setIsVisible(false)
        if (onDismiss) {
          setTimeout(onDismiss, 300) // Wait for animation
        }
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onDismiss])

  if (!show && !isVisible) return null

  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      onClick={() => {
        setIsVisible(false)
        if (onDismiss) {
          setTimeout(onDismiss, 300)
        }
      }}
    >
      <div
        className={cn(
          "bg-white rounded-2xl p-8 shadow-2xl max-w-md mx-4 transform transition-all duration-300",
          isVisible ? "scale-100" : "scale-75"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Celebration icon */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <CheckCircle2 className="w-24 h-24 text-green-500" />
            <Sparkles className="w-8 h-8 text-yellow-500 absolute -top-2 -right-2 animate-pulse" />
            <Sparkles className="w-6 h-6 text-yellow-500 absolute -bottom-1 -left-1 animate-pulse delay-150" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center space-y-4">
          <h2 className="text-3xl font-bold text-gray-900">Section Complete!</h2>
          <p className="text-lg text-gray-600">
            You&apos;ve completed <span className="font-semibold">{sectionTitle}</span>
          </p>
          <p className="text-sm text-muted-foreground">Great job! Keep up the excellent work!</p>
        </div>

        {/* Dismiss button */}
        <button
          onClick={() => {
            setIsVisible(false)
            if (onDismiss) {
              setTimeout(onDismiss, 300)
            }
          }}
          className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
