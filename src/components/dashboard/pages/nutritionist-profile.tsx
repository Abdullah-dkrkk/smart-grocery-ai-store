"use client"

import { useState } from "react"
import { Save, Loader2, CheckCircle, User, Star } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function NutritionistProfile() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: "Dr. Sarah Nutritionist",
    email: "sarah@smartgrocery.com",
    phone: "+1 (555) 987-6543",
    specialization: "Clinical Nutrition, Weight Management",
    experience: "8 years",
    qualifications: "PhD in Nutrition Science, Registered Dietitian",
    bio: "Passionate about helping people achieve their health goals through evidence-based nutrition advice.",
  })

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    await new Promise((r) => setTimeout(r, 1000))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Profile</h2>
        <p className="text-base text-muted-foreground">Manage your professional profile and credentials.</p>
      </div>

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
