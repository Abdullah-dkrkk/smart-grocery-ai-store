export interface User {
  id: number
  name: string
  email: string
  role: "admin" | "vendor" | "customer"
  created_at: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface ProductImage {
  id: number
  image_url: string
  variation_type: string | null
  alt_text: string | null
  is_primary: boolean
  sort_order: number
}

export interface Product {
  id: number
  name: string
  slug: string
  description: string
  price: string
  compare_at_price: string | null
  image_url: string | null
  images: ProductImage[]
  category_id: number
  vendor_id: number | null
  stock_quantity: number
  min_stock_threshold: number
  is_active: boolean
  is_featured: boolean
  nutrition_data: Record<string, unknown> | null
  sku: string | null
  weight_kg: string | null
  category?: Category
  vendor?: User
  created_at: string
}

export interface Category {
  id: number
  name: string
  slug: string
  description: string | null
  image_url: string | null
  parent_id: number | null
  sort_order: number
  is_active: boolean
  children?: Category[]
  product_count?: number
}

export interface CartItem {
  id: number
  user_id: number
  product_id: number
  quantity: number
  product: Product
}

export interface CartResponse {
  items: CartItem[]
  subtotal: number
  item_count: number
}

export interface Order {
  id: number
  user_id: number
  order_number: string
  subtotal: string
  tax_amount: string
  shipping_cost: string
  discount_amount: string
  total_amount: string
  status: string
  payment_method: string | null
  payment_status: string
  shipping_address: string
  billing_address: string | null
  shipping_phone: string | null
  notes: string | null
  items: OrderItem[]
  created_at: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  product_name: string
  quantity: number
  unit_price: string
  subtotal: string
  product?: Product
}

export interface HealthProfile {
  id: number
  user_id: number
  age: number | null
  weight: number | null
  height: number | null
  bmi: number | null
  goals: string | null
  allergies: string[] | null
  dietary_type: string | null
  activity_level: string | null
  medical_conditions: string | null
  daily_calorie_target: number | null
}

export interface AiResponse {
  response: string
  suggested_products: Product[]
  conversation_id: number
}

export interface DietPlan {
  plan: string
  daily_meals: unknown[]
  total_calories: number
  duration_days: number
}

export interface DashboardOverview {
  total_revenue: number
  total_orders: number
  total_products: number
  total_customers: number
  total_vendors: number
  orders_by_status: Record<string, number>
  revenue_by_period: Record<string, number>
  recent_orders: Order[]
  low_stock_products: Product[]
}
