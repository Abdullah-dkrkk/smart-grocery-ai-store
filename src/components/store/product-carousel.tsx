"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { ProductCard } from "./product-card"
import type { Product } from "@/types/product"

interface ProductCarouselProps {
  products: Product[]
  title?: string
  onAddToCart?: (product: Product) => void
  onToggleWishlist?: (product: Product) => void
  className?: string
  slidesPerView?: 3 | 4 | 5
}

export function ProductCarousel({
  products,
  title,
  onAddToCart,
  onToggleWishlist,
  className,
  slidesPerView = 4,
}: ProductCarouselProps) {
  const [scrollPos, setScrollPos] = useState(0)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(true)

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    const el = e.currentTarget
    setScrollPos(el.scrollLeft)
    setCanScrollLeft(el.scrollLeft > 0)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  function scroll(offset: number) {
    const el = document.getElementById("product-carousel")
    if (!el) return
    const cardWidth = slidesPerView === 5 ? 220 : slidesPerView === 3 ? 350 : 280
    el.scrollBy({ left: offset * cardWidth, behavior: "smooth" })
  }

  if (!products.length) return null

  return (
    <div className={cn("relative", className)}>
      {title && (
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-heading font-semibold tracking-tight">{title}</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              disabled={!canScrollLeft}
              onClick={() => scroll(-1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 rounded-full"
              disabled={!canScrollRight}
              onClick={() => scroll(1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <div
        id="product-carousel"
        className="flex gap-4 overflow-x-auto scrollbar-none snap-x snap-mandatory pb-2"
        onScroll={handleScroll}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {products.map((product) => (
          <div key={product.id} className="snap-start shrink-0" style={{ width: slidesPerView === 5 ? "210px" : slidesPerView === 3 ? "340px" : "270px" }}>
            <ProductCard
              product={product}
              onAddToCart={onAddToCart}
              onToggleWishlist={onToggleWishlist}
              variant="default"
              showDescription={false}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
