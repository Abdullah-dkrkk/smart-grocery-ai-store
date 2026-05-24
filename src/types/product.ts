export interface Product {
  id: number
  name: string
  slug: string
  description: string
  short_description: string
  price: number
  compare_price: number | null
  cost_per_unit: string | null
  image: string
  images: string[]
  category_id: number
  category_name: string
  category_slug: string
  rating: number
  review_count: number
  badge: string | null
  badges: string[]
  is_featured: boolean
  is_on_sale: boolean
  stock: number
  unit: string
  weight: string | null
  tags: string[]
  created_at: string
}

export interface ProductFilters {
  category_id?: number
  min_price?: number
  max_price?: number
  rating?: number
  sort?: ProductSortOption
  search?: string
  page?: number
  per_page?: number
}

export type ProductSortOption = "newest" | "price_asc" | "price_desc" | "rating" | "popular"

export interface ProductCategory {
  id: number
  name: string
  slug: string
  description: string
  image: string
  icon: string
  parent_id: number | null
  children?: ProductCategory[]
  product_count: number
}
