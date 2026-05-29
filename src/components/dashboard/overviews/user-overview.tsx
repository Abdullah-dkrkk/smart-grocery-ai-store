"use client"

import { ShoppingBag, Clock, Star, DollarSign, Truck } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/dashboard/common/stat-card"
import { RecentOrderRow } from "@/components/dashboard/common/recent-order-row"

export function UserOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Welcome back, Alex!</h2>
        <p className="text-base text-muted-foreground">Here is what is happening with your orders today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShoppingBag} label="Total Orders" value="24" trend="12% from last month" positive color="bg-brand-green/10 text-brand-green" />
        <StatCard icon={Clock} label="Pending Delivery" value="3" trend="2 orders delayed" positive={false} color="bg-yellow-50 text-yellow-600" />
        <StatCard icon={Star} label="Reviews Given" value="8" trend="3 this month" positive color="bg-brand-orange/10 text-brand-orange" />
        <StatCard icon={DollarSign} label="Total Spent" value="$1,284" trend="8% increase" positive color="bg-blue-50 text-blue-600" />
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="px-5">
            <RecentOrderRow id="#ORD-4821" customer="Sarah Johnson" items={5} total="89.50" status="delivered" time="2 hours ago" />
            <RecentOrderRow id="#ORD-4820" customer="Michael Chen" items={3} total="45.00" status="shipped" time="5 hours ago" />
            <RecentOrderRow id="#ORD-4819" customer="Emily Davis" items={8} total="124.75" status="pending" time="1 day ago" />
            <RecentOrderRow id="#ORD-4818" customer="James Wilson" items={2} total="23.99" status="delivered" time="2 days ago" />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Upcoming Deliveries</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {[
              { day: "Today, 2:00 PM", items: "Fresh produce, dairy, bread", status: "Confirmed" },
              { day: "Tomorrow, 10:00 AM", items: "Organic vegetables, fruits", status: "Preparing" },
            ].map((d, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
                  <Truck className="h-5 w-5 text-brand-green" />
                </div>
                <div>
                  <p className="text-base font-medium">{d.day}</p>
                  <p className="text-sm text-muted-foreground">{d.items}</p>
                  <Badge variant="outline" className="mt-1 text-xs bg-brand-green/5 text-brand-green border-brand-green/20">
                    {d.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Recommended for You</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {[
              { name: "Organic Avocados", discount: "15% OFF" },
              { name: "Almond Milk Bundle", discount: "20% OFF" },
              { name: "Mixed Fruit Box", discount: "10% OFF" },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-lg border p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-green-light text-brand-green text-base font-bold">
                  {item.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium truncate">{item.name}</p>
                </div>
                <Badge className="bg-brand-orange/10 text-brand-orange text-xs">{item.discount}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
