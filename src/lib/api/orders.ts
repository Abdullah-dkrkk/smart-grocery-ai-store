import { get, post, put } from "./client"
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
    return post<Order>("/customer/orders/checkout", data)
  },

  history(page = 1, per_page = 10) {
    return get<Order[]>("/customer/orders", { page, per_page })
  },

  detail(id: number) {
    return get<Order>(`/customer/orders/${id}`)
  },

  cancel(id: number) {
    return put<Order>(`/customer/orders/${id}/cancel`)
  },

  track(id: number) {
    return get<{ current_status: string; timeline: { status: string; timestamp: string; note?: string }[] }>(`/customer/orders/${id}/track`)
  },

  // Admin endpoints
  adminList(params?: { page?: number; per_page?: number; status?: string }) {
    return get<Order[]>("/admin/orders", params as Record<string, string | number | boolean | undefined>)
  },

  adminDetail(id: number) {
    return get<Order>(`/admin/orders/${id}`)
  },

  updateStatus(id: number, data: { status: string; notes?: string }) {
    return put<Order>(`/admin/orders/${id}/status`, data)
  },
}
