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

export interface VendorDashboardOverview {
  total_products: number
  active_products: number
  orders_received_today: number
  orders_received_total: number
  total_revenue: number
  revenue_this_month: number
  average_rating: number
  low_stock_products: {
    id: number
    name: string
    stock_quantity: number
    min_stock_threshold: number
  }[]
  recent_orders: {
    id: number
    order_number: string
    customer_name: string
    total_amount: number
    status: string
    items_count: number
    created_at: string
  }[]
  earnings_trend: {
    last_7_days: number[]
    labels: string[]
  }
}

export interface NutritionistDashboardOverview {
  active_clients: number
  meal_plans_created: number
  total_appointments_today: number
  upcoming_appointments: {
    id: number
    client_name: string
    type: string
    scheduled_at: string
    status: string
  }[]
  client_growth: string
  average_rating: number
  meal_plans_summary: {
    name: string
    client_count: number
    meal_count: number
  }[]
}

export const dashboardApi = {
  customerOverview() {
    return get<CustomerOverview>("/customer/dashboard/overview")
  },
  vendorOverview() {
    return get<VendorDashboardOverview>("/vendor/dashboard/overview")
  },
  nutritionistOverview() {
    return get<NutritionistDashboardOverview>("/nutritionist/dashboard/overview")
  },
}
