"use client"

import { useEffect } from "react"
import { SessionProvider, signOut } from "next-auth/react"
import type { ReactNode } from "react"
import { initAuthToken, removeAuthToken, setOnUnauthorized } from "@/lib/api"

export function AuthSessionProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    initAuthToken()
    setOnUnauthorized(() => {
      removeAuthToken()
      signOut({ redirect: true, callbackUrl: "/login" })
    })
  }, [])

  return <SessionProvider>{children}</SessionProvider>
}
