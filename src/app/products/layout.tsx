import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Products - Browse Our Fresh Selection",
  description: "Explore our wide range of fresh groceries, organic produce, dairy, beverages, and more. Find everything you need for your daily meals.",
}

export default function ProductsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
