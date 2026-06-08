"use client"

import { useEffect, useState } from "react"
import { BarChart3, TrendingUp, Users, ShoppingBag, DollarSign, Activity } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function Analytics() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  const stats = [
    { icon: Users, label: "Active Users", value: "1,284", change: "+12%", color: "bg-brand-green/10 text-brand-green" },
    { icon: ShoppingBag, label: "Total Orders", value: "3,567", change: "+8%", color: "bg-blue-50 text-blue-600" },
    { icon: DollarSign, label: "Revenue", value: "$142,890", change: "+15%", color: "bg-brand-orange/10 text-brand-orange" },
    { icon: Activity, label: "Conversion Rate", value: "3.2%", change: "+0.5%", color: "bg-purple-50 text-purple-600" },
  ]

  const topProducts = [
    { name: "Organic Fresh Apples", sold: 456, revenue: "$3,647", trend: "up" },
    { name: "Whole Wheat Bread", sold: 389, revenue: "$1,945", trend: "up" },
    { name: "Free Range Eggs (12pk)", sold: 342, revenue: "$2,736", trend: "up" },
    { name: "Organic Milk 1 Gallon", sold: 298, revenue: "$1,788", trend: "down" },
    { name: "Fresh Salmon Fillet", sold: 267, revenue: "$4,005", trend: "up" },
  ]

  if (loading) return (
    <div className="space-y-6">
      <div className="space-y-2"><h2 className="text-2xl font-semibold">Analytics</h2><p className="text-base text-muted-foreground">Loading analytics...</p></div>
      {[1,2,3,4].map((i) => <div key={i} className="h-24 bg-card border rounded-xl animate-pulse" />)}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Platform Analytics</h2>
        <p className="text-base text-muted-foreground">Key metrics and performance insights.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  <TrendingUp className="h-3.5 w-3.5 text-brand-green" />
                  <span className="text-xs font-medium text-brand-green">{stat.change}</span>
                  <span className="text-xs text-muted-foreground ml-1">vs last month</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Revenue Overview</CardTitle></CardHeader>
          <CardContent>
            <div className="h-48 flex items-center justify-center bg-muted/30 rounded-xl">
              <div className="text-center">
                <BarChart3 className="h-10 w-10 text-muted-foreground/40 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Revenue chart will render here</p>
                <p className="text-xs text-muted-foreground/60">Connect to analytics API for live data</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Top Selling Products</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-muted-foreground w-5">{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium">{p.name}</p>
                    <p className="text-xs text-muted-foreground">{p.sold} sold</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">{p.revenue}</p>
                  <TrendingUp className={`h-3 w-3 ml-auto ${p.trend === "up" ? "text-brand-green" : "text-destructive"}`} />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
