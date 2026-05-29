import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review your items, apply coupon codes, and proceed to checkout. Your groceries are just a few clicks away.",
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
