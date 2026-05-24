export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  per_page: number
  total: number
  from: number | null
  to: number | null
}

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface FeatureItem {
  title: string
  description: string
  icon: string
}

export interface TestimonialItem {
  id: number | string
  name: string
  avatar?: string
  rating: number
  text: string
  date?: string
}

export interface Address {
  id: number
  label: string
  street: string
  city: string
  state: string
  zip: string
  is_default: boolean
}
