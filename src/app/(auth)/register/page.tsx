"use client"

import { useState } from "react"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthSlider } from "@/components/auth/auth-slider"
import { Eye, EyeOff, ChevronLeft, ChevronDown, Loader2, AlertCircle, X } from "lucide-react"
import { registerSchema } from "@/lib/validations"
import { setAuthToken } from "@/lib/api/config"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function RegisterPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<string>("customer")
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
    const parsed = registerSchema.safeParse({ name, email, password, password_confirmation: confirmPassword, role })
    if (!parsed.success) {
      const errors: Record<string, string> = {}
      parsed.error.issues.forEach((issue) => {
        const field = issue.path[0] as string
        // Map Zod's password_confirmation to UI field name
        const uiField = field === "password_confirmation" ? "confirmPassword" : field
        errors[uiField] = issue.message
      })
      setFieldErrors(errors)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      return
    }
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, password, password_confirmation: confirmPassword, role }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(extractErrorMessage(data, "Registration failed")); setLoading(false); return
      }

      setAuthToken(data.data.token)

      const result = await signIn("credentials", { email, password, token: data.data.token, redirect: false })
      if (result?.error) { setError("Account created but sign in failed. Please try logging in."); setLoading(false); return }

      window.location.href = "/dashboard"
    } catch {
      setError("Something went wrong. Please try again.")
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
                <h1 className="text-3xl font-heading font-bold tracking-tight">Create an account</h1>
                <p className="text-muted-foreground mt-2 text-sm">Join SmartGrocery and start shopping smarter</p>
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
                  <label htmlFor="name" className="block text-sm font-medium mb-1">Full Name</label>
                  <Input
                    id="name" type="text" autoComplete="name"
                    value={name} onChange={(e) => setName(e.target.value)}
                    onFocus={() => clearFieldError("name")}
                    placeholder="John Doe"
                    className={`text-[14px] ${fieldErrors.name ? "border-destructive" : ""}`}
                    aria-invalid={!!fieldErrors.name}
                    aria-describedby={fieldErrors.name ? "name-error" : undefined}
                  />
                  {fieldErrors.name && (
                    <p id="name-error" className="text-xs text-destructive mt-1">{fieldErrors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="role" className="block text-sm font-medium mb-1">I want to join as</label>
                  <div className="relative">
                    <select
                      id="role"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="h-10 w-full rounded-lg border border-input bg-transparent px-3 py-2 text-sm transition-colors outline-none appearance-none pr-10 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                      aria-label="I want to join as"
                    >
                      <option value="customer">Customer</option>
                      <option value="vendor">Vendor</option>
                      <option value="nutritionist">Nutritionist</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                </div>

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
                      autoComplete="new-password"
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

                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">Confirm Password</label>
                  <Input
                    id="confirmPassword" type="password" autoComplete="new-password"
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={() => clearFieldError("confirmPassword")}
                    placeholder="••••••••"
                    className={`text-[14px] ${fieldErrors.confirmPassword ? "border-destructive" : ""}`}
                    aria-invalid={!!fieldErrors.confirmPassword}
                    aria-describedby={fieldErrors.confirmPassword ? "confirmPassword-error" : undefined}
                  />
                  {fieldErrors.confirmPassword && (
                    <p id="confirmPassword-error" className="text-xs text-destructive mt-1">{fieldErrors.confirmPassword}</p>
                  )}
                </div>

                <Button type="submit" disabled={loading} className={`w-full h-10 text-[14px] bg-brand-green hover:bg-brand-green/90 text-white ${shake ? "shake" : ""}`}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Already have an account?{" "}
                <Link href="/login" className="text-brand-green font-medium hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
