import { get, put } from "./client"
import type { Product } from "./types"

export interface InventoryItem extends Product {
  min_stock_threshold: number
}

export interface InventoryUpdate {
  stock_quantity: number
  min_stock_threshold?: number
}

export const vendorInventoryApi = {
  list() {
    return get<InventoryItem[]>("/vendor/inventory")
  },
  update(productId: number, data: InventoryUpdate) {
    return put<Product>(`/vendor/inventory/${productId}`, data)
  },
}
