"use client"

import { useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { X, ShoppingCart, Trash2, Minus, Plus, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useCartContext } from "@/lib/providers/cart-provider"
import gsap from "gsap"

export function CartDrawer() {
  const { items, itemCount, subtotal, isDrawerOpen, closeDrawer, removeItem, updateQuantity } =
    useCartContext()

  const overlayRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<HTMLDivElement>(null)
  const prevOpenRef = useRef(isDrawerOpen)

  useEffect(() => {
    if (isDrawerOpen && !prevOpenRef.current) {
      document.body.style.overflow = "hidden"
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" })
      gsap.to(panelRef.current, {
        x: "0%",
        duration: 0.4,
        ease: "power3.out",
        onStart: () => {
          if (itemsRef.current) {
            gsap.fromTo(
              itemsRef.current.querySelectorAll(".cart-item"),
              { opacity: 0, x: 40, scale: 0.95 },
              { opacity: 1, x: 0, scale: 1, duration: 0.35, stagger: 0.04, ease: "power2.out" },
            )
          }
        },
      })
    } else if (!isDrawerOpen && prevOpenRef.current) {
      document.body.style.overflow = ""
      gsap.to(overlayRef.current, { opacity: 0, duration: 0.2 })
      gsap.to(panelRef.current, {
        x: "100%",
        duration: 0.3,
        ease: "power2.in",
      })
    }
    prevOpenRef.current = isDrawerOpen

    return () => {
      document.body.style.overflow = ""
    }
  }, [isDrawerOpen])

  if (!isDrawerOpen) return null

  return (
    <div className="fixed inset-0 z-50">
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-black/20 backdrop-blur-sm"
        style={{ opacity: 0 }}
        onClick={closeDrawer}
      />
      <div
        ref={panelRef}
        className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-background shadow-2xl flex flex-col"
        style={{ transform: "translateX(100%)" }}
      >
        <div className="flex items-center justify-between px-4 md:px-5 h-14 md:h-16 border-b shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <span className="font-semibold text-base">Cart</span>
            <span className="text-sm text-muted-foreground">({itemCount})</span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full cursor-pointer"
            onClick={closeDrawer}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-5 pb-4 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-muted/30 [&::-webkit-scrollbar-thumb]:bg-muted-foreground/20 [&::-webkit-scrollbar-thumb]:rounded-full">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center py-16 min-h-full">
              <ShoppingCart className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <p className="text-base font-medium text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Add items to get started.</p>
              <Link href="/products" onClick={closeDrawer}>
                <Button variant="outline" className="mt-4 cursor-pointer">Continue Shopping</Button>
              </Link>
            </div>
          ) : (
            <div ref={itemsRef} className="flex flex-col">
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  className={`cart-item py-4 md:py-5 ${idx > 0 ? "border-t border-border/60" : ""}`}
                >
                  <div className="flex gap-3">
                    <div className="w-14 h-14 md:w-16 md:h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-xs md:text-sm font-medium line-clamp-2 leading-snug">
                          {item.product.name}
                        </p>
                        <button
                          className="text-muted-foreground hover:text-destructive transition-colors shrink-0 mt-0.5 cursor-pointer"
                          onClick={() => removeItem(item.id, item.product_id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="text-xs md:text-sm text-muted-foreground mt-1">
                        ${item.unit_price.toFixed(2)}
                      </p>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border rounded-md h-7">
                          <button
                            className="h-full px-1.5 hover:bg-muted transition-colors disabled:opacity-30 cursor-pointer"
                            disabled={item.quantity <= 1}
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-2 text-sm font-medium min-w-[20px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            className="h-full px-1.5 hover:bg-muted transition-colors cursor-pointer"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>
                        <span className="text-xs md:text-sm font-medium">
                          ${item.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border-t px-4 md:px-5 py-4 shrink-0 space-y-3 bg-background">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          {items.length > 0 && (
            <Link
              href="/cart"
              onClick={closeDrawer}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-brand-green/30 bg-brand-green-light dark:bg-brand-green/10 px-4 py-2 text-sm font-medium text-brand-green transition-all hover:bg-brand-green/15 dark:hover:bg-brand-green/20 hover:border-brand-green/50 active:translate-y-px"
            >
              View Full Cart
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          )}
          <Separator />
          <Button
            className="w-full h-10 cursor-pointer"
            size="lg"
            disabled={items.length === 0}
            onClick={() => {
              closeDrawer()
              window.location.href = "/checkout"
            }}
          >
            Checkout — ${subtotal.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  )
}
