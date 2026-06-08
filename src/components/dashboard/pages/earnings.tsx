"use client"

import { useEffect, useState } from "react"
import { DollarSign, TrendingUp, TrendingDown, AlertCircle, Calendar } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"

export function Earnings() {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(t)
  }, [])

  const stats = [
    { label: "Total Revenue", value: "$12,450", change: "+12.5%", up: true, color: "bg-brand-green/10 text-brand-green" },
    { label: "This Month", value: "$3,280", change: "+8.2%", up: true, color: "bg-blue-50 text-blue-600" },
    { label: "Pending Payouts", value: "$1,150", change: "-", up: false, color: "bg-yellow-50 text-yellow-600" },
    { label: "Avg. Order Value", value: "$45.20", change: "+3.1%", up: true, color: "bg-brand-orange/10 text-brand-orange" },
  ]

  const transactions = [
    { id: "TXN-001", order: "#ORD-1024", amount: "$89.50", status: "Completed", date: "2026-06-08", fee: "$2.68" },
    { id: "TXN-002", order: "#ORD-1023", amount: "$45.00", status: "Completed", date: "2026-06-07", fee: "$1.35" },
    { id: "TXN-003", order: "#ORD-1022", amount: "$120.00", status: "Pending", date: "2026-06-06", fee: "$3.60" },
    { id: "TXN-004", order: "#ORD-1021", amount: "$32.75", status: "Completed", date: "2026-06-05", fee: "$0.98" },
    { id: "TXN-005", order: "#ORD-1020", amount: "$67.25", status: "Completed", date: "2026-06-04", fee: "$2.02" },
  ]

  if (loading) return (
    <div className="space-y-6">
      <div className="space-y-2"><h2 className="text-2xl font-semibold">Earnings</h2><p className="text-base text-muted-foreground">Loading earnings data...</p></div>
      {[1,2,3,4].map((i) => <div key={i} className="h-24 bg-card border rounded-xl animate-pulse" />)}
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
              {transactions.map((tx) => (
                <tr key={tx.id} className="border-b last:border-0">
                  <td className="py-3.5 pl-5 pr-3 text-sm">{tx.id}</td>
                  <td className="py-3.5 px-3 text-sm">{tx.order}</td>
                  <td className="py-3.5 px-3 text-sm font-medium">{tx.amount}</td>
                  <td className="py-3.5 px-3 text-sm text-muted-foreground">{tx.fee}</td>
                  <td className="py-3.5 px-3">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                      tx.status === "Completed" ? "bg-brand-green/10 text-brand-green" : "bg-yellow-50 text-yellow-600"
                    }`}>{tx.status}</span>
                  </td>
                  <td className="py-3.5 pl-3 pr-5 text-sm text-muted-foreground text-right">{tx.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
