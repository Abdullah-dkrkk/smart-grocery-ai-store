import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Wishlist",
  description: "View your saved items and never miss out on your favorite grocery products. Add them to your cart anytime.",
}

export default function WishlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
