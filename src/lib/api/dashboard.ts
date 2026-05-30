import { get } from "./client"

export interface CustomerOverview {
  total_orders: number
  pending_deliveries: number
  reviews_given: number
  total_spent: number
  recent_orders: {
    id: number
    order_number: string
    total_amount: number
    status: string
    item_count: number
    created_at: string
  }[]
  upcoming_deliveries: {
    id: number
    scheduled_date: string | null
    items_summary: string
    status: string
  }[]
  recommended_products: {
    id: number
    name: string
    image_url: string | null
    price: number
    discount_percent: number | null
  }[]
}

export const dashboardApi = {
  customerOverview() {
    return get<CustomerOverview>("/customer/dashboard/overview")
  },
}
