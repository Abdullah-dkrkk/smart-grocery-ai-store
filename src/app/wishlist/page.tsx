"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { AnnouncementBar } from "@/components/sections/announcement-bar"
import { Header } from "@/components/sections/header"
import { Footer } from "@/components/store/footer"
import { ProductCard } from "@/components/store/product-card"
import { Button } from "@/components/ui/button"
import { Breadcrumbs } from "@/components/common/breadcrumbs"
import { Heart, ShoppingBag, Trash2, Loader2 } from "lucide-react"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { useToast } from "@/components/ui/toast"
import { cn } from "@/lib/utils"
import { MOCK_PRODUCTS } from "@/lib/mock/products"
import type { ProductCategory } from "@/types/product"

const announcements = [
  { text: "Grand opening — up to 15% off all items. Only 3 days left!" },
  { text: "Free delivery on orders over $50 — shop now!" },
  { text: "Trendy 25 silver jewelry — save up to 35% off today!" },
]

const allCategories: ProductCategory[] = [
  { id: 1, name: "Milks & Dairies", slug: "milks-dairies", description: "", image: "", icon: "", parent_id: null, product_count: 30 },
  { id: 2, name: "Wines & Drinks", slug: "wines-drinks", description: "", image: "", icon: "", parent_id: null, product_count: 25 },
  { id: 12, name: "Coffee & Teas", slug: "coffee-teas", description: "", image: "", icon: "", parent_id: null, product_count: 33 },
]

export default function WishlistPage() {
  const { wishlistIds, removeWishlist, loadingId } = useWishlist()
  const { showToast } = useToast()

  const wishlistProducts = useMemo(
    () => MOCK_PRODUCTS.filter((p) => wishlistIds.includes(p.id)),
    [wishlistIds]
  )

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar announcements={announcements} interval={5000} />
      <Header categories={allCategories} cartCount={3} />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "My Wishlist" }]} className="mb-6" />

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-heading font-bold tracking-tight">
              My Wishlist
            </h1>
            <p className="text-muted-foreground mt-1">{wishlistIds.length} item{wishlistIds.length !== 1 ? "s" : ""} saved</p>
          </div>
          {wishlistProducts.length > 0 && (
            <Link href="/products">
              <Button variant="outline" className="gap-2">
                <ShoppingBag className="h-4 w-4" />
                Continue Shopping
              </Button>
            </Link>
          )}
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="text-center py-24">
            <Heart className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-2xl font-heading font-semibold mb-2">Your Wishlist is Empty</h2>
            <p className="text-muted-foreground mb-6">Save your favorite items and come back to them later!</p>
            <Link href="/products">
              <Button className="bg-brand-green hover:bg-brand-green/90 text-white">Explore Products</Button>
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {wishlistProducts.map((product) => (
              <div key={product.id} className="relative group">
                <ProductCard product={product} variant="default" />
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-white shadow border hover:bg-red-50 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={async () => {
                    await removeWishlist(product.id)
                    showToast("Removed from Wishlist")
                  }}
                  disabled={loadingId === product.id}
                >
                  {loadingId === product.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4 text-red-500" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )}
      </main>

      <div className="mt-16"><Footer /></div>
    </div>
  )
}
