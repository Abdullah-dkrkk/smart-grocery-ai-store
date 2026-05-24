"use client"

import { useRef, useState, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { categorySvgs } from "@/components/sections/category-icons"
import type { ProductCategory } from "@/types/product"

const slugToSvgKey: Record<string, string> = {
  "milks-dairies": "milks", "milk-diaries": "milks",
  "wines-drinks": "wines",
  "clothing-beauty": "clothing",
  "pet-foods": "pet",
  "baking-material": "baking",
  "fresh-fruit": "fruit", "fruits": "fruit",
  "vegetables": "vegetables",
  "bread-juice": "bread",
  "fresh-seafood": "seafood",
  "fast-food": "cake",
  "cake-milk": "cake",
  "coffee-teas": "coffee", "cookies-teas": "coffee",
  "meat": "seafood", "breakfast": "baking",
}

function getSvgForSlug(slug: string): React.ReactNode | null {
  const key = slugToSvgKey[slug]
  return key ? categorySvgs[key] ?? null : null
}

interface CategoryShowcaseProps {
  title: string
  description?: string
  categories: ProductCategory[]
}

function getCategoryBg(index: number): string {
  const colors = [
    "bg-emerald-50 dark:bg-emerald-950/30",
    "bg-orange-50 dark:bg-orange-950/30",
    "bg-blue-50 dark:bg-blue-950/30",
    "bg-rose-50 dark:bg-rose-950/30",
    "bg-violet-50 dark:bg-violet-950/30",
    "bg-amber-50 dark:bg-amber-950/30",
    "bg-cyan-50 dark:bg-cyan-950/30",
    "bg-pink-50 dark:bg-pink-950/30",
    "bg-lime-50 dark:bg-lime-950/30",
    "bg-indigo-50 dark:bg-indigo-950/30",
    "bg-teal-50 dark:bg-teal-950/30",
    "bg-red-50 dark:bg-red-950/30",
  ]
  return colors[index % colors.length]
}

function getCategoryIconBg(index: number): string {
  const colors = [
    "bg-emerald-100 dark:bg-emerald-900/50 text-emerald-600 dark:text-emerald-300",
    "bg-orange-100 dark:bg-orange-900/50 text-orange-600 dark:text-orange-300",
    "bg-blue-100 dark:bg-blue-900/50 text-blue-600 dark:text-blue-300",
    "bg-rose-100 dark:bg-rose-900/50 text-rose-600 dark:text-rose-300",
    "bg-violet-100 dark:bg-violet-900/50 text-violet-600 dark:text-violet-300",
    "bg-amber-100 dark:bg-amber-900/50 text-amber-600 dark:text-amber-300",
    "bg-cyan-100 dark:bg-cyan-900/50 text-cyan-600 dark:text-cyan-300",
    "bg-pink-100 dark:bg-pink-900/50 text-pink-600 dark:text-pink-300",
    "bg-lime-100 dark:bg-lime-900/50 text-lime-600 dark:text-lime-300",
    "bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300",
    "bg-teal-100 dark:bg-teal-900/50 text-teal-600 dark:text-teal-300",
    "bg-red-100 dark:bg-red-900/50 text-red-600 dark:text-red-300",
  ]
  return colors[index % colors.length]
}

export function CategoryShowcase({
  title,
  description,
  categories,
}: CategoryShowcaseProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!scrollRef.current) return
    e.preventDefault()
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

  function scroll(dir: "left" | "right") {
    if (!scrollRef.current) return
    const cardWidth = 160
    const scrollAmount = cardWidth * 1.5
    scrollRef.current.scrollBy({ left: dir === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" })
  }

  return (
    <section>
      <div className="flex items-end justify-between mb-6">
        <div>
          <h2 className="text-3xl font-heading font-semibold tracking-tight">{title}</h2>
          {description && <p className="text-[15px] text-muted-foreground mt-1">{description}</p>}
        </div>
        {categories.length > 0 && (
          <div className="hidden sm:flex items-center gap-3">
            <Button variant="ghost" className="gap-1 text-sm text-brand-green hover:text-brand-green/80 font-semibold">
              View All <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {categories.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-xl font-heading text-muted-foreground py-8">No categories available.</p>
        </div>
      ) : (
        <>
          <div
            ref={scrollRef}
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            className={`flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory py-3 select-none
            [&::-webkit-scrollbar]:h-1.5
            [&::-webkit-scrollbar-track]:bg-muted/30
            [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20
            [&::-webkit-scrollbar-thumb]:rounded-full
            ${isDragging ? "cursor-grabbing" : "cursor-grab"}`}>
            {categories.map((cat, idx) => (
              <a key={cat.id} href={`/category/${cat.slug}`} draggable="false"
                className={`group flex flex-col items-center justify-center text-center p-6 rounded-xl border transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 min-w-[160px] min-h-[200px] flex-shrink-0 snap-start ${getCategoryBg(idx)}`}>
                <span className={`inline-flex items-center justify-center w-[68px] h-[68px] rounded-full text-2xl mb-3 transition-transform duration-200 group-hover:scale-110 ${getCategoryIconBg(idx)}`}>
                  {getSvgForSlug(cat.slug)}
                </span>
                <span className="text-[15px] font-heading font-semibold leading-tight line-clamp-2">{cat.name}</span>
                <span className="text-xs text-muted-foreground mt-1">{cat.product_count} items</span>
              </a>
            ))}
          </div>

          <div className="flex justify-end mt-4 gap-2">
            <Button size="icon" className="h-9 w-9 rounded-full bg-brand-green hover:bg-brand-green/90 text-white" onClick={() => scroll("left")}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button size="icon" className="h-9 w-9 rounded-full bg-brand-green hover:bg-brand-green/90 text-white" onClick={() => scroll("right")}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}
    </section>
  )
}
