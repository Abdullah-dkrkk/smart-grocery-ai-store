import { useQuery } from "@tanstack/react-query"
import { productsApi } from "@/lib/api/products"
import { adaptProducts, adaptProduct } from "@/lib/adapters/product-adapter"
import type { Product } from "@/types/product"

export function useProducts(filters?: { category_id?: number; search?: string }) {
  return useQuery<Product[]>({
    queryKey: ["products", filters],
    queryFn: async () => {
      const res = await productsApi.list(filters as Record<string, string | number | boolean | undefined>)
      return adaptProducts(res.data)
    },
  })
}

export function useProduct(id: number) {
  return useQuery<Product>({
    queryKey: ["product", id],
    queryFn: async () => {
      const res = await productsApi.detail(id)
      return adaptProduct(res.data)
    },
    enabled: !!id,
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
