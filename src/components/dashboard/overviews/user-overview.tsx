"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { ShoppingBag, Clock, Star, DollarSign, Truck } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/dashboard/common/stat-card"
import { RecentOrderRow } from "@/components/dashboard/common/recent-order-row"
import { dashboardApi, type CustomerOverview } from "@/lib/api/dashboard"
import { setAuthToken } from "@/lib/api/config"

export function UserOverview() {
  const { data: session, status } = useSession()
  const [data, setData] = useState<CustomerOverview | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.token) return
    setAuthToken(session.user.token)
    dashboardApi.customerOverview()
      .then((res) => setData(res.data))
      .catch(() => setData(null))
      .finally(() => setLoading(false))
  }, [status, session])

  if (loading || !data) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold">Welcome back{status === "authenticated" ? `, ${session?.user?.name || ""}` : ""}!</h2>
          <p className="text-base text-muted-foreground">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Welcome back{session?.user?.name ? `, ${session.user.name}` : ""}!</h2>
        <p className="text-base text-muted-foreground">Here is what is happening with your orders today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingBag} label="Total Orders" value={String(data.total_orders)} color="bg-brand-green/10 text-brand-green" />
        <StatCard icon={Clock} label="Pending Delivery" value={String(data.pending_deliveries)} positive={false} color="bg-yellow-50 text-yellow-600" />
        <StatCard icon={Star} label="Reviews Given" value={String(data.reviews_given)} color="bg-brand-orange/10 text-brand-orange" />
        <StatCard icon={DollarSign} label="Total Spent" value={`$${data.total_spent.toFixed(2)}`} color="bg-blue-50 text-blue-600" />
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {data.recent_orders.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No orders yet. Start shopping!</p>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b text-left text-xs text-muted-foreground">
                  <th className="py-3 pl-5 pr-3 font-medium">Order</th>
                  <th className="py-3 px-3 font-medium">Items</th>
                  <th className="py-3 px-3 font-medium">Total</th>
                  <th className="py-3 px-3 font-medium">Status</th>
                  <th className="py-3 pl-3 pr-5 font-medium text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {data.recent_orders.map((order) => (
                  <RecentOrderRow
                    key={order.id}
                    id={order.order_number}
                    items={order.item_count}
                    total={order.total_amount.toFixed(2)}
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
            {data.upcoming_deliveries.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No upcoming deliveries.</p>
            ) : (
              data.upcoming_deliveries.map((d) => (
                <div key={d.id} className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
                    <Truck className="h-5 w-5 text-brand-green" />
                  </div>
                  <div>
                    <p className="text-base font-medium">{d.scheduled_date ? new Date(d.scheduled_date).toLocaleString() : "Not scheduled"}</p>
                    <p className="text-sm text-muted-foreground">{d.items_summary}</p>
                    <Badge variant="outline" className="mt-1 text-xs bg-brand-green/5 text-brand-green border-brand-green/20">
                      {d.status.charAt(0).toUpperCase() + d.status.slice(1)}
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
            {data.recommended_products.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No recommendations yet.</p>
            ) : (
              data.recommended_products.map((item) => (
                <div key={item.id} className="flex items-center gap-3 rounded-lg border p-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green-light text-brand-green text-base font-bold">
                    {item.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium truncate">{item.name}</p>
                    <p className="text-sm text-muted-foreground">${item.price.toFixed(2)}</p>
                  </div>
                  {item.discount_percent && (
                    <Badge className="bg-brand-orange/10 text-brand-orange text-xs">{item.discount_percent}% OFF</Badge>
                  )}
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
