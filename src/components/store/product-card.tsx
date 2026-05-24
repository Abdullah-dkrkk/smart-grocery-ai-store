import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { ShoppingCart, Heart, Star } from "lucide-react"
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

function formatPrice(price: number) {
  return `$${price.toFixed(2)}`
}

export function ProductCard({
  product,
  onAddToCart,
  onToggleWishlist,
  className,
  variant = "default",
  showBadge = true,
  showRating = true,
  showDescription = variant !== "compact",
}: ProductCardProps) {
  const isCompact = variant === "compact"
  const isHorizontal = variant === "horizontal"

  return (
    <Card
      className={cn(
        "group overflow-hidden border-0 shadow-sm hover:shadow-md transition-all",
        !isHorizontal && "hover:-translate-y-0.5",
        className
      )}
    >
      <div className={cn(isHorizontal ? "flex" : "")}>
        <div className={cn("relative overflow-hidden", isHorizontal ? "w-32 shrink-0" : "")}>
          <img
            src={product.image}
            alt={product.name}
            className={cn(
              "w-full object-cover transition-transform duration-300 group-hover:scale-105",
              isCompact ? "h-36" : isHorizontal ? "h-full" : "h-48"
            )}
          />
          {showBadge && product.badge && (
            <Badge className="absolute top-2 left-2 bg-brand-orange text-white border-0 text-xs">
              {product.badge}
            </Badge>
          )}
          {onToggleWishlist && (
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-2 right-2 h-7 w-7 rounded-full bg-white/80 hover:bg-white opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={() => onToggleWishlist(product)}
            >
              <Heart className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        <CardContent className={cn("flex flex-col", isCompact ? "p-3 gap-1" : isHorizontal ? "p-3 flex-1" : "p-4 gap-2")}>
          {product.category_name && (
            <p className="text-xs text-muted-foreground uppercase tracking-wider">{product.category_name}</p>
          )}

          <h3 className={cn("font-semibold leading-snug line-clamp-2", isCompact ? "text-sm" : "text-base")}>
            {product.name}
          </h3>

          {showDescription && product.short_description && (
            <p className="text-sm text-muted-foreground line-clamp-2">{product.short_description}</p>
          )}

          {showRating && (
            <div className="flex items-center gap-1">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">{product.rating}</span>
              <span className="text-xs text-muted-foreground">({product.review_count})</span>
            </div>
          )}

          {product.unit && <p className="text-xs text-muted-foreground">{product.unit}</p>}

          <div className="flex items-center justify-between mt-auto pt-2">
            <div className="flex items-center gap-2">
              <span className={cn("font-bold text-brand-green", isCompact ? "text-sm" : "text-lg")}>
                {formatPrice(product.price)}
              </span>
              {product.compare_price && product.compare_price > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatPrice(product.compare_price)}
                </span>
              )}
            </div>

            {onAddToCart && (
              <Button
                size={isCompact ? "icon" : "sm"}
                variant="default"
                className={cn("rounded-full", isCompact ? "h-7 w-7" : "")}
                onClick={() => onAddToCart(product)}
              >
                <ShoppingCart className={cn(isCompact ? "h-3 w-3" : "h-3.5 w-3.5", !isCompact && "mr-1.5")} />
                {!isCompact && "Add"}
              </Button>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  )
}
