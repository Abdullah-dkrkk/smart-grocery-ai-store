"use client"

import { useState, useRef, useCallback } from "react"
import Link from "next/link"
import { ChevronLeft, ChevronRight, Heart, Eye, Loader2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/common/star-rating"
import { PriceDisplay } from "@/components/common/price-display"
import { handleImgError } from "@/lib/utils/placeholder"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { useToast } from "@/components/ui/toast"
import { useCartContext } from "@/lib/providers/cart-provider"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/product"

interface Tab {
  slug: string
  name: string
}

interface ProductSliderProps {
  title: string
  description?: string
  products: Product[]
  tabs?: Tab[]
}

const badgeStyles: Record<string, string> = {
  Hot: "bg-orange-500 text-white",
  Sale: "bg-red-500 text-white",
  New: "bg-emerald-500 text-white",
  Organic: "bg-green-600 text-white",
  Fresh: "bg-sky-500 text-white",
}

function ProductSlideCard({ product }: { product: Product | null | undefined }) {
  if (!product) return null
  const badgeClass = product.badge ? badgeStyles[product.badge] || "bg-brand-green text-white" : ""
  const discount = !product.category_slug?.includes("seafood") && product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null
  const [hovered, setHovered] = useState(false)
  const [cartState, setCartState] = useState<"idle" | "loading" | "added">("idle")
  const { isWishlisted, toggleWishlist, loadingId } = useWishlist()
  const { showToast } = useToast()
  const { addItem } = useCartContext()
  const loading = loadingId === product.id
  const wishlisted = isWishlisted(product.id)

  async function handleAddToCart() {
    if (cartState === "loading" || !product) return
    setCartState("loading")
    await Promise.all([
      addItem(product),
      new Promise((r) => setTimeout(r, 500)),
    ])
    setCartState("added")
    setTimeout(() => setCartState("idle"), 2000)
  }

  return (
    <div className="w-[280px] flex-shrink-0 snap-start">
      <div
        className="relative bg-card border rounded-lg overflow-hidden transition-shadow hover:shadow-lg"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="relative aspect-[28/31] overflow-hidden bg-muted">
          {loading && (
            <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
              <Loader2 className="h-8 w-8 animate-spin text-white" />
            </div>
          )}
          <img
            src={product.image}
            alt={product.name}
            className={`h-full w-full object-cover transition-transform duration-500 ${hovered ? "scale-105" : ""}`}
            loading="lazy"
            onError={handleImgError}
          />
          {product.badge && (
            <Badge className={`absolute top-2 left-2 text-xs px-2 py-0.5 font-semibold ${badgeClass}`}>
              {product.badge}
            </Badge>
          )}
          {discount && discount > 0 && (
            <Badge className="absolute top-2 right-2 text-xs px-2 py-0.5 font-semibold bg-amber-500 text-white">
              -{discount}%
            </Badge>
          )}
          <div className={`absolute inset-0 flex items-center justify-center gap-2 transition-opacity ${hovered ? "opacity-100" : "opacity-0"} bg-black/10`}>
            <button
              type="button"
              className="h-9 w-9 rounded-full bg-white shadow flex items-center justify-center cursor-pointer outline-none focus:outline-none active:outline-none transition-transform hover:scale-105"
              onClick={async () => {
                await toggleWishlist(product)
                showToast(wishlisted ? "Removed from Wishlist" : "Added to Wishlist!")
              }}
            >
              <Heart className={cn("h-4 w-4 transition-colors", wishlisted && "fill-brand-green text-brand-green")} />
            </button>
            <Link href={`/products/${product.slug}`}>
              <button type="button" className="h-9 w-9 rounded-full bg-white shadow flex items-center justify-center cursor-pointer outline-none focus:outline-none active:outline-none transition-transform hover:scale-105">
                <Eye className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>
        <div className="p-4 space-y-2">
          <StarRating rating={product.rating} size="sm" showValue reviewCount={product.review_count} />
          <h3 className="text-[17px] font-semibold leading-snug line-clamp-2 min-h-[50px]">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground">By SmartGrocery</p>
          <div className="pt-2 space-y-2">
            <div className="mb-3.5">
              <PriceDisplay price={product.price} comparePrice={product.compare_price ?? undefined} size="md" />
            </div>
            <Button
              className="w-full h-9 min-h-[38px] text-base rounded-[10px] bg-brand-green hover:bg-brand-green/90 text-white cursor-pointer uppercase"
              onClick={handleAddToCart}
              disabled={cartState === "loading"}
            >
              {cartState === "loading" ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : cartState === "added" ? (
                <Check className="h-3 w-3 mr-1" />
              ) : null}
              {cartState === "added" ? "Added" : "Add to Cart"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export function ProductSlider({ title, description, products = [], tabs }: ProductSliderProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeTab, setActiveTab] = useState<string>("all")
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const safeProducts = Array.isArray(products) ? products : []
  const filtered = activeTab === "all"
    ? safeProducts
    : safeProducts.filter((p) => p && p.category_slug === activeTab)

  const scroll = (dir: "left" | "right") => {
    if (!scrollRef.current) return
    const cardWidth = 280 + 20
    const scrollAmount = cardWidth * 1.5
    scrollRef.current.scrollBy({ left: dir === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" })
  }

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - scrollRef.current.offsetLeft)
    setScrollLeft(scrollRef.current.scrollLeft)
  }, [])

  const handleMouseUp = useCallback(() => {
    setIsDragging(false)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !scrollRef.current) return
    e.preventDefault()
    const x = e.pageX - scrollRef.current.offsetLeft
    const walk = (x - startX) * 1.5
    scrollRef.current.scrollLeft = scrollLeft - walk
  }, [isDragging, startX, scrollLeft])

  const handleMouseLeave = useCallback(() => {
    setIsDragging(false)
  }, [])

  return (
    <section>
      <div className="flex items-end justify-between mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-3xl font-heading font-semibold tracking-tight">{title}</h2>
            <Badge variant="secondary" className="text-xs">Trending</Badge>
          </div>
          {description && (
            <p className="text-[15px] text-muted-foreground mt-1">{description}</p>
          )}
        </div>
        <div className="hidden sm:flex gap-2">
          <Button size="icon" className="h-9 w-9 rounded-full bg-brand-green hover:bg-brand-green/90 text-white" onClick={() => scroll("left")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button size="icon" className="h-9 w-9 rounded-full bg-brand-green hover:bg-brand-green/90 text-white" onClick={() => scroll("right")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {tabs && tabs.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-6 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.slug}
              onClick={() => setActiveTab(tab.slug)}
              className={`px-5 py-2.5 text-sm font-medium transition-colors relative ${
                activeTab === tab.slug
                  ? "text-brand-green"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.name}
              {activeTab === tab.slug && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-brand-green rounded-full" />
              )}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-xl font-heading text-muted-foreground py-8">No products found in this category.</p>
        </div>
      ) : (
        <div className="relative group -mx-1">
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`flex gap-5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-3 px-1
              [&::-webkit-scrollbar]:h-1.5
              [&::-webkit-scrollbar-track]:bg-muted/30
              [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20
              [&::-webkit-scrollbar-thumb]:rounded-full
              ${isDragging ? "cursor-grabbing select-none" : "cursor-grab"}`}
          >
            {filtered.map((product, idx) => (
              <ProductSlideCard key={product?.id ?? idx} product={product} />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
