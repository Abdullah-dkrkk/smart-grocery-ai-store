import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import type { ProductCategory } from "@/types/product"

interface CategoryCardProps {
  category: ProductCategory
  onClick?: (category: ProductCategory) => void
  className?: string
  variant?: "default" | "icon" | "minimal"
}

export function CategoryCard({ category, onClick, className, variant = "default" }: CategoryCardProps) {
  const isMinimal = variant === "minimal"
  const isIcon = variant === "icon"

  const content = (
    <Card
      className={cn(
        "cursor-pointer border-0 shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 overflow-hidden",
        isMinimal && "hover:bg-accent hover:-translate-y-0",
        isIcon && "flex flex-col items-center text-center p-4",
        className
      )}
    >
      {isIcon ? (
        <>
          <span className="text-3xl mb-2">{category.icon}</span>
          <p className="text-sm font-medium line-clamp-1">{category.name}</p>
          <p className="text-xs text-muted-foreground mt-0.5">{category.product_count} items</p>
        </>
      ) : (
        <div className="flex items-center gap-4 p-0">
          {category.image && (
            <div className="w-20 h-20 shrink-0">
              <img src={category.image} alt={category.name} className="w-full h-full object-cover" />
            </div>
          )}
          <CardContent className={cn("flex-1", category.image ? "py-4 pl-0" : "py-4")}>
            <span className="text-2xl mr-2">{category.icon}</span>
            <p className="font-semibold">{category.name}</p>
            {category.description && (
              <p className="text-sm text-muted-foreground line-clamp-1">{category.description}</p>
            )}
            <p className="text-xs text-muted-foreground mt-1">{category.product_count} products</p>
          </CardContent>
        </div>
      )}
    </Card>
  )

  if (onClick) {
    return <button onClick={() => onClick(category)} className="w-full text-left">{content}</button>
  }

  return content
}
