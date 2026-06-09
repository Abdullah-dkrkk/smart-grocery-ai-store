import { get, post, put, del } from "./client"
import type { ReviewItem } from "./types"

export interface ReviewInput {
  product_id: number
  rating: number
  comment?: string
}

export const reviewsApi = {
  listByProduct(productId: number, page = 1) {
    return get<ReviewItem[]>(`/products/${productId}/reviews`, { page, per_page: 10 })
  },
  myReviews() {
    return get<ReviewItem[]>("/customer/reviews")
  },
  create(data: ReviewInput) {
    return post<ReviewItem>(`/products/${data.product_id}/reviews`, data)
  },
  update(id: number, data: { rating?: number; comment?: string }) {
    return put<ReviewItem>(`/reviews/${id}`, data)
  },
  destroy(id: number) {
    return del<void>(`/reviews/${id}`)
  },
}
