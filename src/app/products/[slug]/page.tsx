"use client"

import { useState, use, useRef, useCallback } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
import { AnnouncementBar } from "@/components/sections/announcement-bar"
import { Header } from "@/components/sections/header"
import { Breadcrumbs } from "@/components/common/breadcrumbs"
import { PriceDisplay } from "@/components/common/price-display"
import { StarRating } from "@/components/common/star-rating"
import { QuantitySelector } from "@/components/common/quantity-selector"
import { AddToCartButton } from "@/components/store/add-to-cart-button"
import { ProductSlider } from "@/components/store/product-slider"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { Footer } from "@/components/store/footer"
import { useProductBySlug, useRelatedProducts } from "@/lib/hooks/use-products"
import { useReviews } from "@/lib/hooks/use-reviews"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { useToast } from "@/components/ui/toast"
import { useCartContext } from "@/lib/providers/cart-provider"
import { Heart, Share2, Truck, ShieldCheck, RotateCcw, Check, Loader2, Store, Apple, Flame } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProductCategory } from "@/types/product"

const announcements = [
  { text: "Grand opening — up to 15% off all items. Only 3 days left!" },
  { text: "Free delivery on orders over $50 — shop now!" },
  { text: "Trendy 25 silver jewelry — save up to 35% off today!" },
]

