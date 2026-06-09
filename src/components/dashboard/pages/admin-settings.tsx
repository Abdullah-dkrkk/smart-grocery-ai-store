"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Settings as SettingsIcon, Save, Loader2, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { adminApi } from "@/lib/api/admin"
import { setAuthToken } from "@/lib/api/config"

const keyMapping: Record<string, string> = {
  site_name: "siteName",
  support_email: "supportEmail",
  support_phone: "supportPhone",
  currency: "currency",
  tax_rate: "taxRate",
  delivery_fee: "deliveryFee",
  free_delivery_min: "freeDeliveryMin",
  max_order_items: "maxOrderItems",
  maintenance_mode: "maintenanceMode",
}

const reverseMapping: Record<string, string> = Object.fromEntries(
  Object.entries(keyMapping).map(([k, v]) => [v, k])
)

const defaults: Record<string, string> = {
  siteName: "SmartGrocery",
  supportEmail: "support@smartgrocery.com",
  supportPhone: "+1 (800) 123-4567",
  currency: "USD",
  taxRate: "10",
  deliveryFee: "9.99",
  freeDeliveryMin: "50.00",
  maxOrderItems: "50",
  maintenanceMode: "false",
}

export function AdminSettings() {
  const { data: session, status: authStatus } = useSession()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState<Record<string, string>>(defaults)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false)
      setError("Please sign in.")
      return
    }
    setAuthToken(session.user.token)
    setLoading(true)
    adminApi.settings()
      .then((res) => {
        const settings = res.data || []
        const mapped: Record<string, string> = { ...defaults }
        settings.forEach((s) => {
          const formKey = keyMapping[s.key]
          if (formKey) mapped[formKey] = s.value
        })
        setForm(mapped)
      })
      .catch((err) => setError(err.message || "Failed to load settings."))
      .finally(() => setLoading(false))
  }, [authStatus, session])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    try {
      const payload: Record<string, string> = {}
      for (const [formKey, value] of Object.entries(form)) {
        const apiKey = reverseMapping[formKey]
        if (apiKey) payload[apiKey] = value
      }
      await adminApi.updateSettings(payload)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save settings.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) return (
    <div className="space-y-6">
      <div className="space-y-2"><h2 className="text-2xl font-semibold">Settings</h2><p className="text-base text-muted-foreground">Loading settings...</p></div>
      {[1,2,3].map((i) => <div key={i} className="h-24 bg-card border rounded-xl animate-pulse" />)}
    </div>
  )

  if (error && !saving) return (
    <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
        <AlertCircle className="h-8 w-8 text-destructive" />
      </div>
      <h3 className="text-lg font-semibold mb-2">Unable to load settings</h3>
      <p className="text-sm text-muted-foreground mb-6">{error}</p>
      <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
    </CardContent></Card>
  )

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">System Settings</h2>
        <p className="text-base text-muted-foreground">Configure global platform settings.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">
          <AlertCircle className="h-4 w-4 shrink-0" />{error}
        </div>
      )}

      <form onSubmit={handleSave}>
        <Card>
          <CardHeader><CardTitle>General</CardTitle></CardHeader>
          <CardContent className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Site Name</label>
                <Input value={form.siteName} onChange={(e) => setForm({ ...form, siteName: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Support Email</label>
                <Input value={form.supportEmail} onChange={(e) => setForm({ ...form, supportEmail: e.target.value })} type="email" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Support Phone</label>
                <Input value={form.supportPhone} onChange={(e) => setForm({ ...form, supportPhone: e.target.value })} />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Currency</label>
                <select value={form.currency} onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>
            </div>

            <div className="border-t pt-5">
              <h3 className="text-sm font-semibold mb-4">Order & Delivery</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Tax Rate (%)</label>
                  <Input value={form.taxRate} onChange={(e) => setForm({ ...form, taxRate: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Delivery Fee ($)</label>
                  <Input value={form.deliveryFee} onChange={(e) => setForm({ ...form, deliveryFee: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Free Delivery Min ($)</label>
                  <Input value={form.freeDeliveryMin} onChange={(e) => setForm({ ...form, freeDeliveryMin: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Max Items Per Order</label>
                  <Input value={form.maxOrderItems} onChange={(e) => setForm({ ...form, maxOrderItems: e.target.value })} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Maintenance Mode</label>
                  <select value={form.maintenanceMode} onChange={(e) => setForm({ ...form, maintenanceMode: e.target.value })}
                    className="flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="false">Disabled</option>
                    <option value="true">Enabled</option>
                  </select>
                </div>
              </div>
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
