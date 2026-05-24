const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export const API_CONFIG = {
  baseUrl: API_BASE_URL,
  tokenKey: "auth_token",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null
  return localStorage.getItem(API_CONFIG.tokenKey)
}

export function setAuthToken(token: string): void {
  localStorage.setItem(API_CONFIG.tokenKey, token)
}

export function removeAuthToken(): void {
  localStorage.removeItem(API_CONFIG.tokenKey)
}
