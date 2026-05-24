"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/common/star-rating"
import { PriceDisplay } from "@/components/common/price-display"
import type { Product } from "@/types/product"

interface DailyBestSellsProps {
  title?: string
  subtitle?: string
  bannerTitle: string
  bannerDescription: string
  bannerButtonLabel: string
  bannerImage?: string
  products: Product[]
  endDate?: Date
}

function CountdownTimer({ endDate }: { endDate: Date }) {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    function calc() {
      const diff = Math.max(0, endDate.getTime() - Date.now())
      setTime({
        hours: Math.floor(diff / 3600000),
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
    <div className="flex gap-2">
      {[
        { label: "Hours", value: pad(time.hours) },
        { label: "Minutes", value: pad(time.minutes) },
        { label: "Seconds", value: pad(time.seconds) },
      ].map((unit) => (
        <div key={unit.label} className="text-center">
          <div className="bg-white/20 text-white text-lg font-bold w-12 h-12 rounded-lg flex items-center justify-center backdrop-blur-sm">
            {unit.value}
          </div>
          <span className="text-[11px] text-white/80 mt-0.5 block font-medium">{unit.label}</span>
        </div>
      ))}
    </div>
  )
}

function DailyProductCard({ product }: { product: Product }) {
  const [hovered, setHovered] = useState(false)
  const discount = !product.category_slug?.includes("seafood") && product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null
  const badgeMap: Record<string, string> = {
    Hot: "bg-orange-500", Sale: "bg-red-500", New: "bg-emerald-500",
    Organic: "bg-green-600", Fresh: "bg-sky-500",
  }

  return (
    <div className="bg-card border rounded-xl overflow-hidden transition-shadow hover:shadow-lg flex flex-col"
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <img src={product.image} alt={product.name}
          className={`h-full w-full object-cover transition-transform duration-500 ${hovered ? "scale-105" : ""}`}
          loading="lazy" />
        {product.badge && (
          <Badge className={`absolute top-3 left-3 text-xs px-2 py-0.5 font-semibold ${badgeMap[product.badge] || "bg-brand-green"} text-white`}>
            {product.badge}
          </Badge>
        )}
        {discount && discount > 0 && (
          <Badge className="absolute top-3 right-3 text-xs px-2 py-0.5 font-semibold bg-amber-500 text-white">
            -{discount}%
          </Badge>
        )}
      </div>
      <div className="p-4 flex flex-col gap-2 flex-1">
        <StarRating rating={product.rating} size="sm" showValue reviewCount={product.review_count} />
        <h3 className="text-[17px] font-semibold leading-snug line-clamp-2">{product.name}</h3>
        <p className="text-xs text-muted-foreground">By SmartGrocery</p>
        <div className="mt-auto flex items-center justify-between pt-2">
          <PriceDisplay price={product.price} comparePrice={product.compare_price ?? undefined} size="md" />
          <Button className="text-xs px-4 h-9 rounded-lg bg-brand-green hover:bg-brand-green/90 text-white font-medium">
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  )
}

export function DailyBestSells({
  title = "Daily Best Sells",
  subtitle,
  bannerTitle,
  bannerDescription,
  bannerButtonLabel,
  bannerImage,
  products,
  endDate,
}: DailyBestSellsProps) {
  const targetDate = endDate || new Date(Date.now() + 86400000)

  return (
    <section>
      <div className="mb-6">
        <h2 className="text-3xl font-heading font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-[15px] text-muted-foreground mt-1">{subtitle}</p>}
      </div>

      <div className="grid lg:grid-cols-4 gap-5">
        <div className="relative rounded-xl overflow-hidden bg-gradient-to-br from-brand-green/90 to-brand-green/70 lg:col-span-1 p-6 min-h-[350px] flex flex-col justify-between">
          {bannerImage && (
            <img src={bannerImage} alt="" className="absolute right-0 bottom-0 h-3/4 w-auto object-contain opacity-30" loading="lazy" />
          )}
          <div className="relative z-10">
            <p className="text-white/80 text-sm mb-1">{bannerDescription}</p>
            <h3 className="text-2xl font-heading font-semibold text-white leading-snug">{bannerTitle}</h3>
          </div>
          <div className="relative z-10 space-y-4">
            <CountdownTimer endDate={targetDate} />
            <Button variant="secondary" size="default" className="bg-white text-brand-green hover:bg-white/90 font-semibold">
              {bannerButtonLabel} →
            </Button>
          </div>
        </div>

        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-3 gap-5">
          {products.slice(0, 3).map((product) => (
            <DailyProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  )
}
