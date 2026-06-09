"use client"

import { useState, useCallback, useMemo } from "react"
import { useParams, useSearchParams, useRouter } from "next/navigation"
import Link from "next/link"
import { AnnouncementBar } from "@/components/sections/announcement-bar"
import { Header } from "@/components/sections/header"
import { HEADER_ANNOUNCEMENTS } from "@/lib/constants"
import { Footer } from "@/components/store/footer"
import { FilterSidebar } from "@/components/store/filter-sidebar"
import { ProductGrid } from "@/components/store/product-grid"
import { Pagination } from "@/components/store/pagination"
import { SearchBar } from "@/components/store/search-bar"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { useCategories } from "@/lib/hooks/use-categories"
import { usePaginatedProducts } from "@/lib/hooks/use-products"
import { useCartContext } from "@/lib/providers/cart-provider"
import { Breadcrumbs } from "@/components/common/breadcrumbs"
import { cn } from "@/lib/utils"
import { handleImgError } from "@/lib/utils/placeholder"
import { SlidersHorizontal, X, ChevronDown, Grid3X3, List, AlertCircle, RefreshCw, Package, Search } from "lucide-react"
import type { ProductCategory, ProductSortOption } from "@/types/product"

const ITEMS_PER_PAGE = 12

const sortLabels: Record<ProductSortOption, string> = {
  newest: "Newest",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  rating: "Top Rated",
  popular: "Most Popular",
}

