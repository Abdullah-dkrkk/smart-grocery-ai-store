import { get, post } from "./client"

export const vendorReviewsApi = {
  list() {
    return get<any[]>("/vendor/reviews")
  },
  reply(id: number, data: { reply: string }) {
    return post<any>(`/vendor/reviews/${id}/reply`, data)
  },
}
