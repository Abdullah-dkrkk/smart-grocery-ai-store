import { cn } from "@/lib/utils"
import { ProductCard } from "./product-card"
import type { Product } from "@/types/product"

interface ProductGridProps {
  products: Product[]
  onAddToCart?: (product: Product) => void
  onToggleWishlist?: (product: Product) => void
  columns?: 2 | 3 | 4
  variant?: "default" | "compact"
  className?: string
}

const columnMap = {
  2: "grid-cols-2",
  3: "grid-cols-2 md:grid-cols-3",
  4: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
}

export function ProductGrid({
  products,
  onAddToCart,
  onToggleWishlist,
  columns = 4,
  variant = "default",
  className,
}: ProductGridProps) {
  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-lg font-medium text-muted-foreground">No products found</p>
        <p className="text-sm text-muted-foreground">Try adjusting your filters or search terms.</p>
      </div>
    )
  }

  return (
    <div className={cn("grid gap-4 md:gap-6", columnMap[columns], className)}>
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
          onToggleWishlist={onToggleWishlist}
          variant={variant}
        />
      ))}
    </div>
  )
}
