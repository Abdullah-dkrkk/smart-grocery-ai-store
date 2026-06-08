"use client"

import { useState } from "react"
import { Settings as SettingsIcon, Save, Loader2, CheckCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function AdminSettings() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    siteName: "SmartGrocery",
    supportEmail: "support@smartgrocery.com",
    supportPhone: "+1 (800) 123-4567",
    currency: "USD",
    taxRate: "10",
    deliveryFee: "9.99",
    freeDeliveryMin: "50.00",
    maxOrderItems: "50",
    maintenanceMode: "false",
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
        <h2 className="text-2xl font-semibold">System Settings</h2>
        <p className="text-base text-muted-foreground">Configure global platform settings.</p>
      </div>

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
