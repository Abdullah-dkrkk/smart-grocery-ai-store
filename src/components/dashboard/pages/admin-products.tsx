"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Package, Search, AlertCircle, Edit3, Trash2, Plus } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { productsApi } from "@/lib/api/products"
import { setAuthToken } from "@/lib/api/config"
import type { Product } from "@/lib/api/types"

export function AdminProducts() {
  const { data: session, status: authStatus } = useSession()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false); setError("Please sign in.")
      return
    }
    setAuthToken(session.user.token)
    setLoading(true)
    productsApi.list({ per_page: 100 })
      .then((res) => setProducts(res.data || []))
      .catch((err) => setError(err.message || "Failed to load products."))
      .finally(() => setLoading(false))
  }, [authStatus, session])

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="space-y-6">
      <div className="space-y-2"><h2 className="text-2xl font-semibold">Products</h2><p className="text-base text-muted-foreground">Loading products...</p></div>
      {[1,2,3].map((i) => <div key={i} className="h-20 bg-card border rounded-xl animate-pulse" />)}
    </div>
  )

  if (error) return (
    <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Unable to load products</h3>
      <p className="text-sm text-muted-foreground mb-6">{error}</p>
      <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
    </CardContent></Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">All Products</h2>
          <p className="text-base text-muted-foreground">Manage the entire product catalog. ({filtered.length} products)</p>
        </div>
      </div>

      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search products..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10 text-sm" />
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Package className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No products found</h3>
          <p className="text-sm text-muted-foreground">{search ? "Try a different search." : "No products in the catalog."}</p>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((product) => (
            <Card key={product.id}>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-muted overflow-hidden">
                  {product.image_url ? <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" /> : <Package className="h-6 w-6 text-muted-foreground/40" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-medium truncate">{product.name}</p>
                    <Badge variant={product.is_active ? "default" : "secondary"} className="text-[10px]">{product.is_active ? "Active" : "Inactive"}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Price: ${Number(product.price).toFixed(2)} | Stock: {product.stock_quantity} | SKU: {product.sku || "N/A"}</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"><Edit3 className="h-4 w-4 text-muted-foreground" /></button>
                  <button className="p-2 hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer"><Trash2 className="h-4 w-4 text-destructive" /></button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
