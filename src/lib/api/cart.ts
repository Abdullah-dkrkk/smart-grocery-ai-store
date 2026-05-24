import { get, post, del } from "./client"
import type { CartResponse } from "./types"

export const cartApi = {
  list() {
    return get<CartResponse>("/cart")
  },

  add(data: { product_id: number; quantity?: number }) {
    return post<CartResponse>("/cart/add", data)
  },

  remove(cartItemId: number) {
    return del<CartResponse>(`/cart/remove/${cartItemId}`)
  },

  clear() {
    return del<{ message: string }>("/cart/clear")
  },
}
