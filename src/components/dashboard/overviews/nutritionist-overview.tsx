"use client"

import { useEffect, useState } from "react"
import { Users, ClipboardList, Calendar, Star, Apple, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/dashboard/common/stat-card"
import { dashboardApi, type NutritionistDashboardOverview } from "@/lib/api/dashboard"
import { setAuthToken } from "@/lib/api/config"
import { useSession } from "next-auth/react"

export function NutritionistOverview() {
  const { data: session, status } = useSession()
  const [data, setData] = useState<NutritionistDashboardOverview | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (status === "loading") return
    if (status !== "authenticated" || !session?.user?.token) {
      setLoading(false)
      setError("Please sign in to view your dashboard.")
      return
    }
    setAuthToken(session.user.token)

    dashboardApi.nutritionistOverview()
      .then((res) => setData(res.data))
      .catch((err) => setError(err.message || "Failed to load dashboard."))
      .finally(() => setLoading(false))
  }, [status, session])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Nutritionist Dashboard</h2>
          <p className="text-base text-muted-foreground">Loading your dashboard...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-card border rounded-xl animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Nutritionist Dashboard</h2>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Unable to load dashboard</h3>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return null

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Nutritionist Dashboard</h2>
        <p className="text-base text-muted-foreground">Manage your clients, meal plans, and consultations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard icon={Users} label="Active Clients" value={String(data.active_clients)} trend={data.client_growth} positive color="bg-brand-green/10 text-brand-green" />
        <StatCard icon={ClipboardList} label="Meal Plans" value={String(data.meal_plans_created)} trend="Created" positive color="bg-blue-50 text-blue-600" />
        <StatCard icon={Calendar} label="Appointments Today" value={String(data.total_appointments_today)} trend={`${data.upcoming_appointments.length} upcoming`} positive color="bg-brand-orange/10 text-brand-orange" />
        <StatCard icon={Star} label="Avg. Rating" value={String(data.average_rating || "—")} trend={data.average_rating > 0 ? "Active" : "No ratings yet"} positive={data.average_rating > 0} color="bg-purple-50 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Today&apos;s Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {data.upcoming_appointments.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No upcoming appointments.</p>
            ) : (
              data.upcoming_appointments.map((s) => (
                <div key={s.id} className="flex items-center gap-3 border-b pb-3 last:border-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                    {s.client_name?.split(" ").map((n: string) => n[0]).join("") || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-medium">{s.client_name}</p>
                    <p className="text-sm text-muted-foreground">{s.type || s.status}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {s.scheduled_at ? new Date(s.scheduled_at).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" }) : s.status}
                  </Badge>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Meal Plan Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {data.meal_plans_summary.length === 0 ? (
              <p className="text-sm text-muted-foreground py-4 text-center">No meal plans created yet.</p>
            ) : (
              data.meal_plans_summary.map((p, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-2">
                    <Apple className="h-5 w-5 text-brand-green" />
                    <span className="text-base font-medium">{p.name}</span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{p.client_count} clients</span>
                    <span>{p.meal_count} meals</span>
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
