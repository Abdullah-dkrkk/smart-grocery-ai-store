import { cn } from "@/lib/utils"

interface PriceDisplayProps {
  price: number
  comparePrice?: number | null
  size?: "sm" | "md" | "lg"
  currency?: string
  unit?: string
  variant?: "default" | "sale" | "range"
  className?: string
}

const sizeMap = {
  sm: { current: "text-sm", original: "text-xs" },
  md: { current: "text-lg", original: "text-sm" },
  lg: { current: "text-2xl", original: "text-base" },
}

export function PriceDisplay({
  price,
  comparePrice,
  size = "md",
  currency = "$",
  unit,
  variant = "default",
  className,
}: PriceDisplayProps) {
  const sizes = sizeMap[size]
  const isSale = variant === "sale" || (comparePrice !== undefined && comparePrice !== null && comparePrice > price)
  const discount = comparePrice ? Math.round((1 - price / comparePrice) * 100) : 0

  return (
    <div className={cn("flex items-baseline gap-2 flex-wrap", className)}>
      <span className={cn(sizes.current, "font-bold text-foreground")}>
        {currency}{price.toFixed(2)}
      </span>
      {isSale && comparePrice && (
        <>
          <span className={cn(sizes.original, "text-muted-foreground line-through")}>
            {currency}{comparePrice.toFixed(2)}
          </span>
          {discount > 0 && (
            <span className="text-xs font-medium text-brand-orange bg-brand-orange/10 px-1.5 py-0.5 rounded">
              -{discount}%
            </span>
          )}
        </>
      )}
      {unit && <span className="text-xs text-muted-foreground">/{unit}</span>}
    </div>
  )
}
