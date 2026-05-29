"use client"

import { Users, ClipboardList, Calendar, Star, Apple } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { StatCard } from "@/components/dashboard/common/stat-card"

export function NutritionistOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Nutritionist Dashboard</h2>
        <p className="text-base text-muted-foreground">Manage your clients, meal plans, and consultations.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Active Clients" value="18" trend="3 new this month" positive color="bg-brand-green/10 text-brand-green" />
        <StatCard icon={ClipboardList} label="Meal Plans" value="24" trend="5 updated" positive color="bg-blue-50 text-blue-600" />
        <StatCard icon={Calendar} label="Appointments" value="6" trend="2 this week" positive color="bg-brand-orange/10 text-brand-orange" />
        <StatCard icon={Star} label="Avg. Rating" value="4.9" trend="Top rated" positive color="bg-purple-50 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Today&apos;s Schedule</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {[
              { time: "9:00 AM", client: "Sarah Johnson", type: "Consultation" },
              { time: "11:00 AM", client: "Michael Chen", type: "Follow-up" },
              { time: "2:00 PM", client: "Emily Davis", type: "New Client" },
              { time: "4:00 PM", client: "James Wilson", type: "Diet Review" },
            ].map((s, i) => (
              <div key={i} className="flex items-center gap-3 border-b pb-3 last:border-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-semibold">
                  {s.client.split(" ").map(n => n[0]).join("")}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-base font-medium">{s.client}</p>
                  <p className="text-sm text-muted-foreground">{s.type}</p>
                </div>
                <Badge variant="outline" className="text-xs">{s.time}</Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b">
            <CardTitle>Meal Plan Overview</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {[
              { name: "Weight Loss Plan", clients: 8, meals: 21 },
              { name: "Muscle Gain Diet", clients: 5, meals: 18 },
              { name: "Diabetic Management", clients: 3, meals: 21 },
              { name: "Vegan Nutrition", clients: 2, meals: 14 },
            ].map((p, i) => (
              <div key={i} className="flex items-center justify-between py-2">
                <div className="flex items-center gap-2">
                  <Apple className="h-5 w-5 text-brand-green" />
                  <span className="text-base font-medium">{p.name}</span>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>{p.clients} clients</span>
                  <span>{p.meals} meals</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
