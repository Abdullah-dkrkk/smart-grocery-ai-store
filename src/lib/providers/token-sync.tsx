"use client"

import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { setAuthToken, removeAuthToken } from "@/lib/api/config"

export function TokenSync({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession()

  useEffect(() => {
    if (status === "authenticated" && session?.user?.token) {
      setAuthToken(session.user.token)
    } else if (status === "unauthenticated") {
      removeAuthToken()
    }
  }, [session, status])

  return <>{children}</>
}
