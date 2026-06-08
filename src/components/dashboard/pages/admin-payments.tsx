"use client"

import { useState } from "react"
import { DollarSign, Search, TrendingUp, TrendingDown } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

const payments = [
  { id: "PAY-001", vendor: "Green Farm Organics", amount: "$1,250.00", fee: "$37.50", net: "$1,212.50", status: "Paid", date: "2026-06-08" },
  { id: "PAY-002", vendor: "Fresh Daily Produce", amount: "$890.00", fee: "$26.70", net: "$863.30", status: "Paid", date: "2026-06-07" },
  { id: "PAY-003", vendor: "Baker's Delight", amount: "$450.00", fee: "$13.50", net: "$436.50", status: "Pending", date: "2026-06-06" },
  { id: "PAY-004", vendor: "Organic Meat Co.", amount: "$1,680.00", fee: "$50.40", net: "$1,629.60", status: "Pending", date: "2026-06-05" },
  { id: "PAY-005", vendor: "Dairy Fresh Farms", amount: "$320.00", fee: "$9.60", net: "$310.40", status: "Paid", date: "2026-06-04" },
]

export function AdminPayments() {
  const [search, setSearch] = useState("")

  const filtered = payments.filter((p) =>
    p.vendor.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
  )

  const totalRevenue = payments.reduce((s, p) => s + Number.parseFloat(p.amount.replace("$", "")), 0)
  const totalFees = payments.reduce((s, p) => s + Number.parseFloat(p.fee.replace("$", "")), 0)
  const pendingPayouts = payments.filter((p) => p.status === "Pending").reduce((s, p) => s + Number.parseFloat(p.net.replace("$", "")), 0)

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Payments</h2>
        <p className="text-base text-muted-foreground">Track vendor payouts and platform revenue.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card><CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Total Revenue</p>
          <p className="text-2xl font-bold">${totalRevenue.toFixed(2)}</p>
          <span className="flex items-center gap-1 text-xs text-brand-green mt-1"><TrendingUp className="h-3 w-3" /> Processing</span>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Platform Fees</p>
          <p className="text-2xl font-bold">${totalFees.toFixed(2)}</p>
        </CardContent></Card>
        <Card><CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Pending Payouts</p>
          <p className="text-2xl font-bold">${pendingPayouts.toFixed(2)}</p>
          <span className="flex items-center gap-1 text-xs text-yellow-600 mt-1"><TrendingDown className="h-3 w-3" /> Awaiting processing</span>
        </CardContent></Card>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search transactions..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10 text-sm" />
      </div>

      <Card className="pb-0">
        <CardHeader><CardTitle>Transaction History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-3.5 pl-5 pr-3 font-medium">Transaction</th>
                <th className="py-3.5 px-3 font-medium">Vendor</th>
                <th className="py-3.5 px-3 font-medium">Amount</th>
                <th className="py-3.5 px-3 font-medium">Fee</th>
                <th className="py-3.5 px-3 font-medium">Net</th>
                <th className="py-3.5 px-3 font-medium">Status</th>
                <th className="py-3.5 pl-3 pr-5 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b last:border-0">
                  <td className="py-3.5 pl-5 pr-3 text-sm">{p.id}</td>
                  <td className="py-3.5 px-3 text-sm">{p.vendor}</td>
                  <td className="py-3.5 px-3 text-sm font-medium">{p.amount}</td>
                  <td className="py-3.5 px-3 text-sm text-muted-foreground">{p.fee}</td>
                  <td className="py-3.5 px-3 text-sm">{p.net}</td>
                  <td className="py-3.5 px-3">
                    <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${p.status === "Paid" ? "bg-brand-green/10 text-brand-green" : "bg-yellow-50 text-yellow-600"}`}>{p.status}</span>
                  </td>
                  <td className="py-3.5 pl-3 pr-5 text-sm text-muted-foreground text-right">{p.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
