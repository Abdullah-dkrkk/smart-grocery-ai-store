"use client"

import { useState, useMemo, useCallback } from "react"
import { AnnouncementBar } from "@/components/sections/announcement-bar"
import { Header } from "@/components/sections/header"
import { FilterSidebar } from "@/components/store/filter-sidebar"
import { ProductGrid } from "@/components/store/product-grid"
import { Pagination } from "@/components/store/pagination"
import { SearchBar } from "@/components/store/search-bar"
import { Footer } from "@/components/store/footer"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, X, ChevronDown, Grid3X3, List } from "lucide-react"
import { cn } from "@/lib/utils"
import { MOCK_PRODUCTS } from "@/lib/mock/products"
import type { ProductCategory, ProductSortOption } from "@/types/product"
import { useCartContext } from "@/lib/providers/cart-provider"

const announcements = [
  { text: "Grand opening — up to 15% off all items. Only 3 days left!" },
  { text: "Free delivery on orders over $50 — shop now!" },
  { text: "Trendy 25 silver jewelry — save up to 35% off today!" },
]

const categories: ProductCategory[] = [
  { id: 1, name: "Milks & Dairies", slug: "milks-dairies", description: "", image: "", icon: "", parent_id: null, product_count: 30 },
  { id: 2, name: "Wines & Drinks", slug: "wines-drinks", description: "", image: "", icon: "", parent_id: null, product_count: 25 },
  { id: 3, name: "Clothing & Beauty", slug: "clothing-beauty", description: "", image: "", icon: "", parent_id: null, product_count: 45 },
  { id: 4, name: "Pet Foods & Toys", slug: "pet-foods", description: "", image: "", icon: "", parent_id: null, product_count: 18 },
  { id: 5, name: "Baking Material", slug: "baking-material", description: "", image: "", icon: "", parent_id: null, product_count: 35 },
  { id: 6, name: "Fresh Fruit", slug: "fresh-fruit", description: "", image: "", icon: "", parent_id: null, product_count: 50 },
  { id: 7, name: "Vegetables", slug: "vegetables", description: "", image: "", icon: "", parent_id: null, product_count: 65 },
  { id: 8, name: "Bread & Juice", slug: "bread-juice", description: "", image: "", icon: "", parent_id: null, product_count: 28 },
  { id: 9, name: "Fresh Seafood", slug: "fresh-seafood", description: "", image: "", icon: "", parent_id: null, product_count: 22 },
  { id: 10, name: "Fast Food", slug: "fast-food", description: "", image: "", icon: "", parent_id: null, product_count: 40 },
  { id: 11, name: "Cake & Milk", slug: "cake-milk", description: "", image: "", icon: "", parent_id: null, product_count: 15 },
  { id: 12, name: "Coffee & Teas", slug: "coffee-teas", description: "", image: "", icon: "", parent_id: null, product_count: 33 },
]

const allProducts = MOCK_PRODUCTS

const ITEMS_PER_PAGE = 12

