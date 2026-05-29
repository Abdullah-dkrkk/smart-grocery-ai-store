"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

const statusStyles: Record<string, string> = {
  pending: "bg-yellow-50 text-yellow-600 border-yellow-200",
  processing: "bg-blue-50 text-blue-600 border-blue-200",
  shipped: "bg-blue-50 text-blue-600 border-blue-200",
  delivered: "bg-brand-green/10 text-brand-green border-brand-green/20",
  cancelled: "bg-red-50 text-red-600 border-red-200",
}

interface RecentOrderRowProps {
  id: string
  customer?: string
  items: number
  total: string
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  time: string
}

export function RecentOrderRow({ id, customer, items, total, status, time }: RecentOrderRowProps) {
  return (
    <div className="flex items-center justify-between py-3 border-b last:border-0">
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-sm font-medium">
          {customer ? customer.charAt(0) : id.charAt(id.length - 1)}
        </div>
        <div className="min-w-0">
          <p className="text-base font-medium truncate">{customer ?? `Order ${id}`}</p>
          <p className="text-sm text-muted-foreground">{id} &middot; {items} items</p>
        </div>
      </div>
      <div className="flex items-center gap-4 shrink-0">
        <span className="text-base font-medium">${total}</span>
        <Badge variant="outline" className={cn("text-xs font-medium", statusStyles[status])}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
        <span className="text-sm text-muted-foreground w-20 text-right">{time}</span>
      </div>
    </div>
  )
}
