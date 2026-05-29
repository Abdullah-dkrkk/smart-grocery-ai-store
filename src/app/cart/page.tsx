"use client"

import { useState } from "react"
import Link from "next/link"
import { AnnouncementBar } from "@/components/sections/announcement-bar"
import { Header } from "@/components/sections/header"
import { Breadcrumbs } from "@/components/common/breadcrumbs"
import { QuantitySelector } from "@/components/common/quantity-selector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Footer } from "@/components/store/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { Trash2, ShoppingBag, ArrowRight, Percent, X } from "lucide-react"
import { useCartContext } from "@/lib/providers/cart-provider"
import { useCategories } from "@/lib/hooks/use-categories"

const announcements = [
  { text: "Grand opening — up to 15% off all items. Only 3 days left!" },
  { text: "Free delivery on orders over $50 — shop now!" },
  { text: "Trendy 25 silver jewelry — save up to 35% off today!" },
]

export default function CartPage() {
  const { items, itemCount, subtotal, updateQuantity, removeItem, loading } = useCartContext()
  const { data: categories = [], isLoading: catLoading } = useCategories()
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)

  const shipping = subtotal >= 50 ? 0 : 9.99
  const discount = promoApplied ? subtotal * 0.1 : 0
  const total = subtotal + shipping - discount

  if (catLoading || loading) {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar announcements={announcements} interval={5000} />
        <Header categories={categories} cartCount={0} />
        <main className="container mx-auto px-4 py-8">
          <Breadcrumbs items={[{ label: "Cart" }]} className="mb-6" />
          <Skeleton className="h-9 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-4 bg-card border rounded-xl p-4">
                  <Skeleton className="w-20 h-20 rounded-lg shrink-0" />
                  <div className="flex-1 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-6 w-20" />
                    <div className="flex items-center justify-between mt-3">
                      <Skeleton className="h-8 w-28 rounded-md" />
                      <Skeleton className="h-5 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="lg:col-span-1">
              <div className="bg-card border rounded-xl p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                </div>
                <Skeleton className="h-9 w-full rounded-md" />
                <Skeleton className="h-px w-full" />
                <Skeleton className="h-5 w-full" />
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
            </div>
          </div>
        </main>
        <div className="mt-16"><Footer /></div>
      </div>
    )
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar announcements={announcements} interval={5000} />
        <Header categories={categories} cartCount={0} />
        <main className="container mx-auto px-4 py-16">
          <Breadcrumbs items={[{ label: "Cart" }]} className="mb-8" />
          <div className="text-center py-20">
            <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground/30 mb-6" />
            <h1 className="text-2xl font-heading font-semibold mb-3">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Looks like you haven&apos;t added anything yet.</p>
            <Link href="/products" className="inline-flex items-center justify-center rounded-lg bg-brand-green hover:bg-brand-green/90 text-white h-10 px-6 text-sm font-medium transition-all">
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar announcements={announcements} interval={5000} />
      <Header categories={categories} cartCount={itemCount} />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "Cart" }]} className="mb-6" />
        <h1 className="text-3xl font-heading font-semibold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-card border rounded-xl p-4 transition-shadow hover:shadow-sm">
                <Link href={`/products/${item.product.slug}`} className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product.slug}`} className="font-medium text-base hover:text-brand-green transition-colors line-clamp-1">
                    {item.product.name}
                  </Link>
                  <p className="text-lg font-bold text-brand-green mt-1">${item.unit_price.toFixed(2)}</p>
                  <div className="flex items-center justify-between mt-3">
                    <QuantitySelector
                      value={item.quantity}
                      min={1}
                      max={item.product.stock}
                      onChange={(q) => updateQuantity(item.id, q)}
                      size="sm"
                    />
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm">${item.total.toFixed(2)}</span>
                      <button onClick={() => removeItem(item.id, item.product_id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card border rounded-xl p-6 sticky top-24 space-y-4">
              <h2 className="text-lg font-heading font-semibold">Order Summary</h2>

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-brand-green">
                    <span>Promo (10%)</span>
                    <span className="font-medium">-${discount.toFixed(2)}</span>
                  </div>
                )}
              </div>

              {!promoApplied ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="h-12 text-[14px]"
                  />
                  <Button
                    variant="outline"
                    className="h-12"
                    onClick={() => { if (promoCode.trim()) setPromoApplied(true) }}
                  >
                    Apply
                  </Button>
                </div>
              ) : (
                <div className="flex items-center justify-between text-sm bg-brand-green/10 rounded-lg px-3 py-2">
                  <span className="flex items-center gap-2 text-brand-green font-medium">
                    <Percent className="h-4 w-4" /> Code applied
                  </span>
                  <button onClick={() => { setPromoApplied(false); setPromoCode("") }}>
                    <X className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              )}

              <Separator />

              <div className="flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">${total.toFixed(2)}</span>
              </div>

              <Link href="/checkout" className="inline-flex items-center justify-center w-full rounded-lg bg-brand-green hover:bg-brand-green/90 text-white h-10 text-[14px] font-medium transition-all">
                Proceed to Checkout <ArrowRight className="h-4 w-4 ml-2" />
              </Link>

              <Link href="/products" className="inline-flex items-center justify-center w-full rounded-lg border border-border bg-background hover:bg-muted h-10 text-[14px] font-medium transition-all">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </main>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  )
}
