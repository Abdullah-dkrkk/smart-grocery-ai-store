"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { User, AlertCircle, Save, Loader2 } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { authApi } from "@/lib/api/auth"
import { setAuthToken } from "@/lib/api/config"
import type { User as UserType } from "@/lib/api/types"

export function MyProfile() {
  const { data: session, status: authStatus } = useSession()
  const [profile, setProfile] = useState<UserType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false)
      setError("Please sign in to view your profile.")
      return
    }
    setAuthToken(session.user.token)
    setLoading(true)
    authApi.me()
      .then((res) => {
        const data = res.data || res
        setProfile(data)
        setName(data.name || "")
        setEmail(data.email || "")
      })
      .catch((err) => setError(err.message || "Failed to load profile."))
      .finally(() => setLoading(false))
  }, [authStatus, session])

  const handleSave = async () => {
    if (!session?.user?.token) return
    setAuthToken(session.user.token)
    setSaving(true)
    setSaved(false)
    try {
      await authApi.updateProfile({ name, email })
      setProfile((prev) => prev ? { ...prev, name, email } : prev)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to update profile.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">My Profile</h2>
          <p className="text-base text-muted-foreground">Loading your profile...</p>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-card border rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">My Profile</h2>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Unable to load profile</h3>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">My Profile</h2>
        <p className="text-base text-muted-foreground">Manage your account information.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="flex items-center gap-4 pb-4 border-b">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10">
              <User className="h-8 w-8 text-brand-green" />
            </div>
            <div>
              <p className="text-lg font-semibold">{profile?.name || "User"}</p>
              <p className="text-sm text-muted-foreground">{profile?.email || ""}</p>
              <p className="text-xs text-muted-foreground/60 capitalize">Role: {profile?.role || "customer"}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address</label>
              <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" />
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
              {saving ? "Saving..." : "Save Changes"}
            </Button>
            {saved && <span className="text-sm text-brand-green font-medium">Profile updated!</span>}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Member Since</span>
            <span>{profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : "N/A"}</span>
          </div>
          <div className="flex justify-between py-2 border-b">
            <span className="text-muted-foreground">Account Type</span>
            <span className="capitalize">{profile?.role || "Customer"}</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Email Verified</span>
            <span className="text-brand-green font-medium">Yes</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
