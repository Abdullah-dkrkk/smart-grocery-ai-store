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
      <CardContent className="flex items-start gap-4">
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-xl", color)}>
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm text-muted-foreground">{label}</p>
          <p className="text-2xl font-semibold tracking-tight">{value}</p>
          {trend && (
            <span className={cn(
              "inline-flex items-center gap-0.5 text-sm font-medium",
              positive ? "text-brand-green" : "text-destructive"
            )}>
              {positive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              {trend}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
