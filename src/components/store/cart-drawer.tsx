"use client"

import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { X, ShoppingCart, Trash2, Minus, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import type { CartItem } from "@/types/cart"

interface CartDrawerProps {
  open: boolean
  onClose: () => void
  items: CartItem[]
  subtotal: number
  itemCount: number
  onUpdateQuantity?: (itemId: number, quantity: number) => void
  onRemoveItem?: (itemId: number) => void
  onCheckout?: () => void
}

export function CartDrawer({
  open,
  onClose,
  items,
  subtotal,
  itemCount,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-background shadow-2xl flex flex-col animate-in slide-in-from-right">
        <div className="flex items-center justify-between px-5 h-16 border-b shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            <span className="font-semibold text-base">Cart</span>
            <span className="text-sm text-muted-foreground">({itemCount})</span>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <ShoppingCart className="h-12 w-12 text-muted-foreground/40 mb-4" />
              <p className="text-base font-medium text-muted-foreground">Your cart is empty</p>
              <p className="text-sm text-muted-foreground mt-1">Add items to get started.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3">
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">${item.unit_price.toFixed(2)}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="flex items-center border rounded-md h-7">
                        <button
                          className="h-full px-1.5 hover:bg-muted transition-colors disabled:opacity-30"
                          disabled={item.quantity <= 1}
                          onClick={() => onUpdateQuantity?.(item.id, item.quantity - 1)}
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-2 text-sm font-medium min-w-[20px] text-center">{item.quantity}</span>
                        <button
                          className="h-full px-1.5 hover:bg-muted transition-colors"
                          onClick={() => onUpdateQuantity?.(item.id, item.quantity + 1)}
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <button
                        className="text-muted-foreground hover:text-destructive transition-colors p-1"
                        onClick={() => onRemoveItem?.(item.id)}
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                      <span className="ml-auto text-sm font-medium">${item.total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        <div className="border-t px-5 py-4 shrink-0 space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <Separator />
          <Button className="w-full h-10" size="lg" disabled={items.length === 0} onClick={onCheckout}>
            Checkout — ${subtotal.toFixed(2)}
          </Button>
        </div>
      </div>
    </div>
  )
}
