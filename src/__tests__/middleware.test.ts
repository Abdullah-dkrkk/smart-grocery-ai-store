import { describe, it, expect, vi, beforeEach } from "vitest"

// Mock next-auth/auth
vi.mock("@/lib/auth", () => ({
  auth: (handler: (req: any) => any) => handler,
}))

const publicPaths = ["/", "/login", "/register", "/forgot-password", "/reset-password", "/products", "/categories", "/cart", "/search", "/about", "/contact", "/blog", "/api", "/_next", "/favicon"]
const authPaths = ["/dashboard", "/wishlist", "/checkout"]

function isPublicPath(pathname: string): boolean {
  return publicPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

function isAuthPath(pathname: string): boolean {
  return authPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

function simulateMiddleware(pathname: string, query: Record<string, string>, hasAuth: boolean, userRole?: string) {
  const url = new URL(`http://localhost:3000${pathname}`)
  Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v))

  const req = {
    nextUrl: url,
    url: url.toString(),
    auth: hasAuth ? { user: { role: userRole } } : null,
  }

  if (isPublicPath(pathname)) {
    return { action: "next" }
  }

  if (isAuthPath(pathname)) {
    if (!req.auth) {
      return { action: "redirect", to: "/login" }
    }

    if (pathname.startsWith("/dashboard") && query.role) {
      url.searchParams.delete("role")
      return { action: "redirect", to: url.toString() }
    }

    return { action: "next" }
  }

  return { action: "next" }
}

describe("Middleware - Authentication", () => {
  it("allows unauthenticated access to public paths", () => {
    expect(simulateMiddleware("/login", {}, false)).toEqual({ action: "next" })
    expect(simulateMiddleware("/register", {}, false)).toEqual({ action: "next" })
    expect(simulateMiddleware("/products", {}, false)).toEqual({ action: "next" })
    expect(simulateMiddleware("/", {}, false)).toEqual({ action: "next" })
  })

  it("redirects unauthenticated users from auth paths to login", () => {
    const result = simulateMiddleware("/dashboard", {}, false)
    expect(result.action).toBe("redirect")
    expect(result.to).toBe("/login")
  })

  it("allows authenticated users to access auth paths", () => {
    expect(simulateMiddleware("/dashboard", {}, true, "user").action).toBe("next")
    expect(simulateMiddleware("/wishlist", {}, true, "user").action).toBe("next")
    expect(simulateMiddleware("/checkout", {}, true, "user").action).toBe("next")
  })
})

describe("Middleware - Role-based protection", () => {
  it("strips role query param from dashboard URL", () => {
    const result = simulateMiddleware("/dashboard", { role: "super-admin" }, true, "user")
    expect(result.action).toBe("redirect")
    const redirectedUrl = new URL(result.to!)
    expect(redirectedUrl.searchParams.has("role")).toBe(false)
    expect(redirectedUrl.pathname).toBe("/dashboard")
  })

  it("preserves tab param when stripping role param", () => {
    const result = simulateMiddleware("/dashboard", { role: "super-admin", tab: "My Orders" }, true, "user")
    expect(result.action).toBe("redirect")
    const redirectedUrl = new URL(result.to!)
    expect(redirectedUrl.searchParams.has("role")).toBe(false)
    expect(redirectedUrl.searchParams.get("tab")).toBe("My Orders")
  })

  it("does not redirect dashboard without role param", () => {
    const result = simulateMiddleware("/dashboard", { tab: "Overview" }, true, "user")
    expect(result.action).toBe("next")
  })
})
