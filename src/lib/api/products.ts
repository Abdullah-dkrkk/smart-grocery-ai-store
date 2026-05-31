import { get, post, put, del } from "./client"
import type { Product, Category, ReviewItem } from "./types"

export interface ProductFilters {
  page?: number
  per_page?: number
  search?: string
  category_id?: number
  category_slug?: string
  vendor_id?: number
  min_price?: number
  max_price?: number
  rating?: number
  in_stock?: boolean
  is_active?: boolean
  sort_by?: "price_asc" | "price_desc" | "name_asc" | "name_desc" | "newest" | "oldest" | "avg_rating" | "review_count"
  sort_dir?: "asc" | "desc"
}

export const productsApi = {
  list(filters: ProductFilters = {}) {
    return get<Product[]>("/products", filters as Record<string, string | number | boolean | undefined>)
  },

  bySlug(slug: string) {
    return get<Product>(`/products/slug/${slug}`)
  },

  detail(id: number) {
    return get<Product>(`/products/${id}`)
  },

  categories() {
    return get<Category[]>("/products/categories")
  },

  featured() {
    return get<Product[]>("/products/featured")
  },

  reviews(productId: number, page = 1) {
    return get<ReviewItem[]>(`/products/${productId}/reviews`, { page, per_page: 10 })
  },

  // Admin endpoints
  create(data: FormData | Record<string, unknown>) {
    return post<Product>("/admin/products", data)
  },

  update(id: number, data: FormData | Record<string, unknown>) {
    return put<Product>(`/admin/products/${id}`, data)
  },

  delete(id: number) {
    return del<void>(`/admin/products/${id}`)
  },

  bulkUpdate(data: { products: { id: number; updates: Record<string, unknown> }[] }) {
    return put<{ updated: number }>("/admin/products/bulk-update", data)
  },

  // Vendor endpoints
  vendorProducts(filters: ProductFilters = {}) {
    return get<Product[]>("/vendor/products", filters as Record<string, string | number | boolean | undefined>)
  },

  vendorProduct(id: number) {
    return get<Product>(`/vendor/products/${id}`)
  },

  createVendorProduct(data: FormData | Record<string, unknown>) {
    return post<Product>("/vendor/products", data)
  },

  updateVendorProduct(id: number, data: FormData | Record<string, unknown>) {
    return put<Product>(`/vendor/products/${id}`, data)
  },

  deleteVendorProduct(id: number) {
    return del<void>(`/vendor/products/${id}`)
  },
}
