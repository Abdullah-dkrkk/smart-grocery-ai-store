"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { ShoppingBag, Search, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { RecentOrderRow } from "@/components/dashboard/common/recent-order-row"
import { ordersApi } from "@/lib/api/orders"
import { setAuthToken } from "@/lib/api/config"
import type { Order } from "@/lib/api/types"

const statusFilters = ["All", "Pending", "Processing", "Shipped", "Delivered", "Cancelled"]

export function AdminOrders() {
  const { data: session, status: authStatus } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("All")

  useEffect(() => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false); setError("Please sign in.")
      return
    }
    setAuthToken(session.user.token)
    setLoading(true)
    ordersApi.adminList({ page, per_page: 10 })
      .then((res) => {
        const data = res.data || []
        setOrders(data)
        setTotalPages(Math.max(1, Math.ceil((res as { meta?: { last_page?: number } }).meta?.last_page || data.length / 10)))
      })
      .catch((err) => setError(err.message || "Failed to load orders."))
      .finally(() => setLoading(false))
  }, [authStatus, session, page])

  const filtered = orders.filter((o) => {
    const mS = statusFilter === "All" || o.status.toLowerCase() === statusFilter.toLowerCase()
    const mS2 = !search || o.order_number.toLowerCase().includes(search.toLowerCase())
    return mS && mS2
  })

  if (loading) return (
    <div className="space-y-6">
      <div className="space-y-2"><h2 className="text-2xl font-semibold">Orders</h2><p className="text-base text-muted-foreground">Loading orders...</p></div>
      {[1,2,3].map((i) => <div key={i} className="h-16 bg-card border rounded-xl animate-pulse" />)}
    </div>
  )

  if (error) return (
    <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Unable to load orders</h3>
      <p className="text-sm text-muted-foreground mb-6">{error}</p>
      <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
    </CardContent></Card>
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Order Management</h2>
        <p className="text-base text-muted-foreground">View and manage all platform orders.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by order number..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10 text-sm" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {statusFilters.map((f) => (
            <button key={f} onClick={() => { setStatusFilter(f); setPage(1) }}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${statusFilter === f ? "bg-brand-green text-white" : "text-muted-foreground hover:bg-muted"}`}>{f}</button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <ShoppingBag className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No orders found</h3>
          <p className="text-sm text-muted-foreground mb-6">{search || statusFilter !== "All" ? "Try adjusting your search." : "No orders placed yet."}</p>
        </CardContent></Card>
      ) : (
        <Card className="pb-0">
          <CardHeader><CardTitle>{statusFilter === "All" ? "All Orders" : `${statusFilter} Orders`} <span className="text-sm font-normal text-muted-foreground ml-2">({filtered.length})</span></CardTitle></CardHeader>
          <CardContent className="p-0">
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-3.5 pl-5 pr-3 font-medium">Order</th>
                  <th className="py-3.5 px-3 font-medium">Items</th>
                  <th className="py-3.5 px-3 font-medium">Total</th>
                  <th className="py-3.5 px-3 font-medium">Status</th>
                  <th className="py-3.5 pl-3 pr-5 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <RecentOrderRow key={order.id} id={order.order_number} items={order.items?.length || 0}
                    total={Number.parseFloat(order.total_amount || "0").toFixed(2)}
                    status={order.status as "pending" | "processing" | "shipped" | "delivered" | "cancelled"}
                    time={order.created_at} />
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-2">
          <p className="text-sm text-muted-foreground">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}><ChevronLeft className="h-4 w-4 mr-1" /> Previous</Button>
            <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage(page + 1)}>Next <ChevronRight className="h-4 w-4 ml-1" /></Button>
          </div>
        </div>
      )}
    </div>
  )
}
