"use client"

import { usePathname } from "next/navigation"
import { CartDrawer } from "@/components/store/cart-drawer"

const AUTH_ROUTES = ["/login", "/register", "/forgot-password", "/reset-password"]

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAuth = AUTH_ROUTES.includes(pathname)

  if (isAuth) {
    return <>{children}</>
  }

  return (
    <>
      <main className="flex-1">{children}</main>
      <CartDrawer />
    </>
  )
}
