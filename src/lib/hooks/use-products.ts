import { useQuery } from "@tanstack/react-query"
import { productsApi, type ProductFilters } from "@/lib/api/products"
import { get } from "@/lib/api/client"
import { adaptProducts, adaptProduct } from "@/lib/adapters/product-adapter"
import type { Product } from "@/types/product"
import type { Product as ApiProduct } from "@/lib/api/types"
import type { PaginatedResponse, PaginationMeta } from "@/lib/api/client"

export function useProducts(filters?: {
  category_id?: number
  category_slug?: string
  search?: string
  min_price?: number
  max_price?: number
  rating?: number
  sort_by?: string
  sort_dir?: string
  page?: number
  per_page?: number
}) {
  return useQuery<Product[]>({
    queryKey: ["products", filters],
    queryFn: async () => {
      const res = await productsApi.list(filters as Record<string, string | number | boolean | undefined>)
      return adaptProducts(res.data)
    },
  })
}

export function usePaginatedProducts(filters: ProductFilters = {}) {
  return useQuery<{ products: Product[]; pagination: PaginationMeta }>({
    queryKey: ["products", "paginated", filters],
    queryFn: async () => {
      const res = await get<ApiProduct[]>("/products", filters as Record<string, string | number | boolean | undefined>) as unknown as PaginatedResponse<ApiProduct>
      return {
        products: adaptProducts(res.data),
        pagination: res.meta ?? { current_page: 1, per_page: 15, total: 0, last_page: 1, from: null, to: null },
      }
    },
  })
}

export function useProduct(id: number) {
  return useQuery<Product | null>({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await productsApi.detail(id)
      return adaptProduct(res.data)
    },
    enabled: !!id,
  })
}

export function useProductBySlug(slug: string) {
  return useQuery<Product | null>({
    queryKey: ["product", "slug", slug],
    queryFn: async () => {
      const res = await productsApi.bySlug(slug)
      return adaptProduct(res.data)
    },
    enabled: !!slug,
  })
}

export function useFeaturedProducts() {
  return useQuery<Product[]>({
    queryKey: ["products", "featured"],
    queryFn: async () => {
      const res = await productsApi.featured()
      return adaptProducts(res.data)
    },
  })
}

export function useRelatedProducts(categoryId: number | undefined, excludeId: number | undefined) {
  return useQuery<Product[]>({
    queryKey: ["products", "related", categoryId],
    queryFn: async () => {
      const res = await productsApi.list({ category_id: categoryId, per_page: 8 })
      return adaptProducts(res.data)
    },
    enabled: !!categoryId,
    select: (data) => data.filter((p) => p.id !== excludeId).slice(0, 6),
  })
}
