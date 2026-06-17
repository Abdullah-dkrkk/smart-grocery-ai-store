"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthSlider } from "@/components/auth/auth-slider"
import { ChevronLeft, Loader2, MailCheck, AlertCircle, X } from "lucide-react"
import { forgotPasswordSchema } from "@/lib/validations"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [shake, setShake] = useState(false)
  const [sent, setSent] = useState(false)

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
    const parsed = forgotPasswordSchema.safeParse({ email })
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
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(extractErrorMessage(data, "Email not found"))
        setLoading(false)
        return
      }

      setSent(true)
      setLoading(false)
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
                  href="/login"
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Sign In
                </Link>
                <h1 className="text-3xl font-heading font-bold tracking-tight">Forgot password?</h1>
                <p className="text-muted-foreground mt-2 text-sm">
                  No worries. Enter your email and we&apos;ll send you a reset link.
                </p>
              </div>

              {sent ? (
                <div className="text-center py-6">
                  <MailCheck className="h-12 w-12 mx-auto text-brand-green mb-4" />
                  <h2 className="text-xl font-heading font-semibold mb-2">Check your email</h2>
                  <p className="text-muted-foreground text-lg">
                    We&apos;ve sent a password reset link to <strong>{email}</strong>
                  </p>
                  <Link href="/login">
                    <Button variant="outline" className="mt-6">
                      Back to Sign In
                    </Button>
                  </Link>
                </div>
              ) : (
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

                  <Button type="submit" disabled={loading} className={`w-full h-10 text-[14px] bg-brand-green hover:bg-brand-green/90 text-white ${shake ? "shake" : ""}`}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
                  </Button>
                </form>
              )}

              <p className="text-center text-sm text-muted-foreground mt-6">
                Remember your password?{" "}
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
