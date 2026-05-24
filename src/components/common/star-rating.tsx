import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

interface StarRatingProps {
  rating: number
  maxRating?: number
  size?: "sm" | "md" | "lg"
  showValue?: boolean
  reviewCount?: number
  interactive?: boolean
  onChange?: (rating: number) => void
  className?: string
}

const sizeMap = { sm: "h-3 w-3", md: "h-4 w-4", lg: "h-5 w-5" }

export function StarRating({
  rating,
  maxRating = 5,
  size = "sm",
  showValue = false,
  reviewCount,
  interactive = false,
  onChange,
  className,
}: StarRatingProps) {
  const stars = Array.from({ length: maxRating }, (_, i) => i + 1)
  const sizeClass = sizeMap[size]

  return (
    <div className={cn("flex items-center gap-0.5", className)}>
      {stars.map((star) => {
        const filled = star <= Math.floor(rating)
        const partial = !filled && star - rating < 1 && star - rating > 0
        const fillPercent = partial ? (rating - Math.floor(rating)) * 100 : filled ? 100 : 0

        return (
          <button
            key={star}
            type={interactive ? "button" : undefined}
            disabled={!interactive}
            onClick={() => interactive && onChange?.(star)}
            className={cn(interactive && "cursor-pointer hover:scale-110 transition-transform")}
          >
            <div className="relative">
              <Star className={cn(sizeClass, "text-muted-foreground/30")} />
              <div
                className="absolute inset-0 overflow-hidden"
                style={{ width: `${fillPercent}%` }}
              >
                <Star className={cn(sizeClass, "fill-yellow-400 text-yellow-400")} />
              </div>
            </div>
          </button>
        )
      })}
      {showValue && <span className="text-sm font-medium ml-1">{rating.toFixed(1)}</span>}
      {reviewCount !== undefined && (
        <span className="text-xs text-muted-foreground ml-1">({reviewCount})</span>
      )}
    </div>
  )
}
