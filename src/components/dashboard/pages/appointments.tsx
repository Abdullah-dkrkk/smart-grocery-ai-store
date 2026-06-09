"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Calendar, Clock, Plus, CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { appointmentsApi } from "@/lib/api/appointments"
import { setAuthToken } from "@/lib/api/config"
import type { Appointment } from "@/lib/api/appointments"

export function Appointments() {
  const { data: session, status: authStatus } = useSession()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState<number | null>(null)
  const [error, setError] = useState<string | null>(null)

  const fetchAppointments = () => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false)
      setError("Please sign in to view appointments.")
      return
    }
    setAuthToken(session.user.token)
    setLoading(true)
    appointmentsApi.list()
      .then((res) => setAppointments(Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []))
      .catch((err) => setError(err.message || "Failed to load appointments."))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchAppointments() }, [authStatus, session])

  const handleStatusUpdate = async (id: number, status: string) => {
    setUpdating(id)
    try {
      await appointmentsApi.updateStatus(id, { status })
      setAppointments((prev) => prev.map((a) => a.id === id ? { ...a, status } : a))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update appointment.")
    } finally {
      setUpdating(null)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Appointments</h2>
          <p className="text-base text-muted-foreground">Loading appointments...</p>
        </div>
        {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-card border rounded-xl animate-pulse" />)}
      </div>
    )
  }

  if (error && appointments.length === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Appointments</h2>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Unable to load appointments</h3>
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
          <h2 className="text-2xl font-semibold">Appointments</h2>
          <p className="text-base text-muted-foreground">Manage your appointment schedule.</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> Schedule</Button>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {appointments.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Calendar className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No appointments</h3>
          <p className="text-sm text-muted-foreground">No upcoming appointments scheduled.</p>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {appointments.map((apt) => (
            <Card key={apt.id}>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  apt.status === "Confirmed" || apt.status === "completed" ? "bg-brand-green/10" : "bg-yellow-50"
                }`}>
                  {apt.status === "Confirmed" || apt.status === "completed"
                    ? <CheckCircle className="h-6 w-6 text-brand-green" />
                    : <XCircle className="h-6 w-6 text-yellow-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{apt.client_name ?? `Client #${apt.client_id}`}</p>
                    <Badge variant={apt.status === "Confirmed" || apt.status === "completed" ? "default" : "outline"} className="text-[10px]">{apt.status}</Badge>
                    <span className="text-[11px] text-muted-foreground">{apt.type}</span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(apt.scheduled_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(apt.scheduled_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </p>
                </div>
                {apt.status === "pending" && (
                  <Button size="sm" variant="outline" disabled={updating === apt.id} onClick={() => handleStatusUpdate(apt.id, "confirmed")}>
                    {updating === apt.id ? <Loader2 className="h-3 w-3 animate-spin" /> : "Confirm"}
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
