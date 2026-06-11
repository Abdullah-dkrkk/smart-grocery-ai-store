import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import type { User } from "next-auth"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

interface ApiAuthResponse {
  success: boolean
  data: {
    user: {
      id: number
      name: string
      email: string
      role: string
    }
    token: string
  }
  message?: string
}

interface ApiMeResponse {
  success: boolean
  data: {
    id: number
    name: string
    email: string
    role: string
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<User | null> {
        if (!credentials?.email || !credentials?.password) return null

        try {
          // SPA flow: browser already obtained a Sanctum token via direct AJAX.
          // Validate it via GET /auth/me instead of logging in again.
          const creds = credentials as Record<string, unknown>
          if (creds.token) {
            const token = String(creds.token)
            const res = await fetch(`${API_BASE_URL}/auth/me`, {
              method: "GET",
              headers: {
                Authorization: `Bearer ${token}`,
                Accept: "application/json",
              },
            })
            if (!res.ok) return null

            const data: ApiMeResponse = await res.json()
            if (!data.success || !data.data) return null

            const user = data.data
            return {
              id: String(user.id),
              name: user.name,
              email: user.email,
              role: user.role,
              token: token,
            } as User
          }

          // Fallback: direct credentials authentication (e.g. NextAuth test page)
          const controller = new AbortController()
          const timeout = setTimeout(() => controller.abort(), 8000)

          const res = await fetch(`${API_BASE_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json", Accept: "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
            signal: controller.signal,
          })
          clearTimeout(timeout)

          if (!res.ok) return null

          const data: ApiAuthResponse = await res.json()

          if (!data.success || !data.data) return null

          const { user, token } = data.data

          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            role: user.role,
            token: token,
          } as User
        } catch {
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as User & { role: string }).role
        token.token = (user as User & { token: string }).token
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.token = token.token as string
      }
      return session
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24,
  },
  trustHost: true,
})
