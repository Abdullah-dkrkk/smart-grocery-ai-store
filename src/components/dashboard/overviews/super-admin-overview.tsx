"use client"

import { useEffect, useState } from "react"
import { Users, Store, Stethoscope, DollarSign, AlertCircle, ShoppingBag } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { StatCard } from "@/components/dashboard/common/stat-card"
import { RecentOrderRow } from "@/components/dashboard/common/recent-order-row"
import { adminApi } from "@/lib/api/admin"
import { setAuthToken } from "@/lib/api/config"
import { useSession } from "next-auth/react"
import type { DashboardOverview } from "@/lib/api/types"

const statusColor: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-600 border-yellow-200",
  processing: "bg-blue-50 text-blue-600 border-blue-200",
  shipped: "bg-purple-50 text-purple-600 border-purple-200",
  delivered: "bg-green-50 text-green-600 border-green-200",
  cancelled: "bg-red-50 text-red-600 border-red-200",
}

export function SuperAdminOverview() {
  const { data: session, status: authStatus } = useSession()
  const [data, setData] = useState<DashboardOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false)
      setError("Please sign in to view the admin panel.")
      return
    }
    setAuthToken(session.user.token)

    adminApi.dashboard()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message || "Failed to load dashboard."))
      .finally(() => setLoading(false))
  }, [authStatus, session])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Admin Control Center</h2>
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
          <h2 className="text-2xl font-semibold">Admin Control Center</h2>
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

  const pendingOrders = (data.orders_by_status?.pending || 0) + (data.orders_by_status?.processing || 0)

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Admin Control Center</h2>
        <p className="text-base text-muted-foreground">Full platform oversight and management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={Users} label="Total Users" value={String(data.total_customers + data.total_vendors)} trend={`${data.total_customers} customers`} positive color="bg-blue-50 text-blue-600" />
        <StatCard icon={Store} label="Vendors" value={String(data.total_vendors)} trend="Registered" positive color="bg-brand-green/10 text-brand-green" />
        <StatCard icon={ShoppingBag} label="Total Orders" value={String(data.total_orders)} trend={`${pendingOrders} pending`} positive color="bg-brand-orange/10 text-brand-orange" />
        <StatCard icon={DollarSign} label="Platform Revenue" value={`$${(data.total_revenue || 0).toLocaleString()}`} trend={`$${(data.revenue_by_period?.this_month || 0).toLocaleString()} this month`} positive color="bg-purple-50 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Orders by Status</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {data.orders_by_status && Object.keys(data.orders_by_status).length > 0 ? (
              Object.entries(data.orders_by_status).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between py-1">
                  <span className="text-base capitalize">{status}</span>
                  <Badge variant="outline" className={cn("text-xs", statusColor[status] || "")}>
                    {count}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">No orders yet.</p>
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
                    customer={order.user?.name || "Unknown"}
                    items={order.items?.length || 0}
                    total={Number.parseFloat(order.total_amount || "0").toFixed(2)}
                    status={order.status as "pending" | "processing" | "shipped" | "delivered" | "cancelled"}
                    time={order.created_at}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Low Stock Products</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          {data.low_stock_products.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">All products are well stocked.</p>
          ) : (
            <div className="divide-y px-5">
              {data.low_stock_products.slice(0, 5).map((product) => (
                <div key={product.id} className="flex items-center justify-between py-3">
                  <span className="text-base font-medium">{product.name}</span>
                  <span className="text-sm text-destructive font-medium">{product.stock_quantity} left</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
