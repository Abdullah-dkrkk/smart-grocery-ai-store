"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { DollarSign, Search, TrendingUp, TrendingDown, AlertCircle, Loader2, CheckCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { adminApi } from "@/lib/api/admin"
import { setAuthToken } from "@/lib/api/config"
import type { Payment } from "@/lib/api/admin"

export function AdminPayments() {
  const { data: session, status: authStatus } = useSession()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [updatingId, setUpdatingId] = useState<number | null>(null)

  const fetchPayments = () => {
    if (authStatus === "loading" || authStatus !== "authenticated" || !session?.user?.token) return
    setAuthToken(session.user.token)
    setLoading(true)
    adminApi.payments()
      .then((res) => setPayments(res.data || []))
      .catch((err) => setError(err.message || "Failed to load payments."))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false)
      setError("Please sign in.")
      return
    }
    fetchPayments()
  }, [authStatus, session])

  const handleStatusUpdate = async (id: number, status: string) => {
    setUpdatingId(id)
    try {
      await adminApi.updatePaymentStatus(id, { status })
      setPayments((prev) => prev.map((p) => (p.id === id ? { ...p, status } : p)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update payment status.")
    } finally {
      setUpdatingId(null)
    }
  }

  const filtered = payments.filter((p) =>
    p.vendor_name.toLowerCase().includes(search.toLowerCase()) || String(p.id).toLowerCase().includes(search.toLowerCase())
  )

  const totalRevenue = payments.reduce((s, p) => s + Number.parseFloat(p.amount || "0"), 0)
  const totalFees = payments.reduce((s, p) => s + Number.parseFloat(p.fee || "0"), 0)
  const pendingPayouts = payments.filter((p) => p.status.toLowerCase() === "pending").reduce((s, p) => s + Number.parseFloat(p.amount || "0") - Number.parseFloat(p.fee || "0"), 0)

  if (loading) return (
    <div className="space-y-6">
      <div className="space-y-2"><h2 className="text-2xl font-semibold">Payments</h2><p className="text-base text-muted-foreground">Loading payments...</p></div>
      {[1,2,3].map((i) => <div key={i} className="h-24 bg-card border rounded-xl animate-pulse" />)}
    </div>
  )

  if (error) return (
    <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Unable to load payments</h3>
      <p className="text-sm text-muted-foreground mb-6">{error}</p>
      <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
    </CardContent></Card>
  )

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

      {filtered.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <DollarSign className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No payments found</h3>
          <p className="text-sm text-muted-foreground">{search ? "Try a different search." : "No payments recorded yet."}</p>
        </CardContent></Card>
      ) : (
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
                {filtered.map((p) => {
                  const net = (Number.parseFloat(p.amount || "0") - Number.parseFloat(p.fee || "0")).toFixed(2)
                  return (
                    <tr key={p.id} className="border-b last:border-0">
                      <td className="py-3.5 pl-5 pr-3 text-sm">PAY-{String(p.id).padStart(3, "0")}</td>
                      <td className="py-3.5 px-3 text-sm">{p.vendor_name}</td>
                      <td className="py-3.5 px-3 text-sm font-medium">${Number.parseFloat(p.amount || "0").toFixed(2)}</td>
                      <td className="py-3.5 px-3 text-sm text-muted-foreground">${Number.parseFloat(p.fee || "0").toFixed(2)}</td>
                      <td className="py-3.5 px-3 text-sm">${net}</td>
                      <td className="py-3.5 px-3">
                        {updatingId === p.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : p.status.toLowerCase() === "pending" ? (
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600">Pending</span>
                            <button
                              onClick={() => handleStatusUpdate(p.id, "paid")}
                              className="text-brand-green hover:text-brand-green/80 transition-colors"
                              title="Mark as paid"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green">Paid</span>
                        )}
                      </td>
                      <td className="py-3.5 pl-3 pr-5 text-sm text-muted-foreground text-right">{new Date(p.created_at).toLocaleDateString()}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
