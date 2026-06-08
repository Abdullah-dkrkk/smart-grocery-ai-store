"use client"

import { Apple, ArrowRight, Activity, Cookie, Droplets, Flame } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export function NutritionPlans() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Nutrition Plans</h2>
        <p className="text-base text-muted-foreground">Personalized meal plans tailored to your health goals.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { icon: Flame, label: "Calorie Target", value: "2,000 kcal", color: "bg-orange-50 text-orange-600" },
          { icon: Droplets, label: "Water Intake", value: "8 glasses", color: "bg-blue-50 text-blue-600" },
          { icon: Activity, label: "Activity Level", value: "Moderate", color: "bg-brand-green/10 text-brand-green" },
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
          <CardTitle>Your Meal Plan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { meal: "Breakfast", time: "7:00 AM - 9:00 AM", foods: "Oatmeal with fruits, Greek yogurt", calories: 450 },
            { meal: "Lunch", time: "12:00 PM - 1:30 PM", foods: "Grilled chicken salad, quinoa", calories: 650 },
            { meal: "Snack", time: "3:00 PM - 4:00 PM", foods: "Mixed nuts, protein shake", calories: 300 },
            { meal: "Dinner", time: "7:00 PM - 8:30 PM", foods: "Salmon with steamed vegetables", calories: 600 },
          ].map((item) => (
            <div key={item.meal} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
                <Apple className="h-5 w-5 text-brand-green" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold">{item.meal}</p>
                  <span className="text-xs text-muted-foreground">{item.calories} cal</span>
                </div>
                <p className="text-sm text-muted-foreground">{item.time}</p>
                <p className="text-sm mt-1">{item.foods}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="text-center">
        <Button>
          Generate Personalized Plan
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
        <p className="text-xs text-muted-foreground mt-2">AI-powered meal plan based on your health profile</p>
      </div>
    </div>
  )
}
