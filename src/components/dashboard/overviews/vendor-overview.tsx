"use client"

import { useEffect, useState } from "react"
import { Package, ShoppingBag, DollarSign, Star, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { StatCard } from "@/components/dashboard/common/stat-card"
import { RecentOrderRow } from "@/components/dashboard/common/recent-order-row"
import { dashboardApi, type VendorDashboardOverview } from "@/lib/api/dashboard"
import { setAuthToken } from "@/lib/api/config"
import { useSession } from "next-auth/react"
import Link from "next/link"

export function VendorOverview() {
  const { data: session, status } = useSession()
  const [data, setData] = useState<VendorDashboardOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return
    if (status !== "authenticated" || !session?.user?.token) {
      setLoading(false)
      setError("Please sign in to view your dashboard.")
      return
    }
    setAuthToken(session.user.token)

    dashboardApi.vendorOverview()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message || "Failed to load dashboard."))
      .finally(() => setLoading(false))
  }, [status, session])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Store Dashboard</h2>
          <p className="text-base text-muted-foreground">Loading your dashboard...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-card border rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Store Dashboard</h2>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Unable to load dashboard</h3>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Store Dashboard</h2>
        <p className="text-base text-muted-foreground">Track your products, orders, and earnings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={Package} label="Total Products" value={String(data.total_products)} trend={`${data.active_products} active`} positive color="bg-brand-green/10 text-brand-green" />
        <StatCard icon={ShoppingBag} label="Orders Received" value={String(data.orders_received_total)} trend={`${data.orders_received_today} today`} positive color="bg-blue-50 text-blue-600" />
        <StatCard icon={DollarSign} label="Revenue" value={`$${data.total_revenue.toLocaleString()}`} trend={`$${data.revenue_this_month.toLocaleString()} this month`} positive color="bg-brand-orange/10 text-brand-orange" />
        <StatCard icon={Star} label="Avg. Rating" value={String(data.average_rating)} trend={data.average_rating > 0 ? "Active" : "No ratings yet"} positive={data.average_rating > 0} color="bg-purple-50 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Inventory Alert</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {data.low_stock_products.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No low stock alerts.</p>
            ) : (
              data.low_stock_products.map((item) => (
                <div key={item.id} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <div className={cn("h-2.5 w-2.5 rounded-full", item.stock_quantity <= item.min_stock_threshold * 0.5 ? "bg-destructive" : "bg-yellow-400")} />
                    <span className="text-base">{item.name}</span>
                  </div>
                  <span className={cn("text-sm font-medium", item.stock_quantity <= item.min_stock_threshold * 0.5 ? "text-destructive" : "text-muted-foreground")}>
                    {item.stock_quantity} left
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="border-b">
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            {data.recent_orders.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center px-5">No orders yet.</p>
            ) : (
              <div className="px-5">
                {data.recent_orders.slice(0, 5).map((order) => (
                  <RecentOrderRow
                    key={order.id}
                    id={order.order_number}
                    customer={order.customer_name}
                    items={order.items_count}
                    total={order.total_amount.toFixed(2)}
                    status={order.status as "pending" | "processing" | "shipped" | "delivered" | "cancelled"}
                    time={order.created_at}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
