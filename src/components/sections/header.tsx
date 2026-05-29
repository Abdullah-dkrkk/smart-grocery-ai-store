"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Search, ShoppingCart, Heart, ChevronDown, Menu, X, Phone, Bell, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { getCategorySvg } from "@/components/sections/category-icons"
import { handleImgError } from "@/lib/utils/placeholder"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { useCartContext } from "@/lib/providers/cart-provider"
import type { ProductCategory } from "@/types/product"

interface HeaderProps {
  categories?: ProductCategory[]
  cartCount?: number
}

export function Header({ categories = [], cartCount: _cartCount = 0 }: HeaderProps) {
  const { data: session, status } = useSession()
  const { wishlistIds } = useWishlist()
  const { openDrawer, itemCount } = useCartContext()
  const wishlistCount = wishlistIds.length
  const displayCartCount = itemCount
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [showMegaMenu, setShowMegaMenu] = useState(false)
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false)
  const [isStuck, setIsStuck] = useState(false)
  const stickyRef = useRef<HTMLElement>(null)
  const megaMenuTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const el = stickyRef.current
    if (!el) return
    const handleScroll = () => {
      setIsStuck(el.getBoundingClientRect().top <= 0)
    }
    handleScroll()
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleProductsMouseEnter = () => {
    if (megaMenuTimer.current) clearTimeout(megaMenuTimer.current)
    setShowMegaMenu(true)
  }

  const handleProductsMouseLeave = () => {
    megaMenuTimer.current = setTimeout(() => {
      setShowMegaMenu(false)
    }, 100)
  }

  const handleMegaMenuMouseEnter = () => {
    if (megaMenuTimer.current) clearTimeout(megaMenuTimer.current)
    setShowMegaMenu(true)
  }

  const handleMegaMenuMouseLeave = () => {
    setShowMegaMenu(false)
  }

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

    { label: "Contact", href: "/contact" },
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
  ]

  return (
    <>
      {/* Top info bar - NOT sticky */}
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

      {/* Search bar row - Full width - NOT sticky */}
      <div className="hidden lg:block border-b bg-muted/20">
        <div className="container mx-auto px-4 py-3">
          <div className="flex items-center gap-3">
            {/* Browse All Categories */}
            <div className="relative shrink-0 pb-2"
              onMouseEnter={() => setShowCategoryDropdown(true)}
              onMouseLeave={() => setShowCategoryDropdown(false)}>
              <button className="flex items-center gap-2 bg-brand-green text-white px-5 py-2 rounded-lg text-base font-semibold hover:bg-brand-green/90 transition-colors relative top-[3px]">
                Browse All Categories
                <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${showCategoryDropdown ? "rotate-180" : ""}`} />
              </button>
              <div className={`absolute top-full left-0 w-[460px] bg-card border rounded-xl shadow-xl z-[60] transition-all duration-200 ${showCategoryDropdown ? "opacity-100 visible" : "opacity-0 invisible"}`}>
                <div className="p-4">
                  {displayCategories.reduce((rows, cat, i) => {
                    if (i % 2 === 0) {
                      const pair = displayCategories.slice(i, i + 2)
                      rows.push(
                        <div key={i} className="flex gap-3 mb-3">
                          {pair.map((c) => (
                            <a key={c.id} href={`/category/${c.slug}`}
                              className="flex-1 flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium hover:bg-muted transition-colors border">
                              {c.image ? (
                                <span className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                                  <img src={c.image} alt={c.name} className="w-full h-full object-cover" onError={handleImgError} />
                                </span>
                              ) : (
                                <span className="text-brand-green shrink-0">{getCategorySvg(c.slug)}</span>
                              )}
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

            {/* Search bar */}
            <div className="flex-1 relative">
              <Input
                type="search"
                placeholder="Search for products..."
                className="h-10 pr-10 border-brand-green/20 focus-visible:border-brand-green text-[15px] [&::-webkit-search-cancel-button]:hidden [&::-webkit-search-decoration]:hidden [&::-ms-clear]:hidden"
              />
              <Button size="icon" className="absolute right-0 top-0 h-10 w-10 bg-brand-green hover:bg-brand-green/90 text-white rounded-l-none">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            {/* Auth buttons */}
            <div className="flex items-center gap-2 shrink-0 ml-auto">
              {status === "loading" ? (
                <div className="flex items-center gap-2">
                  <div className="w-[76px] h-[36px] rounded-lg bg-muted animate-pulse" />
                  <div className="w-[82px] h-[36px] rounded-lg bg-muted animate-pulse" />
                </div>
              ) : session ? (
                <Link
                  href="/my-account"
                  className="flex items-center gap-2 bg-brand-green text-white px-5 py-2 rounded-lg text-base font-semibold hover:bg-brand-green/90 transition-colors"
                >
                  <User className="h-4 w-4" />
                  My Account
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="px-5 py-2 rounded-lg text-base font-semibold text-brand-green border border-brand-green hover:bg-brand-green hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="px-5 py-2 rounded-lg text-base font-semibold bg-brand-green text-white hover:bg-brand-green/90 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <header ref={stickyRef} className={`sticky top-0 z-50 transition-all duration-300 ${isStuck ? "bg-background/80 backdrop-blur-lg border-b shadow-sm" : "bg-background border-b"}`}>
        {/* Main navbar - Logo + Nav links + Right icons */}
      <div className="container mx-auto px-4 py-3 relative">
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

          {/* Nav links - left aligned with logo */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) =>
              link.hasMegaMenu ? (
                <div
                  key={link.label}
                  className="relative pb-6 top-[12px]"
                  onMouseEnter={handleProductsMouseEnter}
                  onMouseLeave={handleProductsMouseLeave}
                >
                  <a
                    href={link.href}
                    className="px-3.5 py-2 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-brand-green-light dark:hover:bg-brand-green/20 transition-colors"
                  >
                    {link.label}
                    <ChevronDown className="h-3.5 w-3.5 inline ml-1 opacity-60" />
                  </a>
                </div>
              ) : (
                <div key={link.label}>
                  <a
                    href={link.href}
                    className="px-3.5 py-2 rounded-lg text-base font-medium text-muted-foreground hover:text-foreground hover:bg-brand-green-light dark:hover:bg-brand-green/20 transition-colors"
                  >
                    {link.label}
                  </a>
                </div>
              )
            )}
          </nav>

          {/* Right icons */}
          <div className="flex items-center gap-3 ml-auto">
            {/* Sticky-only auth buttons */}
            <div className={`items-center gap-1.5 ${isStuck ? "flex" : "hidden"}`}>
              {status === "loading" ? (
                <>
                  <div className="w-[52px] h-[28px] rounded-lg bg-muted animate-pulse" />
                  <div className="w-[60px] h-[28px] rounded-lg bg-muted animate-pulse" />
                </>
              ) : session ? (
                <Link
                  href="/my-account"
                  className="flex items-center gap-1 rounded-lg bg-brand-green text-white px-2.5 py-1 text-[13px] font-semibold hover:bg-brand-green/90 transition-colors"
                >
                  <User className="h-3.5 w-3.5" />
                  Account
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-lg border border-brand-green/30 bg-brand-green-light dark:bg-brand-green/10 px-2.5 py-1 text-[13px] font-medium text-brand-green transition-all hover:bg-brand-green/15 dark:hover:bg-brand-green/20 hover:border-brand-green/50"
                  >
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="rounded-lg bg-brand-green text-white px-2.5 py-1 text-[13px] font-semibold hover:bg-brand-green/90 transition-colors"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>

            <a href="tel:1900888" className="hidden lg:flex items-center gap-2">
              <Phone className="h-6 w-6 text-brand-green" />
              <div className="leading-tight">
                <p className="text-[13px] text-muted-foreground">24/7 Support</p>
                <p className="font-semibold text-base">1900 - 888</p>
              </div>
            </a>

            {/* Sticky-only search icon */}
            <button className={`relative p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer ${isStuck ? "block" : "hidden"}`} aria-label="Search">
              <Search className="h-5 w-5" />
            </button>

            <Link href="/wishlist" className="relative p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer" aria-label="Wishlist">
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-brand-orange">
                  {wishlistCount}
                </Badge>
              )}
            </Link>

            <button onClick={openDrawer} className="relative p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer" aria-label="Cart">
              <ShoppingCart className="h-5 w-5" />
              {displayCartCount > 0 && (
                <Badge className="absolute -top-0.5 -right-0.5 h-4 w-4 p-0 flex items-center justify-center text-[9px] bg-brand-green">
                  {displayCartCount}
                </Badge>
              )}
            </button>
          </div>

          {/* Mega Menu for Products - full width */}
          {showMegaMenu && (
            <div
              onMouseEnter={handleMegaMenuMouseEnter}
              onMouseLeave={handleMegaMenuMouseLeave}
              className="absolute top-full left-1/2 -translate-x-1/2 w-[1280px] bg-card border rounded-xl shadow-xl z-50 p-6 pb-8"
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
                {cat.image ? (
                  <span className="w-7 h-7 rounded-full overflow-hidden shrink-0">
                    <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" onError={handleImgError} />
                  </span>
                ) : (
                  <span className="text-brand-green shrink-0">{getCategorySvg(cat.slug)}</span>
                )}
                <span className="font-medium">{cat.name}</span>
                <span className="ml-auto text-xs text-muted-foreground">{cat.product_count}</span>
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
    </>
  )
}
