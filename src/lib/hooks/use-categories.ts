import { useQuery } from "@tanstack/react-query"
import { productsApi } from "@/lib/api/products"
import { adaptCategories } from "@/lib/adapters/product-adapter"
import type { ProductCategory } from "@/types/product"

export function useCategories() {
  return useQuery<ProductCategory[]>({
    queryKey: ["categories"],
    queryFn: async () => {
      const res = await productsApi.categories()
      return adaptCategories(res.data)
    },
  })
}
