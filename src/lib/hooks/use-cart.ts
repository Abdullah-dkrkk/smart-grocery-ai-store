import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { cartApi } from "@/lib/api/cart"
import type { CartResponse } from "@/lib/api/types"

export function useCart() {
  const queryClient = useQueryClient()

  const query = useQuery<CartResponse>({
    queryKey: ["cart"],
    queryFn: async () => {
      const res = await cartApi.list()
      return res.data
    },
  })

  const addItem = useMutation({
    mutationFn: (data: { product_id: number; quantity?: number }) => cartApi.add(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })

  const removeItem = useMutation({
    mutationFn: (id: number) => cartApi.remove(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })

  const clearCart = useMutation({
    mutationFn: () => cartApi.clear(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["cart"] })
    },
  })

  return {
    ...query,
    items: query.data?.items ?? [],
    subtotal: query.data?.subtotal ?? 0,
    itemCount: query.data?.item_count ?? 0,
    addItem,
    removeItem,
    clearCart,
  }
}
