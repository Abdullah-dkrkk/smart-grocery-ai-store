"use client"

import { Calendar, Clock, Plus, CheckCircle, XCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const appointments = [
  { id: 1, client: "Alice Johnson", date: "2026-06-10", time: "10:00 AM", type: "Follow-up", status: "Confirmed" },
  { id: 2, client: "Bob Smith", date: "2026-06-10", time: "2:00 PM", type: "Initial", status: "Confirmed" },
  { id: 3, client: "Carol Davis", date: "2026-06-11", time: "11:30 AM", type: "Check-in", status: "Pending" },
  { id: 4, client: "Frank Lee", date: "2026-06-12", time: "9:00 AM", type: "Initial", status: "Pending" },
]

export function Appointments() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Appointments</h2>
          <p className="text-base text-muted-foreground">Manage your appointment schedule.</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> Schedule</Button>
      </div>

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
                  apt.status === "Confirmed" ? "bg-brand-green/10" : "bg-yellow-50"
                }`}>
                  {apt.status === "Confirmed" ? <CheckCircle className="h-6 w-6 text-brand-green" /> : <XCircle className="h-6 w-6 text-yellow-600" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{apt.client}</p>
                    <Badge variant={apt.status === "Confirmed" ? "default" : "outline"} className="text-[10px]">{apt.status}</Badge>
                    <span className="text-[11px] text-muted-foreground">{apt.type}</span>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{apt.date}</span>
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{apt.time}</span>
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
