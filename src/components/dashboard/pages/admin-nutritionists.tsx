"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Stethoscope, Search, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { adminApi } from "@/lib/api/admin"
import { setAuthToken } from "@/lib/api/config"
import type { User as UserType } from "@/lib/api/types"

export function AdminNutritionists() {
  const { data: session, status: authStatus } = useSession()
  const [nutritionists, setNutritionists] = useState<UserType[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState("")

  useEffect(() => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false); setError("Please sign in.")
      return
    }
    setAuthToken(session.user.token)
    setLoading(true)
    adminApi.users({ per_page: 100 })
      .then((res) => {
        const all = res.data || []
        setNutritionists(all.filter((u: UserType) => (u.role as string) === "nutritionist"))
      })
      .catch((err) => setError(err.message || "Failed to load nutritionists."))
      .finally(() => setLoading(false))
  }, [authStatus, session])

  const filtered = nutritionists.filter((n) =>
    n.name.toLowerCase().includes(search.toLowerCase()) || n.email.toLowerCase().includes(search.toLowerCase())
  )

  if (loading) return (
    <div className="space-y-6">
      <div className="space-y-2"><h2 className="text-2xl font-semibold">Nutritionists</h2><p className="text-base text-muted-foreground">Loading nutritionists...</p></div>
      {[1,2,3].map((i) => <div key={i} className="h-16 bg-card border rounded-xl animate-pulse" />)}
    </div>
  )

  if (error) return (
    <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Unable to load nutritionists</h3>
      <p className="text-sm text-muted-foreground mb-6">{error}</p>
      <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
    </CardContent></Card>
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Nutritionists</h2>
        <p className="text-base text-muted-foreground">Manage nutritionist accounts. ({filtered.length} registered)</p>
      </div>

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10 text-sm" />
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Stethoscope className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No nutritionists found</h3>
          <p className="text-sm text-muted-foreground">{search ? "Try a different search." : "No nutritionists registered yet."}</p>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 gap-3">
          {filtered.map((n) => (
            <Card key={n.id}>
              <CardContent className="flex items-center gap-4 pt-6">
                <Avatar className="h-10 w-10">
                  <AvatarFallback className="bg-blue-50 text-blue-600 font-semibold">{n.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium">{n.name}</p>
                  <p className="text-xs text-muted-foreground">{n.email}</p>
                </div>
                <p className="text-xs text-muted-foreground shrink-0">Joined {new Date(n.created_at).toLocaleDateString()}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
