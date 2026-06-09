"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthSlider } from "@/components/auth/auth-slider"
import { ChevronLeft, Loader2 } from "lucide-react"

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  )
}

function LoginForm() {
  const searchParams = useSearchParams()
  const [csrfToken, setCsrfToken] = useState("")
  const [loading, setLoading] = useState(false)
  const error = searchParams.get("error")
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard?role=user"

  useEffect(() => {
    fetch("/api/auth/csrf")
      .then((r) => r.json())
      .then((d) => setCsrfToken(d.csrfToken))
      .catch(() => {})
  }, [])

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
                href="/"
                className="inline-flex items-center gap-2 text-lg text-muted-foreground hover:text-foreground transition-colors mb-8"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <h1 className="text-3xl font-heading font-bold tracking-tight">Welcome back</h1>
              <p className="text-muted-foreground mt-2 text-lg">Sign in to your account to continue</p>
            </div>

            {error && (
              <div className="mb-5 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                Invalid email or password. Please try again.
              </div>
            )}

            <form
              action="/api/auth/callback/credentials"
              method="POST"
              onSubmit={() => setLoading(true)}
              className="space-y-5"
            >
              <input type="hidden" name="csrfToken" value={csrfToken} />
              <input type="hidden" name="callbackUrl" value={callbackUrl} />

              <div>
                <label htmlFor="email" className="block text-lg font-medium mb-1.5">Email</label>
                <Input
                  id="email" name="email" type="email" autoComplete="email"
                  placeholder="you@example.com"
                  className="text-[14px]"
                  required
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-lg font-medium mb-1.5">Password</label>
                <Input
                  id="password" name="password" type="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="text-[14px]"
                  required
                />
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="h-4 w-4 rounded border-input accent-brand-green" />
                  <span className="text-lg text-muted-foreground">Remember me</span>
                </label>
                <Link href="/forgot-password" className="text-lg text-brand-green hover:underline">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" disabled={loading} className="w-full h-11 text-[14px] bg-brand-green hover:bg-brand-green/90 text-white">
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
              </Button>
            </form>

            <p className="text-center text-lg text-muted-foreground mt-8">
              Don&apos;t have an account?{" "}
              <Link href="/register" className="text-brand-green font-medium hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
