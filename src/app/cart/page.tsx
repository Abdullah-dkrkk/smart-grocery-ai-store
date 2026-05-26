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
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, Percent, X } from "lucide-react"
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

interface CartItem {
  id: number
  name: string
  slug: string
  price: number
  image: string
  quantity: number
  stock: number
}

const initialItems: CartItem[] = [
  { id: 1, name: "Seeds of Change Organic Quinoa", slug: "organic-quinoa", price: 28.85, image: "https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?w=200&h=200&fit=crop", quantity: 2, stock: 50 },
  { id: 7, name: "Artisan Sourdough Bread Fresh Baked Daily", slug: "sourdough-bread", price: 6.99, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop", quantity: 1, stock: 30 },
  { id: 11, name: "Organic Fuji Apples Sweet & Crispy 3lb Bag", slug: "fuji-apples", price: 3.99, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=200&h=200&fit=crop", quantity: 3, stock: 100 },
]

export default function CartPage() {
  const [items, setItems] = useState<CartItem[]>(initialItems)
  const [promoCode, setPromoCode] = useState("")
  const [promoApplied, setPromoApplied] = useState(false)

  function updateQuantity(id: number, quantity: number) {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, quantity } : item))
  }

  function removeItem(id: number) {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal >= 50 ? 0 : 9.99
  const discount = promoApplied ? subtotal * 0.1 : 0
  const total = subtotal + shipping - discount

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar announcements={announcements} interval={5000} />
        <Header categories={allCategories} cartCount={0}  />
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
      <Header categories={allCategories} cartCount={items.length}  />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "Cart" }]} className="mb-6" />
        <h1 className="text-3xl font-heading font-semibold mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-card border rounded-xl p-4 transition-shadow hover:shadow-sm">
                <Link href={`/products/${item.slug}`} className="w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                  <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.slug}`} className="font-medium text-base hover:text-brand-green transition-colors line-clamp-1">
                    {item.name}
                  </Link>
                  <p className="text-lg font-bold text-brand-green mt-1">${item.price.toFixed(2)}</p>
                  <div className="flex items-center justify-between mt-3">
                    <QuantitySelector
                      value={item.quantity}
                      min={1}
                      max={item.stock}
                      onChange={(q) => updateQuantity(item.id, q)}
                      size="sm"
                    />
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-sm">${(item.price * item.quantity).toFixed(2)}</span>
                      <button onClick={() => removeItem(item.id)} className="text-muted-foreground hover:text-destructive transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
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

              {/* Promo Code */}
              {!promoApplied ? (
                <div className="flex gap-2">
                  <Input
                    placeholder="Promo code"
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="h-9 text-sm"
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="h-9"
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

              <Link href="/checkout" className="inline-flex items-center justify-center w-full rounded-lg bg-brand-green hover:bg-brand-green/90 text-white h-12 text-base font-medium transition-all">
                Proceed to Checkout <ArrowRight className="h-4 w-4 ml-2" />
              </Link>

              <Link href="/products" className="inline-flex items-center justify-center w-full rounded-lg border border-border bg-background hover:bg-muted h-10 text-sm font-medium transition-all">
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
