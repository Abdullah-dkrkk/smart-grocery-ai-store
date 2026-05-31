"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { ShoppingBag, Clock, Star, DollarSign, Truck, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StatCard } from "@/components/dashboard/common/stat-card"
import { RecentOrderRow } from "@/components/dashboard/common/recent-order-row"
import { ordersApi } from "@/lib/api/orders"
import type { Order } from "@/lib/api/types"
import { setAuthToken } from "@/lib/api/config"
import Link from "next/link"

export function UserOverview() {
  const { data: session, status } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
  const [totalOrders, setTotalOrders] = useState(0)
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

    ordersApi.history(1, 50)
      .then((res) => {
        const allOrders = res.data || []
        setOrders(allOrders)
        setTotalOrders(allOrders.length)
      })
      .catch((err) => setError(err.message || "Something went wrong. Please try again."))
      .finally(() => setLoading(false))
  }, [status, session])

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Welcome back{status === "authenticated" ? `, ${session?.user?.name || ""}` : ""}!</h2>
          <p className="text-base text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Dashboard</h2>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Unable to load dashboard</h3>
            <p className="text-sm text-muted-foreground max-w-md mb-6">{error}</p>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => window.location.reload()}>
                Try Again
              </Button>
              <Link href="/products">
                <Button variant="default">
                  <ShoppingBag className="h-4 w-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const pendingOrders = orders.filter((o) => o.status === "pending" || o.status === "processing")
  const totalSpent = orders.reduce((sum, o) => sum + Number.parseFloat(o.total_amount || "0"), 0)
  const recentOrders = orders.slice(0, 5)

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}!</h2>
        <p className="text-base text-muted-foreground">Here is what is happening with your orders today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={ShoppingBag} label="Total Orders" value={String(totalOrders)} color="bg-brand-green/10 text-brand-green" />
        <StatCard icon={Clock} label="Pending Delivery" value={String(pendingOrders.length)} positive={false} color="bg-yellow-50 text-yellow-600" />
        <StatCard icon={Star} label="Reviews Given" value="0" color="bg-brand-orange/10 text-brand-orange" />
        <StatCard icon={DollarSign} label="Total Spent" value={`$${totalSpent.toFixed(2)}`} color="bg-blue-50 text-blue-600" />
      </div>

      <Card className="pb-0">
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {recentOrders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No orders yet. Start shopping!</p>
          ) : (
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
                {recentOrders.map((order) => (
                  <RecentOrderRow
                    key={order.id}
                    id={order.order_number}
                    items={order.items?.length || 0}
                    total={Number.parseFloat(order.total_amount || "0").toFixed(2)}
                    status={order.status as "pending" | "processing" | "shipped" | "delivered" | "cancelled"}
                    time={order.created_at}
                  />
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Upcoming Deliveries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {orders.filter((o) => o.status === "shipped").length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No upcoming deliveries.</p>
            ) : (
              orders.filter((o) => o.status === "shipped").slice(0, 5).map((o) => (
                <div key={o.id} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
                    <Truck className="h-5 w-5 text-brand-green" />
                  </div>
                  <div>
                    <p className="text-base font-medium">Order #{o.order_number}</p>
                    <p className="text-sm text-muted-foreground">{o.items?.length || 0} item(s)</p>
                    <Badge variant="outline" className="mt-1 text-xs bg-brand-green/5 text-brand-green border-brand-green/20">
                      {o.status.charAt(0).toUpperCase() + o.status.slice(1)}
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Recommended for You</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            <p className="text-sm text-muted-foreground py-4 text-center">Recommendations coming soon.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
