import { get, post, del } from "./client"
import type { CartResponse } from "./types"

export const cartApi = {
  list() {
    return get<CartResponse>("/customer/cart")
  },

  add(data: { product_id: number; quantity?: number }) {
    return post<CartResponse>("/customer/cart/add", data)
  },

  remove(cartItemId: number) {
    return del<CartResponse>(`/customer/cart/${cartItemId}`)
  },

  clear() {
    return del<{ message: string }>("/customer/cart/clear")
  },
}
