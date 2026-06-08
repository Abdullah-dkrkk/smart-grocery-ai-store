"use client"

import { useState } from "react"
import { Plus, Loader2, CheckCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function VendorAddProduct() {
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState({
    name: "", description: "", price: "", compare_price: "",
    stock_quantity: "10", sku: "", unit: "piece", category: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
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
        <h2 className="text-2xl font-semibold">Add Product</h2>
        <p className="text-base text-muted-foreground">List a new product in your catalog.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium">Product Name *</label>
              <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Organic Fresh Apples" required />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="flex min-h-[100px] w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                placeholder="Describe your product..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Price *</label>
                <Input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} type="number" step="0.01" placeholder="9.99" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Compare-at Price</label>
                <Input value={form.compare_price} onChange={(e) => setForm({ ...form, compare_price: e.target.value })} type="number" step="0.01" placeholder="12.99" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Unit</label>
                <select value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })}
                  className="flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="piece">Piece</option>
                  <option value="kg">Kilogram</option>
                  <option value="lb">Pound</option>
                  <option value="g">Gram</option>
                  <option value="L">Liter</option>
                  <option value="pack">Pack</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Stock Quantity *</label>
                <Input value={form.stock_quantity} onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })} type="number" placeholder="10" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">SKU</label>
                <Input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="e.g. APP-001" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                  <option value="">Select category</option>
                  <option value="fruits">Fruits</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="dairy">Dairy</option>
                  <option value="meat">Meat</option>
                  <option value="bakery">Bakery</option>
                  <option value="beverages">Beverages</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <Button type="submit" disabled={saving || !form.name || !form.price}>
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Plus className="h-4 w-4 mr-2" />}
                {saving ? "Adding Product..." : "Add Product"}
              </Button>
              {saved && <span className="flex items-center gap-1 text-sm text-brand-green font-medium"><CheckCircle className="h-4 w-4" /> Product added successfully!</span>}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
