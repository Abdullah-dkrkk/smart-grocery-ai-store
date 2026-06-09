import { get, put } from "./client"

export interface VendorStore {
  id: number
  vendor_id: number
  store_name: string
  store_description?: string
  store_logo_url?: string
  store_banner_url?: string
  store_policy?: string
  contact_email?: string
  contact_phone?: string
  created_at: string
  updated_at: string
}

export interface VendorStoreInput {
  store_name?: string
  store_description?: string
  store_policy?: string
  contact_email?: string
  contact_phone?: string
}

export const vendorStoreApi = {
  show() {
    return get<VendorStore>("/vendor/store")
  },
  update(data: VendorStoreInput) {
    return put<VendorStore>("/vendor/store", data)
  },
}
