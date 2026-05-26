"use client"

import { useState } from "react"
import Link from "next/link"
import { AnnouncementBar } from "@/components/sections/announcement-bar"
import { Header } from "@/components/sections/header"
import { Breadcrumbs } from "@/components/common/breadcrumbs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Footer } from "@/components/store/footer"
import { CreditCard, Check, ChevronDown, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProductCategory } from "@/types/product"

const announcements = [
  { text: "Grand opening — up to 15% off all items. Only 3 days left!" },
  { text: "Free delivery on orders over $50 — shop now!" },
  { text: "Trendy 25 silver jewelry — save up to 35% off today!" },
]

const allCategories: ProductCategory[] = [
  { id: 1, name: "Milks & Dairies", slug: "milks-dairies", description: "", image: "", icon: "", parent_id: null, product_count: 30 },
  { id: 2, name: "Wines & Drinks", slug: "wines-drinks", description: "", image: "", icon: "", parent_id: null, product_count: 25 },
  { id: 3, name: "Clothing & Beauty", slug: "clothing-beauty", description: "", image: "", icon: "", parent_id: null, product_count: 45 },
  { id: 4, name: "Pet Foods & Toys", slug: "pet-foods", description: "", image: "", icon: "", parent_id: null, product_count: 18 },
  { id: 5, name: "Baking Material", slug: "baking-material", description: "", image: "", icon: "", parent_id: null, product_count: 35 },
  { id: 6, name: "Fresh Fruit", slug: "fresh-fruit", description: "", image: "", icon: "", parent_id: null, product_count: 50 },
  { id: 7, name: "Vegetables", slug: "vegetables", description: "", image: "", icon: "", parent_id: null, product_count: 65 },
  { id: 8, name: "Bread & Juice", slug: "bread-juice", description: "", image: "", icon: "", parent_id: null, product_count: 28 },
  { id: 9, name: "Fresh Seafood", slug: "fresh-seafood", description: "", image: "", icon: "", parent_id: null, product_count: 22 },
  { id: 10, name: "Fast Food", slug: "fast-food", description: "", image: "", icon: "", parent_id: null, product_count: 40 },
  { id: 11, name: "Cake & Milk", slug: "cake-milk", description: "", image: "", icon: "", parent_id: null, product_count: 15 },
  { id: 12, name: "Coffee & Teas", slug: "coffee-teas", description: "", image: "", icon: "", parent_id: null, product_count: 33 },
]

type PaymentMethod = "card" | "cod"

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

const initialCartItems = [
  { name: "Seeds of Change Organic Quinoa", price: 28.85, quantity: 2 },
  { name: "Artisan Sourdough Bread Fresh Baked Daily", price: 6.99, quantity: 1 },
  { name: "Organic Fuji Apples Sweet & Crispy 3lb Bag", price: 3.99, quantity: 3 },
]

export default function CheckoutPage() {
  const [step, setStep] = useState<"form" | "confirm" | "success">("form")
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [form, setForm] = useState<FormData>({
    firstName: "", lastName: "", email: "", phone: "",
    address: "", city: "", state: "", zip: "",
  })
  const [errors, setErrors] = useState<Partial<FormData>>({})
  const [submitting, setSubmitting] = useState(false)

  const subtotal = initialCartItems.reduce((s, i) => s + i.price * i.quantity, 0)
  const shipping = subtotal >= 50 ? 0 : 9.99
  const total = subtotal + shipping

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

  function handleSubmit() {
    if (!validate()) return
    setStep("confirm")
  }

  async function handleConfirm() {
    setSubmitting(true)
    await new Promise((r) => setTimeout(r, 1500))
    setSubmitting(false)
    setStep("success")
  }

  if (step === "success") {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar announcements={announcements} interval={5000} />
        <Header categories={allCategories} cartCount={0}  />
        <main className="container mx-auto px-4 py-16">
          <Breadcrumbs items={[{ label: "Checkout" }]} className="mb-8" />
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-brand-green" />
            </div>
            <h1 className="text-2xl font-heading font-semibold mb-3">Order Placed Successfully!</h1>
            <p className="text-muted-foreground mb-8">Thank you for your order. You&apos;ll receive a confirmation email shortly.</p>
            <div className="space-y-3">
              <Link href="/products" className="inline-flex items-center justify-center rounded-lg bg-brand-green hover:bg-brand-green/90 text-white h-10 px-6 text-sm font-medium transition-all">
                Continue Shopping
              </Link>
              <Link href="/" className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted h-10 px-6 text-sm font-medium transition-all">
                Back to Home
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar announcements={announcements} interval={5000} />
      <Header categories={allCategories} cartCount={3}  />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} className="mb-6" />
        <h1 className="text-3xl font-heading font-semibold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-8">
            {/* Shipping Information */}
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

            {/* Payment Method */}
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
            </div>

            {/* Confirm / Submit */}
            {step === "confirm" ? (
              <div className="bg-card border rounded-xl p-6">
                <h2 className="text-lg font-heading font-semibold mb-4">Confirm Your Order</h2>
                <div className="space-y-2 text-sm text-muted-foreground mb-6">
                  <p><span className="font-medium text-foreground">Shipping to:</span> {form.firstName} {form.lastName}, {form.address}, {form.city}, {form.state} {form.zip}</p>
                  <p><span className="font-medium text-foreground">Email:</span> {form.email}</p>
                  <p><span className="font-medium text-foreground">Payment:</span> {paymentMethod === "card" ? "Credit/Debit Card" : "Cash on Delivery"}</p>
                </div>
                <div className="flex gap-3">
                  <Button onClick={handleConfirm} disabled={submitting} className="bg-brand-green hover:bg-brand-green/90 text-white min-w-[160px]">
                    {submitting ? "Processing..." : "Place Order"}
                  </Button>
                  <Button variant="outline" onClick={() => setStep("form")}>Edit Details</Button>
                </div>
              </div>
            ) : (
              <Button onClick={handleSubmit} className="bg-brand-green hover:bg-brand-green/90 text-white h-12 text-base min-w-[200px]">
                Review Order
              </Button>
            )}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-xl p-6 sticky top-24 space-y-4">
              <h2 className="text-lg font-heading font-semibold">Order Summary</h2>
              <div className="space-y-3">
                {initialCartItems.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground truncate mr-4">{item.name} × {item.quantity}</span>
                    <span className="font-medium shrink-0">${(item.price * item.quantity).toFixed(2)}</span>
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
              </div>
              <Separator />
              <div className="flex justify-between text-base">
                <span className="font-semibold">Total</span>
                <span className="font-bold text-lg">${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  )
}
