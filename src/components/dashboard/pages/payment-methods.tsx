"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { CreditCard, Plus, Trash2, CheckCircle, AlertCircle } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { paymentMethodsApi, setAuthToken } from "@/lib/api"
import type { PaymentMethod as ApiPaymentMethod } from "@/lib/api/payment-methods"

interface PaymentMethod {
  id: number
  type: "visa" | "mastercard" | "amex"
  last4: string
  expiry: string
  name: string
  isDefault: boolean
}

const cardIcons: Record<string, string> = {
  visa: "Visa",
  mastercard: "MC",
  amex: "Amex",
}

function fromApi(pm: ApiPaymentMethod): PaymentMethod {
  return {
    id: pm.id,
    type: pm.card_type as PaymentMethod["type"],
    last4: pm.last_four,
    expiry: `${pm.expiry_month}/${pm.expiry_year.slice(-2)}`,
    name: pm.cardholder_name,
    isDefault: pm.is_default,
  }
}

export function PaymentMethods() {
  const { data: session, status: authStatus } = useSession()
  const [methods, setMethods] = useState<PaymentMethod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ number: "", expiry: "", cvc: "", name: "" })
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false)
      setError("Please sign in to view your payment methods.")
      return
    }
    setAuthToken(session.user.token)
    setLoading(true)
    paymentMethodsApi.list()
      .then((res) => setMethods((res.data || []).map(fromApi)))
      .catch((err) => setError(err.message || "Failed to load payment methods."))
      .finally(() => setLoading(false))
  }, [authStatus, session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.token) return
    setAuthToken(session.user.token)
    setSaving(true)
    try {
      const cardType = form.number.startsWith("4") ? "visa" : form.number.startsWith("5") ? "mastercard" : "amex"
      const [expMonth, expYear] = form.expiry.split("/")
      const res = await paymentMethodsApi.create({
        card_type: cardType,
        last_four: form.number.slice(-4),
        expiry_month: expMonth,
        expiry_year: expYear,
        cardholder_name: form.name,
      })
      setMethods((prev) => [...prev, fromApi(res.data)])
      setForm({ number: "", expiry: "", cvc: "", name: "" })
      setShowForm(false)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to save card."
      setError(msg)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!session?.user?.token) return
    setAuthToken(session.user.token)
    try {
      await paymentMethodsApi.destroy(id)
      setMethods((prev) => prev.filter((m) => m.id !== id))
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete card."
      setError(msg)
    }
  }

  const setDefault = (id: number) => {
    setMethods((prev) => prev.map((m) => ({ ...m, isDefault: m.id === id })))
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">Payment Methods</h2>
          <p className="text-base text-muted-foreground">Loading your payment methods...</p>
        </div>
        {[1, 2].map((i) => (
          <div key={i} className="h-24 bg-card border rounded-xl animate-pulse" />
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
            <h3 className="text-lg font-semibold mb-2">Unable to load payment methods</h3>
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
          <h2 className="text-2xl font-semibold">Payment Methods</h2>
          <p className="text-base text-muted-foreground">Manage your saved payment methods.</p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" /> Add Card
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add Payment Method</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cardholder Name</label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Card Number</label>
                <Input value={form.number} onChange={(e) => setForm({ ...form, number: e.target.value.replace(/\D/g, "").slice(0, 16) })} placeholder="4242 4242 4242 4242" required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Expiry (MM/YY)</label>
                  <Input value={form.expiry} onChange={(e) => setForm({ ...form, expiry: e.target.value.slice(0, 5) })} placeholder="12/28" required />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">CVC</label>
                  <Input value={form.cvc} onChange={(e) => setForm({ ...form, cvc: e.target.value.replace(/\D/g, "").slice(0, 4) })} placeholder="123" required />
                </div>
              </div>
              <div className="flex gap-3 pt-2">
                <Button type="submit" disabled={saving}>Save Card</Button>
                <Button type="button" variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {methods.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <CreditCard className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No payment methods</h3>
            <p className="text-sm text-muted-foreground mb-6">Add a card to checkout faster.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {methods.map((method) => (
            <Card key={method.id} className={method.isDefault ? "ring-2 ring-brand-green/30" : ""}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-14 items-center justify-center rounded-lg bg-muted text-[11px] font-bold tracking-tight">
                      {cardIcons[method.type]}
                    </div>
                    <div>
                      <p className="font-medium">•••• {method.last4}</p>
                      <p className="text-xs text-muted-foreground">Expires {method.expiry}</p>
                    </div>
                  </div>
                  <button onClick={() => handleDelete(method.id)} className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors cursor-pointer">
                    <Trash2 className="h-3.5 w-3.5 text-destructive" />
                  </button>
                </div>
                {method.isDefault ? (
                  <span className="flex items-center gap-1 text-xs text-brand-green font-medium">
                    <CheckCircle className="h-3 w-3" /> Default payment method
                  </span>
                ) : (
                  <button onClick={() => setDefault(method.id)} className="text-xs text-brand-green hover:underline cursor-pointer">
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
