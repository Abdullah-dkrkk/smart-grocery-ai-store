"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/common/star-rating"
import { PriceDisplay } from "@/components/common/price-display"
import { Loader2, Check } from "lucide-react"
import { handleImgError } from "@/lib/utils/placeholder"
import { useCartContext } from "@/lib/providers/cart-provider"
import type { Product } from "@/types/product"

interface DealsOfDayProps {
  title?: string
  subtitle?: string
  products: Product[]
  endDate?: Date
  featuredProduct?: Product
}

function DealProductCard({ product, discount }: { product: Product; discount: number | null }) {
  const [cartState, setCartState] = useState<"idle" | "loading" | "added">("idle")
  const { addItem } = useCartContext()

  async function handleAdd() {
    if (cartState === "loading") return
    setCartState("loading")
    await Promise.all([
      addItem(product),
      new Promise((r) => setTimeout(r, 500)),
    ])
    setCartState("added")
    setTimeout(() => setCartState("idle"), 2000)
  }

  return (
    <div className="flex gap-4 bg-card border rounded-lg p-4 transition-shadow hover:shadow-md">
      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
        <img src={product.image} alt={product.name} className="h-full w-full object-cover" loading="lazy" onError={handleImgError} />
        {discount && discount > 0 && (
          <span className="absolute top-1 right-1 bg-amber-500 text-white text-[10px] font-bold px-1.5 rounded-sm">
            -{discount}%
          </span>
        )}
      </div>
      <div className="flex flex-col justify-between min-w-0 flex-1">
        <div>
          <StarRating rating={product.rating} size="sm" showValue reviewCount={product.review_count} />
          <h4 className="text-[17px] font-semibold leading-snug line-clamp-1 mt-1">{product.name}</h4>
          <p className="text-xs text-muted-foreground">By Global Store</p>
        </div>
        <div className="flex items-center justify-between mt-2">
          <PriceDisplay price={product.price} comparePrice={product.compare_price ?? undefined} size="md" />
          <Button
            className="text-xs px-4 h-9 rounded-lg bg-brand-green hover:bg-brand-green/90 text-white font-medium cursor-pointer"
            onClick={handleAdd}
            disabled={cartState === "loading"}
          >
            {cartState === "loading" ? (
              <Loader2 className="h-3 w-3 mr-1 animate-spin" />
            ) : cartState === "added" ? (
              <Check className="h-3 w-3 mr-1" />
            ) : null}
            {cartState === "added" ? "Added" : "Add"}
          </Button>
        </div>
      </div>
    </div>
  )
}

function DealsCountdown({ endDate }: { endDate: Date }) {
  const [time, setTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function calc() {
      const diff = Math.max(0, endDate.getTime() - Date.now())
      setTime({
        days: Math.floor(diff / 86400000),
        hours: Math.floor((diff % 86400000) / 3600000),
        minutes: Math.floor((diff % 3600000) / 60000),
        seconds: Math.floor((diff % 60000) / 1000),
      })
    }
    calc()
    const timer = setInterval(calc, 1000)
    return () => clearInterval(timer)
  }, [endDate])

  const pad = (n: number) => String(n).padStart(2, "0")

  return (
    <div className="flex gap-1.5">
      {[
        { label: "Days", value: pad(time.days) },
        { label: "Hours", value: pad(time.hours) },
        { label: "Minutes", value: pad(time.minutes) },
        { label: "Seconds", value: pad(time.seconds) },
      ].map((unit) => (
        <div key={unit.label} className="text-center">
          <div className="bg-brand-green text-white text-sm font-bold min-w-[40px] h-9 rounded flex items-center justify-center px-2">
            {unit.value}
          </div>
          <span className="text-[10px] text-muted-foreground block mt-0.5">{unit.label}</span>
        </div>
      ))}
    </div>
  )
}

export function DealsOfDay({
  title = "Deals Of The Day",
  subtitle,
  products = [],
  endDate,
  featuredProduct,
}: DealsOfDayProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const targetDate = endDate || new Date(Date.now() + 86400000)
  const safeProducts = Array.isArray(products) ? products : []
  const fp = featuredProduct && featuredProduct.id ? featuredProduct : safeProducts[0]

  if (!fp) return null

  const discount = !fp.category_slug?.includes("seafood") && fp.compare_price
    ? Math.round(((fp.compare_price - fp.price) / fp.compare_price) * 100)
    : null

  return (
    <section>
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-3xl font-heading font-semibold tracking-tight">{title}</h2>
          <Badge variant="secondary" className="text-xs">Limited</Badge>
        </div>
        {subtitle && <p className="text-[15px] text-muted-foreground mt-1">{subtitle}</p>}
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Featured Product */}
        <div className="lg:col-span-5 bg-card border rounded-xl overflow-y-auto max-h-[560px] flex flex-col">
          <div className="relative aspect-[4/3] overflow-hidden bg-muted">
            <img src={fp.image} alt={fp.name} className="h-full w-full object-cover" loading="lazy" onError={handleImgError} />
            {fp.badge && (
              <Badge className="absolute top-3 left-3 bg-brand-green text-white text-xs px-2">{fp.badge}</Badge>
            )}
            {discount && discount > 0 && (
              <Badge className="absolute top-3 right-3 bg-amber-500 text-white text-sm px-3 py-1 font-bold">
                -{discount}%
              </Badge>
            )}
          </div>
          <div className="p-5 space-y-4">
            <div className="flex items-center justify-between">
              <StarRating rating={fp.rating} size="md" showValue reviewCount={fp.review_count} />
              <span className="text-xs text-muted-foreground">By Global Store</span>
            </div>
            <h3 className="text-[17px] font-heading font-semibold">{fp.name}</h3>
            <PriceDisplay price={fp.price} comparePrice={fp.compare_price ?? undefined} size="lg" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-muted-foreground">Hurry Up! Offer End In:</p>
              <DealsCountdown endDate={targetDate} />
            </div>
            <Button className="w-full bg-brand-green hover:bg-brand-green/90 text-white font-semibold h-11">
              Shop Now
            </Button>
          </div>
        </div>

        {/* Scrollable Deals */}
        <div className="lg:col-span-7">
          <div ref={scrollRef} className="space-y-4 max-h-[560px] overflow-y-auto pr-2
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-muted/30
            [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20
            [&::-webkit-scrollbar-thumb]:rounded-full">
            {safeProducts.slice(0, 6).map((product) => {
              if (!product) return null
              const dsc = !product.category_slug?.includes("seafood") && product.compare_price
                ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
                : null

              return <DealProductCard key={product.id} product={product} discount={dsc} />
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
