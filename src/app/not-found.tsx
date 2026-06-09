import Link from "next/link"
import { ArrowLeft, Home } from "lucide-react"

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-dvh bg-background px-4">
      <div className="relative flex flex-col items-center text-center max-w-lg">
        <div className="relative mb-8">
          <div className="text-[12rem] font-heading font-bold leading-none tracking-tighter text-[#059669]/10 select-none">
            404
          </div>

        </div>

        <h1 className="text-3xl md:text-4xl font-heading font-semibold text-foreground mb-3">
          Page Not Found
        </h1>
        <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-sm">
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
          Let&apos;s get you back on track.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-lg bg-brand-green hover:bg-brand-green-dark text-white h-11 px-6 text-sm font-medium transition-all gap-2"
          >
            <Home className="h-4 w-4" />
            Back to Home
          </Link>
          <Link
            href="/products"
            className="inline-flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted text-foreground h-11 px-6 text-sm font-medium transition-all gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Browse Products
          </Link>
        </div>

        <div className="mt-12 flex items-center gap-6 text-sm text-muted-foreground/80">
          <Link href="/" className="hover:text-brand-green transition-colors">Home</Link>
          <Link href="/categories" className="hover:text-brand-green transition-colors">Categories</Link>
          <Link href="/cart" className="hover:text-brand-green transition-colors">Cart</Link>
          <Link href="/contact" className="hover:text-brand-green transition-colors">Contact</Link>
        </div>
      </div>
    </div>
  )
}
