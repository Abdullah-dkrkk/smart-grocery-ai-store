import { get, post, put, del } from "./client"
import type { DashboardOverview, Order, Product, Category, User, ReviewItem } from "./types"

export interface Setting {
  key: string
  value: string
  description?: string
}

export interface Payment {
  id: number
  vendor_id: number
  vendor_name: string
  amount: string
  fee: string
  status: string
  payment_method: string
  created_at: string
}

export interface AuditLogEntry {
  id: number
  user_id: number
  user_name: string
  action: string
  entity_type: string
  entity_id: number | null
  description: string
  ip_address: string
  created_at: string
}

export interface VendorUser extends User {
  store_name?: string
  total_products?: number
  total_revenue?: string
  is_approved?: boolean
}

export interface NutritionistUser extends User {
  specialization?: string
  total_clients?: number
  avg_rating?: number
  is_approved?: boolean
}

export const adminApi = {
  dashboard() {
    return get<DashboardOverview>("/admin/dashboard/overview")
  },

  trends(params?: { period?: "7" | "30" | "90"; from?: string; to?: string }) {
    return get<{ labels: string[]; revenue: number[]; orders: number[] }>("/admin/dashboard/trends", params as Record<string, string | number | boolean | undefined>)
  },

  // Admin users
  users(params?: { page?: number; per_page?: number; role?: string }) {
    return get<User[]>("/admin/users", params as Record<string, string | number | boolean | undefined>)
  },

  user(id: number) {
    return get<User>(`/admin/users/${id}`)
  },

  updateUser(id: number, data: Partial<User>) {
    return put<User>(`/admin/users/${id}`, data)
  },

  deleteUser(id: number) {
    return del<void>(`/admin/users/${id}`)
  },

  approveUser(id: number) {
    return put<User>(`/admin/users/${id}/approve`)
  },

  suspendUser(id: number) {
    return put<User>(`/admin/users/${id}/suspend`)
  },

  // Admin categories
  categories() {
    return get<Category[]>("/admin/categories")
  },

  category(id: number) {
    return get<Category>(`/admin/categories/${id}`)
  },

  createCategory(data: FormData | Record<string, unknown>) {
    return post<Category>("/admin/categories", data)
  },

  updateCategory(id: number, data: FormData | Record<string, unknown>) {
    return put<Category>(`/admin/categories/${id}`, data)
  },

  deleteCategory(id: number) {
    return del<void>(`/admin/categories/${id}`)
  },

  // Admin settings
  settings() {
    return get<Setting[]>("/admin/settings")
  },

  updateSettings(data: Record<string, string>) {
    return put<{ message: string }>("/admin/settings", data)
  },

  // Admin analytics
  analytics() {
    return get<{ stats: Record<string, unknown>; top_products: unknown[]; chart_data: unknown }>("/admin/analytics")
  },

  // Admin payments
  payments(params?: { page?: number; per_page?: number }) {
    return get<Payment[]>("/admin/payments", params as Record<string, string | number | boolean | undefined>)
  },

  payment(id: number) {
    return get<Payment>(`/admin/payments/${id}`)
  },

  updatePaymentStatus(id: number, data: { status: string }) {
    return put<Payment>(`/admin/payments/${id}/status`, data)
  },

  // Admin vendors
  vendors(params?: { page?: number; per_page?: number }) {
    return get<VendorUser[]>("/admin/vendors", params as Record<string, string | number | boolean | undefined>)
  },

  vendor(id: number) {
    return get<VendorUser>(`/admin/vendors/${id}`)
  },

  approveVendor(id: number) {
    return put<VendorUser>(`/admin/vendors/${id}/approve`)
  },

  suspendVendor(id: number) {
    return put<VendorUser>(`/admin/vendors/${id}/suspend`)
  },

  vendorProducts(id: number) {
    return get<Product[]>(`/admin/vendors/${id}/products`)
  },

  // Admin nutritionists
  nutritionists(params?: { page?: number; per_page?: number }) {
    return get<NutritionistUser[]>("/admin/nutritionists", params as Record<string, string | number | boolean | undefined>)
  },

  nutritionist(id: number) {
    return get<NutritionistUser>(`/admin/nutritionists/${id}`)
  },

  approveNutritionist(id: number) {
    return put<NutritionistUser>(`/admin/nutritionists/${id}/approve`)
  },

  suspendNutritionist(id: number) {
    return put<NutritionistUser>(`/admin/nutritionists/${id}/suspend`)
  },

  // Admin audit logs
  auditLogs(params?: { page?: number; per_page?: number }) {
    return get<AuditLogEntry[]>("/admin/audit-logs", params as Record<string, string | number | boolean | undefined>)
  },
}
