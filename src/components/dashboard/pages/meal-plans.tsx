"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { ClipboardList, Plus, Users, Clock, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { mealPlansApi } from "@/lib/api/meal-plans"
import { setAuthToken } from "@/lib/api/config"
import type { MealPlan } from "@/lib/api/meal-plans"

export function MealPlans() {
  const { data: session, status: authStatus } = useSession()
  const [plans, setPlans] = useState<MealPlan[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPlans = () => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false)
      setError("Please sign in to view meal plans.")
      return
    }
    setAuthToken(session.user.token)
    setLoading(true)
    mealPlansApi.list()
      .then((res) => setPlans(Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []))
      .catch((err) => setError(err.message || "Failed to load meal plans."))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPlans() }, [authStatus, session])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Meal Plans</h2>
          <p className="text-base text-muted-foreground">Loading meal plans...</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2].map((i) => <div key={i} className="h-40 bg-card border rounded-xl animate-pulse" />)}
        </div>
      </div>
    )
  }

  if (error && plans.length === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Meal Plans</h2>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Unable to load meal plans</h3>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Meal Plans</h2>
          <p className="text-base text-muted-foreground">Create and manage nutrition meal plans for your clients.</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> Create Plan</Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {plans.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <ClipboardList className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No meal plans</h3>
          <p className="text-sm text-muted-foreground">Create your first meal plan for a client.</p>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <Card key={plan.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="font-semibold">{plan.title}</h3>
                    <span className="text-[11px] font-medium px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green">Active</span>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-3 text-center py-3 border-y">
                  <div>
                    <p className="text-lg font-semibold">{plan.client_name ?? "—"}</p>
                    <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Users className="h-3 w-3" /> Client</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{plan.meals?.length ?? 0}</p>
                    <p className="text-xs text-muted-foreground">Meals</p>
                  </div>
                  <div>
                    <p className="text-lg font-semibold">{plan.daily_calories?.toLocaleString() ?? "—"}</p>
                    <p className="text-xs text-muted-foreground">Calories</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {plan.duration_days} days</span>
                  <button className="text-xs text-brand-green hover:underline font-medium cursor-pointer">View Plan</button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
