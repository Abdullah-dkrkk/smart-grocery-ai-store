"use client"

import { useRef, useMemo } from "react"
import Link from "next/link"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Truck, Tag, Package, RotateCcw, Sparkles } from "lucide-react"
import { AnnouncementBarWrapper } from "@/components/sections/announcement-bar-wrapper"
import { Header } from "@/components/sections/header"
import { CategoryShowcase } from "@/components/store/category-showcase"
import { BannerRow } from "@/components/sections/banner-row"
import { ProductSlider } from "@/components/store/product-slider"
import { DailyBestSells } from "@/components/sections/daily-best-sells"
import { DealsOfDay } from "@/components/sections/deals-of-day"
import { TestimonialSection } from "@/components/sections/testimonial-section"
import { NewsletterSection } from "@/components/sections/newsletter-section"
import { Footer } from "@/components/store/footer"
import { useCategories } from "@/lib/hooks/use-categories"
import { useProducts, useFeaturedProducts } from "@/lib/hooks/use-products"
import { useLeafParticle } from "@/lib/hooks/use-leaf-particle"
import {
  ProductSliderSkeleton,
  CategoryShowcaseSkeleton,
  DailyBestSellsSkeleton,
  DealsOfDaySkeleton,
} from "@/components/ui/skeleton"
import type { TestimonialItem } from "@/types/common"

const testimonials: TestimonialItem[] = [
  { id: 1, name: "James Dopli", rating: 5, text: "Thanks for all your efforts and teamwork over the last several months! The quality and freshness of the produce is unmatched. Highly recommend SmartGrocery for all your daily needs.", date: "2 weeks ago" },
  { id: 2, name: "Theodore Handle", rating: 3.5, text: "Very happy with our choice to shop here. The entire team was great! The delivery was on time and all items were packed with care.", date: "1 month ago" },
  { id: 3, name: "Shahnewaz Sakil", rating: 5, text: "Wedding day savior! 5 stars. Their organic collection is a game-changer. Made our celebration extra special with fresh ingredients delivered right to our door.", date: "3 weeks ago" },
  { id: 4, name: "Albert Flores", rating: 4, text: "The AI recommendations are spot on! I discovered so many new healthy products that I wouldn't have found otherwise. The subscription feature saves me so much time.", date: "1 week ago" },
  { id: 5, name: "Sarah Ahmed", rating: 4.5, text: "Great prices and even better quality. The loyalty program is fantastic and the staff is always helpful when I have questions about products.", date: "2 months ago" },
  { id: 6, name: "Emily Chen", rating: 5, text: "Finally a grocery delivery service that gets it right! Everything from the website UX to the packaging is thoughtful and well-executed.", date: "3 months ago" },
  { id: 7, name: "Michael Torres", rating: 4, text: "The same-day delivery is a lifesaver. I forgot about dinner plans and they had everything I needed at my door within hours. Incredible service.", date: "1 week ago" },
  { id: 8, name: "Aisha Patel", rating: 5, text: "As a nutritionist, I'm picky about ingredients. SmartGrocery's detailed product descriptions and origin info make my job so much easier. Love it!", date: "2 weeks ago" },
  { id: 9, name: "David Kim", rating: 4.5, text: "I've been a customer for 6 months and the consistent quality keeps me coming back. The produce is always fresh and the meat section is top-notch.", date: "1 month ago" },
  { id: 10, name: "Lisa Anderson", rating: 3.5, text: "Good selection and fair prices. The app could use some UI improvements but the core service works well. Customer support resolved my issue quickly.", date: "3 weeks ago" },
  { id: 11, name: "Omar Hassan", rating: 5, text: "The organic section is the best I've seen online. Fair prices, fast shipping, and the packaging is fully recyclable. This is the future of grocery shopping.", date: "5 days ago" },
  { id: 12, name: "Priya Sharma", rating: 4, text: "I love the weekly meal plans with auto-generated shopping lists. It's saved me hours every week and helped me eat healthier. Highly recommended!", date: "2 months ago" },
]

