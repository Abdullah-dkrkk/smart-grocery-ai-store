"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthSlider } from "@/components/auth/auth-slider"
import { ChevronLeft, Loader2, MailCheck } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!email) { setError("Please enter your email"); return }
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ email }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data?.message || "Email not found")
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
    <div className="min-h-dvh flex items-center justify-center bg-background lg:bg-muted/30">
      <div className="flex w-full max-w-[1920px] min-h-dvh lg:bg-background lg:shadow-2xl">
        <div className="hidden lg:flex relative w-1/2">
          <AuthSlider />
        </div>

        <div className="flex-1 flex items-center justify-center px-5 py-12 lg:px-16">
          <div className="w-full max-w-sm">
            <div className="mb-8">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 text-lg text-muted-foreground hover:text-foreground transition-colors mb-8"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Sign In
              </Link>
              <h1 className="text-3xl font-heading font-bold tracking-tight">Forgot password?</h1>
              <p className="text-muted-foreground mt-2 text-lg">
                No worries. Enter your email and we&apos;ll send you a reset link.
              </p>
            </div>

            {sent ? (
              <div className="text-center py-8">
                <MailCheck className="h-16 w-16 mx-auto text-brand-green mb-4" />
                <h2 className="text-2xl font-heading font-semibold mb-2">Check your email</h2>
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
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-lg">{error}</div>
                )}

                <div>
                  <label htmlFor="email" className="block text-lg font-medium mb-1.5">Email</label>
                  <Input
                    id="email" type="email" autoComplete="email"
                    value={email} onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="text-[14px]"
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full h-11 text-[14px] bg-brand-green hover:bg-brand-green/90 text-white">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Send Reset Link"}
                </Button>
              </form>
            )}

            <p className="text-center text-lg text-muted-foreground mt-8">
              Remember your password?{" "}
              <Link href="/login" className="text-brand-green font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
