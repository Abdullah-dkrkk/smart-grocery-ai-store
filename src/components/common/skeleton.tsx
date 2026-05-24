import { cn } from "@/lib/utils"

interface SkeletonProps {
  className?: string
  variant?: "text" | "circular" | "rectangular" | "card" | "product-card"
}

export function Skeleton({ className, variant = "text" }: SkeletonProps) {
  if (variant === "product-card") {
    return (
      <div className="rounded-xl border bg-card overflow-hidden">
        <div className="aspect-[4/3] bg-muted animate-pulse" />
        <div className="p-4 space-y-3">
          <div className="h-3 w-16 bg-muted rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
          <div className="h-3 w-full bg-muted rounded animate-pulse" />
          <div className="flex items-center justify-between pt-2">
            <div className="h-5 w-20 bg-muted rounded animate-pulse" />
            <div className="h-8 w-20 bg-muted rounded-full animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (variant === "card") {
    return (
      <div className="rounded-xl border bg-card p-6 space-y-4">
        <div className="h-4 w-1/3 bg-muted rounded animate-pulse" />
        <div className="h-3 w-2/3 bg-muted rounded animate-pulse" />
        <div className="h-3 w-full bg-muted rounded animate-pulse" />
        <div className="h-3 w-4/5 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  return (
    <div
      className={cn(
        "animate-pulse bg-muted",
        variant === "circular" && "rounded-full",
        variant === "text" && "h-4 w-full rounded",
        variant === "rectangular" && "rounded-lg",
        className
      )}
    />
  )
}

export function ProductGridSkeleton({ count = 8, columns = 4 }: { count?: number; columns?: number }) {
  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-${columns} gap-4 md:gap-6`}>
      {Array.from({ length: count }, (_, i) => (
        <Skeleton key={i} variant="product-card" />
      ))}
    </div>
  )
}
