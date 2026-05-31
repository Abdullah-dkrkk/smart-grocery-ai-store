"use client"

import Link from "next/link"
import { AnnouncementBar } from "@/components/sections/announcement-bar"
import { Header } from "@/components/sections/header"
import { Footer } from "@/components/store/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCategories } from "@/lib/hooks/use-categories"
import { handleImgError } from "@/lib/utils/placeholder"
import { AlertCircle, RefreshCw, Package, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProductCategory } from "@/types/product"

const announcements = [
  { text: "Grand opening — up to 15% off all items. Only 3 days left!" },
  { text: "Free delivery on orders over $50 — shop now!" },
  { text: "Trendy 25 silver jewelry — save up to 35% off today!" },
]

export default function CategoriesPage() {
  const { data: categories = [], isLoading, error, refetch } = useCategories()
  const parentCategories = categories.filter((c) => !c.parent_id)

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar announcements={announcements} interval={5000} />
      <Header categories={categories} cartCount={3} />

      <main className="container mx-auto px-4 py-8">
        {/* Hero */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-green/15 via-brand-green/10 to-brand-green/8 border mb-10">
          <div className="absolute inset-0 w-full h-full overflow-hidden">
            <div className="absolute -top-32 right-[10%] w-[500px] h-[500px] rounded-full bg-brand-green/20 blur-3xl" />
            <div className="absolute bottom-[5%] right-[5%] w-80 h-80 rounded-full bg-emerald-300/20 blur-3xl" />
            <div className="absolute top-[12%] right-[40%] w-56 h-56 border-4 rounded-full" style={{ borderColor: '#34d399' }} />
            <div className="absolute top-[6%] right-[6%] w-36 h-36 border-4 rounded-2xl rotate-12" style={{ borderColor: '#34d399' }} />
            <div className="absolute bottom-[10%] right-[12%] w-28 h-28 border-4 rounded-xl -rotate-6" style={{ borderColor: '#34d399' }} />
            <div className="absolute top-[55%] right-[15%] w-6 h-6 rounded-full bg-brand-green/80" />
            <div className="absolute top-[80%] right-[40%] w-4 h-4 rounded-full bg-brand-green/70" />
            <div className="absolute top-[35%] right-[45%] w-3 h-3 rounded-full bg-brand-green/80" />
            <div className="absolute bottom-[40%] right-[25%] w-2 h-2 rounded-full bg-brand-green/70" />
            <div className="absolute top-[42%] right-[42%] w-5 h-5 rounded-full bg-brand-green/60" />
            <div className="absolute top-[62%] right-[35%] w-3 h-3 rounded-full bg-brand-green/70" />
            <svg className="absolute top-[28%] right-[30%] w-28 h-28 text-brand-green/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
            </svg>
          </div>
          <div className="relative z-10 p-8 md:p-10">
            <Badge className="bg-brand-green/15 text-brand-green border-0 mb-4 text-xs font-medium">All Departments</Badge>
            <h1 className="text-3xl md:text-4xl font-heading font-bold">Shop by Category</h1>
            <p className="text-muted-foreground mt-2 max-w-xl text-[15px]">
              Browse our wide selection of products organized by category. Find everything you need in one place, from fresh produce to daily essentials.
            </p>
            <div className="flex items-center gap-3 mt-4">
              <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <Package className="h-4 w-4 text-brand-green" />
                <span>{parentCategories.length} categories</span>
              </div>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="bg-card border rounded-xl overflow-hidden">
                <div className="pt-8 pb-6 px-6 flex flex-col items-center gap-4">
                  <Skeleton className="w-16 h-16 rounded-full" />
                  <div className="space-y-2 text-center w-full">
                    <Skeleton className="h-5 w-2/3 mx-auto" />
                    <Skeleton className="h-4 w-1/3 mx-auto" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-heading font-semibold mb-2">Failed to load categories</h2>
            <p className="text-muted-foreground mb-6">Something went wrong. Please try again.</p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" /> Retry
            </Button>
          </div>
        ) : parentCategories.length === 0 ? (
          <div className="text-center py-20">
            <h2 className="text-xl font-heading font-semibold mb-2">No categories available</h2>
            <p className="text-muted-foreground">Categories will appear here once they are added.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {parentCategories.map((category: ProductCategory) => (
              <Link key={category.id} href={`/categories/${category.slug}`} className="group">
                <div className="bg-card border rounded-xl transition-all hover:shadow-lg hover:-translate-y-1 overflow-hidden h-full">
                  <div className="h-1.5 bg-brand-green/30" />
                  <div className="p-6 flex flex-col items-center text-center gap-3">
                    {category.image ? (
                      <div className="w-16 h-16 overflow-hidden">
                        <img
                          src={category.image}
                          alt={category.name}
                          className="h-full w-full object-cover"
                          onError={handleImgError}
                          loading="lazy"
                        />
                      </div>
                    ) : (
                      <div className="w-16 h-16 flex items-center justify-center">
                        <Package className="h-7 w-7 text-brand-green/50" />
                      </div>
                    )}
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-[15px] group-hover:text-brand-green transition-colors">{category.name}</h3>
                      {category.description && (
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1 leading-relaxed">{category.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="font-medium text-brand-green/70">{category.product_count}</span>
                      <span>product{category.product_count !== 1 ? "s" : ""}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-white font-medium mt-2 bg-brand-green rounded-md px-3 py-1.5 hover:bg-brand-green/90 transition-colors">
                      <span>Browse</span>
                      <ChevronRight className="h-3 w-3" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  )
}
