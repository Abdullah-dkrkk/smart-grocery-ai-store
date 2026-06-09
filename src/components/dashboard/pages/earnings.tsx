"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Calendar } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { vendorEarningsApi, type VendorEarningsOverview, type VendorTransaction } from "@/lib/api/vendor-earnings"
import { setAuthToken } from "@/lib/api/config"

export function Earnings() {
  const { data: session, status: authStatus } = useSession()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [data, setData] = useState<VendorEarningsOverview | null>(null)

  useEffect(() => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false); setError("Please sign in.")
      return
    }
    setAuthToken(session.user.token)
    vendorEarningsApi.overview()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message || "Failed to load earnings."))
      .finally(() => setLoading(false))
  }, [authStatus, session])

  const stats = [
    { label: "Total Revenue", value: data ? `$${parseFloat(data.total_revenue).toLocaleString()}` : "$0", change: "-", up: true, color: "bg-brand-green/10 text-brand-green" },
    { label: "This Month", value: data ? `$${parseFloat(data.this_month).toLocaleString()}` : "$0", change: "-", up: true, color: "bg-blue-50 text-blue-600" },
    { label: "Pending Payouts", value: data ? `$${parseFloat(data.pending_payouts).toLocaleString()}` : "$0", change: "-", up: false, color: "bg-yellow-50 text-yellow-600" },
    { label: "Avg. Order Value", value: data ? `$${parseFloat(data.avg_order_value).toLocaleString()}` : "$0", change: "-", up: true, color: "bg-brand-orange/10 text-brand-orange" },
  ]

  const transactions: VendorTransaction[] = data?.transactions || []

  if (loading) return (
    <div className="space-y-6">
      <div className="space-y-2"><h2 className="text-2xl font-semibold">Earnings</h2><p className="text-base text-muted-foreground">Loading earnings data...</p></div>
      {[1,2,3,4].map((i) => <div key={i} className="h-24 bg-card border rounded-xl animate-pulse" />)}
    </div>
  )

  if (error) return (
    <div className="space-y-6">
      <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Unable to load earnings</h3>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>
      </CardContent></Card>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Earnings & Revenue</h2>
        <p className="text-base text-muted-foreground">Track your sales performance and payouts.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => {
          const Icon = stat.up ? TrendingUp : TrendingDown
          return (
            <Card key={stat.label}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">{stat.label}</span>
                  <div className={`flex h-9 w-9 items-center justify-center rounded-lg ${stat.color}`}>
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <div className="flex items-center gap-1 mt-1">
                  {stat.change !== "-" && <Icon className={`h-3.5 w-3.5 ${stat.up ? "text-brand-green" : "text-destructive"}`} />}
                  <span className={`text-xs font-medium ${stat.up ? "text-brand-green" : "text-destructive"}`}>{stat.change}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-3.5 pl-5 pr-3 font-medium">Transaction</th>
                <th className="py-3.5 px-3 font-medium">Order</th>
                <th className="py-3.5 px-3 font-medium">Amount</th>
                <th className="py-3.5 px-3 font-medium">Fee</th>
                <th className="py-3.5 px-3 font-medium">Status</th>
                <th className="py-3.5 pl-3 pr-5 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {transactions.length === 0 ? (
                <tr><td colSpan={6} className="py-12 text-center text-sm text-muted-foreground">No transactions yet.</td></tr>
              ) : (
                transactions.map((tx) => (
                  <tr key={tx.id} className="border-b last:border-0">
                    <td className="py-3.5 pl-5 pr-3 text-sm">TXN-{String(tx.id).padStart(3, "0")}</td>
                    <td className="py-3.5 px-3 text-sm">{tx.order_number}</td>
                    <td className="py-3.5 px-3 text-sm font-medium">${parseFloat(tx.amount).toFixed(2)}</td>
                    <td className="py-3.5 px-3 text-sm text-muted-foreground">${parseFloat(tx.fee).toFixed(2)}</td>
                    <td className="py-3.5 px-3">
                      <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                        tx.status === "Completed" || tx.status === "completed" || tx.status === "paid" ? "bg-brand-green/10 text-brand-green" : "bg-yellow-50 text-yellow-600"
                      }`}>{tx.status}</span>
                    </td>
                    <td className="py-3.5 pl-3 pr-5 text-sm text-muted-foreground text-right">{new Date(tx.created_at).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
