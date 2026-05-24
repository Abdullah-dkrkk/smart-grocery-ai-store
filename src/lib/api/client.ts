import { API_CONFIG, getAuthToken } from "./config"

export interface ApiResponse<T = unknown> {
  success: boolean
  data: T
  message?: string
}

export interface PaginationMeta {
  current_page: number
  per_page: number
  total: number
  last_page: number
  from: number | null
  to: number | null
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta?: PaginationMeta
}

class ApiError extends Error {
  status: number
  data: unknown

  constructor(status: number, data: unknown) {
    super(typeof data === "object" && data !== null && "message" in data ? String((data as Record<string, unknown>).message) : `HTTP ${status}`)
    this.status = status
    this.data = data
  }
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<ApiResponse<T>> {
  const token = getAuthToken()

  const headers: Record<string, string> = {
    ...API_CONFIG.headers,
    ...(options.headers as Record<string, string> | undefined),
  }

  if (token) {
    headers["Authorization"] = `Bearer ${token}`
  }

  const isFormData = options.body instanceof FormData
  if (isFormData) {
    delete headers["Content-Type"]
  }

  const response = await fetch(`${API_CONFIG.baseUrl}${endpoint}`, {
    ...options,
    headers,
  })

  let data: ApiResponse<T>
  try {
    data = await response.json()
  } catch {
    if (!response.ok) {
      throw new ApiError(response.status, { message: response.statusText })
    }
    data = { success: true, data: null as unknown as T }
  }

  if (!response.ok || !data.success) {
    throw new ApiError(response.status, data)
  }

  return data
}

export function get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<ApiResponse<T>> {
  let url = endpoint
  if (params) {
    const searchParams = new URLSearchParams()
    for (const [key, value] of Object.entries(params)) {
      if (value !== undefined && value !== "") {
        searchParams.set(key, String(value))
      }
    }
    const qs = searchParams.toString()
    if (qs) url += `?${qs}`
  }
  return request<T>(url, { method: "GET" })
}

export function post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    method: "POST",
    body: body instanceof FormData ? body : JSON.stringify(body),
  })
}

export function put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    method: "PUT",
    body: body instanceof FormData ? body : JSON.stringify(body),
  })
}

export function del<T>(endpoint: string): Promise<ApiResponse<T>> {
  return request<T>(endpoint, { method: "DELETE" })
}

export { ApiError }
