"use client"

import { Package, ShoppingBag, DollarSign, Star, Warehouse } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { StatCard } from "@/components/dashboard/common/stat-card"
import { RecentOrderRow } from "@/components/dashboard/common/recent-order-row"

export function VendorOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Store Dashboard</h2>
        <p className="text-base text-muted-foreground">Track your products, orders, and earnings.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Package} label="Total Products" value="48" trend="5 new this week" positive color="bg-brand-green/10 text-brand-green" />
        <StatCard icon={ShoppingBag} label="Orders Received" value="156" trend="23% increase" positive color="bg-blue-50 text-blue-600" />
        <StatCard icon={DollarSign} label="Revenue" value="$8,432" trend="15% growth" positive color="bg-brand-orange/10 text-brand-orange" />
        <StatCard icon={Star} label="Avg. Rating" value="4.7" trend="0.2 improvement" positive color="bg-purple-50 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Inventory Alert</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {[
              { name: "Fresh Strawberries", stock: "12 left", critical: false },
              { name: "Organic Spinach", stock: "5 left", critical: true },
              { name: "Whole Wheat Bread", stock: "8 left", critical: false },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2">
                  <div className={cn("h-2.5 w-2.5 rounded-full", item.critical ? "bg-destructive" : "bg-yellow-400")} />
                  <span className="text-base">{item.name}</span>
                </div>
                <span className={cn("text-sm font-medium", item.critical ? "text-destructive" : "text-muted-foreground")}>
                  {item.stock}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="border-b">
            <CardTitle>Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="px-0">
            <div className="px-5">
              <RecentOrderRow id="#ORD-4821" customer="Sarah Johnson" items={5} total="89.50" status="pending" time="30 min ago" />
              <RecentOrderRow id="#ORD-4820" customer="Michael Chen" items={3} total="45.00" status="pending" time="1 hour ago" />
              <RecentOrderRow id="#ORD-4819" customer="Emily Davis" items={8} total="124.75" status="shipped" time="3 hours ago" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
