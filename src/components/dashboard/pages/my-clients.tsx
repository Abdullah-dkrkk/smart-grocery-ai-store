"use client"

import { useState } from "react"
import { Users, Search, Mail, Phone, Calendar } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

const mockClients = [
  { id: 1, name: "Alice Johnson", email: "alice@email.com", phone: "+1 555-0101", plan: "Weight Loss", status: "Active", lastVisit: "2026-06-05", goal: "Lose 10 lbs in 3 months" },
  { id: 2, name: "Bob Smith", email: "bob@email.com", phone: "+1 555-0102", plan: "Muscle Gain", status: "Active", lastVisit: "2026-06-03", goal: "Build lean muscle mass" },
  { id: 3, name: "Carol Davis", email: "carol@email.com", phone: "+1 555-0103", plan: "Diabetes Management", status: "Active", lastVisit: "2026-06-01", goal: "Stable blood sugar levels" },
  { id: 4, name: "David Wilson", email: "david@email.com", phone: "+1 555-0104", plan: "Heart Health", status: "Inactive", lastVisit: "2026-05-20", goal: "Lower cholesterol" },
  { id: 5, name: "Eve Martinez", email: "eve@email.com", phone: "+1 555-0105", plan: "Vegan Transition", status: "Active", lastVisit: "2026-06-07", goal: "Balanced plant-based diet" },
]

export function MyClients() {
  const [search, setSearch] = useState("")

  const filtered = mockClients.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">My Clients</h2>
        <p className="text-base text-muted-foreground">Manage your client roster and their nutrition plans.</p>
      </div>

      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search clients..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9 h-10 text-sm" />
      </div>

      {filtered.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <Users className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No clients found</h3>
          <p className="text-sm text-muted-foreground">{search ? "Try a different search." : "No clients assigned yet."}</p>
        </CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map((client) => (
            <Card key={client.id}>
              <CardContent className="flex items-center gap-4 pt-6">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-brand-green/10 text-brand-green font-semibold">
                    {client.name.split(" ").map((n) => n[0]).join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="font-semibold">{client.name}</p>
                    <Badge variant={client.status === "Active" ? "default" : "secondary"} className="text-[10px]">{client.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground flex items-center gap-3 mt-0.5">
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{client.email}</span>
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{client.phone}</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Plan: {client.plan} | Goal: {client.goal}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs text-muted-foreground">Last Visit</p>
                  <p className="text-sm font-medium">{new Date(client.lastVisit).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