const allCategories: ProductCategory[] = [
  { id: 1, name: "Milks & Dairies", slug: "milks-dairies", description: "", image: "", icon: "", parent_id: null, product_count: 30 },
  { id: 2, name: "Wines & Drinks", slug: "wines-drinks", description: "", image: "", icon: "", parent_id: null, product_count: 25 },
  { id: 3, name: "Clothing & Beauty", slug: "clothing-beauty", description: "", image: "", icon: "", parent_id: null, product_count: 45 },
  { id: 4, name: "Pet Foods & Toys", slug: "pet-foods", description: "", image: "", icon: "", parent_id: null, product_count: 18 },
  { id: 5, name: "Baking Material", slug: "baking-material", description: "", image: "", icon: "", parent_id: null, product_count: 35 },
  { id: 6, name: "Fresh Fruit", slug: "fresh-fruit", description: "", image: "", icon: "", parent_id: null, product_count: 50 },
  { id: 7, name: "Vegetables", slug: "vegetables", description: "", image: "", icon: "", parent_id: null, product_count: 65 },
  { id: 8, name: "Bread & Juice", slug: "bread-juice", description: "", image: "", icon: "", parent_id: null, product_count: 28 },
  { id: 9, name: "Fresh Seafood", slug: "fresh-seafood", description: "", image: "", icon: "", parent_id: null, product_count: 22 },
  { id: 10, name: "Fast Food", slug: "fast-food", description: "", image: "", icon: "", parent_id: null, product_count: 40 },
  { id: 11, name: "Cake & Milk", slug: "cake-milk", description: "", image: "", icon: "", parent_id: null, product_count: 15 },
  { id: 12, name: "Coffee & Teas", slug: "coffee-teas", description: "", image: "", icon: "", parent_id: null, product_count: 33 },
]

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>
}

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-5 w-64 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="flex gap-4">
            <div className="flex flex-col shrink-0 gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="bg-card border rounded-xl overflow-hidden">
                  <div className="w-20 h-20">
                    <Skeleton className="w-full h-full rounded-none" />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex-1 bg-card border rounded-2xl overflow-hidden">
              <div className="aspect-square">
                <Skeleton className="w-full h-full rounded-none" />
              </div>
            </div>
          </div>
          <div className="bg-card border rounded-xl p-6 space-y-6">
            <div className="space-y-3">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-8 w-3/4" />
              <Skeleton className="h-5 w-48" />
            </div>
            <Skeleton className="h-px w-full" />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-16 w-full" />
            <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-3 border">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
            <Skeleton className="h-px w-full" />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-28 rounded-lg" />
              <Skeleton className="h-12 flex-1 rounded-lg" />
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-12 w-12 rounded-lg" />
            </div>
            <Skeleton className="h-5 w-40" />
            <Skeleton className="h-px w-full" />
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-card border rounded-xl p-3">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-5 w-5 rounded" />
                    <div className="flex-1 space-y-1">
                      <Skeleton className="h-3 w-20" />
                      <Skeleton className="h-2 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function NutritionCard({ data }: { data: Record<string, unknown> }) {
  const fmt = (v: unknown) => v != null ? String(v) : null
  const num = (v: unknown) => typeof v === "number" ? v : null
  const bool = (v: unknown) => v === true

  const primary = [
    { label: "Calories", value: num(data.calories), unit: "kcal", icon: Flame },
    { label: "Protein", value: num(data.protein), unit: "g", icon: Apple },
    { label: "Carbs", value: num(data.carbs), unit: "g", icon: Apple },
    { label: "Fat", value: num(data.fat), unit: "g", icon: Apple },
    { label: "Fiber", value: num(data.fiber), unit: "g", icon: Apple },
    { label: "Sugar", value: num(data.sugar), unit: "g", icon: Apple },
  ].filter((i) => i.value !== null)

  const badgeList: { label: string; active: boolean }[] = [
    { label: "Vegetarian", active: bool(data.is_vegetarian) },
    { label: "Vegan", active: bool(data.is_vegan) },
    { label: "Gluten Free", active: bool(data.is_gluten_free) },
    { label: "Keto Friendly", active: bool(data.is_keto_friendly) },
  ]

  const vitaminList: { label: string; value: unknown }[] = [
    { label: "Vitamin A", value: data.vitamin_a },
    { label: "Vitamin C", value: data.vitamin_c },
    { label: "Calcium", value: data.calcium },
    { label: "Iron", value: data.iron },
  ]

  return (
    <div className="space-y-8">
      {fmt(data.serving_size) && (
        <p className="text-sm text-muted-foreground flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-brand-green" />
          Per serving: <span className="font-medium text-foreground">{fmt(data.serving_size)}</span>
        </p>
      )}

      <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))" }}>
        {primary.map((item) => (
          <div
            key={item.label}
            className="relative bg-gradient-to-b from-brand-green/5 to-transparent rounded-2xl p-4 text-center border border-brand-green/10 shadow-sm hover:shadow-md hover:border-brand-green/20 transition-all"
          >
            <div className="w-9 h-9 mx-auto mb-2.5 rounded-full bg-brand-green/10 flex items-center justify-center">
              <item.icon className="h-4 w-4 text-brand-green" />
            </div>
            <p className="text-xl font-bold font-heading text-foreground">{item.value}</p>
            <p className="text-[11px] text-muted-foreground/70 font-medium uppercase tracking-wider">{item.unit}</p>
            <p className="text-[11px] text-muted-foreground font-medium mt-1">{item.label}</p>
          </div>
        ))}
      </div>

      {badgeList.some((b) => b.active) && (
        <div className="flex flex-wrap gap-2">
          {badgeList.filter((b) => b.active).map((b) => (
            <Badge
              key={b.label}
              className="bg-brand-green/10 text-brand-green border-brand-green/20 text-xs px-3 py-1 rounded-full font-medium"
            >
              {b.label}
            </Badge>
          ))}
        </div>
      )}

      {vitaminList.some((v) => v.value != null) && (
        <div className="bg-muted/30 rounded-2xl p-5 border border-border/50">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Vitamins & Minerals</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {vitaminList.map((item) => {
              const v = item.value
              if (v == null) return null
              return (
                <div key={item.label} className="bg-background rounded-xl p-3 border border-border/50">
                  <p className="text-base font-bold font-heading text-foreground">
                    {fmt(v)}{typeof v === "number" && v > 0 ? "%" : ""}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{item.label}</p>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {fmt(data.health_notes) && (
        <div className="bg-brand-green/5 border border-brand-green/10 rounded-xl p-4">
          <p className="text-sm text-muted-foreground italic leading-relaxed">
            &ldquo;{fmt(data.health_notes)}&rdquo;
          </p>
        </div>
      )}

      {Array.isArray(data.allergens) && (data.allergens as unknown[]).length > 0 && (
        <div className="flex items-center gap-2 text-xs text-amber-600 bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 dark:border-amber-800/30 rounded-lg px-3 py-2">
          <span className="font-medium">Contains:</span>
          <span className="flex gap-1.5">
            {(data.allergens as string[]).map((a) => (
              <span key={a} className="bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 rounded-md capitalize text-amber-700 dark:text-amber-400">
                {a}
              </span>
            ))}
          </span>
        </div>
      )}
    </div>
  )
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = use(params)
  const { showToast } = useToast()
  const { isWishlisted, toggleWishlist, loadingId } = useWishlist(showToast)
  const { addItem } = useCartContext()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState("description")
  const [isZoomed, setIsZoomed] = useState(false)
  const [zoomPos, setZoomPos] = useState({ x: 50, y: 50 })
  const [thumbScrollIndex, setThumbScrollIndex] = useState(0)
  const mainImgRef = useRef<HTMLDivElement>(null)
  const thumbListRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!mainImgRef.current) return
    const rect = mainImgRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100
    setZoomPos({ x, y })
  }, [])

  const { data: product, isLoading, error } = useProductBySlug(slug)
  const { data: reviewsData, isLoading: reviewsLoading } = useReviews(product?.id)
  const { data: relatedProducts } = useRelatedProducts(product?.category_id, product?.id)

  const images = product?.images?.length
    ? product.images
    : product?.image
      ? [product.image]
      : []

  const visibleThumbs = 4
  const thumbStep = 92
  const containerHeight = visibleThumbs * thumbStep - 12
  const wishlisted = product ? isWishlisted(product.id) : false
  const loading = product ? loadingId === product.id : false
  const hasNutrition = product?.nutrition_data && Object.keys(product.nutrition_data).length > 0
  const avgRating = reviewsData?.avgRating ?? product?.rating ?? 0
  const totalReviews = reviewsData?.totalReviews ?? product?.review_count ?? 0

  const tabs = [
    { value: "description", label: "Description" },
    ...(hasNutrition ? [{ value: "nutrition", label: "Nutrition" }] : []),
    { value: "reviews", label: `Reviews${totalReviews > 0 ? ` (${totalReviews})` : ""}` },
    { value: "shipping", label: "Shipping & Returns" },
  ]

  if (isLoading) return <ProductDetailSkeleton />
  if (!product || error) notFound()

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar announcements={announcements} interval={5000} />
      <Header categories={allCategories} cartCount={3} />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: "Products", href: "/products" },
            { label: product.category_name || "Category", href: `/products?category=${product.category_slug}` },
            { label: product.name },
          ]}
          className="mb-6"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="flex gap-4">
            {images.length > 1 && (
              <div className="flex flex-col shrink-0">
                <div
                  className="overflow-hidden rounded-xl"
                  style={{ height: `${containerHeight}px` }}
                >
                  <div
                    ref={thumbListRef}
                    className="flex flex-col gap-3 transition-transform duration-300"
                    style={{ transform: `translateY(-${thumbScrollIndex * thumbStep}px)` }}
                  >
                    {images.map((img, i) => (
                      <div
                        key={i}
                        className="w-20 h-20 shrink-0 rounded-xl overflow-hidden"
                        style={{
                          border: selectedImage === i ? "2px solid #059669" : "2px solid transparent"
                        }}
                      >
                        <button
                          onClick={() => {
                            setSelectedImage(i)
                            if (images.length <= visibleThumbs) return
                            const isNearBottom = i >= thumbScrollIndex + visibleThumbs - 2
                            const isNearTop = i <= thumbScrollIndex + 1
                            if (isNearBottom && thumbScrollIndex < images.length - visibleThumbs) {
                              setThumbScrollIndex((prev) => prev + 1)
                            } else if (isNearTop && thumbScrollIndex > 0) {
                              setThumbScrollIndex((prev) => prev - 1)
                            }
                          }}
                          className="w-full h-full cursor-pointer"
                        >
                          <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
            <div className="flex-1">
              <div
                ref={mainImgRef}
                className="relative aspect-square rounded-2xl overflow-hidden bg-muted border cursor-crosshair"
                onMouseMove={handleMouseMove}
                onMouseEnter={() => setIsZoomed(true)}
                onMouseLeave={() => setIsZoomed(false)}
              >
                {loading && (
                  <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                    <Loader2 className="h-10 w-10 animate-spin text-white" />
                  </div>
                )}
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-200"
                  style={{
                    transform: isZoomed ? "scale(2.5)" : "scale(1)",
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                  }}
                />
                {product.badge && (
                  <Badge className="absolute top-4 left-4 bg-brand-green text-white text-xs px-3 py-1 pointer-events-none">{product.badge}</Badge>
                )}
                <button
                  type="button"
                  className="absolute top-4 right-4 bg-background/80 hover:bg-background cursor-pointer flex items-center justify-center h-10 w-10 rounded-full outline-none focus:outline-none active:outline-none border-0"
                  onClick={async () => {
                    await toggleWishlist(product)
                  }}
                >
                  <Heart className={cn("h-5 w-5 transition-colors", wishlisted ? "fill-brand-green text-brand-green" : "")} />
                </button>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              {product.badges.length > 0 && (
                <div className="flex gap-2">
                  {product.badges.map((b) => (<Badge key={b} variant="secondary" className="text-xs">{b}</Badge>))}
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-heading font-bold leading-tight">{product.name}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <StarRating rating={avgRating} showValue reviewCount={totalReviews} size="md" />
              </div>
            </div>

            <Separator />

            <PriceDisplay price={product.price} comparePrice={product.compare_price} size="lg" unit={product.unit} />

            <p className="text-muted-foreground text-sm leading-relaxed">{product.short_description || product.description}</p>

            {product.vendor && (
              <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-3 border">
                <div className="h-10 w-10 rounded-full bg-brand-green/10 flex items-center justify-center">
                  <Store className="h-5 w-5 text-brand-green" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sold by {product.vendor.name}</p>
                  {product.vendor.slug && (
                    <Link href={`/vendor/${product.vendor.slug}`} className="text-xs text-brand-green hover:underline">
                      Visit Store
                    </Link>
                  )}
                </div>
              </div>
            )}

            <Separator />

            <div className="flex items-center gap-4 flex-wrap">
              <QuantitySelector value={quantity} min={1} max={Math.max(product.stock, 1)} onChange={setQuantity} size="md" />
              <AddToCartButton product={product} quantity={quantity} size="lg" className="flex-1 min-w-[160px]" onAddToCart={(p, q) => { addItem(p, q); return true }} />
              <button
                type="button"
                className="h-12 w-12 cursor-pointer flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted transition-colors outline-none focus:outline-none active:outline-none"
                onClick={async () => {
                  await toggleWishlist(product)
                }}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Heart className={cn("h-5 w-5 transition-colors", wishlisted ? "fill-brand-green text-brand-green" : "")} />
                )}
              </button>
              <Button variant="outline" size="icon" className="h-12 w-12 cursor-pointer"><Share2 className="h-5 w-5" /></Button>
            </div>

            <p className={cn("text-sm flex items-center gap-2", product.stock > 0 ? "text-brand-green" : "text-destructive")}>
              <span className={cn("w-2 h-2 rounded-full inline-block", product.stock > 0 ? "bg-brand-green" : "bg-destructive")} />
              {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
            </p>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-3">
                <Truck className="h-5 w-5 text-brand-green shrink-0" />
                <div><p className="text-xs font-medium">Free Delivery</p><p className="text-[11px] text-muted-foreground">Orders over $50</p></div>
              </div>
              <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-3">
                <ShieldCheck className="h-5 w-5 text-brand-green shrink-0" />
                <div><p className="text-xs font-medium">Secure Payment</p><p className="text-[11px] text-muted-foreground">100% protected</p></div>
              </div>
              <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-3">
                <RotateCcw className="h-5 w-5 text-brand-green shrink-0" />
                <div><p className="text-xs font-medium">30-Day Returns</p><p className="text-[11px] text-muted-foreground">Easy returns</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 gap-0 overflow-x-auto">
              {tabs.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-green data-[state=active]:text-brand-green bg-transparent px-6 py-3 text-sm font-medium capitalize shrink-0"
                >
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="description" className="pt-6">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                <h4 className="text-base font-semibold mt-6 mb-3">Key Features</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-brand-green mt-0.5 shrink-0" /> Premium quality sourced from trusted suppliers</li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-brand-green mt-0.5 shrink-0" /> Freshness guaranteed with fast delivery</li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-brand-green mt-0.5 shrink-0" /> Packed with essential nutrients and rich flavor</li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-brand-green mt-0.5 shrink-0" /> Perfect for daily meals and special occasions</li>
                </ul>
              </div>
            </TabsContent>

            {hasNutrition && (
              <TabsContent value="nutrition" className="pt-6">
                <NutritionCard data={product.nutrition_data!} />
              </TabsContent>
            )}

            <TabsContent value="reviews" className="pt-6">
              {reviewsLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-card border rounded-xl p-4 space-y-2">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-4 w-full" />
                    </div>
                  ))}
                </div>
              ) : reviewsData && reviewsData.reviews.length > 0 ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-muted/30 rounded-xl">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-brand-green">{avgRating.toFixed(1)}</p>
                      <StarRating rating={avgRating} size="sm" />
                      <p className="text-xs text-muted-foreground mt-1">{totalReviews} reviews</p>
                    </div>
                    <Separator orientation="vertical" className="h-16" />
                    <div className="flex-1">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const count = reviewsData.reviews.filter((r) => r.rating === star).length
                        const pct = totalReviews > 0 ? (count / totalReviews) * 100 : 0
                        return (
                          <div key={star} className="flex items-center gap-2 text-xs">
                            <span className="w-8 text-right text-muted-foreground">{star} ★</span>
                            <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-brand-green rounded-full transition-all" style={{ width: `${pct}%` }} />
                            </div>
                            <span className="w-8 text-muted-foreground">{count}</span>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                  <Separator />
                  {reviewsData.reviews.map((review) => (
                    <div key={review.id} className="border-b pb-5 last:border-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-sm">{review.user?.name || "Anonymous"}</span>
                        <span className="text-xs text-muted-foreground">
                          {new Date(review.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}
                        </span>
                      </div>
                      <StarRating rating={review.rating} size="sm" className="mb-2" />
                      {review.comment && (
                        <p className="text-sm text-muted-foreground">{review.comment}</p>
                      )}
                      {review.vendor_reply && (
                        <div className="mt-3 ml-4 pl-4 border-l-2 border-brand-green/30">
                          <p className="text-xs font-medium text-brand-green mb-1">Vendor Response</p>
                          <p className="text-sm text-muted-foreground">{review.vendor_reply}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-muted-foreground">
                  <p>No reviews yet. Be the first to review this product!</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="shipping" className="pt-6">
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex gap-4 p-4 bg-muted/50 rounded-xl">
                  <Truck className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground mb-1">Free Delivery</p>
                    <p>Free standard delivery on all orders over $50. Express delivery available for an additional fee. Estimated delivery time: 2-5 business days.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-muted/50 rounded-xl">
                  <RotateCcw className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground mb-1">30-Day Return Policy</p>
                    <p>Not satisfied? Return your purchase within 30 days for a full refund. Items must be unopened and in original packaging. Contact our support team to initiate a return.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {relatedProducts && relatedProducts.length > 0 && (
          <div className="mt-16">
            <ProductSlider
              title="Related Products"
              description="You might also like"
              products={relatedProducts}
            />
          </div>
        )}
      </main>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  )
}