const sortLabels: Record<ProductSortOption, string> = {
  newest: "Newest",
  price_asc: "Price: Low to High",
  price_desc: "Price: High to Low",
  rating: "Top Rated",
  popular: "Most Popular",
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | undefined>()
  const [minPrice, setMinPrice] = useState<number | undefined>()
  const [maxPrice, setMaxPrice] = useState<number | undefined>()
  const [selectedRating, setSelectedRating] = useState<number | undefined>()
  const [sortBy, setSortBy] = useState<ProductSortOption>("newest")
  const [currentPage, setCurrentPage] = useState(1)
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false)
  const { addItem } = useCartContext()
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const filtered = useMemo(() => {
    let result = [...allProducts]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter((p) => p.name.toLowerCase().includes(q) || p.category_name.toLowerCase().includes(q))
    }

    if (selectedCategoryId) {
      const cat = categories.find((c) => c.id === selectedCategoryId)
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
  }, [searchQuery, selectedCategoryId, minPrice, maxPrice, selectedRating, sortBy])

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
  }, [])

  const handleSearch = useCallback((q: string) => {
    setSearchQuery(q)
    setCurrentPage(1)
  }, [])

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
    setSortDropdownOpen(false)
  }, [])

  const totalResults = filtered.length

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar announcements={announcements} interval={5000} />
      <Header categories={categories} cartCount={3} />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb + Page Title */}
        <div className="mb-6">
          <nav className="text-sm text-muted-foreground mb-2">
            <a href="/" className="hover:text-brand-green transition-colors">Home</a>
            <span className="mx-2">/</span>
            <span className="text-foreground font-medium">Products</span>
          </nav>
          <h1 className="text-3xl font-heading font-semibold">All Products</h1>
        </div>

        <div className="flex gap-8">
          {/* Sidebar - Desktop */}
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

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-6 bg-card border rounded-xl p-4">
              <div className="flex items-center gap-3">
                {/* Mobile filter toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  className="lg:hidden"
                  onClick={() => setMobileFilterOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>

                {/* Search */}
                <div className="w-full sm:w-64">
                  <SearchBar onSearch={handleSearch} placeholder="Search products..." />
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
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

                {/* View Mode Toggle */}
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

                {/* Result count */}
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                  {totalResults} product{totalResults !== 1 ? "s" : ""}
                </span>
              </div>
            </div>

            {/* Active Filters */}
            {(selectedCategoryId || minPrice !== undefined || maxPrice !== undefined || selectedRating || searchQuery) && (
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <span className="text-sm text-muted-foreground">Active filters:</span>
                {searchQuery && (
                  <span className="inline-flex items-center gap-1 text-xs bg-brand-green/10 text-brand-green px-2.5 py-1 rounded-full">
                    Search: &quot;{searchQuery}&quot;
                    <button onClick={() => handleSearch("")} className="hover:text-brand-green/70"><X className="h-3 w-3" /></button>
                  </span>
                )}
                {selectedCategoryId && (
                  <span className="inline-flex items-center gap-1 text-xs bg-brand-green/10 text-brand-green px-2.5 py-1 rounded-full">
                    {categories.find((c) => c.id === selectedCategoryId)?.name}
                    <button onClick={() => handleCategoryChange(undefined)} className="hover:text-brand-green/70"><X className="h-3 w-3" /></button>
                  </span>
                )}
                {(minPrice !== undefined || maxPrice !== undefined) && (
                  <span className="inline-flex items-center gap-1 text-xs bg-brand-green/10 text-brand-green px-2.5 py-1 rounded-full">
                    Price: {minPrice !== undefined ? `$${minPrice}` : "$0"} – {maxPrice !== undefined ? `$${maxPrice}` : "∞"}
                    <button onClick={() => handlePriceChange(undefined, undefined)} className="hover:text-brand-green/70"><X className="h-3 w-3" /></button>
                  </span>
                )}
                {selectedRating && (
                  <span className="inline-flex items-center gap-1 text-xs bg-brand-green/10 text-brand-green px-2.5 py-1 rounded-full">
                    ★ {selectedRating}+
                    <button onClick={() => handleRatingChange(undefined)} className="hover:text-brand-green/70"><X className="h-3 w-3" /></button>
                  </span>
                )}
                <button onClick={handleReset} className="text-xs text-muted-foreground hover:text-destructive transition-colors ml-1 underline">
                  Clear all
                </button>
              </div>
            )}

            {/* Products Grid / Empty State */}
            {paginated.length > 0 ? (
              <>
                {viewMode === "grid" ? (
                  <ProductGrid
                    products={paginated}
                    columns={3}
                    onAddToCart={(p) => addItem(p)}
                    onToggleWishlist={(p) => console.log("Toggle wishlist", p.name)}
                  />
                ) : (
                  <div className="space-y-4">
                    {paginated.map((product) => (
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

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="mt-8">
                    <Pagination
                      currentPage={currentPage}
                      totalPages={totalPages}
                      onPageChange={(p) => { setCurrentPage(p); window.scrollTo({ top: 0, behavior: "smooth" }) }}
                    />
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-20">
                <div className="text-6xl mb-4 opacity-30">🔍</div>
                <h3 className="text-xl font-heading font-semibold mb-2">No products found</h3>
                <p className="text-muted-foreground mb-6">Try adjusting your filters or search query</p>
                <Button onClick={handleReset} variant="outline">Reset all filters</Button>
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
              selectedCategoryId={selectedCategoryId}
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
