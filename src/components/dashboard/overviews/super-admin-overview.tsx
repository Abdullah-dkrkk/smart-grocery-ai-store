"use client"

import { Users, Store, Stethoscope, DollarSign, AlertCircle, CheckCircle2, BarChart3, Activity } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { StatCard } from "@/components/dashboard/common/stat-card"
import { RecentOrderRow } from "@/components/dashboard/common/recent-order-row"

export function SuperAdminOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold">Admin Control Center</h2>
        <p className="text-base text-muted-foreground">Full platform oversight and management.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Users" value="2,847" trend="12% this month" positive color="bg-blue-50 text-blue-600" />
        <StatCard icon={Store} label="Vendors" value="86" trend="4 pending approval" positive color="bg-brand-green/10 text-brand-green" />
        <StatCard icon={Stethoscope} label="Nutritionists" value="24" trend="2 new this week" positive color="bg-brand-orange/10 text-brand-orange" />
        <StatCard icon={DollarSign} label="Platform Revenue" value="$48,290" trend="18% growth" positive color="bg-purple-50 text-purple-600" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="border-b">
            <CardTitle>Pending Approvals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 pt-4">
            {[
              { name: "GreenFarm Organics", type: "Vendor", time: "2 hours ago" },
              { name: "Dr. Aisha Patel", type: "Nutritionist", time: "5 hours ago" },
              { name: "FreshDaily Store", type: "Vendor", time: "1 day ago" },
            ].map((a, i) => (
              <div key={i} className="flex items-center justify-between py-1">
                <div>
                  <p className="text-base font-medium">{a.name}</p>
                  <p className="text-sm text-muted-foreground">{a.type} &middot; {a.time}</p>
                </div>
                <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-600 border-yellow-200">
                  Pending
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader className="border-b">
            <CardTitle>System Health</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 pt-4">
            {[
              { label: "Server Status", value: "Operational", icon: CheckCircle2, color: "text-brand-green" },
              { label: "Active Sessions", value: "1,234", icon: Activity, color: "text-blue-500" },
              { label: "API Response Time", value: "42ms", icon: BarChart3, color: "text-brand-green" },
              { label: "Error Rate", value: "0.02%", icon: AlertCircle, color: "text-brand-green" },
            ].map((s) => {
              const Icon = s.icon
              return (
                <div key={s.label} className="flex items-center justify-between py-1">
                  <div className="flex items-center gap-2">
                    <Icon className={cn("h-5 w-5", s.color)} />
                    <span className="text-base">{s.label}</span>
                  </div>
                  <span className="text-base font-medium">{s.value}</span>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="border-b">
          <CardTitle>Recent Platform Activity</CardTitle>
        </CardHeader>
        <CardContent className="px-0">
          <div className="px-5">
            <RecentOrderRow id="#ORD-4821" customer="Sarah Johnson" items={5} total="89.50" status="delivered" time="2 hours ago" />
            <RecentOrderRow id="#ORD-4820" customer="Michael Chen" items={3} total="45.00" status="shipped" time="5 hours ago" />
            <RecentOrderRow id="#ORD-4819" customer="Emily Davis" items={8} total="124.75" status="pending" time="1 day ago" />
            <RecentOrderRow id="#ORD-4818" customer="James Wilson" items={2} total="23.99" status="cancelled" time="2 days ago" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
