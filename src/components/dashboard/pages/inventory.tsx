"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Warehouse, AlertCircle, Search, Package } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { productsApi } from "@/lib/api/products"
import { setAuthToken } from "@/lib/api/config"
import type { Product } from "@/lib/api/types"

export function Inventory() {
  const { data: session, status: authStatus } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"all" | "low" | "out">("all")

  useEffect(() => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false); setError("Please sign in.")
      return
    }
    setAuthToken(session.user.token)
    setLoading(true)
    productsApi.vendorProducts()
      .then((res) => setProducts(res.data || []))
      .catch((err) => setError(err.message || "Failed to load inventory."))
      .finally(() => setLoading(false))
  }, [authStatus, session])

  const filtered = products.filter((p) => {
    const mS = p.name.toLowerCase().includes(search.toLowerCase())
    const mF = filter === "all" ? true : filter === "low" ? p.stock_quantity <= (p.min_stock_threshold || 5) && p.stock_quantity > 0 : p.stock_quantity === 0
    return mS && mF
  })

  const lowStock = products.filter((p) => p.stock_quantity <= (p.min_stock_threshold || 5) && p.stock_quantity > 0).length
  const outOfStock = products.filter((p) => p.stock_quantity === 0).length

  if (loading) return (
    <div className="space-y-6">
      <div className="space-y-2"><h2 className="text-2xl font-semibold">Inventory</h2><p className="text-base text-muted-foreground">Loading inventory...</p></div>
      {[1,2,3].map((i) => <div key={i} className="h-16 bg-card border rounded-xl animate-pulse" />)}
    </div>
  )

  if (error) return (
    <div className="space-y-6">
      <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Unable to load inventory</h3>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>
        <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
      </CardContent></Card>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Inventory Management</h2>
        <p className="text-base text-muted-foreground">Track stock levels and manage your products.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="flex items-center gap-4 pt-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-green/10"><Package className="h-6 w-6 text-brand-green" /></div>
          <div><p className="text-sm text-muted-foreground">Total Products</p><p className="text-xl font-semibold">{products.length}</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 pt-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-yellow-50"><AlertCircle className="h-6 w-6 text-yellow-600" /></div>
          <div><p className="text-sm text-muted-foreground">Low Stock</p><p className="text-xl font-semibold">{lowStock}</p></div>
        </CardContent></Card>
        <Card><CardContent className="flex items-center gap-4 pt-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10"><Warehouse className="h-6 w-6 text-destructive" /></div>
          <div><p className="text-sm text-muted-foreground">Out of Stock</p><p className="text-xl font-semibold">{outOfStock}</p></div>
        </CardContent></Card>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10 text-sm" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {(["all", "low", "out"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${filter === f ? "bg-brand-green text-white" : "text-muted-foreground hover:bg-muted"}`}>
              {f === "all" ? "All" : f === "low" ? "Low Stock" : "Out of Stock"}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Warehouse className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No products found</h3>
          <p className="text-sm text-muted-foreground">{search ? "Try a different search." : "No products match this filter."}</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((product) => (
            <Card key={product.id}>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-muted overflow-hidden">
                  {product.image_url ? <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" /> : <Package className="h-5 w-5 text-muted-foreground/40" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{product.name}</p>
                  <p className="text-xs text-muted-foreground">SKU: {product.sku || "N/A"}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className={`text-lg font-semibold ${product.stock_quantity === 0 ? "text-destructive" : product.stock_quantity <= (product.min_stock_threshold || 5) ? "text-yellow-600" : "text-brand-green"}`}>
                    {product.stock_quantity}
                  </p>
                  <p className="text-xs text-muted-foreground">in stock</p>
                </div>
                <Badge variant={product.stock_quantity === 0 ? "destructive" : product.stock_quantity <= (product.min_stock_threshold || 5) ? "outline" : "default"}
                  className={`text-[10px] ${product.stock_quantity > 0 && product.stock_quantity <= (product.min_stock_threshold || 5) ? "border-yellow-300 text-yellow-700" : ""}`}>
                  {product.stock_quantity === 0 ? "Out" : product.stock_quantity <= (product.min_stock_threshold || 5) ? "Low" : "In Stock"}
                </Badge>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
