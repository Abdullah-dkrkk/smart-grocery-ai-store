"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState, type ReactNode } from "react"
import { ToastProvider } from "@/components/ui/toast"
import { CartProvider } from "@/lib/providers/cart-provider"
import { AuthSessionProvider } from "@/lib/providers/auth-session"

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000 * 60 * 5,
            retry: 2,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthSessionProvider>
        <ToastProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </ToastProvider>
      </AuthSessionProvider>
    </QueryClientProvider>
  )
}
