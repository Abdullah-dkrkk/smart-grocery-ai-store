import { get, post } from "./client"
import type { Order } from "./types"

export interface CheckoutData {
  shipping_address: string
  billing_address?: string
  shipping_phone?: string
  payment_method?: string
  notes?: string
}

export const ordersApi = {
  checkout(data: CheckoutData) {
    return post<Order>("/orders/checkout", data)
  },

  history(page = 1, per_page = 10) {
    return get<Order[]>("/orders", { page, per_page })
  },

  detail(id: number) {
    return get<Order>(`/orders/${id}`)
  },

  cancel(id: number) {
    return post<Order>(`/orders/${id}/cancel`)
  },

  track(id: number) {
    return get<{ current_status: string; timeline: { status: string; timestamp: string; note?: string }[] }>(`/orders/${id}/track`)
  },

  // Admin endpoints
  adminList(params?: { page?: number; per_page?: number; status?: string }) {
    return get<Order[]>("/admin/orders", params as Record<string, string | number | boolean | undefined>)
  },

  adminDetail(id: number) {
    return get<Order>(`/admin/orders/${id}`)
  },

  updateStatus(id: number, data: { status: string; notes?: string }) {
    return post<Order>(`/admin/orders/${id}/status`, data)
  },
}
