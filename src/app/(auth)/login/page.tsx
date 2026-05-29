"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthSlider } from "@/components/auth/auth-slider"
import { Eye, EyeOff, ChevronLeft, Loader2 } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!email || !password) { setError("Please fill in all fields"); return }
    setLoading(true)

    try {
      const result = await signIn("credentials", { email, password, redirect: false })
      if (result?.error) { setError("Invalid email or password"); setLoading(false); return }
      router.push(searchParams.get("callbackUrl") || "/")
      router.refresh()
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
                href="/"
                className="inline-flex items-center gap-2 text-lg text-muted-foreground hover:text-foreground transition-colors mb-8"
              >
                <ChevronLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <h1 className="text-3xl font-heading font-bold tracking-tight">Welcome back</h1>
              <p className="text-muted-foreground mt-2 text-lg">Sign in to your account to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-lg">
                  {error}
                </div>
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

              <div>
                <label htmlFor="password" className="block text-lg font-medium mb-1.5">Password</label>
                <div className="relative">
                <Input
                  id="password" type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
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
