"use client"

import { useState } from "react"
import { useAdminDiscounts, useCreateDiscount, useUpdateDiscount, useDeleteDiscount } from "@/lib/hooks/use-discounts"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/components/ui/toast"
import { Plus, Percent, Edit2, Trash2, Search, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Discount } from "@/lib/api/types"

type DiscountForm = {
  code: string
  description: string
  type: "percentage" | "fixed"
  value: string
  max_discount_amount: string
  min_order_amount: string
  max_uses: string
  per_user_limit: string
  minimum_items: string
  applies_to: "all" | "category" | "product"
  applicable_ids: string
  starts_at: string
  expires_at: string
  is_active: boolean
}

const emptyForm: DiscountForm = {
  code: "",
  description: "",
  type: "percentage",
  value: "",
  max_discount_amount: "",
  min_order_amount: "",
  max_uses: "",
  per_user_limit: "",
  minimum_items: "",
  applies_to: "all",
  applicable_ids: "",
  starts_at: "",
  expires_at: "",
  is_active: true,
}

export function Discounts() {
  const { data: discounts, isLoading, refetch } = useAdminDiscounts()
  const createDiscount = useCreateDiscount()
  const updateDiscount = useUpdateDiscount()
  const deleteDiscount = useDeleteDiscount()
  const { showToast } = useToast()

  const [search, setSearch] = useState("")
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<DiscountForm>(emptyForm)
  const [saving, setSaving] = useState(false)

  const filtered = discounts?.filter(
    (d) =>
      d.code.toLowerCase().includes(search.toLowerCase()) ||
      (d.description || "").toLowerCase().includes(search.toLowerCase()),
  ) ?? []

  function resetForm() {
    setForm(emptyForm)
    setEditingId(null)
    setShowForm(false)
  }

  function editDiscount(d: Discount) {
    setForm({
      code: d.code,
      description: d.description || "",
      type: d.type,
      value: String(d.value),
      max_discount_amount: d.max_discount_amount || "",
      min_order_amount: d.min_order_amount || "",
      max_uses: d.max_uses !== null ? String(d.max_uses) : "",
      per_user_limit: d.per_user_limit !== null ? String(d.per_user_limit) : "",
      minimum_items: d.minimum_items !== null ? String(d.minimum_items) : "",
      applies_to: d.applies_to || "all",
      applicable_ids: d.applicable_ids?.join(", ") || "",
      starts_at: d.starts_at ? d.starts_at.split(" ")[0] : "",
      expires_at: d.expires_at ? d.expires_at.split(" ")[0] : "",
      is_active: d.is_active,
    })
    setEditingId(d.id)
    setShowForm(true)
  }

  async function handleSave() {
    if (!form.code.trim() || !form.value) return
    setSaving(true)

    const payload: Record<string, unknown> = {
      code: form.code.trim(),
      description: form.description.trim() || null,
      type: form.type,
      value: Number(form.value),
      max_discount_amount: form.max_discount_amount ? Number(form.max_discount_amount) : null,
      min_order_amount: form.min_order_amount ? Number(form.min_order_amount) : null,
      max_uses: form.max_uses ? Number(form.max_uses) : null,
      per_user_limit: form.per_user_limit ? Number(form.per_user_limit) : null,
      minimum_items: form.minimum_items ? Number(form.minimum_items) : null,
      applies_to: form.applies_to,
      applicable_ids: form.applicable_ids.trim()
        ? form.applicable_ids.split(",").map((s) => Number(s.trim())).filter((n) => !isNaN(n))
        : null,
      starts_at: form.starts_at || null,
      expires_at: form.expires_at || null,
      is_active: form.is_active,
    }

    try {
      if (editingId) {
        await updateDiscount.mutateAsync({ id: editingId, data: payload })
        showToast("Discount updated successfully")
      } else {
        await createDiscount.mutateAsync(payload)
        showToast("Discount created successfully")
      }
      resetForm()
      refetch()
    } catch {
      showToast("Failed to save discount", "error")
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete(id: number) {
    if (!window.confirm("Are you sure you want to delete this discount code?")) return
    try {
      await deleteDiscount.mutateAsync(id)
      showToast("Discount deleted")
      refetch()
    } catch {
      showToast("Failed to delete discount", "error")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-semibold">Discounts</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage promo codes and coupon campaigns</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true) }} className="bg-brand-green hover:bg-brand-green/90 text-white">
          <Plus className="h-4 w-4 mr-2" /> New Discount
        </Button>
      </div>

      <Separator />

      {showForm && (
        <div className="bg-card border rounded-xl p-6 space-y-5">
          <h2 className="text-lg font-heading font-semibold">{editingId ? "Edit Discount" : "Create Discount"}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Code *</label>
              <Input value={form.code} onChange={(e) => setForm((p) => ({ ...p, code: e.target.value.toUpperCase() }))} placeholder="SAVE20" className="h-10 font-mono" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as "percentage" | "fixed" }))}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed ($)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Value *</label>
              <Input value={form.value} onChange={(e) => setForm((p) => ({ ...p, value: e.target.value }))} type="number" min="0" step="0.01" placeholder={form.type === "percentage" ? "20" : "10"} className="h-10" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Discount ($)</label>
              <Input value={form.max_discount_amount} onChange={(e) => setForm((p) => ({ ...p, max_discount_amount: e.target.value }))} type="number" min="0" step="0.01" placeholder="50" className="h-10" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Min Order ($)</label>
              <Input value={form.min_order_amount} onChange={(e) => setForm((p) => ({ ...p, min_order_amount: e.target.value }))} type="number" min="0" step="0.01" placeholder="30" className="h-10" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Min Items</label>
              <Input value={form.minimum_items} onChange={(e) => setForm((p) => ({ ...p, minimum_items: e.target.value }))} type="number" min="1" placeholder="2" className="h-10" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Max Uses (global)</label>
              <Input value={form.max_uses} onChange={(e) => setForm((p) => ({ ...p, max_uses: e.target.value }))} type="number" min="1" placeholder="100" className="h-10" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Per-User Limit</label>
              <Input value={form.per_user_limit} onChange={(e) => setForm((p) => ({ ...p, per_user_limit: e.target.value }))} type="number" min="1" placeholder="1" className="h-10" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Applies To</label>
              <select
                value={form.applies_to}
                onChange={(e) => setForm((p) => ({ ...p, applies_to: e.target.value as "all" | "category" | "product" }))}
                className="flex h-10 w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <option value="all">All Items</option>
                <option value="category">Specific Categories</option>
                <option value="product">Specific Products</option>
              </select>
            </div>
            {form.applies_to !== "all" && (
              <div>
                <label className="block text-sm font-medium mb-1">{form.applies_to === "category" ? "Category IDs" : "Product IDs"}</label>
                <Input value={form.applicable_ids} onChange={(e) => setForm((p) => ({ ...p, applicable_ids: e.target.value }))} placeholder="1, 2, 3" className="h-10" />
                <p className="text-xs text-muted-foreground mt-1">Comma-separated IDs</p>
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Start Date</label>
              <Input value={form.starts_at} onChange={(e) => setForm((p) => ({ ...p, starts_at: e.target.value }))} type="date" className="h-10" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <Input value={form.expires_at} onChange={(e) => setForm((p) => ({ ...p, expires_at: e.target.value }))} type="date" className="h-10" />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.is_active}
                  onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.checked }))}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-muted peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-brand-green/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-green"></div>
              </label>
              <span className="text-sm">Active</span>
            </div>
          </div>
          <div className="col-span-full">
            <label className="block text-sm font-medium mb-1">Description</label>
            <Input value={form.description} onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))} placeholder="20% off on all grocery items" className="h-10" />
          </div>
          <div className="flex items-center gap-3 pt-2">
            <Button onClick={handleSave} disabled={saving || !form.code.trim() || !form.value} className="bg-brand-green hover:bg-brand-green/90 text-white">
              {saving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {editingId ? "Update" : "Create"}
            </Button>
            <Button variant="outline" onClick={resetForm}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="relative max-w-xs">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search discounts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 h-10"
        />
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-20 w-full rounded-xl" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-muted-foreground">
          <Percent className="h-12 w-12 mx-auto mb-3 text-muted-foreground/30" />
          <p>{search ? "No discounts match your search" : "No discounts yet. Create your first promo code!"}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((d) => (
            <div key={d.id} className="bg-card border rounded-xl p-4 flex items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-bold text-base">{d.code}</span>
                  <span className={cn(
                    "text-[11px] px-2 py-0.5 rounded-full font-medium",
                    d.is_active ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"
                  )}>
                    {d.is_active ? "Active" : "Inactive"}
                  </span>
                  <span className="text-[11px] px-2 py-0.5 rounded-full bg-brand-green/10 text-brand-green font-medium">
                    {d.type === "percentage" ? `${d.value}%` : `$${d.value}`}
                  </span>
                </div>
                {d.description && (
                  <p className="text-sm text-muted-foreground line-clamp-1">{d.description}</p>
                )}
                <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                  <span>Used: {d.used_count}{d.max_uses ? `/${d.max_uses}` : ""}</span>
                  {d.min_order_amount && <span>Min: ${d.min_order_amount}</span>}
                  {d.expires_at && <span>Expires: {new Date(d.expires_at).toLocaleDateString()}</span>}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button variant="ghost" size="icon" onClick={() => editDiscount(d)}>
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => handleDelete(d.id)} className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
