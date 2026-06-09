"use client"

import { useState, useMemo, useEffect } from "react"
import Link from "next/link"
import { AnnouncementBar } from "@/components/sections/announcement-bar"
import { Header } from "@/components/sections/header"
import { Breadcrumbs } from "@/components/common/breadcrumbs"
import { HEADER_ANNOUNCEMENTS } from "@/lib/constants"
import { QuantitySelector } from "@/components/common/quantity-selector"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Footer } from "@/components/store/footer"
import { Skeleton } from "@/components/ui/skeleton"
import { useCartContext } from "@/lib/providers/cart-provider"
import { useCategories } from "@/lib/hooks/use-categories"
import { checkoutSchema } from "@/lib/validations"
import { ordersApi } from "@/lib/api/orders"
import { cartApi } from "@/lib/api/cart"
import { useValidateDiscount } from "@/lib/hooks/use-discounts"
import { Trash2, CreditCard, Check, AlertCircle, Landmark, ShoppingBag, ArrowLeft, Lock, Percent, X, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useToast } from "@/components/ui/toast"
import type { DiscountValidation } from "@/lib/api/types"

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
  const [cardForm, setCardForm] = useState({
    cardNumber: "", expirationMonth: "", expirationYear: "", cardCode: "", nameOnCard: "",
  })
  const [paymentError, setPaymentError] = useState("")

  const [promoCode, setPromoCode] = useState("")
  const [appliedDiscount, setAppliedDiscount] = useState<DiscountValidation | null>(null)
  const [promoError, setPromoError] = useState("")
  const validateDiscount = useValidateDiscount()

  const shipping = subtotal >= 50 ? 0 : 9.99
  const tax = subtotal * 0.1
  const discount = appliedDiscount ? appliedDiscount.discount_amount : 0
  const total = subtotal + shipping + tax - discount

  const itemCategoryIds = useMemo(() => {
    return items
      .map((i) => (i.product as unknown as { category_id?: number }).category_id)
      .filter((id): id is number => id != null)
  }, [items])

  useEffect(() => {
    const savedCode = sessionStorage.getItem("checkout_discount_code")
    if (savedCode && !cartLoading && subtotal > 0) {
      sessionStorage.removeItem("checkout_discount_code")
      setPromoCode(savedCode)
      validateDiscount.mutate(
        {
          code: savedCode,
          subtotal,
          item_count: itemCount,
          product_category_ids: itemCategoryIds,
        },
        {
          onSuccess: (res) => {
            setAppliedDiscount(res.data)
          },
          onError: () => {},
        },
      )
    }
  }, [cartLoading, subtotal, itemCount, itemCategoryIds])

  function updateField(field: keyof FormData, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }))
  }

  function validate(): boolean {
    const parsed = checkoutSchema.safeParse({
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      address: form.address,
      city: form.city,
      state: form.state,
      zipCode: form.zip,
      country: "US",
      notes: "",
    })
    if (!parsed.success) {
      const errs: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        let field = issue.path[0] as string
        if (field === "zipCode") field = "zip"
        if (!errs[field]) errs[field] = issue.message
      }
      setErrors(errs)
      return false
    }
    setErrors({})
    return true
  }

  function handleReviewOrder() {
    if (items.length === 0) {
      showToast("Your cart is empty!", "error")
      return
    }
    if (!validate()) return

    if (promoCode.trim() && !appliedDiscount) {
      validateDiscount.mutate(
        {
          code: promoCode.trim(),
          subtotal,
          item_count: itemCount,
          product_category_ids: itemCategoryIds,
        },
        {
          onSuccess: (res) => {
            setAppliedDiscount(res.data)
            setPromoError("")
            setStep("confirm")
          },
          onError: (err: unknown) => {
            const msg =
              typeof err === "object" && err !== null && "message" in err
                ? String((err as { message: string }).message)
                : "Invalid promo code"
            setPromoError(msg)
          },
        },
      )
      return
    }

    setStep("confirm")
  }

  function handleApplyPromo() {
    const code = promoCode.trim()
    if (!code) return
    setPromoError("")
    setAppliedDiscount(null)

    validateDiscount.mutate(
      {
        code,
        subtotal,
        item_count: itemCount,
        product_category_ids: itemCategoryIds,
      },
      {
        onSuccess: (res) => {
          setAppliedDiscount(res.data)
        },
        onError: (err: unknown) => {
          const msg =
            typeof err === "object" && err !== null && "message" in err
              ? String((err as { message: string }).message)
              : "Invalid promo code"
          setPromoError(msg)
        },
      },
    )
  }

  function handleRemovePromo() {
    setAppliedDiscount(null)
    setPromoError("")
    validateDiscount.reset()
  }

  async function syncCartToBackend() {
    for (const item of items) {
      try {
        await cartApi.add({ product_id: item.product_id, quantity: item.quantity })
      } catch {}
    }
  }

  async function handlePlaceOrder() {
    setSubmitting(true)
    setPaymentError("")
    try {
      await syncCartToBackend()

      const checkoutPayload: {
        shipping_address: string
        shipping_phone: string
        payment_method: string
        notes: string
        discount_code?: string
      } = {
        shipping_address: `${form.firstName} ${form.lastName}, ${form.address}, ${form.city}, ${form.state} ${form.zip}`,
        shipping_phone: form.phone,
        payment_method: paymentMethod === "card" ? "credit_card" : paymentMethod === "cod" ? "cash_on_delivery" : "credit_card",
        notes: "",
      }

      if (appliedDiscount) {
        checkoutPayload.discount_code = appliedDiscount.discount_code
      }

      if (paymentMethod === "authorize") {
        const cardReq = {
          cardNumber: cardForm.cardNumber.replace(/\s/g, ""),
          expirationMonth: cardForm.expirationMonth,
          expirationYear: cardForm.expirationYear,
          cardCode: cardForm.cardCode,
          amount: total,
          firstName: form.firstName,
          lastName: form.lastName,
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
        }
        const payRes = await fetch("/api/payment/authorize-net", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(cardReq),
        })
        const payData = await payRes.json()
        if (!payData.success) {
          setPaymentError(payData.errorMessage || "Payment failed")
          showToast(payData.errorMessage || "Payment failed", "error")
          setSubmitting(false)
          return
        }
        const notes = `Authorize.net Transaction: ${payData.transactionId} (Auth: ${payData.authCode})`
        checkoutPayload.notes = notes
        checkoutPayload.payment_method = "credit_card"

        await ordersApi.checkout(checkoutPayload)
      } else {
        await ordersApi.checkout(checkoutPayload)
      }

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

  const promoSection = (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          placeholder="Promo code"
          value={promoCode}
          onChange={(e) => { setPromoCode(e.target.value); setPromoError("") }}
          onKeyDown={(e) => { if (e.key === "Enter") handleApplyPromo() }}
          className="h-12 text-[14px]"
          disabled={!!appliedDiscount}
        />
        {!appliedDiscount ? (
          <Button
            variant="outline"
            className="h-12 min-w-[80px]"
            onClick={handleApplyPromo}
            disabled={validateDiscount.isPending || !promoCode.trim()}
          >
            {validateDiscount.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Apply"}
          </Button>
        ) : (
          <Button
            variant="ghost"
            className="h-12 w-[80px]"
            onClick={handleRemovePromo}
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
      {validateDiscount.isPending && (
        <p className="text-xs text-muted-foreground flex items-center gap-1">
          <Loader2 className="h-3 w-3 animate-spin" /> Validating code...
        </p>
      )}
      {promoError && (
        <p className="text-xs text-destructive flex items-center gap-1">
          <AlertCircle className="h-3 w-3" /> {promoError}
        </p>
      )}
      {appliedDiscount && (
        <div className="flex items-center justify-between text-sm bg-brand-green/10 rounded-lg px-3 py-2">
          <span className="flex items-center gap-2 text-brand-green font-medium">
            <CheckCircle2 className="h-4 w-4" /> {appliedDiscount.discount_code}
            <span className="text-xs text-muted-foreground font-normal">
              ({appliedDiscount.discount.type === "percentage"
                ? `${appliedDiscount.discount.value}%`
                : `$${appliedDiscount.discount.value}`} off)
            </span>
          </span>
        </div>
      )}
    </div>
  )

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
        <div className="mt-4 p-4 bg-muted/50 rounded-lg border space-y-4">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3 text-brand-green" />
            <span>Encrypted &amp; secure — processed via Authorize.net Sandbox</span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Card Number</label>
            <Input
              value={cardForm.cardNumber}
              onChange={(e) => setCardForm((p) => ({ ...p, cardNumber: e.target.value.replace(/[^\d\s]/g, "").slice(0, 19) }))}
              placeholder="4111 1111 1111 1111"
              className="h-10 font-mono text-sm"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5">Month</label>
              <Input
                value={cardForm.expirationMonth}
                onChange={(e) => setCardForm((p) => ({ ...p, expirationMonth: e.target.value.replace(/\D/g, "").slice(0, 2) }))}
                placeholder="MM"
                className="h-10 font-mono text-sm text-center"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Year</label>
              <Input
                value={cardForm.expirationYear}
                onChange={(e) => setCardForm((p) => ({ ...p, expirationYear: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                placeholder="YYYY"
                className="h-10 font-mono text-sm text-center"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">CVV</label>
              <Input
                value={cardForm.cardCode}
                onChange={(e) => setCardForm((p) => ({ ...p, cardCode: e.target.value.replace(/\D/g, "").slice(0, 4) }))}
                placeholder="123"
                className="h-10 font-mono text-sm text-center"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5">Name on Card</label>
            <Input
              value={cardForm.nameOnCard}
              onChange={(e) => setCardForm((p) => ({ ...p, nameOnCard: e.target.value }))}
              placeholder="John Doe"
              className="h-10 text-sm"
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Test card: <span className="font-mono text-foreground">4111 1111 1111 1111</span> | Any future date | Any 3 digits CVV
          </p>
          {paymentError && (
            <p className="text-xs text-destructive flex items-center gap-1"><AlertCircle className="h-3 w-3" />{paymentError}</p>
          )}
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
          paymentMethod === "authorize" ? `Authorize.net ••••${cardForm.cardNumber.replace(/\s/g, "").slice(-4)}` :
          paymentMethod === "card" ? "Credit/Debit Card" : "Cash on Delivery"
        }</p>
        {appliedDiscount && (
          <p>
            <span className="font-medium text-foreground">Discount:</span>{" "}
            <span className="text-brand-green">
              {appliedDiscount.discount_code} (-${discount.toFixed(2)})
            </span>
          </p>
        )}
      </div>
      <div className="flex gap-3">
        <Button onClick={handlePlaceOrder} disabled={submitting} className="bg-brand-green hover:bg-brand-green/90 text-white min-w-[160px]">
          {submitting ? "Processing..." : `Place Order — $${total.toFixed(2)}`}
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
          {discount > 0 && appliedDiscount && (
            <div className="flex justify-between text-brand-green">
              <span className="flex items-center gap-1">
                <Percent className="h-3.5 w-3.5" />
                {appliedDiscount.discount_code}
              </span>
              <span className="font-medium">-${discount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <Separator />

        <div className="flex justify-between text-base">
          <span className="font-semibold">Total</span>
          <span className="font-bold text-lg">${Math.max(total, 0).toFixed(2)}</span>
        </div>

        {step === "form" && promoSection}

        {step === "form" && (
          <Button
            onClick={handleReviewOrder}
            disabled={validateDiscount.isPending}
            className="w-full bg-brand-green hover:bg-brand-green/90 text-white h-12 text-base"
          >
            {validateDiscount.isPending ? "Validating..." : "Review Order"}
          </Button>
        )}
      </div>
    </div>
  )

  if (step === "success") {
    return (
      <div className="min-h-screen bg-background">
        <AnnouncementBar announcements={HEADER_ANNOUNCEMENTS} interval={5000} />
        <Header categories={categories} />
        <main className="container mx-auto px-4 py-16">
          <Breadcrumbs items={[{ label: "Checkout" }]} className="mb-8" />
          <div className="max-w-lg mx-auto text-center py-16">
            <div className="w-16 h-16 bg-brand-green/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="h-8 w-8 text-brand-green" />
            </div>
            <h1 className="text-2xl font-heading font-semibold mb-3">Order Placed Successfully!</h1>
            <p className="text-muted-foreground mb-2">Thank you for your order. You&apos;ll receive a confirmation email shortly.</p>
            <p className="text-xs text-muted-foreground mb-8">
              Payment method: {paymentMethod === "authorize" ? "Authorize.net (Sandbox)" : paymentMethod === "card" ? "Credit/Debit Card" : "Cash on Delivery"}
            </p>
            {appliedDiscount && (
              <p className="text-sm text-brand-green mb-4">
                Discount applied: {appliedDiscount.discount_code} (-${discount.toFixed(2)})
              </p>
            )}
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
        <AnnouncementBar announcements={HEADER_ANNOUNCEMENTS} interval={5000} />
        <Header categories={categories} />
        <main className="container mx-auto px-4 py-8">
          <Breadcrumbs items={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]} className="mb-6" />
          <Skeleton className="h-9 w-48 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border rounded-xl p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-44" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-14" />
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-20" />
                    <Skeleton className="h-10 w-full rounded-lg" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-10 w-full rounded-lg" />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-card border rounded-xl p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-36" />
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 w-28" />
                  </div>
                  <div className="flex items-center gap-3 p-3 border rounded-lg">
                    <Skeleton className="h-5 w-5 rounded-full" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                </div>
              </div>
              <div className="bg-card border rounded-xl p-6">
                <div className="space-y-4">
                  <Skeleton className="h-6 w-32" />
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-3 border rounded-lg">
                        <Skeleton className="w-14 h-14 rounded-lg shrink-0" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-4 w-3/4" />
                          <Skeleton className="h-3 w-16" />
                          <Skeleton className="h-4 w-20" />
                        </div>
                        <Skeleton className="h-8 w-12 rounded-md" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-card border rounded-xl p-6 space-y-4">
                <Skeleton className="h-6 w-32" />
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-px w-full" />
                <div className="flex justify-between">
                  <Skeleton className="h-5 w-12" />
                  <Skeleton className="h-5 w-20" />
                </div>
                <Skeleton className="h-px w-full" />
                <Skeleton className="h-10 w-full rounded-lg" />
                <Skeleton className="h-10 w-full rounded-lg" />
              </div>
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
        <AnnouncementBar announcements={HEADER_ANNOUNCEMENTS} interval={5000} />
        <Header categories={categories} />
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
      <AnnouncementBar announcements={HEADER_ANNOUNCEMENTS} interval={5000} />
      <Header categories={categories} />

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
                  <Button
                    onClick={handleReviewOrder}
                    disabled={validateDiscount.isPending}
                    className="bg-brand-green hover:bg-brand-green/90 text-white h-12 text-base min-w-[200px]"
                  >
                    {validateDiscount.isPending ? "Validating..." : "Review Order"}
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
