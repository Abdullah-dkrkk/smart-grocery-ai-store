"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Apple, ArrowRight, Activity, Droplets, Flame, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { nutritionPlansApi } from "@/lib/api/nutrition-plans"
import { setAuthToken } from "@/lib/api/config"

export function NutritionPlans() {
  const { data: session, status: authStatus } = useSession()
  const [plans, setPlans] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false)
      return
    }
    setAuthToken(session.user.token)
    nutritionPlansApi.list()
      .then((res) => setPlans(res.data || []))
      .catch((err) => setError(err.message || "Failed to load nutrition plans"))
      .finally(() => setLoading(false))
  }, [authStatus, session])

  if (loading) return (
    <div className="space-y-6">
      <div className="space-y-2"><h2 className="text-2xl font-semibold">Nutrition Plans</h2><p className="text-base text-muted-foreground">Loading...</p></div>
      {[1,2,3].map((i) => <div key={i} className="h-24 bg-card border rounded-xl animate-pulse" />)}
    </div>
  )

  if (error) return (
    <div className="space-y-6">
      <div className="space-y-2"><h2 className="text-2xl font-semibold">Nutrition Plans</h2></div>
      <Card>
        <CardContent className="flex items-center gap-3 py-8 text-red-600">
          <AlertCircle className="h-5 w-5" /> {error}
        </CardContent>
      </Card>
    </div>
  )

  const plan = plans[0]
  const meals = plan?.meals || []

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Nutrition Plans</h2>
        <p className="text-base text-muted-foreground">Personalized meal plans tailored to your health goals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Flame, label: "Calorie Target", value: plan ? `${plan.daily_calories} kcal` : "2,000 kcal", color: "bg-orange-50 text-orange-600" },
          { icon: Droplets, label: "Water Intake", value: "8 glasses", color: "bg-blue-50 text-blue-600" },
          { icon: Activity, label: "Duration", value: plan ? `${plan.duration_days} days` : "N/A", color: "bg-brand-green/10 text-brand-green" },
        ].map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label}>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-xl ${stat.color}`}>
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-xl font-semibold">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{plan ? plan.title : "Your Meal Plan"}</CardTitle>
          {plan?.description && <p className="text-sm text-muted-foreground">{plan.description}</p>}
        </CardHeader>
        <CardContent className="space-y-4">
          {meals.length > 0 ? meals.map((item: any, idx: number) => (
            <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
                <Apple className="h-5 w-5 text-brand-green" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{item.meal_type || item.name}</p>
                  <span className="text-xs text-muted-foreground">{item.calories} cal</span>
                </div>
                <p className="text-sm mt-1">{item.description || item.name}</p>
              </div>
            </div>
          )) : (
            <p className="text-sm text-muted-foreground text-center py-4">No meals defined for this plan yet.</p>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
        <Button disabled>
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          Generate Personalized Plan
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
        <p className="text-xs text-muted-foreground mt-2">AI-powered meal plan based on your health profile (coming soon)</p>
      </div>
    </div>
  )
}
