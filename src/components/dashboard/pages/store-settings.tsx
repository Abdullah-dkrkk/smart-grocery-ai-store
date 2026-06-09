"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Store, Save, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { vendorStoreApi } from "@/lib/api/vendor-store"
import { setAuthToken } from "@/lib/api/config"

export function StoreSettings() {
  const { data: session, status: authStatus } = useSession()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    storeName: "",
    slug: "",
    email: "",
    phone: "",
    address: "",
    description: "",
    returnPolicy: "",
  })

  useEffect(() => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false); setError("Please sign in.")
      return
    }
    setAuthToken(session.user.token)
    vendorStoreApi.show()
      .then((res) => {
        const s = res.data
        setForm({
          storeName: s.store_name || "",
          slug: "",
          email: s.contact_email || "",
          phone: s.contact_phone || "",
          address: "",
          description: s.store_description || "",
          returnPolicy: s.store_policy || "",
        })
      })
      .catch((err) => setError(err.message || "Failed to load store settings."))
      .finally(() => setLoading(false))
  }, [authStatus, session])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      await vendorStoreApi.update({
        store_name: form.storeName,
        store_description: form.description,
        store_policy: form.returnPolicy,
        contact_email: form.email,
        contact_phone: form.phone,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err: any) {
      setError(err.message || "Failed to save.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="space-y-6">
      <div className="space-y-2"><h2 className="text-2xl font-semibold">Store Settings</h2><p className="text-base text-muted-foreground">Loading store settings...</p></div>
      {[1,2,3].map((i) => <div key={i} className="h-24 bg-card border rounded-xl animate-pulse" />)}
    </div>
  )

  if (error) return (
    <div className="space-y-6">
      <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Unable to load store settings</h3>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>
      </CardContent></Card>
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Store Settings</h2>
        <p className="text-base text-muted-foreground">Manage your store information and preferences.</p>
      </div>

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader>
            <CardTitle>Store Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Store Name</label>
                <Input value={form.storeName} onChange={(e) => setForm({ ...form, storeName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Store Slug</label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} type="email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Address</label>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Store Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="flex min-h-[80px] w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Return Policy</label>
              <textarea value={form.returnPolicy} onChange={(e) => setForm({ ...form, returnPolicy: e.target.value })}
                className="flex min-h-[80px] w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={saving}>
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                {saving ? "Saving..." : "Save Settings"}
              </Button>
              {saved && <span className="flex items-center gap-1 text-sm text-brand-green font-medium"><CheckCircle className="h-4 w-4" /> Settings saved!</span>}
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
