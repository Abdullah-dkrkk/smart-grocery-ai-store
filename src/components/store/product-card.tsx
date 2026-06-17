import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StarRating } from "@/components/common/star-rating"
import { PriceDisplay } from "@/components/common/price-display"
import { cn } from "@/lib/utils"
import { handleImgError } from "@/lib/utils/placeholder"
import { Heart, Eye, Loader2, Check, ShoppingCart } from "lucide-react"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { useToast } from "@/components/ui/toast"
import { useCartContext } from "@/lib/providers/cart-provider"
import type { Product } from "@/types/product"

interface ProductCardProps {
  product: Product
  onAddToCart?: (product: Product) => void
  onToggleWishlist?: (product: Product) => void
  className?: string
  variant?: "default" | "compact" | "horizontal"
  showBadge?: boolean
  showRating?: boolean
  showDescription?: boolean
}

const badgeStyles: Record<string, string> = {
  Hot: "bg-orange-500 text-white",
  Sale: "bg-red-500 text-white",
  New: "bg-emerald-500 text-white",
  Organic: "bg-green-600 text-white",
  Fresh: "bg-sky-500 text-white",
}

export function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  className,
  variant = "default",
  showBadge = true,
  showRating = true,
}: ProductCardProps) {
  const isCompact = variant === "compact"
  const isHorizontal = variant === "horizontal"
  const { showToast } = useToast()
  const { isWishlisted, toggleWishlist, loadingId } = useWishlist(showToast)
  const { addItem } = useCartContext()
  const [cartState, setCartState] = useState<"idle" | "loading" | "added">("idle")
  const loading = loadingId === product.id
  const wishlisted = isWishlisted(product.id)
  const badgeClass = product.badge ? badgeStyles[product.badge] || "bg-brand-green text-white" : ""

  const discount = !product.category_slug?.includes("seafood") && product.compare_price
    ? Math.round(((product.compare_price - product.price) / product.compare_price) * 100)
    : null

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

  if (isHorizontal) {
    return (
      <div className={cn("flex gap-4 bg-card border rounded-xl p-4 hover:shadow-md transition-shadow", className)}>
        <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-muted">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" onError={handleImgError} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-medium text-base truncate">{product.name}</h3>
          <p className="text-sm text-muted-foreground mt-1">{product.category_name}</p>
          <div className="flex items-center gap-2 mt-2">
            <span className="text-lg font-bold text-brand-green">${product.price.toFixed(2)}</span>
            {product.compare_price && (
              <span className="text-sm text-muted-foreground line-through">${product.compare_price.toFixed(2)}</span>
            )}
          </div>
        </div>
        <div className="flex items-center">
          <Button size="sm" className="bg-brand-green hover:bg-brand-green/90 text-white whitespace-nowrap uppercase" onClick={() => onAddToCart?.(product)}>
            <ShoppingCart className="h-3 w-3 mr-1" /> Add to Cart
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "group relative bg-card border rounded-lg overflow-hidden transition-shadow hover:shadow-lg",
        !isCompact && !isHorizontal && "hover:-translate-y-0.5 transition-all",
        className
      )}
    >
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
        {showBadge && product.badge && (
          <Badge className={`absolute top-2 left-2 text-xs px-2 py-0.5 font-semibold ${badgeClass}`}>
            {product.badge}
          </Badge>
        )}
        {discount && discount > 0 && (
          <Badge className="absolute top-2 right-2 text-xs px-2 py-0.5 font-semibold bg-amber-500 text-white">
            -{discount}%
          </Badge>
        )}
        <div className="absolute inset-0 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-black/10">
          <button
            type="button"
            className="h-9 w-9 rounded-full bg-white shadow flex items-center justify-center cursor-pointer outline-none focus:outline-none active:outline-none transition-transform hover:scale-105"
            disabled={loading}
            onClick={async () => { await toggleWishlist(product) }}
          >
            <Heart className={cn("h-4 w-4 transition-colors", wishlisted && "fill-brand-green text-brand-green")} />
          </button>
          <Link href={`/products/${product.slug}`}>
            <button type="button" className="h-9 w-9 rounded-full bg-white shadow flex items-center justify-center cursor-pointer outline-none focus:outline-none active:outline-none transition-transform hover:scale-105">
              <Eye className="h-4 w-4" />
            </button>
          </Link>
        </div>
        </div>

      {isCompact ? (
        <div className="p-3 space-y-2">
          {showRating && <StarRating rating={product.rating} size="sm" />}
          <h3 className="text-sm font-semibold leading-snug line-clamp-2">{product.name}</h3>
          <div className="flex items-center justify-between pt-1">
            <PriceDisplay price={product.price} comparePrice={product.compare_price ?? undefined} size="sm" />
            {onAddToCart && (
              <Button size="icon" className="h-7 w-7 rounded-full bg-brand-green hover:bg-brand-green/90 text-white" onClick={() => onAddToCart(product)}>
                <ShoppingCart className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      ) : (
        <div className="p-4 flex flex-col gap-2">
          {showRating && <StarRating rating={product.rating} size="sm" showValue reviewCount={product.review_count} />}
          <h3 className="text-[17px] font-semibold leading-snug line-clamp-2 min-h-[50px]">
            {product.name}
          </h3>
          <p className="text-xs text-muted-foreground">By SmartGrocery</p>
          <div className="pt-2 space-y-2">
            <div className="mb-3.5">
              <PriceDisplay price={product.price} comparePrice={product.compare_price ?? undefined} size="md" />
            </div>
            <Button
              className="w-full h-9 text-[12px] rounded-[6px] bg-brand-green hover:bg-brand-green/90 text-white cursor-pointer uppercase"
              onClick={handleAddToCart}
              disabled={cartState === "loading"}
            >
              {cartState === "loading" ? (
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
              ) : cartState === "added" ? (
                <Check className="h-3 w-3 mr-1" />
              ) : (
                <ShoppingCart className="h-3 w-3 mr-1" />
              )}
              {cartState === "added" ? "Added" : "Add to Cart"}
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
