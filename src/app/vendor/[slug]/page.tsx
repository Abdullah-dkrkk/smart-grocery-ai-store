"use client"

import { useState, useEffect, useCallback } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { AnnouncementBarWrapper } from "@/components/sections/announcement-bar-wrapper"
import { Header } from "@/components/sections/header"
import { Footer } from "@/components/store/footer"
import { ProductGrid } from "@/components/store/product-grid"
import { Pagination } from "@/components/store/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Store, Mail, Phone, Package, AlertCircle, RefreshCw, ShoppingBag, ChevronLeft } from "lucide-react"
import { useCartContext } from "@/lib/providers/cart-provider"
import { wishlistApi } from "@/lib/api/wishlist"
import type { Product } from "@/types/product"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface VendorStoreData {
  vendor: {
    id: number
    name: string
    email: string
    phone: string | null
    avatar_url: string | null
    created_at: string
  }
  store: {
    store_name: string
    store_description: string | null
    store_logo_url: string | null
    store_banner_url: string | null
    contact_email: string | null
    contact_phone: string | null
    return_policy: string | null
    shipping_policy: string | null
  } | null
  products: Product[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
  }
}

export default function VendorSlugPage() {
  const params = useParams()
  const slug = params.slug as string
  const { addItem } = useCartContext()
  const { data: session } = useSession()
  const [data, setData] = useState<VendorStoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [page, setPage] = useState(1)

  const fetchVendor = useCallback(async () => {
    setLoading(true)
    setError("")
    try {
      const res = await fetch(`${API_BASE_URL}/vendors/${slug}?page=${page}`)
      const json = await res.json()
      if (!json.success) throw new Error(json.message || "Vendor not found")
      setData(json.data)
    } catch (e: any) {
      setError(e.message || "Failed to load vendor")
    } finally {
      setLoading(false)
    }
  }, [slug, page])

  useEffect(() => { fetchVendor() }, [fetchVendor])

  const toggleWishlist = useCallback(async (product: Product) => {
    if (!session?.user?.token) {
      window.location.href = "/login?callbackUrl=/vendor/" + slug
      return
    }
    try {
      const exists = await wishlistApi.list()
      const alreadyIn = Array.isArray(exists) && exists.some((w: any) => w.product_id === product.id || w.product?.id === product.id)
      if (alreadyIn) {
        await wishlistApi.remove(product.id)
      } else {
        await wishlistApi.add(product.id)
      }
    } catch {}
  }, [session, slug])

  const store = data?.store
  const vendor = data?.vendor
  const products = data?.products || []
  const meta = data?.meta

  return (
    <>
      <AnnouncementBarWrapper />
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <Link href="/products" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
            <ChevronLeft className="h-4 w-4" />
            Back to Products
          </Link>

          {loading ? (
            <div className="space-y-6">
              <Skeleton className="h-48 w-full rounded-2xl" />
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-72 rounded-xl" />
                ))}
              </div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <AlertCircle className="h-16 w-16 text-destructive mb-4" />
              <h2 className="text-2xl font-bold mb-2">Vendor Not Found</h2>
              <p className="text-muted-foreground mb-6">{error}</p>
              <div className="flex gap-3">
                <Button onClick={fetchVendor} variant="outline">
                  <RefreshCw className="h-4 w-4 mr-2" /> Retry
                </Button>
                <Button onClick={() => window.location.href = "/products"}>
                  Browse Products
                </Button>
              </div>
            </div>
          ) : vendor ? (
            <>
              <div className="bg-card border rounded-2xl p-8 mb-8">
                <div className="flex items-start gap-6 flex-col sm:flex-row">
                  <div className="h-20 w-20 rounded-full bg-brand-green/10 flex items-center justify-center shrink-0">
                    {store?.store_logo_url ? (
                      <img src={store.store_logo_url} alt={store.store_name} className="h-20 w-20 rounded-full object-cover" />
                    ) : (
                      <Store className="h-10 w-10 text-brand-green" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h1 className="text-2xl font-heading font-bold">{store?.store_name || vendor.name}</h1>
                    {store?.store_description && (
                      <p className="text-muted-foreground mt-1">{store.store_description}</p>
                    )}
                    <div className="flex flex-wrap gap-4 mt-4 text-sm text-muted-foreground">
                      {store?.contact_email && (
                        <span className="flex items-center gap-1.5">
                          <Mail className="h-4 w-4" /> {store.contact_email}
                        </span>
                      )}
                      {store?.contact_phone && (
                        <span className="flex items-center gap-1.5">
                          <Phone className="h-4 w-4" /> {store.contact_phone}
                        </span>
                      )}
                      <span className="flex items-center gap-1.5">
                        <Package className="h-4 w-4" /> {meta?.total || 0} Products
                      </span>
                      <span className="flex items-center gap-1.5">
                        <ShoppingBag className="h-4 w-4" /> Member since {new Date(vendor.created_at).getFullYear()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-xl font-heading font-bold">Products</h2>
              </div>

              {products.length > 0 ? (
                <>
                  <ProductGrid products={products} onAddToCart={(p) => addItem(p)} onToggleWishlist={toggleWishlist} columns={4} />
                  {meta && meta.last_page > 1 && (
                    <div className="mt-8">
                      <Pagination currentPage={meta.current_page} totalPages={meta.last_page} onPageChange={setPage} />
                    </div>
                  )}
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Package className="h-12 w-12 text-muted-foreground/40 mb-4" />
                  <h3 className="text-lg font-semibold mb-1">No Products Yet</h3>
                  <p className="text-muted-foreground">This vendor has no products available.</p>
                </div>
              )}
            </>
          ) : null}
        </div>
      </main>
      <Footer />
    </>
  )
}
