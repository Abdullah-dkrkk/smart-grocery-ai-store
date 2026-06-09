"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Stethoscope, Calendar, Clock, Video, Phone, AlertCircle, Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { consultationsApi } from "@/lib/api/consultations"
import { setAuthToken } from "@/lib/api/config"
import type { Consultation } from "@/lib/api/consultations"

export function Consultations() {
  const { data: session, status: authStatus } = useSession()
  const [consultations, setConsultations] = useState<Consultation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchConsultations = () => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false)
      setError("Please sign in to view consultations.")
      return
    }
    setAuthToken(session.user.token)
    setLoading(true)
    consultationsApi.list()
      .then((res) => setConsultations(Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : []))
      .catch((err) => setError(err.message || "Failed to load consultations."))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchConsultations() }, [authStatus, session])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Consultations</h2>
          <p className="text-base text-muted-foreground">Loading consultations...</p>
        </div>
        {[1, 2, 3].map((i) => <div key={i} className="h-20 bg-card border rounded-xl animate-pulse" />)}
      </div>
    )
  }

  if (error && consultations.length === 0) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Consultations</h2>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Unable to load consultations</h3>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Consultations</h2>
        <p className="text-base text-muted-foreground">Schedule and manage client consultations.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      {consultations.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Stethoscope className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No consultations</h3>
          <p className="text-sm text-muted-foreground">No consultations scheduled yet.</p>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {consultations.map((c) => (
            <Card key={c.id}>
              <CardContent className="flex items-center gap-4 pt-6">
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                  c.type === "Video Call" || c.type === "video" ? "bg-blue-50 text-blue-600" : c.type === "Phone Call" || c.type === "phone" ? "bg-brand-green/10 text-brand-green" : "bg-brand-orange/10 text-brand-orange"
                }`}>
                  {c.type === "Video Call" || c.type === "video" ? <Video className="h-6 w-6" /> : c.type === "Phone Call" || c.type === "phone" ? <Phone className="h-6 w-6" /> : <Stethoscope className="h-6 w-6" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{c.client_name ?? `Client #${c.client_id}`}</p>
                    <Badge variant="secondary" className="text-[10px]">{c.type}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(c.created_at).toLocaleDateString()}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{new Date(c.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</span>
                  </p>
                </div>
                {c.recommendations && (
                  <Button size="sm" variant="outline">View Notes</Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
