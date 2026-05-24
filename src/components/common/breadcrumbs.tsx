import Link from "next/link"
import { ChevronRight, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BreadcrumbItem } from "@/types/common"

interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
  showHome?: boolean
}

export function Breadcrumbs({ items, className, showHome = true }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cn("flex items-center gap-1 text-sm text-muted-foreground", className)}>
      {showHome && (
        <>
          <Link href="/" className="hover:text-foreground transition-colors">
            <Home className="h-4 w-4" />
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
        </>
      )}
      {items.map((item, i) => {
        const isLast = i === items.length - 1
        return (
          <span key={i} className="flex items-center gap-1">
            {item.href && !isLast ? (
              <Link href={item.href} className="hover:text-foreground transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className={cn(isLast ? "text-foreground font-medium" : "")}>{item.label}</span>
            )}
            {!isLast && <ChevronRight className="h-3.5 w-3.5" />}
          </span>
        )
      })}
    </nav>
  )
}
