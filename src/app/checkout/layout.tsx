import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order with secure checkout. Fast delivery and easy payment options available.",
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
