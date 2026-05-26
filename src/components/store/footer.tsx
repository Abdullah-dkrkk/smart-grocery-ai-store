import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { Leaf, Globe, MessageCircle, Camera, Play, MapPin, Phone, Mail, Clock } from "lucide-react"

interface FooterColumn {
  title: string
  links: { label: string; href: string }[]
}

interface FooterProps {
  className?: string
}

const companyLinks: FooterColumn[] = [
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Delivery Information", href: "/delivery" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms & Conditions", href: "/terms" },
      { label: "Contact Us", href: "/contact" },
      { label: "Support Center", href: "/support" },
      { label: "Careers", href: "/careers" },
    ],
  },
  {
    title: "Account",
    links: [
      { label: "Sign In", href: "/login" },
      { label: "View Cart", href: "/cart" },
      { label: "My Wishlist", href: "/wishlist" },
      { label: "Track My Order", href: "/track-order" },
      { label: "Help Ticket", href: "/help" },
      { label: "Shipping Deals", href: "/shipping" },
      { label: "Compare Products", href: "/compare" },
    ],
  },
  {
    title: "Corporate",
    links: [
      { label: "Become a Vendor", href: "/vendor/register" },
      { label: "Affiliate Program", href: "/affiliate" },
      { label: "Farm Business", href: "/farm-business" },
      { label: "Farm Careers", href: "/farm-careers" },
      { label: "Our Suppliers", href: "/suppliers" },
      { label: "Accessibility", href: "/accessibility" },
      { label: "Promotions", href: "/promotions" },
    ],
  },
  {
    title: "Popular",
    links: [
      { label: "Milk & Flavoured Milk", href: "/categories/milk" },
      { label: "Butter & Margarine", href: "/categories/butter" },
      { label: "Eggs Substitutes", href: "/categories/eggs" },
      { label: "Marmalades", href: "/categories/marmalades" },
      { label: "Sour Cream & Dips", href: "/categories/cream" },
      { label: "Tea & Kombucha", href: "/categories/tea" },
      { label: "Cheese", href: "/categories/cheese" },
    ],
  },
]

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn("border-t bg-muted/50", className)}>
      <div className="container mx-auto px-4 py-12 md:py-16">
        {/* Top section: Brand info + columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="w-9 h-9 rounded-lg bg-brand-green flex items-center justify-center">
                <Leaf className="h-5 w-5 text-white" />
              </span>
              <span className="text-xl font-heading font-bold text-brand-green">SmartGrocery</span>
            </Link>
            <p className="text-base text-muted-foreground leading-relaxed mb-5 max-w-xs">
              Awesome grocery store website template. AI-powered shopping, fresh organic products delivered fast.
            </p>

            <div className="space-y-3 text-[15px]">
              <div className="flex items-start gap-3">
                <MapPin className="h-4 w-4 text-brand-green mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Address:</strong> 5171 W Campbell Ave, Kent, Utah 53127
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="h-4 w-4 text-brand-green mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Call Us:</strong> (+91) - 540-025-124553
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="h-4 w-4 text-brand-green mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Email:</strong> sale@smartgrocery.com
                </span>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="h-4 w-4 text-brand-green mt-0.5 shrink-0" />
                <span className="text-muted-foreground">
                  <strong className="text-foreground">Hours:</strong> 10:00 - 18:00, Mon - Sat
                </span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {companyLinks.map((col) => (
            <div key={col.title}>
              <h4 className="text-[17px] font-semibold mb-4">{col.title}</h4>
              <ul className="space-y-2.5">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* App + Payment */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mt-10 pt-8 border-t">
          <div>
            <h5 className="text-[15px] font-semibold mb-3">Install App</h5>
            <div className="flex gap-3">
              <div className="h-11 w-36 rounded-lg bg-foreground/5 border flex items-center justify-center text-xs text-muted-foreground">
                App Store
              </div>
              <div className="h-11 w-36 rounded-lg bg-foreground/5 border flex items-center justify-center text-xs text-muted-foreground">
                Google Play
              </div>
            </div>
          </div>
          <div>
            <h5 className="text-[15px] font-semibold mb-3">Secure Payment Gateways</h5>
            <div className="flex gap-2">
              {["Visa", "MC", "PayPal", "Stripe"].map((pm) => (
                <span key={pm} className="h-9 px-4 rounded bg-foreground/5 border flex items-center text-xs font-medium text-muted-foreground">
                  {pm}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t bg-background">
        <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-[13px] text-muted-foreground">
            &copy; {currentYear} SmartGrocery. All rights reserved. Powered by Next.js
          </p>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {[Globe, MessageCircle, Camera, Play].map((Icon, i) => (
                <Link
                  key={i}
                  href="#"
                  className="h-7 w-7 rounded-full bg-muted flex items-center justify-center text-muted-foreground hover:text-brand-green hover:bg-brand-green/10 transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
            <Separator orientation="vertical" className="h-5" />
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4 text-brand-green" />
              <div className="leading-tight">
                <p className="text-[13px] text-muted-foreground">24/7 Support</p>
                <p className="font-semibold text-foreground text-[15px]">1900 - 888</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
