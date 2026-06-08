"use client"

import { Shield, Search, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

const logs = [
  { id: 1, user: "Admin User", action: "Updated product #1024", type: "update", timestamp: "2026-06-08 14:32:00", ip: "192.168.1.1" },
  { id: 2, user: "System", action: "Processed vendor payout PAY-003", type: "system", timestamp: "2026-06-08 13:00:00", ip: "-" },
  { id: 3, user: "Vendor - Green Farm", action: "Added new product 'Organic Honey'", type: "create", timestamp: "2026-06-08 11:15:00", ip: "192.168.1.50" },
  { id: 4, user: "Admin User", action: "Updated user role for user #45", type: "update", timestamp: "2026-06-07 16:45:00", ip: "192.168.1.1" },
  { id: 5, user: "Customer - Alice J.", action: "Placed order #ORD-1024", type: "create", timestamp: "2026-06-07 10:30:00", ip: "192.168.1.100" },
  { id: 6, user: "System", action: "Daily backup completed", type: "system", timestamp: "2026-06-07 03:00:00", ip: "-" },
  { id: 7, user: "Admin User", action: "Deleted product #987", type: "delete", timestamp: "2026-06-06 15:20:00", ip: "192.168.1.1" },
]

const typeColors: Record<string, string> = {
  update: "bg-blue-50 text-blue-600",
  create: "bg-brand-green/10 text-brand-green",
  delete: "bg-destructive/10 text-destructive",
  system: "bg-purple-50 text-purple-600",
}

export function AuditLog() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Audit Log</h2>
        <p className="text-base text-muted-foreground">Track all platform activities and changes.</p>
      </div>

      <div className="relative w-full sm:w-80">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search audit log..." className="pl-9 h-10 text-sm" />
      </div>

      <Card className="pb-0">
        <CardHeader><CardTitle>Activity History</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full">
            <thead>
              <tr className="border-b text-left text-xs text-muted-foreground">
                <th className="py-3.5 pl-5 pr-3 font-medium">User</th>
                <th className="py-3.5 px-3 font-medium">Action</th>
                <th className="py-3.5 px-3 font-medium">Type</th>
                <th className="py-3.5 px-3 font-medium">IP</th>
                <th className="py-3.5 pl-3 pr-5 font-medium text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.id} className="border-b last:border-0">
                  <td className="py-3.5 pl-5 pr-3 text-sm font-medium">{log.user}</td>
                  <td className="py-3.5 px-3 text-sm text-muted-foreground">{log.action}</td>
                  <td className="py-3.5 px-3">
                    <Badge variant="outline" className={`text-[10px] capitalize ${typeColors[log.type] || ""}`}>{log.type}</Badge>
                  </td>
                  <td className="py-3.5 px-3 text-xs text-muted-foreground font-mono">{log.ip}</td>
                  <td className="py-3.5 pl-3 pr-5 text-sm text-muted-foreground text-right">{log.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  )
}
