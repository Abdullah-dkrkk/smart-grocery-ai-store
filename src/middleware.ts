import { auth } from "@/lib/auth"
import { NextResponse } from "next/server"

const publicPaths = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/products",
  "/categories",
  "/cart",
  "/search",
  "/about",
  "/contact",
  "/blog",
  "/api",
  "/_next",
  "/favicon",
]

const authPaths = [
  "/dashboard",
  "/wishlist",
  "/checkout",
]

function isPublicPath(pathname: string): boolean {
  return publicPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

function isAuthPath(pathname: string): boolean {
  return authPaths.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

export const middleware = auth((req) => {
  const { pathname } = req.nextUrl

  if (isPublicPath(pathname)) {
    return NextResponse.next()
  }

  if (isAuthPath(pathname)) {
    if (!req.auth) {
      const loginUrl = new URL("/login", req.url)
      loginUrl.searchParams.set("callbackUrl", pathname)
      return NextResponse.redirect(loginUrl)
    }

    if (pathname.startsWith("/dashboard")) {
      const url = req.nextUrl
      if (url.searchParams.has("role")) {
        url.searchParams.delete("role")
        return NextResponse.redirect(url)
      }
    }
  }

  return NextResponse.next()
})

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
