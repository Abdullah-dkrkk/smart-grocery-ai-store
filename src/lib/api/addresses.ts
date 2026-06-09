import { get, post, put, del } from "./client"

export interface Address {
  id: number
  user_id: number
  label: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  zip: string
  country: string
  phone?: string
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface AddressInput {
  label: string
  address_line1: string
  address_line2?: string
  city: string
  state: string
  zip: string
  country?: string
  phone?: string
  is_default?: boolean
}

export const addressesApi = {
  list() {
    return get<Address[]>("/customer/addresses")
  },
  show(id: number) {
    return get<Address>(`/customer/addresses/${id}`)
  },
  create(data: AddressInput) {
    return post<Address>("/customer/addresses", data)
  },
  update(id: number, data: Partial<AddressInput>) {
    return put<Address>(`/customer/addresses/${id}`, data)
  },
  destroy(id: number) {
    return del<void>(`/customer/addresses/${id}`)
  },
}
