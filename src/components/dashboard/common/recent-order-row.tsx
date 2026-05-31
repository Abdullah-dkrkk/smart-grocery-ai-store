"use client"

import { cn } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"

function timeAgo(dateStr: string): string {
  const now = Date.now()
  const then = new Date(dateStr).getTime()
  const seconds = Math.floor((now - then) / 1000)

  if (seconds < 60) return "just now"
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`
  const months = Math.floor(days / 30)
  if (months < 12) return `${months} month${months !== 1 ? "s" : ""} ago`
  const years = Math.floor(months / 12)
  return `${years} year${years !== 1 ? "s" : ""} ago`
}

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
    <tr className="border-b last:border-0 hover:bg-muted/30 transition-colors">
      <td className="py-3.5 pl-5 pr-3">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-medium">
            {customer ? customer.charAt(0) : id.charAt(id.length - 1)}
          </div>
          <span className="text-sm font-medium">{id}</span>
        </div>
      </td>
      <td className="py-3.5 px-3 text-sm text-muted-foreground whitespace-nowrap">{items} item{items !== 1 ? "s" : ""}</td>
      <td className="py-3.5 px-3 text-sm font-semibold whitespace-nowrap">${total}</td>
      <td className="py-3.5 px-3">
        <Badge variant="outline" className={cn("text-[11px] font-medium px-2 py-0.5", statusStyles[status])}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </Badge>
      </td>
      <td className="py-3.5 pl-3 pr-5 text-xs text-muted-foreground whitespace-nowrap text-right">{timeAgo(time)}</td>
    </tr>
  )
}
