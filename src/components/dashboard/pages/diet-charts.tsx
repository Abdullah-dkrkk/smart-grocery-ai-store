"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { BookOpen, Plus, Download, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { dietChartsApi } from "@/lib/api/diet-charts"
import { setAuthToken } from "@/lib/api/config"
import type { DietChart } from "@/lib/api/diet-charts"

export function DietCharts() {
  const { data: session, status: authStatus } = useSession()
  const [charts, setCharts] = useState<DietChart[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCharts = () => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false)
      setError("Please sign in to view diet charts.")
      return
    }
    setAuthToken(session.user.token)
    setLoading(true)
    dietChartsApi.list()
      .then((res) => setCharts(Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []))
      .catch((err) => setError(err.message || "Failed to load diet charts."))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchCharts() }, [authStatus, session])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Diet Charts</h2>
          <p className="text-base text-muted-foreground">Loading diet charts...</p>
        </div>
        {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-card border rounded-xl animate-pulse" />)}
      </div>
    )
  }

  if (error && charts.length === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Diet Charts</h2>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Unable to load diet charts</h3>
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
          <h2 className="text-2xl font-semibold">Diet Charts</h2>
          <p className="text-base text-muted-foreground">Create and assign personalized diet charts.</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> New Chart</Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {charts.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <BookOpen className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No diet charts</h3>
          <p className="text-sm text-muted-foreground">Create your first diet chart for a client.</p>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {charts.map((chart) => (
            <Card key={chart.id}>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-brand-green/10">
                  <BookOpen className="h-6 w-6 text-brand-green" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{chart.title}</p>
                    <Badge variant="secondary" className="text-[10px]">{chart.duration_days} days</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">Client: {chart.client_name ?? "—"} | {chart.days?.length ?? 0} days</p>
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
