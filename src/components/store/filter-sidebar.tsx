"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { SlidersHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProductCategory, ProductSortOption } from "@/types/product"

interface FilterSidebarProps {
  categories: ProductCategory[]
  selectedCategoryId?: number
  minPrice?: number
  maxPrice?: number
  selectedRating?: number
  sortBy?: ProductSortOption
  onCategoryChange?: (categoryId: number | undefined) => void
  onPriceChange?: (min: number | undefined, max: number | undefined) => void
  onRatingChange?: (rating: number | undefined) => void
  onSortChange?: (sort: ProductSortOption) => void
  onReset?: () => void
  className?: string
}

const sortOptions: { label: string; value: ProductSortOption }[] = [
  { label: "Newest", value: "newest" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
  { label: "Top Rated", value: "rating" },
  { label: "Most Popular", value: "popular" },
]

export function FilterSidebar({
  categories,
  selectedCategoryId,
  minPrice,
  maxPrice,
  selectedRating,
  sortBy = "newest",
  onCategoryChange,
  onPriceChange,
  onRatingChange,
  onSortChange,
  onReset,
  className,
}: FilterSidebarProps) {
  const [localMin, setLocalMin] = useState(minPrice?.toString() || "")
  const [localMax, setLocalMax] = useState(maxPrice?.toString() || "")
  const [mobileOpen, setMobileOpen] = useState(false)

  function applyPrice() {
    onPriceChange?.(localMin ? Number(localMin) : undefined, localMax ? Number(localMax) : undefined)
  }

  const filters = (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-semibold mb-3">Sort By</h4>
        <div className="space-y-1">
          {sortOptions.map((opt) => (
            <button
              key={opt.value}
              className={cn(
                "w-full text-left px-3 py-2 text-sm rounded-md transition-colors",
                sortBy === opt.value ? "bg-primary/10 text-primary font-medium" : "hover:bg-muted"
              )}
              onClick={() => onSortChange?.(opt.value)}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-semibold mb-3">Categories</h4>
        <div className="space-y-1 max-h-48 overflow-y-auto">
          <button
            className={cn("w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors", !selectedCategoryId && "bg-primary/10 text-primary font-medium")}
            onClick={() => onCategoryChange?.(undefined)}
          >
            All Categories
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              className={cn(
                "w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors truncate",
                selectedCategoryId === cat.id && "bg-primary/10 text-primary font-medium"
              )}
              onClick={() => onCategoryChange?.(cat.id)}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-semibold mb-3">Price Range</h4>
        <div className="flex items-center gap-2">
          <Input
            placeholder="Min"
            value={localMin}
            onChange={(e) => setLocalMin(e.target.value)}
            className="h-8 text-sm"
            type="number"
            min={0}
          />
          <span className="text-muted-foreground">—</span>
          <Input
            placeholder="Max"
            value={localMax}
            onChange={(e) => setLocalMax(e.target.value)}
            className="h-8 text-sm"
            type="number"
            min={0}
          />
          <Button variant="outline" size="sm" className="h-8 shrink-0" onClick={applyPrice}>
            Go
          </Button>
        </div>
      </div>

      <Separator />

      <div>
        <h4 className="text-sm font-semibold mb-3">Minimum Rating</h4>
        <div className="space-y-1">
          {[4, 3, 2, 1].map((r) => (
            <button
              key={r}
              className={cn(
                "w-full text-left px-3 py-1.5 text-sm rounded-md transition-colors",
                selectedRating === r && "bg-primary/10 text-primary font-medium"
              )}
              onClick={() => onRatingChange?.(selectedRating === r ? undefined : r)}
            >
              {r}+ Stars & up
            </button>
          ))}
        </div>
      </div>

      {onReset && (
        <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={onReset}>
          <X className="h-3.5 w-3.5 mr-1" /> Clear All Filters
        </Button>
      )}
    </div>
  )

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        className="lg:hidden"
        onClick={() => setMobileOpen(true)}
      >
        <SlidersHorizontal className="h-4 w-4 mr-1" /> Filters
      </Button>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-background shadow-xl overflow-y-auto p-5 animate-in slide-in-from-left">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold">Filters</h3>
              <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setMobileOpen(false)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            {filters}
          </div>
        </div>
      )}

      <div className={cn("hidden lg:block w-56 shrink-0", className)}>{filters}</div>
    </>
  )
}
