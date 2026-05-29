"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Product } from "@/types/product"

interface AddToCartButtonProps {
  product: Product
  quantity?: number
  onAddToCart?: (product: Product, quantity: number) => Promise<boolean> | boolean
  variant?: "default" | "icon" | "full"
  size?: "sm" | "default" | "lg"
  className?: string
}

export function AddToCartButton({
  product,
  quantity = 1,
  onAddToCart,
  variant = "default",
  size = "default",
  className,
}: AddToCartButtonProps) {
  const [state, setState] = useState<"idle" | "loading" | "added">("idle")

  async function handleClick() {
    if (state === "loading" || product.stock <= 0) return
    setState("loading")
    try {
      await Promise.all([
        onAddToCart?.(product, quantity),
        new Promise((r) => setTimeout(r, 500)),
      ])
      setState("added")
      setTimeout(() => setState("idle"), 2000)
    } catch {
      setState("idle")
    }
  }

  const isIcon = variant === "icon"

  return (
    <Button
      onClick={handleClick}
      disabled={state === "loading" || product.stock <= 0}
      size={isIcon ? "icon" : size}
      variant={state === "added" ? "secondary" : "default"}
      className={cn(
        "transition-all min-h-[38px]",
        state === "added" && "bg-brand-green/10 text-brand-green border-brand-green/30 hover:bg-brand-green/20",
        className
      )}
    >
      {state === "loading" ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : state === "added" ? (
        <Check className="h-4 w-4" />
      ) : isIcon ? (
        <ShoppingCart className="h-4 w-4" />
      ) : (
        <>
          <ShoppingCart className="h-4 w-4 mr-1.5" />
          {product.stock <= 0 ? "Out of Stock" : "Add to Cart"}
        </>
      )}
    </Button>
  )
}
