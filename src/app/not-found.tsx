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
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex flex-col items-center gap-1">
              <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className="text-brand-green">
                <circle cx="40" cy="40" r="38" stroke="currentColor" strokeWidth="2" strokeDasharray="6 4" opacity="0.3" />
                <circle cx="40" cy="40" r="28" stroke="currentColor" strokeWidth="1.5" opacity="0.15" />
                <path d="M32 36C32 33.8 33.8 32 36 32H44C46.2 32 48 33.8 48 36V44C48 46.2 46.2 48 44 48H36C33.8 48 32 46.2 32 44V36Z" stroke="currentColor" strokeWidth="1.5" />
                <path d="M38 38L42 42M42 38L38 42" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M28 28L34 34M52 52L46 46" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
                <path d="M52 28L46 34M28 52L34 46" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
              </svg>
            </div>
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

        <div className="mt-12 flex items-center gap-6 text-xs text-muted-foreground/60">
          <Link href="/" className="hover:text-brand-green transition-colors">Home</Link>
          <Link href="/categories" className="hover:text-brand-green transition-colors">Categories</Link>
          <Link href="/cart" className="hover:text-brand-green transition-colors">Cart</Link>
          <Link href="/contact" className="hover:text-brand-green transition-colors">Contact</Link>
        </div>
      </div>
    </div>
  )
}
