"use client"

import { useState, useMemo, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { AnnouncementBar } from "@/components/sections/announcement-bar"
import { Header } from "@/components/sections/header"
import { HEADER_ANNOUNCEMENTS } from "@/lib/constants"
import { FilterSidebar } from "@/components/store/filter-sidebar"
import { ProductGrid } from "@/components/store/product-grid"
import { Pagination } from "@/components/store/pagination"
import { SearchBar } from "@/components/store/search-bar"
import { Footer } from "@/components/store/footer"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, Search, X } from "lucide-react"
import { useProducts } from "@/lib/hooks/use-products"
import { useCategories } from "@/lib/hooks/use-categories"
import type { Product, ProductCategory, ProductSortOption } from "@/types/product"
import { useCartContext } from "@/lib/providers/cart-provider"
import { Breadcrumbs } from "@/components/common/breadcrumbs"

const ITEMS_PER_PAGE = 12

const sortLabels: Record<ProductSortOption, string> = {
  newest: "Newest",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  rating: "Top Rated",
  popular: "Most Popular",
}

function SearchPageInner() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const initialQuery = searchParams.get("q") || ""

  const [searchQuery, setSearchQuery] = useState(initialQuery)
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>()
  const [minPrice, setMinPrice] = useState<number | undefined>()
  const [maxPrice, setMaxPrice] = useState<number | undefined>()
  const [selectedRating, setSelectedRating] = useState<number | undefined>()
  const [sortBy, setSortBy] = useState<ProductSortOption>("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const { addItem } = useCartContext()

  const { data: allProducts = [], isLoading: prodLoading } = useProducts({ search: searchQuery || undefined, per_page: 100 })
  const { data: categories = [], isLoading: catLoading } = useCategories()

  const filtered = useMemo(() => {
    let result = [...allProducts]

    if (selectedCategoryId) {
      const cat = categories.find((c: ProductCategory) => c.id === selectedCategoryId)
      if (cat) result = result.filter((p) => p.category_name.toLowerCase() === cat.name.toLowerCase())
    }

    if (minPrice !== undefined) result = result.filter((p) => p.price >= minPrice)
    if (maxPrice !== undefined) result = result.filter((p) => p.price <= maxPrice)

    if (selectedRating) result = result.filter((p) => p.rating >= selectedRating)

    switch (sortBy) {
      case "price_asc": result.sort((a, b) => a.price - b.price); break
      case "price_desc": result.sort((a, b) => b.price - a.price); break
      case "rating": result.sort((a, b) => b.rating - a.rating); break
      case "popular": result.sort((a, b) => b.review_count - a.review_count); break
      case "newest": result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break
    }

    return result
  }, [searchQuery, selectedCategoryId, minPrice, maxPrice, selectedRating, sortBy, allProducts, categories])

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE)
  const paginated = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE)

  const handleReset = useCallback(() => {
    setSelectedCategoryId(undefined)
    setMinPrice(undefined)
    setMaxPrice(undefined)
    setSelectedRating(undefined)
    setSortBy("newest")
    setSearchQuery("")
    setCurrentPage(1)
    router.push("/search")
  }, [router])

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q)
    setCurrentPage(1)
    router.push(`/search?q=${encodeURIComponent(q)}`, { scroll: false })
  }, [router])

  const handleCategoryChange = useCallback((id: number | undefined) => {
    setSelectedCategoryId(id)
    setCurrentPage(1)
  }, [])

  const handlePriceChange = useCallback((min: number | undefined, max: number | undefined) => {
    setMinPrice(min)
    setMaxPrice(max)
    setCurrentPage(1)
  }, [])

  const handleRatingChange = useCallback((r: number | undefined) => {
    setSelectedRating(r)
    setCurrentPage(1)
  }, [])

  const handleSortChange = useCallback((s: ProductSortOption) => {
    setSortBy(s)
    setCurrentPage(1)
  }, [])

  const isLoading = prodLoading && allProducts.length === 0

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar announcements={HEADER_ANNOUNCEMENTS} interval={5000} />
      <Header categories={categories} />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "Search" }]} className="mb-6" />

        <div className="flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex-1 max-w-xl">
              <SearchBar onSearch={handleSearch} placeholder="Search products..." autoFocus />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div>
              {isLoading ? (
                <p className="text-sm text-muted-foreground">Searching products...</p>
              ) : (
                <p className="text-sm text-muted-foreground">
                  {searchQuery ? (
                    <>
                      <span className="font-medium text-foreground">{filtered.length}</span> results for &quot;<span className="font-medium text-foreground">{searchQuery}</span>&quot;
                    </>
                  ) : (
                    <span className="text-foreground font-medium">{filtered.length}</span>
                  )}
                  {!searchQuery && <> products available</>}
                </p>
              )}
            </div>
            {!isLoading && filtered.length > 0 && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Sort:</span>
                <select
                  value={sortBy}
                  onChange={(e) => handleSortChange(e.target.value as ProductSortOption)}
                  className="h-8 rounded-lg border border-input bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  {Object.entries(sortLabels).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="flex gap-8">
            <aside className="hidden lg:block w-[280px] shrink-0">
              <div className="sticky top-24 space-y-6">
                <FilterSidebar
                  categories={categories}
                  selectedCategoryId={selectedCategoryId}
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  selectedRating={selectedRating}
                  sortBy={sortBy}
                  onCategoryChange={handleCategoryChange}
                  onPriceChange={handlePriceChange}
                  onRatingChange={handleRatingChange}
                  onSortChange={handleSortChange}
                  onReset={handleReset}
                />
              </div>
            </aside>

            <div className="flex-1 min-w-0">
              {isLoading ? (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="bg-card border rounded-xl overflow-hidden animate-pulse">
                      <div className="aspect-square bg-muted" />
                      <div className="p-4 space-y-2">
                        <div className="h-4 bg-muted rounded w-3/4" />
                        <div className="h-3 bg-muted rounded w-1/2" />
                        <div className="h-5 bg-muted rounded w-1/3" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : paginated.length > 0 ? (
                <>
                  <ProductGrid
                    products={paginated}
                    onAddToCart={addItem}
                    columns={4}
                  />
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                    className="mt-8"
                  />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
                    <Search className="h-10 w-10 text-muted-foreground/40" />
                  </div>
                  <h3 className="text-xl font-semibold mb-1">No products found</h3>
                  <p className="text-base text-muted-foreground max-w-sm mb-6">
                    {searchQuery
                      ? `We couldn't find any products matching "${searchQuery}". Try a different search term.`
                      : "Try adjusting your filters or browse our categories."}
                  </p>
                  <div className="flex gap-3">
                    {searchQuery && (
                      <Button variant="outline" onClick={() => handleSearch("")}>
                        <X className="h-4 w-4 mr-2" />
                        Clear Search
                      </Button>
                    )}
                    <Button onClick={handleReset}>
                      Reset Filters
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-brand-green border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <SearchPageInner />
    </Suspense>
  )
}
