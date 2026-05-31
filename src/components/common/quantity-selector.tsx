"use client"

import { Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"

interface QuantitySelectorProps {
  value: number
  min?: number
  max?: number
  onChange?: (value: number) => void
  size?: "sm" | "md"
  className?: string
}

export function QuantitySelector({
  value,
  min = 1,
  max = 99,
  onChange,
  size = "md",
  className,
}: QuantitySelectorProps) {
  const isSmall = size === "sm"

  function change(delta: number) {
    const next = value + delta
    if (next >= min && next <= max) {
      onChange?.(next)
    }
  }

  return (
    <div
      className={cn(
        "inline-flex items-center border rounded-lg",
        isSmall ? "h-9" : "h-12",
        className
      )}
    >
      <button
        type="button"
        disabled={value <= min}
        onClick={() => change(-1)}
        className={cn(
          "flex items-center justify-center transition-colors hover:bg-muted disabled:opacity-30 disabled:pointer-events-none",
          isSmall ? "h-full w-7" : "h-full w-10"
        )}
      >
        <Minus className={isSmall ? "h-3 w-3" : "h-4 w-4"} />
      </button>
      <span
        className={cn(
          "font-medium text-center select-none border-x",
          isSmall ? "text-sm min-w-[28px] h-full leading-9" : "text-base min-w-[40px] h-full leading-12"
        )}
      >
        {value}
      </span>
      <button
        type="button"
        disabled={value >= max}
        onClick={() => change(1)}
        className={cn(
          "flex items-center justify-center transition-colors hover:bg-muted disabled:opacity-30 disabled:pointer-events-none",
          isSmall ? "h-full w-7" : "h-full w-10"
        )}
      >
        <Plus className={isSmall ? "h-3 w-3" : "h-4 w-4"} />
      </button>
    </div>
  )
}
