import { get, post, del } from "./client"
import type { DashboardOverview, Order, Product, Category, User } from "./types"

export const adminApi = {
  dashboard() {
    return get<DashboardOverview>("/admin/dashboard")
  },

  trends(params?: { period?: "7" | "30" | "90"; from?: string; to?: string }) {
    return get<{ labels: string[]; revenue: number[]; orders: number[] }>("/admin/trends", params as Record<string, string | number | boolean | undefined>)
  },

  // Admin users
  users(params?: { page?: number; per_page?: number; role?: string }) {
    return get<User[]>("/admin/users", params as Record<string, string | number | boolean | undefined>)
  },

  user(id: number) {
    return get<User>(`/admin/users/${id}`)
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
    return post<Category>(`/admin/categories/${id}`, data)
  },

  deleteCategory(id: number) {
    return del<void>(`/admin/categories/${id}`)
  },
}