function ErrorSection({ message }: { message: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
      <p className="text-sm">{message}</p>
    </div>
  )
}

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const { data: categories = [], isLoading: catLoading, isError: catError } = useCategories()
  const { data: products = [], isLoading: prodLoading, isError: prodError } = useProducts()
  const { data: featuredProducts = [], isLoading: featLoading, isError: featError } = useFeaturedProducts()

  const bestSellerTabs = useMemo(() => {
    const prods = featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8)
    const counts: Record<string, { name: string; count: number }> = {}
    for (const p of prods) {
      if (p.category_slug) {
        const cat = p.category_slug
        if (!counts[cat]) counts[cat] = { name: p.category_name || cat, count: 0 }
        counts[cat].count++
      }
    }
    return [
      { slug: "all", name: "All" },
      ...Object.entries(counts)
        .filter(([_, d]) => d.count >= 2)
        .map(([slug, d]) => ({ slug, name: d.name })),
    ]
  }, [featuredProducts, products])

  const popularTabs = useMemo(() => {
    const counts: Record<string, { name: string; count: number }> = {}
    for (const p of products) {
      if (p.category_slug) {
        const cat = p.category_slug
        if (!counts[cat]) counts[cat] = { name: p.category_name || cat, count: 0 }
        counts[cat].count++
      }
    }
    return [
      { slug: "all", name: "All" },
      ...Object.entries(counts)
        .filter(([_, d]) => d.count >= 2)
        .map(([slug, d]) => ({ slug, name: d.name })),
    ]
  }, [products])

  useLeafParticle(canvasRef)

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBarWrapper />
      <Header categories={categories} />

      <main className="container mx-auto px-4 py-8 space-y-16">
        {/* Hero Banner with Leaf Drift animation */}
        <section ref={heroRef}
          className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-brand-green/20 via-emerald-50/50 to-brand-orange/10 dark:from-brand-green/10 dark:via-emerald-950/20 dark:to-brand-orange/10 min-h-[350px] md:min-h-[450px] flex items-center p-8 md:p-12"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, rgba(59,183,126,0.15) 0%, transparent 50%),
              radial-gradient(circle at 80% 50%, rgba(253,192,64,0.1) 0%, transparent 50%)`,
          }}>
          <canvas ref={canvasRef} className="absolute inset-0 block pointer-events-none" />
          <div className="max-w-lg relative z-10">
            <Badge className="bg-brand-orange text-white mb-4 text-xs px-3 py-1">Don&apos;t miss amazing grocery deals</Badge>
            <h1 className="text-4xl md:text-6xl font-heading font-bold tracking-tight leading-tight mb-4">
              Fresh Vegetables<br />Big Discounts
            </h1>
            <p className="text-muted-foreground mb-6 text-base">Save up to 50% on your first order</p>
            <div className="flex gap-2 max-w-[430px]">
              <Input placeholder="Your email address" className="h-12 bg-background text-base flex-1" />
              <Button className="bg-brand-green hover:bg-brand-green/90 text-white h-12 px-8 text-base font-semibold shrink-0">Subscribe</Button>
            </div>
          </div>
        </section>

        <Separator />

        {/* Featured Categories */}
        <section>
          {catLoading ? (
            <CategoryShowcaseSkeleton />
          ) : catError ? (
            <ErrorSection message="Failed to load categories" />
          ) : categories.length === 0 ? (
            <ErrorSection message="No categories available" />
          ) : (
            <CategoryShowcase
              title="Featured Categories"
              description="Browse our wide selection of fresh products"
              categories={categories}
            />
          )}
        </section>

        <Separator />

        {/* Banner Row */}
        <section>
          <BannerRow
            banners={[
              { title: "Everyday Fresh & Clean\nwith our Products", subtitle: "Fresh produce", buttonLabel: "Shop now", image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=200&h=200&fit=crop" },
              { title: "Make your Breakfast\nHealthy and Easy", subtitle: "Breakfast special", buttonLabel: "Shop now", image: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=200&h=200&fit=crop" },
              { title: "The best Organic\nProducts Online", subtitle: "Organic selection", buttonLabel: "Shop now", image: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?w=200&h=200&fit=crop" },
            ]}
          />
        </section>

        <Separator />

        {/* Best Sellers */}
        <section>
          {featLoading || prodLoading ? (
            <ProductSliderSkeleton />
          ) : featError ? (
            <ErrorSection message="Failed to load featured products" />
          ) : featuredProducts.length === 0 && products.length === 0 ? (
            <ErrorSection message="No products available" />
          ) : (
            <ProductSlider
              title="Best Sellers"
              description="Top rated products you cannot miss"
              products={featuredProducts.length > 0 ? featuredProducts : products.slice(0, 8)}
              tabs={bestSellerTabs}
            />
          )}
        </section>

        <Separator />

        {/* Popular Products */}
        <section>
          {prodLoading ? (
            <ProductSliderSkeleton />
          ) : prodError ? (
            <ErrorSection message="Failed to load products" />
          ) : products.length === 0 ? (
            <ErrorSection message="No products available" />
          ) : (
            <ProductSlider
              title="Popular Products"
              description="Most loved items by our customers"
              products={products}
              tabs={popularTabs}
            />
          )}
        </section>

        <Separator />

        {/* Daily Best Sells */}
        <section>
          {prodLoading ? (
            <DailyBestSellsSkeleton />
          ) : prodError || products.length === 0 ? null : (
            <DailyBestSells
              title="Daily Best Sells"
              subtitle="Check out our best deals today"
              bannerTitle="Bring nature into your home"
              bannerDescription="Save up to 65%"
              bannerButtonLabel="Shop Now"
              bannerImage="https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&h=300&fit=crop"
              products={products.slice(0, 3)}
              endDate={new Date(Date.now() + 86400000 * 2)}
            />
          )}
        </section>

        <Separator />

        {/* Deals Of The Day */}
        <section>
          {prodLoading ? (
            <DealsOfDaySkeleton />
          ) : prodError || products.length === 0 ? null : (
            <DealsOfDay
              title="Deals Of The Day"
              subtitle="Limited time offers — grab them before they're gone"
              products={products}
              endDate={new Date(Date.now() + 43200000)}
              featuredProduct={products.length > 12 ? products[12] : products[products.length - 1]}
            />
          )}
        </section>

        <Separator />

        {/* Special Offers */}
        <section>
          {prodLoading ? (
            <ProductSliderSkeleton />
          ) : prodError || products.length === 0 ? null : (
            <ProductSlider
              title="Special Offers"
              description="Great discounts on your favorite products"
              products={products.filter(p => p.compare_price && p.compare_price > p.price * 1.2)}
            />
          )}
        </section>

        <Separator />

        {/* Testimonials */}
        <section>
          <TestimonialSection
            title="What our Clients say"
            subtitle="Customers Review"
            testimonials={testimonials}
          />
        </section>

        <Separator />

        {/* Newsletter */}
        <section className="mb-5">
          <NewsletterSection
            title="Stay home & get your daily needs from our shop"
            description="Start Your Daily Shopping with Nest Mart"
          />
        </section>

        {/* AI Assistant CTA */}
        <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-green/20 via-emerald-50/30 to-brand-orange/10 dark:from-brand-green/10 dark:via-emerald-950/20 dark:to-brand-orange/5 p-8 md:p-12">
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="max-w-lg">
              <Badge className="bg-brand-orange text-white mb-4 text-xs px-3 py-1">New</Badge>
              <h2 className="text-2xl md:text-3xl font-heading font-semibold tracking-tight mb-2">
                Get Your Personalized Diet Plan
              </h2>
              <p className="text-muted-foreground text-sm md:text-base">
                Let our AI create a custom meal plan tailored to your health goals, preferences, and dietary needs. Start your journey to better eating today.
              </p>
            </div>
            <Link
              href="/dashboard?role=user&tab=AI+Assistant"
              className="inline-flex items-center justify-center rounded-lg bg-brand-green hover:bg-brand-green/90 text-white h-12 px-8 text-base font-semibold gap-2 shrink-0 transition-all"
            >
              <Sparkles className="h-5 w-5" />
              Try AI Assistant
            </Link>
          </div>
        </section>

        <Separator />

        {/* Features */}
        <section className="-mt-11">
          <div className="grid grid-cols-5 gap-5">
            {[
              { icon: ShoppingBag, title: "Best prices & offers", desc: "Orders $50 or more" },
              { icon: Truck, title: "Free delivery", desc: "24/7 amazing services" },
              { icon: Tag, title: "Great daily deal", desc: "When you sign up" },
              { icon: Package, title: "Wide assortment", desc: "Mega Discounts" },
              { icon: RotateCcw, title: "Easy returns", desc: "Within 30 days" },
            ].map((f, idx) => {
              const Icon = f.icon
              return (
                <div key={idx} className="flex flex-col items-center text-center bg-brand-green-light dark:bg-brand-green/10 border border-brand-green/10 rounded-xl py-6 px-3 transition-shadow hover:shadow-md">
                  <span className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-white dark:bg-brand-green/20 mb-3">
                    <Icon className="h-6 w-6 text-brand-green" />
                  </span>
                  <p className="text-sm font-semibold leading-tight">{f.title}</p>
                  <p className="text-xs text-muted-foreground mt-1">{f.desc}</p>
                </div>
              )
            })}
          </div>
        </section>
      </main>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  )
}
