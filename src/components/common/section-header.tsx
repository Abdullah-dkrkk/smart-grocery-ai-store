import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface SectionHeaderProps {
  title: string
  description?: string
  badge?: string
  actionLabel?: string
  onAction?: () => void
  actionHref?: string
  align?: "left" | "center"
  className?: string
}

export function SectionHeader({
  title,
  description,
  badge,
  actionLabel,
  onAction,
  actionHref,
  align = "left",
  className,
}: SectionHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 md:mb-12",
        align === "center" && "sm:items-center text-center",
        className
      )}
    >
      <div className={cn("space-y-1.5", align === "center" && "mx-auto")}>
        {badge && (
          <Badge variant="secondary" className="mb-2">
            {badge}
          </Badge>
        )}
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-heading font-semibold tracking-tight">
          {title}
        </h2>
        {description && (
          <p className="text-sm md:text-base text-muted-foreground max-w-xl">
            {description}
          </p>
        )}
      </div>
      {actionLabel && (
        <Button
          variant="ghost"
          className={cn("shrink-0", align === "center" && "self-center")}
          onClick={onAction}
        >
          {actionLabel}
          <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      )}
    </div>
  )
}
