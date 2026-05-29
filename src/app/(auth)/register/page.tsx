"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AuthSlider } from "@/components/auth/auth-slider"
import { Eye, EyeOff, ChevronLeft, Loader2 } from "lucide-react"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export default function RegisterPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError("")
    if (!name || !email || !password || !confirmPassword) { setError("Please fill in all fields"); return }
    if (password !== confirmPassword) { setError("Passwords do not match"); return }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return }
    setLoading(true)

    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ name, email, password, password_confirmation: confirmPassword }),
      })

      const data = await res.json()

      if (!res.ok || !data.success) {
        const msg = data?.data?.errors
          ? Object.values(data.data.errors).flat().join(", ")
          : data?.message || "Registration failed"
        setError(msg); setLoading(false); return
      }

      const result = await signIn("credentials", { email, password, redirect: false })
      if (result?.error) { setError("Account created but sign in failed. Please try logging in."); setLoading(false); return }

      router.push("/")
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
              <h1 className="text-3xl font-heading font-bold tracking-tight">Create an account</h1>
              <p className="text-muted-foreground mt-2 text-lg">Join SmartGrocery and start shopping smarter</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-3 rounded-lg bg-destructive/10 text-destructive text-lg">{error}</div>
              )}

              <div>
                <label htmlFor="name" className="block text-lg font-medium mb-1.5">Full Name</label>
                <Input
                  id="name" type="text" autoComplete="name"
                  value={name} onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="text-[14px]"
                />
              </div>

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
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
              </Button>
            </form>

            <p className="text-center text-lg text-muted-foreground mt-8">
              Already have an account?{" "}
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
