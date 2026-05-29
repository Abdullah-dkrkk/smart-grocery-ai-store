import type { Metadata } from "next"

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const name = slug
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase())
  return {
    title: `${name} - Product Details`,
    description: `Shop ${name} online at SmartGrocery. Fresh, high-quality groceries delivered to your doorstep.`,
  }
}

export default function ProductDetailLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
