"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthSlider } from "@/components/auth/auth-slider"
import { Eye, EyeOff, ChevronLeft, Loader2, CheckCircle } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token") || ""
  const emailParam = searchParams.get("email") || ""

  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")

    if (!password || !confirmPassword) { setError("Please fill in all fields"); return }
    if (password !== confirmPassword) { setError("Passwords do not match"); return }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return }
    if (!token || !emailParam) { setError("Invalid reset link"); return }

    setLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          token,
          email: emailParam,
          password,
          password_confirmation: confirmPassword,
        }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        setError(data?.message || "Invalid or expired reset link")
        setLoading(false)
        return
      }

      setSuccess(true)
      setLoading(false)
      setTimeout(() => router.push("/login"), 2000)
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
              <h1 className="text-3xl font-heading font-bold tracking-tight">Set new password</h1>
              <p className="text-muted-foreground mt-2 text-lg">Must be at least 8 characters.</p>
            </div>

            {success ? (
              <div className="text-center py-8">
                <CheckCircle className="h-16 w-16 mx-auto text-brand-green mb-4" />
                <h2 className="text-2xl font-heading font-semibold mb-2">Password reset successful</h2>
                <p className="text-muted-foreground text-sm">Redirecting you to sign in...</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                {error && (
                  <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-lg">{error}</div>
                )}

                <div>
                  <label htmlFor="password" className="block text-lg font-medium mb-1.5">New Password</label>
                  <div className="relative">
                    <Input
                      id="password" type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={password} onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="pr-11 text-[14px]"
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
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block text-lg font-medium mb-1.5">Confirm Password</label>
                  <Input
                    id="confirmPassword" type="password" autoComplete="new-password"
                    value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="text-[14px]"
                  />
                </div>

                <Button type="submit" disabled={loading} className="w-full h-11 text-[14px] bg-brand-green hover:bg-brand-green/90 text-white">
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Reset Password"}
                </Button>
              </form>
            )}

            <p className="text-center text-sm text-muted-foreground mt-8">
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
