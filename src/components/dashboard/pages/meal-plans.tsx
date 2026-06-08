"use client"

import { useState } from "react"
import { ClipboardList, Plus, Users, Clock } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const mockPlans = [
  { id: 1, name: "Weight Loss Starter", clients: 12, meals: 21, duration: "30 days", calories: "1,800 kcal/day", status: "Active" },
  { id: 2, name: "Muscle Builder Pro", clients: 8, meals: 28, duration: "60 days", calories: "3,200 kcal/day", status: "Active" },
  { id: 3, name: "Diabetes Care Plan", clients: 5, meals: 21, duration: "30 days", calories: "2,000 kcal/day", status: "Active" },
  { id: 4, name: "Vegan Essentials", clients: 3, meals: 21, duration: "45 days", calories: "2,200 kcal/day", status: "Draft" },
]

export function MealPlans() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Meal Plans</h2>
          <p className="text-base text-muted-foreground">Create and manage nutrition meal plans for your clients.</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> Create Plan</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {mockPlans.map((plan) => (
          <Card key={plan.id}>
            <CardContent className="pt-6">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{plan.name}</h3>
                  <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${plan.status === "Active" ? "bg-brand-green/10 text-brand-green" : "bg-muted text-muted-foreground"}`}>
                    {plan.status}
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 text-center py-3 border-y">
                <div>
                  <p className="text-lg font-semibold">{plan.clients}</p>
                  <p className="text-xs text-muted-foreground flex items-center justify-center gap-1"><Users className="h-3 w-3" /> Clients</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">{plan.meals}</p>
                  <p className="text-xs text-muted-foreground">Meals</p>
                </div>
                <div>
                  <p className="text-lg font-semibold">{plan.calories.split(" ")[0]}</p>
                  <p className="text-xs text-muted-foreground">Calories</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-muted-foreground flex items-center gap-1"><Clock className="h-3 w-3" /> {plan.duration}</span>
                <button className="text-xs text-brand-green hover:underline font-medium cursor-pointer">View Plan</button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
