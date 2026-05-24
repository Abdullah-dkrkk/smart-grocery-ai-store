"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { ProductCategory } from "@/types/product"

interface MegaMenuProps {
  categories: ProductCategory[]
  className?: string
}

export function MegaMenu({ categories, className }: MegaMenuProps) {
  const [openCategory, setOpenCategory] = useState<number | null>(null)

  const topLevel = categories.filter((c) => !c.parent_id)

  return (
    <nav className={cn("hidden md:flex items-center gap-1", className)} onMouseLeave={() => setOpenCategory(null)}>
      {topLevel.map((cat) => (
        <div
          key={cat.id}
          className="relative"
          onMouseEnter={() => setOpenCategory(cat.id)}
        >
          <Link
            href={`/categories/${cat.slug}`}
            className={cn(
              "px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-accent hover:text-accent-foreground",
              openCategory === cat.id && "bg-accent text-accent-foreground"
            )}
          >
            {cat.icon} {cat.name}
          </Link>

          {openCategory === cat.id && cat.children && cat.children.length > 0 && (
            <div className="absolute top-full left-0 mt-1 w-56 rounded-lg border bg-card shadow-lg z-50 p-2 animate-in fade-in slide-in-from-top-1">
              {cat.children.map((child) => (
                <Link
                  key={child.id}
                  href={`/categories/${child.slug}`}
                  className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent transition-colors"
                  onClick={() => setOpenCategory(null)}
                >
                  <span>{child.icon}</span>
                  <span>{child.name}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{child.product_count}</span>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </nav>
  )
}
