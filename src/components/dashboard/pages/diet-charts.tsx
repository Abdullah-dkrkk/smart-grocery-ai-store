"use client"

import { BookOpen, Plus, Download } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const mockCharts = [
  { id: 1, name: "7-Day Clean Eating", client: "Alice Johnson", type: "Weight Loss", meals: 21, created: "2026-06-01", status: "Assigned" },
  { id: 2, name: "High Protein Plan", client: "Bob Smith", type: "Muscle Gain", meals: 28, created: "2026-05-28", status: "Assigned" },
  { id: 3, name: "Low GI Diet Chart", client: "Carol Davis", type: "Diabetes", meals: 21, created: "2026-05-25", status: "Draft" },
]

export function DietCharts() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Diet Charts</h2>
          <p className="text-base text-muted-foreground">Create and assign personalized diet charts.</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> New Chart</Button>
      </div>

      {mockCharts.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No diet charts</h3>
          <p className="text-sm text-muted-foreground">Create your first diet chart for a client.</p>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {mockCharts.map((chart) => (
            <Card key={chart.id}>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-green/10">
                  <BookOpen className="h-6 w-6 text-brand-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{chart.name}</p>
                    <Badge variant={chart.status === "Assigned" ? "default" : "secondary"} className="text-[10px]">{chart.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Client: {chart.client} | {chart.type} | {chart.meals} meals</p>
                </div>
                <div className="flex gap-1 shrink-0">
                  <button className="p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer" title="Download">
                    <Download className="h-4 w-4 text-muted-foreground" />
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
