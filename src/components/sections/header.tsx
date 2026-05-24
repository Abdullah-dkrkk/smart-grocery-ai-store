"use client"

import { useState } from "react"
import { Search, ShoppingCart, Heart, ChevronDown, Menu, X, Phone, Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { categorySvgs } from "@/components/sections/category-icons"
import type { ProductCategory } from "@/types/product"

const slugToSvgKey: Record<string, string> = {
  "milks-dairies": "milks",
  "milk-diaries": "milks",
  "wines-drinks": "wines",
  "clothing-beauty": "clothing",
  "pet-foods": "pet",
  "baking-material": "baking",
  "fresh-fruit": "fruit",
  "fruits": "fruit",
  "vegetables": "vegetables",
  "bread-juice": "bread",
  "fresh-seafood": "seafood",
  "fast-food": "cake",
  "cake-milk": "cake",
  "coffee-teas": "coffee",
  "cookies-teas": "coffee",
  "meat": "seafood",
  "breakfast": "baking",
}

function getSvgForSlug(slug: string): React.ReactNode | null {
  const key = slugToSvgKey[slug]
  return key ? categorySvgs[key] ?? null : null
}

interface HeaderProps {
  categories?: ProductCategory[]
  cartCount?: number
  wishlistCount?: number
}

export function Header({ categories = [], cartCount = 0, wishlistCount = 0 }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showMegaMenu, setShowMegaMenu] = useState(false)

  const displayCategories = categories.slice(0, 10)

  const megaMenuLinks = [
    {
      title: "Fruits & Vegetables",
      links: ["Meat & Poultry", "Fresh Vegetables", "Herbs & Seasoning", "Cuts & Sprouts", "Exotic Fruits & Veggies", "Package Produce"],
    },
    {
      title: "Breakfast & Dairy",
      links: ["Milk & Flavoured Milk", "Butter & Margarine", "Eggs Substitutes", "Marmalades", "Sour Cream", "Cheese"],
    },
    {
      title: "Meat & Seafood",
      links: ["Breakfast Sausage", "Dinner Sausage", "Chicken", "Sliced Daily Meat", "Wild Caught Fillets", "Crab & Shellfish"],
    },
  ]

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Products", href: "/products", hasMegaMenu: true },
    { label: "Categories", href: "/categories" },
    { label: "Contact", href: "/contact" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
  ]

  return (
    <header className="sticky top-0 z-50 bg-background border-b">
      {/* Top info bar */}
      <div className="hidden lg:flex border-b bg-muted/30">
        <div className="container mx-auto px-4 py-1.5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="text-[13px] text-muted-foreground">Need help? Call Us: <strong className="text-foreground text-base">1900 - 888</strong></span>
          </div>
          <div className="flex items-center gap-4 text-[13px] text-muted-foreground">
            <span className="flex items-center gap-1"><Bell className="h-3.5 w-3.5" /> EN | USD</span>
          </div>
        </div>
      </div>

      {/* Main navbar - Logo + Nav links centered + Right icons */}
      <div className="container mx-auto px-4 py-3 relative"
        onMouseLeave={() => setShowMegaMenu(false)}
      >
        <div className="flex items-center gap-4">
          <button className="lg:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)} aria-label="Toggle menu">
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          <a href="/" className="flex items-center gap-2 shrink-0">
            <span className="w-9 h-9 rounded-lg bg-brand-green flex items-center justify-center">
              <span className="text-white font-bold text-sm">SG</span>
            </span>
            <span className="font-heading font-semibold text-xl hidden sm:inline">SmartGrocery</span>
          </a>

          {/* Centered nav links */}
          <nav className="hidden lg:flex items-center justify-center flex-1 gap-1">
            {navLinks.map((link) => (
              <div
                key={link.label}
                className="relative"
                onMouseEnter={() => link.hasMegaMenu && setShowMegaMenu(true)}
              >
                <a
                  href={link.href}
                  className="px-3.5 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-brand-green-light dark:hover:bg-brand-green/20 transition-colors"
                >
                  {link.label}
                  {link.hasMegaMenu && <ChevronDown className="h-3.5 w-3.5 inline ml-1 opacity-60" />}
                </a>
              </div>
            ))}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-3 ml-auto">
            <a href="tel:1900888" className="hidden lg:flex items-center gap-2">
              <Phone className="h-6 w-6 text-brand-green" />
              <div className="leading-tight">
                <p className="text-[13px] text-muted-foreground">24/7 Support</p>
                <p className="font-semibold text-base">1900 - 888</p>
              </div>
            </a>

            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-brand-orange">
                  {wishlistCount}
                </Badge>
              )}
            </button>

            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-brand-green">
                  {cartCount}
                </Badge>
              )}
            </button>
          </div>

          {/* Mega Menu for Products - full width */}
          {showMegaMenu && (
            <div
              onMouseEnter={() => setShowMegaMenu(true)}
              className="absolute top-full left-1/2 -translate-x-1/2 mt-1 w-[1280px] bg-card border rounded-xl shadow-xl z-50 p-6 pb-8"
            >
              <div className="flex gap-8">
                <div className="flex-1 grid grid-cols-3 gap-8">
                  {megaMenuLinks.map((col) => (
                    <div key={col.title}>
                      <h5 className="text-sm font-semibold text-brand-green mb-3">{col.title}</h5>
                      <ul className="space-y-2">
                        {col.links.map((ln) => (
                          <li key={ln}>
                            <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">{ln}</a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
                <div className="w-96 shrink-0 bg-gradient-to-br from-brand-green/10 to-emerald-50 rounded-xl p-6 flex flex-col justify-center border relative overflow-hidden">
                  <div className="absolute inset-0 opacity-10">
                    <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400&h=500&fit=crop" alt="" className="h-full w-full object-cover" />
                  </div>
                  <div className="relative z-10">
                    <h4 className="text-lg font-heading font-bold text-brand-green mb-1">Hot Deals!</h4>
                    <p className="text-sm text-muted-foreground mb-1">Don&apos;t miss trending.</p>
                    <p className="text-sm text-muted-foreground mb-3">Save up to 50% off.</p>
                    <Button className="bg-brand-green hover:bg-brand-green/90 text-white text-xs h-9 w-fit">Shop Now</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Search bar row - Full width */}
      <div className="hidden lg:block border-t bg-muted/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Browse All Categories */}
            <div className="relative group shrink-0">
              <button className="flex items-center gap-2 bg-brand-green text-white px-5 py-3 rounded-lg text-sm font-semibold hover:bg-brand-green/90 transition-colors">
                Browse All Categories
                <ChevronDown className="h-4 w-4 transition-transform group-hover:rotate-180" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-[460px] bg-card border rounded-xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4">
                  {displayCategories.reduce((rows, cat, i) => {
                    if (i % 2 === 0) {
                      const pair = displayCategories.slice(i, i + 2)
                      rows.push(
                        <div key={i} className="flex gap-3 mb-3">
                          {pair.map((c) => (
                            <a key={c.id} href={`/category/${c.slug}`}
                              className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted transition-colors border">
                              <span className="text-brand-green shrink-0">{getSvgForSlug(c.slug)}</span>
                              <span className="text-[13px] text-muted-foreground">{c.name}</span>
                            </a>
                          ))}
                        </div>
                      )
                    }
                    return rows
                  }, [] as React.ReactNode[])}
                  {categories.length > 10 && (
                    <a href="/categories" className="flex items-center justify-center pt-3 border-t text-sm font-medium text-brand-green hover:text-brand-green/80 transition-colors mt-1">
                      Show more...
                    </a>
                  )}
                </div>
              </div>
            </div>

            {/* Full-width Search bar */}
            <div className="flex-1 relative">
              <Input
                type="search"
                placeholder="Search for products..."
                className="h-12 pr-12 border-brand-green/20 focus-visible:border-brand-green text-[15px]"
              />
              <Button size="icon" className="absolute right-0 top-0 h-12 w-12 bg-brand-green hover:bg-brand-green/90 text-white rounded-l-none">
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t bg-background">
          <div className="container mx-auto px-4 py-3 space-y-1">
            {navLinks.map((link) => (
              <a key={link.label} href={link.href}
                className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}>
                {link.label}
              </a>
            ))}
            <div className="border-t pt-3 mt-3">
              <Input type="search" placeholder="Search for products..." className="h-11" />
            </div>
            {displayCategories.map((cat) => (
              <a key={cat.id} href={`/category/${cat.slug}`}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors"
                onClick={() => setMobileMenuOpen(false)}>
                <span className="text-brand-green shrink-0">{getSvgForSlug(cat.slug)}</span>
                <span className="font-medium">{cat.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{cat.product_count}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  )
}
