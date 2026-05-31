import { useQuery } from "@tanstack/react-query"
import { productsApi } from "@/lib/api/products"
import type { ReviewItem } from "@/lib/api/types"

export interface ReviewsData {
  reviews: ReviewItem[]
  avgRating: number
  totalReviews: number
}

interface ReviewResponse {
  success: boolean
  data: ReviewItem[]
  meta: {
    current_page: number
    per_page: number
    total: number
    last_page: number
    avg_rating: number
    total_reviews: number
  }
}

export function useReviews(productId: number | undefined) {
  return useQuery<ReviewsData>({
    queryKey: ["reviews", productId],
    queryFn: async () => {
      const res = await productsApi.reviews(productId!)
      const response = res as unknown as ReviewResponse
      return {
        reviews: response.data,
        avgRating: response.meta.avg_rating,
        totalReviews: response.meta.total_reviews,
      }
    },
    enabled: !!productId,
  })
}
