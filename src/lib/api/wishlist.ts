import { get, post, del } from "./client"
import type { Product } from "./types"

export const wishlistApi = {
  list() {
    return get<Product[]>("/customer/wishlist")
  },

  add(productId: number) {
    return post<{ message: string }>(`/customer/wishlist/${productId}`)
  },

  remove(productId: number) {
    return del<{ message: string }>(`/customer/wishlist/${productId}`)
  },
}
