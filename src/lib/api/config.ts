export const API_CONFIG = {
  baseUrl: "/api-proxy",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json",
  },
}

let memoryToken: string | null = null

export function getAuthToken(): string | null {
  return memoryToken
}

export function setAuthToken(token: string): void {
  memoryToken = token
  syncTokenToCookie(token)
}

export function removeAuthToken(): void {
  memoryToken = null
  syncClearCookie()
}

async function syncTokenToCookie(token: string) {
  try {
    await fetch("/api/auth/token", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token }),
    })
  } catch {}
}

async function syncClearCookie() {
  try {
    await fetch("/api/auth/token", { method: "DELETE" })
  } catch {}
}
