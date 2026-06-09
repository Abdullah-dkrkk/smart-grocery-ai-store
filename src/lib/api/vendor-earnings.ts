import { get } from "./client"

export interface VendorEarningsOverview {
  total_revenue: string
  this_month: string
  pending_payouts: string
  avg_order_value: string
  transactions: VendorTransaction[]
  trend: { labels: string[]; amounts: number[] }
}

export interface VendorTransaction {
  id: number
  order_id: number
  order_number: string
  amount: string
  fee: string
  status: string
  created_at: string
}

export const vendorEarningsApi = {
  overview() {
    return get<VendorEarningsOverview>("/vendor/earnings")
  },
}