export default function CategorySlugPage() {
  const params = useParams()
  const slug = params.slug as string
  const searchParams = useSearchParams()
  const router = useRouter()
  const { addItem } = useCartContext()

  const { data: categories = [], isLoading: catLoading } = useCategories()

  const category = useMemo(
    () => categories.find((c: ProductCategory) => c.slug === slug) ?? null,
    [categories, slug]
  )

  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const sortBy = (searchParams.get("sort") as ProductSortOption) || "newest"
  const minPrice = searchParams.get("min_price") ? Number(searchParams.get("min_price")) : undefined
  const maxPrice = searchParams.get("max_price") ? Number(searchParams.get("max_price")) : undefined
  const selectedRating = searchParams.get("rating") ? Number(searchParams.get("rating")) : undefined
  const searchQuery = searchParams.get("search") || ""
  const currentPage = Number(searchParams.get("page")) || 1

  function buildFilters() {
    const filters: Record<string, string | number | boolean | undefined> = {
      page: currentPage,
      per_page: ITEMS_PER_PAGE,
    }
    if (category) filters.category_id = category.id
    if (searchQuery) filters.search = searchQuery
    if (minPrice !== undefined) filters.min_price = minPrice
    if (maxPrice !== undefined) filters.max_price = maxPrice
    if (selectedRating) filters.rating = selectedRating

    switch (sortBy) {
      case "price_asc": filters.sort_by = "price"; filters.sort_dir = "asc"; break
      case "price_desc": filters.sort_by = "price"; filters.sort_dir = "desc"; break
      case "rating": filters.sort_by = "avg_rating"; filters.sort_dir = "desc"; break
      case "popular": filters.sort_by = "review_count"; filters.sort_dir = "desc"; break
      case "newest": filters.sort_by = "created_at"; filters.sort_dir = "desc"; break
    }
    return filters
  }

  const { data: pageData, isLoading: prodLoading, error, refetch } = usePaginatedProducts(buildFilters() as Record<string, string | number | boolean | undefined>)

  const products = pageData?.products ?? []
  const pagination = pageData?.pagination ?? { current_page: 1, last_page: 1, total: 0, per_page: ITEMS_PER_PAGE, from: null, to: null }

  function updateURL(updates: Record<string, string | undefined>) {
    const current = new URLSearchParams(searchParams.toString())
    for (const [key, value] of Object.entries(updates)) {
      if (value === undefined || value === "" || value === "1" || (key === "sort" && value === "newest")) {
        current.delete(key)
      } else {
        current.set(key, value)
      }
    }
    const qs = current.toString()
    router.push(`/categories/${slug}${qs ? `?${qs}` : ""}`, { scroll: false })
  }

  const handleSearch = useCallback((q: string) => {
    updateURL({ search: q || undefined, page: undefined })
  }, [slug, searchParams])

  const handleSortChange = useCallback((s: ProductSortOption) => {
    updateURL({ sort: s, page: undefined })
    setSortDropdownOpen(false)
  }, [slug, searchParams])

  const handlePriceChange = useCallback((min: number | undefined, max: number | undefined) => {
    updateURL({ min_price: min?.toString(), max_price: max?.toString(), page: undefined })
  }, [slug, searchParams])

  const handleRatingChange = useCallback((r: number | undefined) => {
    updateURL({ rating: r?.toString(), page: undefined })
  }, [slug, searchParams])

  const handleCategoryChange = useCallback((id: number | undefined) => {
    if (id === undefined) {
      router.push(`/products`)
    } else {
      const cat = categories.find((c: ProductCategory) => c.id === id)
      if (cat) router.push(`/categories/${cat.slug}`)
    }
  }, [categories, router])

  const handleReset = useCallback(() => {
    router.push(`/categories/${slug}`)
  }, [slug, router])

  const hasFilters = minPrice !== undefined || maxPrice !== undefined || selectedRating !== undefined || searchQuery

  const isLoading_ = catLoading || prodLoading

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar announcements={HEADER_ANNOUNCEMENTS} interval={5000} />
      <Header categories={categories} />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Categories", href: "/categories" },
            { label: category?.name || slug },
          ]}
          className="mb-4"
        />

        {/* Category Header */}
        {category && (
          <div className="relative bg-gradient-to-r from-brand-green/15 via-brand-green/10 to-brand-green/8 rounded-2xl overflow-hidden border mb-8">
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <div className="absolute -top-24 right-[8%] w-[450px] h-[450px] rounded-full bg-brand-green/20 blur-3xl" />
              <div className="absolute bottom-[8%] right-[6%] w-72 h-72 rounded-full bg-emerald-300/20 blur-3xl" />
              <div className="absolute top-[15%] right-[42%] w-52 h-52 border-4 rounded-full" style={{ borderColor: '#34d399' }} />
              <div className="absolute top-[8%] right-[6%] w-32 h-32 border-4 rounded-2xl rotate-12" style={{ borderColor: '#34d399' }} />
              <div className="absolute bottom-[12%] right-[10%] w-24 h-24 border-4 rounded-xl -rotate-6" style={{ borderColor: '#34d399' }} />
              <div className="absolute top-[52%] right-[12%] w-5 h-5 rounded-full bg-brand-green/80" />
              <div className="absolute top-[78%] right-[42%] w-4 h-4 rounded-full bg-brand-green/70" />
              <div className="absolute bottom-[45%] right-[22%] w-3 h-3 rounded-full bg-brand-green/80" />
              <div className="absolute top-[38%] right-[44%] w-4 h-4 rounded-full bg-brand-green/70" />
              <div className="absolute top-[65%] right-[38%] w-3 h-3 rounded-full bg-brand-green/80" />
              <svg className="absolute top-[30%] right-[32%] w-24 h-24 text-brand-green/60" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <div className="relative z-10 flex items-center gap-6 p-6 md:p-8">
              {category.image && (
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0">
                  <img src={category.image} alt={category.name} className="w-full h-full object-cover" onError={handleImgError} />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl md:text-3xl font-heading font-semibold">{category.name}</h1>
                {category.description && (
                  <p className="text-muted-foreground mt-1 text-sm md:text-base">{category.description}</p>
                )}
                <p className="text-sm text-brand-green font-medium mt-2 flex items-center gap-1.5">
                  <Package className="h-4 w-4" />
                  {pagination.total === 0 && isLoading_ ? "Loading..." : `${pagination.total} product${pagination.total !== 1 ? "s" : ""}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {!category && !catLoading && (
          <div className="text-center py-12 mb-8">
            <h1 className="text-2xl font-heading font-semibold mb-2">Category not found</h1>
            <p className="text-muted-foreground">
              The category you are looking for does not exist.{' '}
              <Link href="/categories" className="text-brand-green hover:underline">Browse all categories</Link>
            </p>
          </div>
        )}

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block w-[280px] shrink-0">
            <div className="sticky top-24 space-y-6">
              <FilterSidebar
                categories={categories}
                selectedCategoryId={category?.id}
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

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-card border rounded-xl p-4">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setMobileFilterOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <div className="w-full sm:w-64">
                  <SearchBar
                    onSearch={handleSearch}
                    placeholder="Search in this category..."
                  />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="relative">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                    className="min-w-[140px] justify-between"
                  >
                    {sortLabels[sortBy]}
                    <ChevronDown className={cn("h-4 w-4 ml-2 transition-transform", sortDropdownOpen && "rotate-180")} />
                  </Button>
                  {sortDropdownOpen && (
                    <div className="absolute right-0 top-full mt-1 w-[180px] bg-card border rounded-lg shadow-lg z-50 py-1">
                      {(Object.entries(sortLabels) as [ProductSortOption, string][]).map(([key, label]) => (
                        <button
                          key={key}
                          onClick={() => handleSortChange(key)}
                          className={cn(
                            "w-full text-left px-4 py-2 text-sm hover:bg-muted transition-colors",
                            sortBy === key && "text-brand-green font-medium"
                          )}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex border rounded-lg overflow-hidden">
                  <button
                    onClick={() => setViewMode("grid")}
                    className={cn("p-2 transition-colors", viewMode === "grid" ? "bg-brand-green text-white" : "bg-card text-muted-foreground hover:text-foreground")}
                    aria-label="Grid view"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode("list")}
                    className={cn("p-2 transition-colors", viewMode === "list" ? "bg-brand-green text-white" : "bg-card text-muted-foreground hover:text-foreground")}
                    aria-label="List view"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                {!isLoading_ && (
                  <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {pagination.total} product{pagination.total !== 1 ? "s" : ""}
                  </span>
                )}
              </div>
            </div>

            {/* Active Filters */}
            {hasFilters && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 text-xs bg-brand-green/10 text-brand-green px-2.5 py-1 rounded-full">
                    Search: &quot;{searchQuery}&quot;
                    <button onClick={() => updateURL({ search: undefined, page: undefined })} className="hover:text-brand-green/70"><X className="h-3 w-3" /></button>
                  </span>
                )}
                {(minPrice !== undefined || maxPrice !== undefined) && (
                  <span className="inline-flex items-center gap-1 text-xs bg-brand-green/10 text-brand-green px-2.5 py-1 rounded-full">
                    Price: {minPrice !== undefined ? `$${minPrice}` : "$0"} – {maxPrice !== undefined ? `$${maxPrice}` : "∞"}
                    <button onClick={() => updateURL({ min_price: undefined, max_price: undefined, page: undefined })} className="hover:text-brand-green/70"><X className="h-3 w-3" /></button>
                  </span>
                )}
                {selectedRating && (
                  <span className="inline-flex items-center gap-1 text-xs bg-brand-green/10 text-brand-green px-2.5 py-1 rounded-full">
                    ★ {selectedRating}+
                    <button onClick={() => updateURL({ rating: undefined, page: undefined })} className="hover:text-brand-green/70"><X className="h-3 w-3" /></button>
                  </span>
                )}
                <button onClick={handleReset} className="text-xs text-muted-foreground hover:text-destructive transition-colors ml-1 underline">
                  Clear all
                </button>
              </div>
            )}

            {/* Loading */}
            {isLoading_ ? (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="bg-card border rounded-lg overflow-hidden">
                    <Skeleton className="aspect-[4/5] rounded-none" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-16" />
                      <div className="flex items-center justify-between pt-2">
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-9 w-24 rounded-lg" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <AlertCircle className="h-12 w-12 text-destructive mb-4" />
                <h2 className="text-xl font-heading font-semibold mb-2">Failed to load products</h2>
                <p className="text-muted-foreground mb-6">Something went wrong. Please try again.</p>
                <Button onClick={() => refetch()} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" /> Retry
                </Button>
              </div>
            ) : products.length > 0 ? (
              <>
                {viewMode === "grid" ? (
                  <ProductGrid
                    products={products}
                    columns={3}
                    onAddToCart={(p) => addItem(p)}
                    onToggleWishlist={(p) => console.log("Toggle wishlist", p.name)}
                  />
                ) : (
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div key={product.id} className="flex gap-4 bg-card border rounded-xl p-4 hover:shadow-md transition-shadow">
                        <div className="w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-muted">
                          <img src={product.image} alt={product.name} className="w-full h-full object-cover" loading="lazy" />
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
                          <Button size="sm" className="bg-brand-green hover:bg-brand-green/90 text-white whitespace-nowrap" onClick={() => addItem(product)}>
                            Add to cart
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {pagination.last_page > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={pagination.current_page}
                      totalPages={pagination.last_page}
                      onPageChange={(p) => {
                        updateURL({ page: p === 1 ? undefined : String(p) })
                        window.scrollTo({ top: 0, behavior: "smooth" })
                      }}
                    />
                  </div>
                )}
              </>
            ) : (
          <div className="text-center py-24">
            <Search className="h-16 w-16 mx-auto text-muted-foreground/30 mb-4" />
            <h2 className="text-2xl font-heading font-semibold mb-2">No products found</h2>
                <p className="text-muted-foreground mb-6">
                  {hasFilters
                    ? "No products match your current filters."
                    : "This category has no products yet. Check back later for new arrivals."}
                </p>
                {hasFilters && (
                  <Button onClick={handleReset} variant="outline">Clear all filters</Button>
                )}
                {!hasFilters && (
                  <Link href="/categories">
                    <Button className="bg-brand-green hover:bg-brand-green/90 text-white">Browse All Categories</Button>
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setMobileFilterOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-[300px] max-w-[85vw] bg-background overflow-y-auto p-6 shadow-xl">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-heading font-semibold">Filters</h2>
              <Button variant="ghost" size="sm" onClick={() => setMobileFilterOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            <FilterSidebar
              categories={categories}
              selectedCategoryId={category?.id}
              minPrice={minPrice}
              maxPrice={maxPrice}
              selectedRating={selectedRating}
              sortBy={sortBy}
              onCategoryChange={(id) => { handleCategoryChange(id); setMobileFilterOpen(false) }}
              onPriceChange={(min, max) => { handlePriceChange(min, max); setMobileFilterOpen(false) }}
              onRatingChange={(r) => { handleRatingChange(r); setMobileFilterOpen(false) }}
              onSortChange={(s) => { handleSortChange(s); setMobileFilterOpen(false) }}
              onReset={() => { handleReset(); setMobileFilterOpen(false) }}
            />
          </div>
        </div>
      )}

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  )
}
