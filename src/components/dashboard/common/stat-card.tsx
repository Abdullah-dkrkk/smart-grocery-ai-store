"use client"

import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { ArrowUpRight, ArrowDownRight } from "lucide-react"

interface StatCardProps {
  icon: React.ElementType
  label: string
  value: string
  trend?: string
  positive?: boolean
  color: string
}

export function StatCard({ icon: Icon, label, value, trend, positive, color }: StatCardProps) {
  return (
    <Card size="sm">
      <CardContent className="flex items-center gap-4">
        <div className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 ring-inset ring-black/5", color)}>
          <Icon className="h-5 w-5" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
          <p className="text-xl font-bold tracking-tight">{value}</p>
          {trend && (
            <span className={cn(
              "inline-flex items-center gap-0.5 text-xs font-medium",
              positive ? "text-emerald-600" : "text-red-600"
            )}>
              {positive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
              {trend}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
