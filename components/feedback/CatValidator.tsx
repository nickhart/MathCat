"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { cn } from "@/lib/utils/cn"

export interface CatValidatorProps {
  isComplete: boolean
  isCorrect: boolean | null
  className?: string
}

export function CatValidator({ isComplete, isCorrect, className }: CatValidatorProps) {
  const [imageKey, setImageKey] = useState(0)

  // Trigger re-render with transition when state changes
  useEffect(() => {
    setImageKey((prev) => prev + 1)
  }, [isComplete, isCorrect])

  // Determine which cat image to show
  const getCatImage = () => {
    if (!isComplete) {
      return {
        src: "/cats/cat-think.png",
        alt: "Cat thinking - keep working!",
        message: "Keep working...",
      }
    }

    if (isCorrect) {
      return {
        src: "/cats/cat-correct.png",
        alt: "Cat celebrating - correct answer!",
        message: "Purr-fect! 🎉",
      }
    }

    return {
      src: "/cats/cat-wrong.png",
      alt: "Cat confused - incorrect answer",
      message: "Not quite... try again!",
    }
  }

  const catState = getCatImage()

  return (
    <div className={cn("flex flex-col items-center gap-4", className)}>
      <div
        key={imageKey}
        className="relative w-32 h-32 transition-all duration-300 ease-in-out animate-in fade-in zoom-in-95"
      >
        <Image src={catState.src} alt={catState.alt} fill className="object-contain" priority />
      </div>
      <p
        className={cn(
          "text-lg font-semibold text-center transition-colors",
          !isComplete && "text-muted-foreground",
          isComplete && isCorrect && "text-green-600",
          isComplete && !isCorrect && "text-amber-600"
        )}
      >
        {catState.message}
      </p>
    </div>
  )
}
