"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Save, Loader2, CheckCircle, User, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { nutritionistProfileApi } from "@/lib/api/nutritionist-profile"
import { setAuthToken } from "@/lib/api/config"

export function NutritionistProfile() {
  const { data: session, status: authStatus } = useSession()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    specialization: "",
    experience: "",
    qualifications: "",
    bio: "",
  })

  useEffect(() => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false)
      setError("Please sign in to view your profile.")
      return
    }
    setAuthToken(session.user.token)
    setLoading(true)
    nutritionistProfileApi.show()
      .then((res) => {
        const data = res.data || res
        setForm({
          name: (data as any).name ?? "",
          email: (data as any).email ?? "",
          phone: (data as any).phone ?? "",
          specialization: data.specialization ?? "",
          experience: data.experience_years ? `${data.experience_years} years` : "",
          qualifications: data.qualifications ?? "",
          bio: data.bio ?? "",
        })
      })
      .catch((err) => setError(err.message || "Failed to load profile."))
      .finally(() => setLoading(false))
  }, [authStatus, session])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    setError(null)
    try {
      await nutritionistProfileApi.update({
        specialization: form.specialization || undefined,
        qualifications: form.qualifications || undefined,
        bio: form.bio || undefined,
        experience_years: form.experience ? parseInt(form.experience) || undefined : undefined,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Profile</h2>
          <p className="text-base text-muted-foreground">Loading your profile...</p>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-16 bg-card border rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (error && !form.name) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Profile</h2>
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
        <h2 className="text-2xl font-semibold">Profile</h2>
        <p className="text-base text-muted-foreground">Manage your professional profile and credentials.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Professional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="flex items-center gap-4 pb-4 border-b">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-green/10">
                <User className="h-8 w-8 text-brand-green" />
              </div>
              <div>
                <p className="text-lg font-semibold">{form.name}</p>
                <p className="text-sm text-muted-foreground">{form.specialization}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Experience</label>
                <Input value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Specialization</label>
              <Input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Qualifications</label>
              <textarea value={form.qualifications} onChange={(e) => setForm({ ...form, qualifications: e.target.value })}
                className="flex min-h-[60px] w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Bio</label>
              <textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })}
                className="flex min-h-[80px] w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {saving ? "Saving..." : "Save Profile"}
              </Button>
              {saved && <span className="flex items-center gap-1 text-sm text-brand-green font-medium"><CheckCircle className="h-4 w-4" /> Profile updated!</span>}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
