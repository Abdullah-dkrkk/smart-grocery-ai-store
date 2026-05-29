"use client"

import { useState } from "react"
import Link from "next/link"
import { AnnouncementBar } from "@/components/sections/announcement-bar"
import { Header } from "@/components/sections/header"
import { Breadcrumbs } from "@/components/common/breadcrumbs"
import { QuantitySelector } from "@/components/common/quantity-selector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Footer } from "@/components/store/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { useCartContext } from "@/lib/providers/cart-provider"
import { useCategories } from "@/lib/hooks/use-categories"
import { ordersApi } from "@/lib/api/orders"
import { Trash2, CreditCard, Check, AlertCircle, Landmark, ShoppingBag, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/toast"

const announcements = [
  { text: "Grand opening — up to 15% off all items. Only 3 days left!" },
  { text: "Free delivery on orders over $50 — shop now!" },
  { text: "Trendy 25 silver jewelry — save up to 35% off today!" },
]

type PaymentMethod = "card" | "cod" | "authorize"

interface FormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  zip: string
}

export default function CheckoutPage() {
  const { items, itemCount, subtotal, updateQuantity, removeItem, clearCart, loading: cartLoading } = useCartContext()
  const { data: categories = [], isLoading: catLoading } = useCategories()
  const { showToast } = useToast()
  const [step, setStep] = useState<"form" | "confirm" | "success">("form")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [form, setForm] = useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", zip: "",
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [submitting, setSubmitting] = useState(false)

  const shipping = subtotal >= 50 ? 0 : 9.99
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const errs: Partial<FormData> = {}
    if (!form.firstName.trim()) errs.firstName = "Required"
    if (!form.lastName.trim()) errs.lastName = "Required"
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Valid email required"
    if (!form.phone.trim()) errs.phone = "Required"
    if (!form.address.trim()) errs.address = "Required"
    if (!form.city.trim()) errs.city = "Required"
    if (!form.state.trim()) errs.state = "Required"
    if (!form.zip.trim()) errs.zip = "Required"
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  function handleReviewOrder() {
    if (items.length === 0) {
      showToast("Your cart is empty!", "error")
      return
    }
    if (!validate()) return
    setStep("confirm")
  }

  async function handlePlaceOrder() {
    setSubmitting(true)
    try {
      const res = await ordersApi.checkout({
        shipping_address: `${form.firstName} ${form.lastName}, ${form.address}, ${form.city}, ${form.state} ${form.zip}`,
        shipping_phone: form.phone,
        payment_method: paymentMethod === "authorize" ? "credit_card" : paymentMethod === "card" ? "credit_card" : "cash_on_delivery",
        notes: "",
      })
      clearCart()
      setStep("success")
      showToast("Order placed successfully!")
    } catch {
      showToast("Failed to place order. Please try again.", "error")
    } finally {
      setSubmitting(false)
    }
  }

  const isLoading = catLoading || cartLoading

  const shippingInfo = (
    <div className="bg-card border rounded-xl p-6">
      <h2 className="text-lg font-heading font-semibold mb-6">Shipping Information</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">First Name</label>
          <Input value={form.firstName} onChange={(e) => updateField("firstName", e.target.value)} className={cn("h-12", errors.firstName && "border-destructive")} />
          {errors.firstName && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.firstName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Last Name</label>
          <Input value={form.lastName} onChange={(e) => updateField("lastName", e.target.value)} className={cn("h-12", errors.lastName && "border-destructive")} />
          {errors.lastName && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.lastName}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Email</label>
          <Input type="email" value={form.email} onChange={(e) => updateField("email", e.target.value)} className={cn("h-12", errors.email && "border-destructive")} />
          {errors.email && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.email}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">Phone</label>
          <Input type="tel" value={form.phone} onChange={(e) => updateField("phone", e.target.value)} className={cn("h-12", errors.phone && "border-destructive")} />
          {errors.phone && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.phone}</p>}
        </div>
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium mb-1.5">Address</label>
          <Input value={form.address} onChange={(e) => updateField("address", e.target.value)} className={cn("h-12", errors.address && "border-destructive")} />
          {errors.address && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.address}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">City</label>
          <Input value={form.city} onChange={(e) => updateField("city", e.target.value)} className={cn("h-12", errors.city && "border-destructive")} />
          {errors.city && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.city}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">State</label>
          <Input value={form.state} onChange={(e) => updateField("state", e.target.value)} className={cn("h-12", errors.state && "border-destructive")} />
          {errors.state && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.state}</p>}
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">ZIP Code</label>
          <Input value={form.zip} onChange={(e) => updateField("zip", e.target.value)} className={cn("h-12", errors.zip && "border-destructive")} />
          {errors.zip && <p className="text-xs text-destructive mt-1 flex items-center gap-1"><AlertCircle className="h-3 w-3" />{errors.zip}</p>}
        </div>
      </div>
    </div>
  )

  const paymentSection = (
    <div className="bg-card border rounded-xl p-6">
      <h2 className="text-lg font-heading font-semibold mb-6">Payment Method</h2>
      <div className="space-y-3">
        <label className={cn(
          "flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all",
          paymentMethod === "card" ? "border-brand-green bg-brand-green/5" : "hover:border-muted-foreground/30"
        )}>
          <input type="radio" name="payment" value="card" checked={paymentMethod === "card"} onChange={() => setPaymentMethod("card")} className="accent-brand-green" />
          <CreditCard className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium text-sm">Credit / Debit Card</p>
            <p className="text-xs text-muted-foreground">Pay with Visa, Mastercard, or PayPal</p>
          </div>
        </label>

        <label className={cn(
          "flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all",
          paymentMethod === "authorize" ? "border-brand-green bg-brand-green/5" : "hover:border-muted-foreground/30"
        )}>
          <input type="radio" name="payment" value="authorize" checked={paymentMethod === "authorize"} onChange={() => setPaymentMethod("authorize")} className="accent-brand-green" />
          <Landmark className="h-5 w-5 text-muted-foreground" />
          <div>
            <p className="font-medium text-sm">Authorize.net</p>
            <p className="text-xs text-muted-foreground">Secure payment via Authorize.net (Sandbox)</p>
          </div>
        </label>

        <label className={cn(
          "flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-all",
          paymentMethod === "cod" ? "border-brand-green bg-brand-green/5" : "hover:border-muted-foreground/30"
        )}>
          <input type="radio" name="payment" value="cod" checked={paymentMethod === "cod"} onChange={() => setPaymentMethod("cod")} className="accent-brand-green" />
          <div className="w-5 h-5 flex items-center justify-center">
            <span className="text-lg">💵</span>
          </div>
          <div>
            <p className="font-medium text-sm">Cash on Delivery</p>
            <p className="text-xs text-muted-foreground">Pay when you receive your order</p>
          </div>
        </label>
      </div>

      {paymentMethod === "authorize" && (
        <div className="mt-4 p-4 bg-muted/50 rounded-lg border">
          <p className="text-xs text-muted-foreground">
            You will be redirected to Authorize.net secure sandbox to complete payment.
            Test card: <span className="font-mono text-foreground">4111 1111 1111 1111</span>
          </p>
        </div>
      )}
    </div>
  )

  const confirmSection = step === "confirm" && (
    <div className="bg-card border rounded-xl p-6">
      <h2 className="text-lg font-heading font-semibold mb-4">Confirm Your Order</h2>
      <div className="space-y-2 text-sm text-muted-foreground mb-6">
        <p><span className="font-medium text-foreground">Shipping to:</span> {form.firstName} {form.lastName}, {form.address}, {form.city}, {form.state} {form.zip}</p>
        <p><span className="font-medium text-foreground">Email:</span> {form.email}</p>
        <p><span className="font-medium text-foreground">Phone:</span> {form.phone}</p>
        <p><span className="font-medium text-foreground">Payment:</span> {
          paymentMethod === "authorize" ? "Authorize.net" :
          paymentMethod === "card" ? "Credit/Debit Card" : "Cash on Delivery"
        }</p>
      </div>
      <div className="flex gap-3">
        <Button onClick={handlePlaceOrder} disabled={submitting} className="bg-brand-green hover:bg-brand-green/90 text-white min-w-[160px]">
          {submitting ? "Processing..." : "Place Order"}
        </Button>
        <Button variant="outline" onClick={() => setStep("form")}>Edit Details</Button>
      </div>
    </div>
  )

  const orderSummarySidebar = (
    <div className="lg:col-span-1">
      <div className="bg-card border rounded-xl p-6 sticky top-24 space-y-4">
        <h2 className="text-lg font-heading font-semibold flex items-center justify-between">
          <span>Order Summary</span>
          <span className="text-sm font-normal text-muted-foreground">({items.length} {items.length === 1 ? "item" : "items"})</span>
        </h2>

        <div className="flex flex-col gap-4">
          {items.map((item) => (
            <div key={item.id} className="flex gap-3 pb-4 border-b border-border/50 last:border-0 last:pb-0">
              <div className="w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-muted">
                <img
                  src={item.product.image || "/placeholder.svg"}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                  onError={(e) => { (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Crect width='64' height='64' fill='%23f1f5f9'/%3E%3C/svg%3E" }}
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{item.product.name}</p>
                <p className="text-sm font-semibold text-brand-green mt-0.5">${item.unit_price.toFixed(2)}</p>
                <div className="flex items-center justify-between mt-2">
                  <QuantitySelector
                    value={item.quantity}
                    min={1}
                    max={item.product.stock || 99}
                    onChange={(q) => updateQuantity(item.id, q)}
                    size="sm"
                  />
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold">${item.total.toFixed(2)}</span>
                    <button
                      onClick={() => removeItem(item.id, item.product_id)}
                      className="text-muted-foreground hover:text-destructive transition-colors shrink-0"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <Separator />

        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Shipping</span>
            <span className="font-medium">{shipping === 0 ? "Free" : `$${shipping.toFixed(2)}`}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Tax (10%)</span>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>
        </div>

        <Separator />

        <div className="flex justify-between text-base">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-lg">${total.toFixed(2)}</span>
        </div>

        {step === "form" && (
          <Button
            onClick={handleReviewOrder}
            className="w-full bg-brand-green hover:bg-brand-green/90 text-white h-12 text-base"
          >
            Review Order
          </Button>
        )}
      </div>
    </div>
  )

  if (step === "success") {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar announcements={announcements} interval={5000} />
        <Header categories={categories} cartCount={0} />
        <main className="container mx-auto px-4 py-16">
          <Breadcrumbs items={[{ label: "Checkout" }]} className="mb-8" />
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-brand-green" />
            </div>
            <h1 className="text-2xl font-heading font-semibold mb-3">Order Placed Successfully!</h1>
            <p className="text-muted-foreground mb-2">Thank you for your order. You&apos;ll receive a confirmation email shortly.</p>
            <p className="text-xs text-muted-foreground mb-8">
              Payment method: {paymentMethod === "authorize" ? "Authorize.net" : paymentMethod === "card" ? "Credit/Debit Card" : "Cash on Delivery"}
            </p>
        <div className="space-y-3">
              <Link href="/products" className="inline-flex items-center justify-center rounded-lg bg-brand-green hover:bg-brand-green/90 text-white h-10 px-6 text-sm font-medium transition-all">
                Continue Shopping
              </Link>
              <Link href="/" className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted h-10 px-6 text-sm font-medium transition-all ml-3">
                Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar announcements={announcements} interval={5000} />
        <Header categories={categories} cartCount={0} />
        <main className="container mx-auto px-4 py-8">
          <Breadcrumbs items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} className="mb-6" />
          <Skeleton className="h-9 w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Skeleton className="h-64 rounded-xl" />
              <Skeleton className="h-40 rounded-xl" />
            </div>
            <div className="lg:col-span-1">
              <Skeleton className="h-96 rounded-xl" />
            </div>
          </div>
        </main>
        <div className="mt-16"><Footer /></div>
      </div>
    )
  }

  if (items.length === 0 && !isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar announcements={announcements} interval={5000} />
        <Header categories={categories} cartCount={0} />
        <main className="container mx-auto px-4 py-16">
          <Breadcrumbs items={[{ label: "Checkout" }]} className="mb-8" />
          <div className="text-center py-20">
            <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground/30 mb-6" />
            <h1 className="text-2xl font-heading font-semibold mb-3">Your cart is empty</h1>
            <p className="text-muted-foreground mb-8">Add some products before checking out.</p>
            <Link href="/products" className="inline-flex items-center justify-center rounded-lg bg-brand-green hover:bg-brand-green/90 text-white h-10 px-6 text-sm font-medium transition-all">
              Continue Shopping
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar announcements={announcements} interval={5000} />
      <Header categories={categories} cartCount={itemCount} />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} className="mb-6" />
        <h1 className="text-3xl font-heading font-semibold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            {step === "form" ? (
              <>
                {shippingInfo}
                {paymentSection}
                <div className="flex items-center justify-between">
                  <Link href="/cart" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to Cart
                  </Link>
                  <Button onClick={handleReviewOrder} className="bg-brand-green hover:bg-brand-green/90 text-white h-12 text-base min-w-[200px]">
                    Review Order
                  </Button>
                </div>
              </>
            ) : (
              <>
                {shippingInfo}
                {paymentSection}
                {confirmSection}
              </>
            )}
          </div>

          {orderSummarySidebar}
        </div>
      </main>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  )
}
