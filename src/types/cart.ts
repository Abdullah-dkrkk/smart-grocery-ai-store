import type { Product } from "./product"

export interface CartItem {
  id: number
  product_id: number
  product: Product
  quantity: number
  unit_price: number
  total: number
}

export interface Cart {
  id: number
  items: CartItem[]
  subtotal: number
  delivery_fee: number
  discount: number
  tax: number
  total: number
  item_count: number
}

export interface AddToCartPayload {
  product_id: number
  quantity: number
}

export interface UpdateCartPayload {
  cart_item_id: number
  quantity: number
}
