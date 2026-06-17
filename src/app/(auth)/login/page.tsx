"use client"

import { Suspense, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthSlider } from "@/components/auth/auth-slider"
import { Eye, EyeOff, ChevronLeft, Loader2, AlertCircle, X } from "lucide-react"
import { loginSchema } from "@/lib/validations"
import { setAuthToken } from "@/lib/api/config"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [shake, setShake] = useState(false)

  /**
   * Extract the best available error message from a Laravel API response.
   * Priority:
   *   1. data.message — if it's a real (non-generic) message, use it
   *   2. Field errors from data.data.errors or data.errors — join all values
   *   3. data.data.message — if non-generic
   *   4. Fallback default
   */
  function extractErrorMessage(data: any, fallback: string): string {
    const genericMessages = ["the given data was invalid", "validation failed"]
    const isGeneric = (msg: string) =>
      genericMessages.some((g) => msg.trim().toLowerCase().replace(/\.$/, '') === g)

    // Priority 1: data.message (if it's a real error, not a generic wrapper)
    if (data?.message && !isGeneric(data.message)) {
      return data.message
    }

    // Priority 2: Field-level errors from either wrapper format
    const fieldErrors = data?.data?.errors || data?.errors
    if (fieldErrors && typeof fieldErrors === "object") {
      const joined = Object.values(fieldErrors)
        .flat()
        .filter(Boolean)
        .join(", ")
      if (joined) return joined
    }

    // Priority 3: Nested data.message (Format C wrapper)
    if (data?.data?.message && !isGeneric(data.data.message)) {
      return data.data.message
    }

    // Priority 4: Fallback
    return fallback
  }

  function clearFieldError(field: string) {
    setFieldErrors((prev) => {
      const next = { ...prev }
      delete next[field]
      return next
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    setFieldErrors({})
    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      const errors: Record<string, string> = {}
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as string
        errors[field] = issue.message
      })
      setFieldErrors(errors)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }
    setLoading(true)

    try {
      // 1. Direct AJAX call to Laravel Sanctum API — visible in browser DevTools
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(extractErrorMessage(data, "Invalid email or password"))
        setLoading(false)
        return
      }

      // 2. Store Sanctum token in memory + cookie for API client
      setAuthToken(data.data.token)

      // 3. Create NextAuth session — uses the pre-obtained token
      //    (authorize validates via GET /auth/me, no duplicate login call)
      const result = await signIn("credentials", {
        email,
        password,
        token: data.data.token,
        redirect: false,
      })

      if (result?.error) {
        setError("Failed to create session. Please try again.")
        setLoading(false)
        return
      }

      // 4. Full page navigation to trigger middleware & ensure session cookie is recognized
      const callbackUrl = searchParams.get("callbackUrl")
      window.location.href = callbackUrl || "/dashboard"
    } catch {
      setError("Connection error. Make sure the backend server is running.")
      setLoading(false)
    }
  }

  return (
    <>
      <style jsx>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-2px); }
          20%, 40%, 60%, 80% { transform: translateX(2px); }
        }
        .shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
      <div className="min-h-dvh flex items-center justify-center bg-background lg:bg-muted/30">
        <div className="flex w-full max-w-[1920px] min-h-dvh lg:bg-background lg:shadow-2xl">
          <div className="hidden lg:flex relative w-1/2">
            <AuthSlider />
          </div>

          <div className="flex-1 flex items-center justify-center px-5 py-12 lg:px-16">
            <div className="w-full max-w-sm">
              <div className="mb-6">
                <Link
                  href="/"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Home
                </Link>
                <h1 className="text-3xl font-heading font-bold tracking-tight">Welcome back</h1>
                <p className="text-muted-foreground mt-2 text-sm">Sign in to your account to continue</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-start gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                    <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                    <span className="flex-1">{error}</span>
                    <button
                      type="button"
                      onClick={() => setError("")}
                      className="shrink-0 hover:text-destructive/80 transition-colors"
                      aria-label="Dismiss error"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}

                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-1">Email</label>
                  <Input
                    id="email" type="email" autoComplete="email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => clearFieldError("email")}
                    placeholder="you@example.com"
                    className={`text-[14px] ${fieldErrors.email ? "border-destructive" : ""}`}
                    aria-invalid={!!fieldErrors.email}
                    aria-describedby={fieldErrors.email ? "email-error" : undefined}
                  />
                  {fieldErrors.email && (
                    <p id="email-error" className="text-xs text-destructive mt-1">{fieldErrors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium mb-1">Password</label>
                  <div className="relative">
                    <Input
                      id="password" type={showPassword ? "text" : "password"}
                      autoComplete="current-password"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      onFocus={() => clearFieldError("password")}
                      placeholder="••••••••"
                      className={`pr-11 text-[14px] ${fieldErrors.password ? "border-destructive" : ""}`}
                      aria-invalid={!!fieldErrors.password}
                      aria-describedby={fieldErrors.password ? "password-error" : undefined}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground outline-none focus:outline-none active:outline-none"
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p id="password-error" className="text-xs text-destructive mt-1">{fieldErrors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-input accent-brand-green" />
                    <span className="text-sm text-muted-foreground">Remember me</span>
                  </label>
                  <Link href="/forgot-password" className="text-sm text-brand-green hover:underline">
                    Forgot password?
                  </Link>
                </div>

                <Button type="submit" disabled={loading} className={`w-full h-10 text-[14px] bg-brand-green hover:bg-brand-green/90 text-white ${shake ? "shake" : ""}`}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Don&apos;t have an account?{" "}
                <Link href="/register" className="text-brand-green font-medium hover:underline">
                  Create one
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
