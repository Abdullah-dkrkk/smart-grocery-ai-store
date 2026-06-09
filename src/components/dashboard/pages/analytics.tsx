"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { BarChart3, TrendingUp, Users, ShoppingBag, DollarSign, Activity, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { adminApi } from "@/lib/api/admin"
import { setAuthToken } from "@/lib/api/config"

interface StatItem {
  icon: React.ElementType
  label: string
  value: string
  change: string
  color: string
}

interface TopProduct {
  name: string
  sold: number
  revenue: string
  trend: string
}

const statConfig: { key: string; label: string; icon: React.ElementType; color: string }[] = [
  { key: "active_users", label: "Active Users", icon: Users, color: "bg-brand-green/10 text-brand-green" },
  { key: "total_orders", label: "Total Orders", icon: ShoppingBag, color: "bg-blue-50 text-blue-600" },
  { key: "revenue", label: "Revenue", icon: DollarSign, color: "bg-brand-orange/10 text-brand-orange" },
  { key: "conversion_rate", label: "Conversion Rate", icon: Activity, color: "bg-purple-50 text-purple-600" },
]

export function Analytics() {
  const { data: session, status: authStatus } = useSession()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [statsData, setStatsData] = useState<Record<string, unknown>>({})
  const [topProducts, setTopProducts] = useState<TopProduct[]>([])

  useEffect(() => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false)
      setError("Please sign in.")
      return
    }
    setAuthToken(session.user.token)
    setLoading(true)
    Promise.all([
      adminApi.analytics(),
      adminApi.trends(),
    ])
      .then(([analyticsRes]) => {
        const d = analyticsRes.data || {}
        setStatsData((d.stats || {}) as Record<string, unknown>)
        setTopProducts((d.top_products || []) as TopProduct[])
      })
      .catch((err) => setError(err.message || "Failed to load analytics."))
      .finally(() => setLoading(false))
  }, [authStatus, session])

  const stats: StatItem[] = statConfig.map(({ key, label, icon, color }) => {
    const s = statsData[key] as Record<string, unknown> | undefined
    return {
      icon,
      label,
      value: typeof s?.value === "string" ? s.value : s?.value !== undefined ? String(s.value) : "0",
      change: (s?.change as string) ?? "0%",
      color,
    }
  })

  if (loading) return (
    <div className="space-y-6">
      <div className="space-y-2"><h2 className="text-2xl font-semibold">Analytics</h2><p className="text-base text-muted-foreground">Loading analytics...</p></div>
      {[1,2,3,4].map((i) => <div key={i} className="h-24 bg-card border rounded-xl animate-pulse" />)}
    </div>
  )

  if (error) return (
    <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Unable to load analytics</h3>
      <p className="text-sm text-muted-foreground mb-6">{error}</p>
      <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
    </CardContent></Card>
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
            {topProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-8">No product data available.</p>
            ) : (
              topProducts.map((p, i) => (
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
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
