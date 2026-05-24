import { useQuery, useMutation } from "@tanstack/react-query"
import { ordersApi, type CheckoutData } from "@/lib/api/orders"
import type { Order } from "@/lib/api/types"

export function useOrders(page = 1) {
  return useQuery<Order[]>({
    queryKey: ["orders", page],
    queryFn: async () => {
      const res = await ordersApi.history(page)
      return res.data
    },
  })
}

export function useOrder(id: number) {
  return useQuery<Order>({
    queryKey: ["order", id],
    queryFn: async () => {
      const res = await ordersApi.detail(id)
      return res.data
    },
    enabled: !!id,
  })
}

export function useCheckout() {
  return useMutation({
    mutationFn: (data: CheckoutData) => ordersApi.checkout(data),
  })
}

export function useCancelOrder() {
  return useMutation({
    mutationFn: (id: number) => ordersApi.cancel(id),
  })
}

export function useTrackOrder(id: number) {
  return useQuery({
    queryKey: ["order-track", id],
    queryFn: () => ordersApi.track(id),
    enabled: !!id,
  })
}
