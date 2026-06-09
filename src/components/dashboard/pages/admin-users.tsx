"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Users, Search, AlertCircle, Shield, Store, User, Loader2, Trash2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { adminApi } from "@/lib/api/admin"
import { setAuthToken } from "@/lib/api/config"
import type { User as UserType } from "@/lib/api/types"

const roleIcons: Record<string, React.ElementType> = {
  admin: Shield,
  vendor: Store,
  customer: User,
}

const roleColors: Record<string, string> = {
  admin: "bg-purple-50 text-purple-600",
  vendor: "bg-brand-orange/10 text-brand-orange",
  customer: "bg-brand-green/10 text-brand-green",
}

export function AdminUsers() {
  const { data: session, status: authStatus } = useSession()
  const [users, setUsers] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [actionLoading, setActionLoading] = useState<number | null>(null)

  const fetchUsers = () => {
    if (authStatus === "loading" || authStatus !== "authenticated" || !session?.user?.token) return
    setAuthToken(session.user.token)
    setLoading(true)
    adminApi.users()
      .then((res) => setUsers(res.data || []))
      .catch((err) => setError(err.message || "Failed to load users."))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false)
      setError("Please sign in.")
      return
    }
    fetchUsers()
  }, [authStatus, session])

  const handleRoleUpdate = async (id: number, role: string) => {
    setActionLoading(id)
    try {
      await adminApi.updateUser(id, { role: role as UserType["role"] })
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: role as UserType["role"] } : u)))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update user role.")
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this user? This action cannot be undone.")) return
    setActionLoading(id)
    try {
      await adminApi.deleteUser(id)
      setUsers((prev) => prev.filter((u) => u.id !== id))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete user.")
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = users.filter((u) => {
    const mS = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const mR = roleFilter === "all" || u.role === roleFilter
    return mS && mR
  })

  if (loading) return (
    <div className="space-y-6">
      <div className="space-y-2"><h2 className="text-2xl font-semibold">Users</h2><p className="text-base text-muted-foreground">Loading users...</p></div>
      {[1,2,3,4].map((i) => <div key={i} className="h-16 bg-card border rounded-xl animate-pulse" />)}
    </div>
  )

  if (error) return (
    <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Unable to load users</h3>
      <p className="text-sm text-muted-foreground mb-6">{error}</p>
      <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
    </CardContent></Card>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">User Management</h2>
          <p className="text-base text-muted-foreground">Manage all platform users. ({filtered.length} users)</p>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">
          <AlertCircle className="h-4 w-4 shrink-0" />{error}
        </div>
      )}

      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10 text-sm" />
        </div>
        <div className="flex gap-1.5 flex-wrap">
          {["all", "customer", "vendor", "admin"].map((role) => (
            <button key={role} onClick={() => setRoleFilter(role)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${roleFilter === role ? "bg-brand-green text-white" : "text-muted-foreground hover:bg-muted"}`}>
              {role === "all" ? "All" : role}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Users className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No users found</h3>
          <p className="text-sm text-muted-foreground">{search || roleFilter !== "all" ? "Try adjusting your search." : "No users registered yet."}</p>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((user) => {
            const RoleIcon = roleIcons[user.role] || User
            return (
              <Card key={user.id}>
                <CardContent className="flex items-center gap-4 pt-6">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className={roleColors[user.role] || "bg-muted"}>
                      {user.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium">{user.name}</p>
                      <Badge variant="outline" className={`text-[10px] capitalize ${roleColors[user.role]}`}>
                        <RoleIcon className="h-3 w-3 mr-1 inline" />{user.role}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {actionLoading === user.id ? (
                      <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                    ) : (
                      <>
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                          className="h-8 rounded-md border bg-background px-2 text-xs focus:outline-none focus:ring-2 focus:ring-ring"
                        >
                          <option value="customer">customer</option>
                          <option value="vendor">vendor</option>
                          <option value="admin">admin</option>
                        </select>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                          title="Delete user"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
