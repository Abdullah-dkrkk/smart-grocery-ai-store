"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { AnnouncementBar } from "@/components/sections/announcement-bar"
import { Header } from "@/components/sections/header"
import { Footer } from "@/components/store/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Breadcrumbs } from "@/components/common/breadcrumbs"
import { StarRating } from "@/components/common/star-rating"
import { PriceDisplay } from "@/components/common/price-display"
import { Heart, ShoppingBag, Loader2, Eye, Check } from "lucide-react"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { useToast } from "@/components/ui/toast"
import { useCartContext } from "@/lib/providers/cart-provider"
import { useProducts } from "@/lib/hooks/use-products"
import { useCategories } from "@/lib/hooks/use-categories"
import { MOCK_PRODUCTS } from "@/lib/mock/products"
import { cn } from "@/lib/utils"
import { handleImgError } from "@/lib/utils/placeholder"
import type { Product } from "@/types/product"

const announcements = [
  { text: "Grand opening — up to 15% off all items. Only 3 days left!" },
  { text: "Free delivery on orders over $50 — shop now!" },
  { text: "Trendy 25 silver jewelry — save up to 35% off today!" },
]

export default function WishlistPage() {
  const { wishlistIds, toggleWishlist, loadingId } = useWishlist()
  const { showToast } = useToast()
  const { data: apiProducts = [], isLoading: productsLoading } = useProducts({ per_page: 100 })
  const { data: categories = [] } = useCategories()

  const wishlistProducts = useMemo(() => {
    const allProducts = [...apiProducts, ...MOCK_PRODUCTS]
    const seen = new Set<number>()
    const merged: Product[] = []
    for (const p of allProducts) {
      if (!seen.has(p.id)) {
        seen.add(p.id)
        merged.push(p)
      }
    }
    return merged.filter((p) => wishlistIds.includes(p.id))
  }, [wishlistIds, apiProducts])

  const isLoading = productsLoading
  const isEmpty = !isLoading && wishlistProducts.length === 0

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar announcements={announcements} interval={5000} />
      <Header categories={categories} cartCount={3} />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "My Wishlist" }]} className="mb-6" />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold tracking-tight">
              My Wishlist
            </h1>
            <p className="text-muted-foreground mt-1">{wishlistIds.length} item{wishlistIds.length !== 1 ? "s" : ""} saved</p>
          </div>
          {!isEmpty && wishlistProducts.length > 0 && (
            <Link href="/products">
              <Button variant="outline" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          )}
        </div>

        {isLoading ? (
          <WishlistSkeleton count={wishlistIds.length || 4} />
        ) : isEmpty ? (
          <div className="text-center py-24">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-2xl font-heading font-semibold mb-2">Your Wishlist is Empty</h2>
            <p className="text-muted-foreground mb-6">Save your favorite items and come back to them later!</p>
            <Link href="/products">
              <Button className="bg-brand-green hover:bg-brand-green/90 text-white">Explore Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
            {wishlistProducts.map((product) => (
              <WishlistCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>

      <div className="mt-16"><Footer /></div>
    </div>
  )
}

function WishlistCard({ product }: { product: Product }) {
  const { isWishlisted, toggleWishlist, loadingId } = useWishlist()
  const { showToast } = useToast()
  const { addItem } = useCartContext()
  const loading = loadingId === product.id
  const wishlisted = isWishlisted(product.id)
  const [cartState, setCartState] = useState<"idle" | "loading" | "added">("idle")

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
    <div className="bg-card border rounded-lg overflow-hidden transition-shadow hover:shadow-lg group">
      <div className="relative aspect-[28/31] overflow-hidden bg-muted">
        {loading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
          </div>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={handleImgError}
        />
        {product.badge && (
          <Badge className="absolute top-2 left-2 text-xs px-2 py-0.5 font-semibold bg-brand-orange text-white">
            {product.badge}
          </Badge>
        )}
        <button
          type="button"
          className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer flex items-center justify-center outline-none focus:outline-none active:outline-none"
          onClick={async () => {
            await toggleWishlist(product)
            showToast(wishlisted ? "Removed from Wishlist" : "Added to Wishlist!")
          }}
          disabled={loading}
        >
          <Heart className={cn("h-3.5 w-3.5 transition-colors", wishlisted && "fill-brand-green text-brand-green")} />
        </button>
        <Link href={`/products/${product.slug}`}>
          <button
            type="button"
            className="absolute bottom-3 right-3 h-8 w-8 rounded-full bg-white shadow flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer outline-none focus:outline-none active:outline-none"
          >
            <Eye className="h-4 w-4" />
          </button>
        </Link>
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
              className="w-full h-9 min-h-[42px] text-base rounded-[10px] bg-brand-green hover:bg-brand-green/90 text-white cursor-pointer uppercase"
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
  )
}

function WishlistSkeleton({ count }: { count: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card border rounded-lg overflow-hidden">
          <Skeleton className="aspect-[4/5] rounded-none" />
          <div className="p-4 space-y-3">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-3 w-16" />
            <div className="flex items-center justify-between pt-2">
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-8 w-16 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
