import { get, post, del } from "./client"

export interface PaymentMethod {
  id: number
  user_id: number
  card_type: string
  last_four: string
  expiry_month: string
  expiry_year: string
  cardholder_name: string
  is_default: boolean
  created_at: string
}

export interface PaymentMethodInput {
  card_type: string
  last_four: string
  expiry_month: string
  expiry_year: string
  cardholder_name: string
  is_default?: boolean
}

export const paymentMethodsApi = {
  list() {
    return get<PaymentMethod[]>("/customer/payment-methods")
  },
  create(data: PaymentMethodInput) {
    return post<PaymentMethod>("/customer/payment-methods", data)
  },
  destroy(id: number) {
    return del<void>(`/customer/payment-methods/${id}`)
  },
}
