"use client"

import { Stethoscope, Calendar, Clock, Video, Phone } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const consultations = [
  { id: 1, client: "Alice Johnson", type: "Video Call", date: "2026-06-10", time: "10:00 AM", duration: "45 min", status: "Upcoming" },
  { id: 2, client: "Bob Smith", type: "In-Person", date: "2026-06-10", time: "2:00 PM", duration: "60 min", status: "Upcoming" },
  { id: 3, client: "Carol Davis", type: "Phone Call", date: "2026-06-11", time: "11:30 AM", duration: "30 min", status: "Scheduled" },
  { id: 4, client: "Eve Martinez", type: "Video Call", date: "2026-06-09", time: "3:00 PM", duration: "45 min", status: "Completed" },
]

export function Consultations() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Consultations</h2>
        <p className="text-base text-muted-foreground">Schedule and manage client consultations.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {consultations.map((c) => (
          <Card key={c.id}>
            <CardContent className="flex items-center gap-4 pt-6">
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                c.type === "Video Call" ? "bg-blue-50 text-blue-600" : c.type === "Phone Call" ? "bg-brand-green/10 text-brand-green" : "bg-brand-orange/10 text-brand-orange"
              }`}>
                {c.type === "Video Call" ? <Video className="h-6 w-6" /> : c.type === "Phone Call" ? <Phone className="h-6 w-6" /> : <Stethoscope className="h-6 w-6" />}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="font-semibold">{c.client}</p>
                  <Badge variant={c.status === "Upcoming" ? "default" : c.status === "Completed" ? "secondary" : "outline"} className="text-[10px]">{c.status}</Badge>
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                  <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{c.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{c.time}</span>
                  <span>{c.duration}</span>
                </p>
              </div>
              {c.status !== "Completed" && (
                <Button size="sm" variant="outline">Join</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
