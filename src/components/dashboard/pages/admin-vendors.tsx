"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Store, Search, AlertCircle, CheckCircle, XCircle, Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { adminApi } from "@/lib/api/admin"
import { setAuthToken } from "@/lib/api/config"
import type { VendorUser } from "@/lib/api/admin"

export function AdminVendors() {
  const { data: session, status: authStatus } = useSession()
  const [vendors, setVendors] = useState<VendorUser[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  const fetchVendors = () => {
    if (authStatus === "loading" || authStatus !== "authenticated" || !session?.user?.token) return
    setAuthToken(session.user.token)
    setLoading(true)
    adminApi.vendors()
      .then((res) => setVendors(res.data || []))
      .catch((err) => setError(err.message || "Failed to load vendors."))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false)
      setError("Please sign in.")
      return
    }
    fetchVendors()
  }, [authStatus, session])

  const handleApprove = async (id: number) => {
    setActionLoading(id)
    try {
      await adminApi.approveVendor(id)
      setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, is_approved: true } : v)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to approve vendor.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleSuspend = async (id: number) => {
    setActionLoading(id)
    try {
      await adminApi.suspendVendor(id)
      setVendors((prev) => prev.map((v) => (v.id === id ? { ...v, is_approved: false } : v)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to suspend vendor.")
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = vendors.filter((v) =>
    v.name.toLowerCase().includes(search.toLowerCase()) || v.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="space-y-6">
      <div className="space-y-2"><h2 className="text-2xl font-semibold">Vendors</h2><p className="text-base text-muted-foreground">Loading vendors...</p></div>
      {[1,2,3].map((i) => <div key={i} className="h-16 bg-card border rounded-xl animate-pulse" />)}
    </div>
  )

  if (error) return (
    <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Unable to load vendors</h3>
      <p className="text-sm text-muted-foreground mb-6">{error}</p>
      <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
    </CardContent></Card>
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Vendor Management</h2>
        <p className="text-base text-muted-foreground">Manage all registered vendors. ({filtered.length} vendors)</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">
          <AlertCircle className="h-4 w-4 shrink-0" />{error}
        </div>
      )}

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search vendors..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10 text-sm" />
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Store className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No vendors found</h3>
          <p className="text-sm text-muted-foreground">{search ? "Try a different search." : "No vendors registered yet."}</p>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((vendor) => (
            <Card key={vendor.id}>
              <CardContent className="flex items-center gap-4 pt-6">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-brand-orange/10 text-brand-orange font-semibold">
                    {vendor.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{vendor.name}</p>
                    {vendor.is_approved !== undefined && (
                      <Badge variant="outline" className={`text-[10px] ${vendor.is_approved ? "text-brand-green" : "text-yellow-600"}`}>
                        {vendor.is_approved ? "Approved" : "Pending"}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{vendor.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  {actionLoading === vendor.id ? (
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  ) : vendor.is_approved === false || vendor.is_approved === undefined ? (
                    <Button size="sm" variant="outline" className="text-brand-green" onClick={() => handleApprove(vendor.id)}>
                      <CheckCircle className="h-4 w-4 mr-1" /> Approve
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="text-destructive" onClick={() => handleSuspend(vendor.id)}>
                      <XCircle className="h-4 w-4 mr-1" /> Suspend
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
