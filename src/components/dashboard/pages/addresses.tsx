"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { MapPin, Plus, Pencil, Trash2, Home, Briefcase, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { addressesApi, setAuthToken } from "@/lib/api"
import type { Address as ApiAddress } from "@/lib/api/addresses"

interface AddressItem {
  id: number
  label: string
  street: string
  city: string
  state: string
  zip: string
  isDefault: boolean
  type: "home" | "work"
}

function fromApi(addr: ApiAddress): AddressItem {
  return {
    id: addr.id,
    label: addr.label,
    street: addr.address_line1,
    city: addr.city,
    state: addr.state,
    zip: addr.zip,
    isDefault: addr.is_default,
    type: "home",
  }
}

function toInput(form: { label: string; street: string; city: string; state: string; zip: string; type: "home" | "work" }) {
  return {
    label: form.label,
    address_line1: form.street,
    city: form.city,
    state: form.state,
    zip: form.zip,
  }
}

export function Addresses() {
  const { data: session, status: authStatus } = useSession()
  const [addresses, setAddresses] = useState<AddressItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [form, setForm] = useState<{ label: string; street: string; city: string; state: string; zip: string; type: "home" | "work" }>({ label: "", street: "", city: "", state: "", zip: "", type: "home" })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false)
      setError("Please sign in to view your addresses.")
      return
    }
    setAuthToken(session.user.token)
    setLoading(true)
    addressesApi.list()
      .then((res) => setAddresses((res.data || []).map(fromApi)))
      .catch((err) => setError(err.message || "Failed to load addresses."))
      .finally(() => setLoading(false))
  }, [authStatus, session])

  const resetForm = () => {
    setForm({ label: "", street: "", city: "", state: "", zip: "", type: "home" })
    setEditingId(null)
    setShowForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.token) return
    setAuthToken(session.user.token)
    setSaving(true)
    try {
      if (editingId) {
        const res = await addressesApi.update(editingId, toInput(form))
        setAddresses((prev) => prev.map((a) => a.id === editingId ? fromApi(res.data) : a))
      } else {
        const res = await addressesApi.create(toInput(form))
        setAddresses((prev) => [...prev, fromApi(res.data)])
      }
      resetForm()
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save address."
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!session?.user?.token) return
    setAuthToken(session.user.token)
    try {
      await addressesApi.destroy(id)
      setAddresses((prev) => prev.filter((a) => a.id !== id))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete address."
      setError(msg)
    }
  }

  const handleEdit = (addr: AddressItem) => {
    setForm({ label: addr.label, street: addr.street, city: addr.city, state: addr.state, zip: addr.zip, type: addr.type })
    setEditingId(addr.id)
    setShowForm(true)
  }

  const setDefault = async (id: number) => {
    if (!session?.user?.token) return
    setAuthToken(session.user.token)
    try {
      await addressesApi.update(id, { is_default: true })
      setAddresses((prev) => prev.map((a) => ({ ...a, isDefault: a.id === id })))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to set default address."
      setError(msg)
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Addresses</h2>
          <p className="text-base text-muted-foreground">Loading your addresses...</p>
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="h-28 bg-card border rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Unable to load addresses</h3>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Addresses</h2>
          <p className="text-base text-muted-foreground">Manage your shipping addresses.</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(true) }}>
          <Plus className="h-4 w-4 mr-2" /> Add Address
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? "Edit Address" : "New Address"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Label</label>
                  <Input value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} placeholder="e.g. Home, Office" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Type</label>
                  <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value as "home" | "work" })}
                    className="flex h-10 w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <option value="home">Home</option>
                    <option value="work">Work</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-sm font-medium">Street Address</label>
                  <Input value={form.street} onChange={(e) => setForm({ ...form, street: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">City</label>
                  <Input value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">State</label>
                  <Input value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">ZIP Code</label>
                  <Input value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} required />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={saving}>{editingId ? "Update" : "Save"} Address</Button>
                <Button type="button" variant="outline" onClick={resetForm}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {addresses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <MapPin className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No addresses saved</h3>
            <p className="text-sm text-muted-foreground mb-6">Add a shipping address to get started.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.map((addr) => (
            <Card key={addr.id} className={addr.isDefault ? "ring-2 ring-brand-green/30" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    {addr.type === "home" ? <Home className="h-4 w-4 text-brand-green" /> : <Briefcase className="h-4 w-4 text-brand-orange" />}
                    <span className="font-semibold">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-[11px] bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full font-medium">Default</span>
                    )}
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => handleEdit(addr)} className="p-1.5 hover:bg-muted rounded-lg transition-colors cursor-pointer">
                      <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                    </button>
                    <button onClick={() => handleDelete(addr.id)} className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer">
                      <Trash2 className="h-3.5 w-3.5 text-destructive" />
                    </button>
                  </div>
                </div>
                <p className="text-sm">{addr.street}</p>
                <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.zip}</p>
                {!addr.isDefault && (
                  <button onClick={() => setDefault(addr.id)} className="text-xs text-brand-green hover:underline mt-2 cursor-pointer">
                    Set as default
                  </button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
