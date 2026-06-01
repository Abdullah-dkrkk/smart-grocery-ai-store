import { get, post, put, del } from "./client"
import type { Discount, DiscountValidation } from "./types"

export interface ValidateCodeParams {
  code: string
  subtotal: number
  item_count?: number
  product_category_ids?: number[]
}

export const discountsApi = {
  validateCode(params: ValidateCodeParams) {
    return post<DiscountValidation>("/customer/orders/validate-discount", params)
  },

  applyCode(params: ValidateCodeParams) {
    return post<DiscountValidation>("/customer/orders/apply-discount", params)
  },

  adminList() {
    return get<Discount[]>("/admin/discounts")
  },

  adminDetail(id: number) {
    return get<Discount>(`/admin/discounts/${id}`)
  },

  adminCreate(data: Record<string, unknown>) {
    return post<Discount>("/admin/discounts", data)
  },

  adminUpdate(id: number, data: Record<string, unknown>) {
    return put<Discount>(`/admin/discounts/${id}`, data)
  },

  adminDelete(id: number) {
    return del<void>(`/admin/discounts/${id}`)
  },
}
