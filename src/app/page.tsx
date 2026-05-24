"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShoppingBag, Truck, Tag, Package, RotateCcw } from "lucide-react"
import { AnnouncementBar } from "@/components/sections/announcement-bar"
import { Header } from "@/components/sections/header"
import { CategoryShowcase } from "@/components/store/category-showcase"
import { BannerRow } from "@/components/sections/banner-row"
import { ProductSlider } from "@/components/store/product-slider"
import { DailyBestSells } from "@/components/sections/daily-best-sells"
import { DealsOfDay } from "@/components/sections/deals-of-day"
import { TestimonialSection } from "@/components/sections/testimonial-section"
import { NewsletterSection } from "@/components/sections/newsletter-section"
import { Footer } from "@/components/store/footer"
import type { Product, ProductCategory } from "@/types/product"
import type { TestimonialItem } from "@/types/common"

const announcements = [
  { text: "Grand opening — up to 15% off all items. Only 3 days left!" },
  { text: "Free delivery on orders over $50 — shop now!" },
  { text: "Trendy 25 silver jewelry — save up to 35% off today!" },
]

const categories: ProductCategory[] = [
  { id: 1, name: "Milks & Dairies", slug: "milks-dairies", description: "", image: "", icon: "🥛", parent_id: null, product_count: 30 },
  { id: 2, name: "Wines & Drinks", slug: "wines-drinks", description: "", image: "", icon: "🍷", parent_id: null, product_count: 25 },
  { id: 3, name: "Clothing & Beauty", slug: "clothing-beauty", description: "", image: "", icon: "👗", parent_id: null, product_count: 45 },
  { id: 4, name: "Pet Foods & Toys", slug: "pet-foods", description: "", image: "", icon: "🐾", parent_id: null, product_count: 18 },
  { id: 5, name: "Baking Material", slug: "baking-material", description: "", image: "", icon: "🥖", parent_id: null, product_count: 35 },
  { id: 6, name: "Fresh Fruit", slug: "fresh-fruit", description: "", image: "", icon: "🍎", parent_id: null, product_count: 50 },
  { id: 7, name: "Vegetables", slug: "vegetables", description: "", image: "", icon: "🥦", parent_id: null, product_count: 65 },
  { id: 8, name: "Bread & Juice", slug: "bread-juice", description: "", image: "", icon: "🧃", parent_id: null, product_count: 28 },
  { id: 9, name: "Fresh Seafood", slug: "fresh-seafood", description: "", image: "", icon: "🐟", parent_id: null, product_count: 22 },
  { id: 10, name: "Fast Food", slug: "fast-food", description: "", image: "", icon: "🍟", parent_id: null, product_count: 40 },
  { id: 11, name: "Cake & Milk", slug: "cake-milk", description: "", image: "", icon: "🎂", parent_id: null, product_count: 15 },
  { id: 12, name: "Coffee & Teas", slug: "coffee-teas", description: "", image: "", icon: "☕", parent_id: null, product_count: 33 },
]

const baseProduct = {
  description: "", short_description: "", cost_per_unit: null,
  images: [], category_id: 1, is_featured: true, is_on_sale: true,
  stock: 50, unit: "each", weight: null, tags: [] as string[],
  created_at: "2025-01-01",
}

const products: Product[] = [
  { ...baseProduct, id: 1, name: "Seeds of Change Organic Quinoa", slug: "organic-quinoa", price: 28.85, compare_price: 32.8, image: "https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?w=400&h=500&fit=crop", category_name: "Milk & Diaries", category_slug: "milk-diaries", rating: 4, review_count: 45, badge: "Hot", badges: ["Hot"] },
  { ...baseProduct, id: 2, name: "All Natural Italian-Style Chicken Meatballs", slug: "chicken-meatballs", price: 28.85, compare_price: 32.8, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=500&fit=crop", category_name: "Milk & Diaries", category_slug: "milk-diaries", rating: 5, review_count: 32, badge: "Sale", badges: ["Sale"] },
  { ...baseProduct, id: 3, name: "Foster Farms Takeout Crispy Classic Buffalo Wings", slug: "buffalo-wings", price: 28.85, compare_price: null, image: "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=400&h=500&fit=crop", category_name: "Cookies & Teas", category_slug: "cookies-teas", rating: 4.5, review_count: 78, badge: "New", badges: ["New"] },
  { ...baseProduct, id: 4, name: "Blue Diamond Almonds Lightly Salted", slug: "blue-diamond-almonds", price: 24.99, compare_price: 34.99, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=500&fit=crop", category_name: "Cookies & Teas", category_slug: "cookies-teas", rating: 4, review_count: 120, badge: "Hot", badges: ["Hot"] },
  { ...baseProduct, id: 5, name: "Angie's Boomchickapop Sweet & Salty Kettle Corn", slug: "kettle-corn", price: 4.32, compare_price: 6.99, image: "https://images.unsplash.com/photo-1495147466023-ac5c588e2e94?w=400&h=500&fit=crop", category_name: "Pet Foods", category_slug: "pet-foods", rating: 4.5, review_count: 210, badge: "", badges: [] },
  { ...baseProduct, id: 6, name: "Fresh Organic Strawberries Premium Pack", slug: "organic-strawberries", price: 5.99, compare_price: 8.99, image: "https://images.unsplash.com/photo-1464965911861-746a04b4bca6?w=400&h=500&fit=crop", category_name: "Pet Foods", category_slug: "pet-foods", rating: 4.8, review_count: 340, badge: "Fresh", badges: ["Fresh"] },
  { ...baseProduct, id: 7, name: "Artisan Sourdough Bread Fresh Baked Daily", slug: "sourdough-bread", price: 6.99, compare_price: 9.99, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=500&fit=crop", category_name: "Meat", category_slug: "meat", rating: 4.7, review_count: 89, badge: "Bakery", badges: ["Bakery"] },
  { ...baseProduct, id: 8, name: "Organic Cold Pressed Green Juice Detox Blend", slug: "green-juice", price: 7.49, compare_price: null, image: "https://images.unsplash.com/photo-1610970881699-44a5587cabec?w=400&h=500&fit=crop", category_name: "Meat", category_slug: "meat", rating: 4.6, review_count: 55, badge: "Organic", badges: ["Organic"] },
  { ...baseProduct, id: 9, name: "Belgian Dark Chocolate 72% Cocoa Premium Bar", slug: "dark-chocolate", price: 4.49, compare_price: 5.99, image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=500&fit=crop", category_name: "Vegetables", category_slug: "vegetables", rating: 4.9, review_count: 188, badge: "Vegan", badges: ["Vegan"] },
  { ...baseProduct, id: 10, name: "Creamy Greek Yogurt Plain 32oz Family Size", slug: "greek-yogurt", price: 5.29, compare_price: 7.49, image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=500&fit=crop", category_name: "Vegetables", category_slug: "vegetables", rating: 4.3, review_count: 167, badge: "Sale", badges: ["Sale"] },
  { ...baseProduct, id: 11, name: "Organic Fuji Apples Sweet & Crispy 3lb Bag", slug: "fuji-apples", price: 3.99, compare_price: 5.49, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=500&fit=crop", category_name: "Fruits", category_slug: "fruits", rating: 4.7, review_count: 203, badge: "Fresh", badges: ["Fresh"] },
  { ...baseProduct, id: 12, name: "Free Range Large Eggs Farm Fresh Dozen", slug: "free-range-eggs", price: 6.99, compare_price: 8.99, image: "https://images.unsplash.com/photo-1587486913049-53fc88980cfc?w=400&h=500&fit=crop", category_name: "Fruits", category_slug: "fruits", rating: 4.8, review_count: 298, badge: "", badges: [] },
  { ...baseProduct, id: 13, name: "Chen Watermelon Fresh & Sweet", slug: "chen-watermelon", price: 69.93, compare_price: 942.00, image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=500&fit=crop", category_name: "Fruits", category_slug: "fruits", rating: 4.2, review_count: 67, badge: "Sale", badges: ["Sale"] },
  { ...baseProduct, id: 14, name: "Encore Seafoods Stuffed Alaskan Salmon", slug: "stuffed-alaskan", price: 1065, compare_price: null, image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=400&h=500&fit=crop", category_name: "Fresh Seafood", category_slug: "fresh-seafood", rating: 4.6, review_count: 43, badge: "", badges: [] },
  { ...baseProduct, id: 15, name: "Diet Foods Blue Diamond Almonds", slug: "diet-almonds", price: 282.00, compare_price: 807.00, image: "https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=400&h=500&fit=crop", category_name: "Pet Foods", category_slug: "pet-foods", rating: 4.4, review_count: 92, badge: "Hot", badges: ["Hot"] },
  { ...baseProduct, id: 16, name: "Pet Foods Seeds of Change Organic Rice", slug: "organic-rice", price: 243.84, compare_price: 508.00, image: "https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?w=400&h=500&fit=crop", category_name: "Pet Foods", category_slug: "pet-foods", rating: 4.1, review_count: 55, badge: "Sale", badges: ["Sale"] },
]

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

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = heroRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    interface Leaf {
      x: number; y: number; vx: number; vy: number
      size: number; rotation: number; rotSpeed: number
      color: string; alpha: number; sway: number; swaySpeed: number
    }

    let animId: number
    let leaves: Leaf[] = []
    let mouseX = -9999, mouseY = -9999, mouseActive = false

    function resize() {
      if (!container || !canvas || !ctx) return
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.scale(dpr, dpr)
      init(rect.width, rect.height)
    }

    function init(w: number, h: number) {
      leaves = []
      for (let i = 0; i < 120; i++) {
        leaves.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3, vy: Math.random() * 0.6 + 0.2,
          size: Math.random() * 24 + 8,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.025,
          color: [
            `hsla(${90 + Math.random() * 40}, ${60 + Math.random() * 20}%, ${28 + Math.random() * 20}%, 0.5)`,
            `hsla(${110 + Math.random() * 30}, ${55 + Math.random() * 25}%, ${22 + Math.random() * 18}%, 0.45)`,
            `hsla(${80 + Math.random() * 30}, ${65 + Math.random() * 15}%, ${18 + Math.random() * 15}%, 0.5)`,
            `hsla(${140 + Math.random() * 30}, ${50 + Math.random() * 25}%, ${15 + Math.random() * 15}%, 0.4)`,
            `hsla(${30 + Math.random() * 20}, ${55 + Math.random() * 25}%, ${20 + Math.random() * 12}%, 0.45)`,
            `hsla(${160 + Math.random() * 20}, ${45 + Math.random() * 20}%, ${12 + Math.random() * 12}%, 0.4)`,
            `hsla(${100 + Math.random() * 20}, ${50 + Math.random() * 20}%, ${16 + Math.random() * 10}%, 0.45)`,
            `hsla(${120 + Math.random() * 20}, ${40 + Math.random() * 20}%, ${10 + Math.random() * 10}%, 0.35)`,
          ][i % 8],
          alpha: Math.random() * 0.35 + 0.15, sway: 0, swaySpeed: Math.random() * 0.02 + 0.008,
        })
      }
    }

    function drawLeaf(c: CanvasRenderingContext2D, l: Leaf) {
      l.sway += l.swaySpeed
      l.x += l.vx + Math.sin(l.sway) * 0.5
      l.y += l.vy
      l.rotation += l.rotSpeed

      if (mouseActive) {
        const dx = l.x - mouseX; const dy = l.y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 200 && dist > 0) {
          const force = (1 - dist / 200) * 0.5
          l.vx += (dx / dist) * force * 0.3
          l.vy += (dy / dist) * force * 0.15
        }
        l.vx *= 0.94
        l.vy *= 0.94
      } else {
        l.vx *= 0.92
        l.vy *= 0.92
      }
      if (!container) return
      const rect = container.getBoundingClientRect()
      if (l.y > rect.height + 40) { l.y = -30; l.x = Math.random() * rect.width; l.vy = Math.random() * 0.6 + 0.2 }
      if (l.x < -50) l.x = rect.width + 30
      if (l.x > rect.width + 50) l.x = -30

      c.save(); c.translate(l.x, l.y); c.rotate(l.rotation); c.globalAlpha = l.alpha
      c.beginPath(); c.moveTo(0, 0)
      c.quadraticCurveTo(l.size * 0.5, -l.size * 0.4, l.size * 0.85, 0)
      c.quadraticCurveTo(l.size * 0.5, l.size * 0.4, 0, 0)
      c.closePath(); c.fillStyle = l.color; c.fill()
      c.globalAlpha = 1; c.restore()
    }

    function draw() {
      if (!ctx || !container) return
      const rect = container.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)
      for (const l of leaves) drawLeaf(ctx, l)
      animId = requestAnimationFrame(draw)
    }

    function onMove(clientX: number, clientY: number) {
      if (!container) return; const rect = container.getBoundingClientRect()
      mouseX = clientX - rect.left; mouseY = clientY - rect.top; mouseActive = true
    }
    function onMouseMove(e: MouseEvent) { onMove(e.clientX, e.clientY) }
    function onTouchMove(e: TouchEvent) { const t = e.touches[0]; onMove(t.clientX, t.clientY) }
    function onLeave() { mouseActive = false; mouseX = -9999; mouseY = -9999 }

    resize(); draw()
    window.addEventListener("resize", resize)
    container.addEventListener("mousemove", onMouseMove)
    container.addEventListener("mouseleave", onLeave)
    container.addEventListener("touchmove", onTouchMove, { passive: false })
    container.addEventListener("touchend", onLeave)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
      container.removeEventListener("mousemove", onMouseMove)
      container.removeEventListener("mouseleave", onLeave)
      container.removeEventListener("touchmove", onTouchMove)
      container.removeEventListener("touchend", onLeave)
    }
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar announcements={announcements} interval={5000} />
      <Header categories={categories} cartCount={3} wishlistCount={1} />

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
          <CategoryShowcase
            title="Featured Categories"
            description="Browse our wide selection of fresh products"
            categories={categories}
          />
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
          <ProductSlider
            title="Best Sellers"
            description="Top rated products you cannot miss"
            products={products.filter(p => p.rating >= 4.5)}
            tabs={[
              { slug: "all", name: "All" },
              { slug: "fruits", name: "Fruits" },
              { slug: "vegetables", name: "Vegetables" },
              { slug: "meat", name: "Meat" },
              { slug: "pet-foods", name: "Pet Foods" },
            ]}
          />
        </section>

        <Separator />

        {/* Popular Products */}
        <section>
          <ProductSlider
            title="Popular Products"
            description="Most loved items by our customers"
            products={products}
            tabs={[
              { slug: "all", name: "All" },
              { slug: "milk-diaries", name: "Milk" },
              { slug: "cookies-teas", name: "Coffee & Teas" },
              { slug: "pet-foods", name: "Pet Foods" },
              { slug: "meat", name: "Meat" },
              { slug: "vegetables", name: "Vegetables" },
              { slug: "fruits", name: "Fruits" },
            ]}
          />
        </section>

        <Separator />

        {/* Daily Best Sells */}
        <section>
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
        </section>

        <Separator />

        {/* Deals Of The Day */}
        <section>
          <DealsOfDay
            title="Deals Of The Day"
            subtitle="Limited time offers — grab them before they're gone"
            products={products}
            endDate={new Date(Date.now() + 43200000)}
            featuredProduct={products[12]}
          />
        </section>

        <Separator />

        {/* Special Offers */}
        <section>
          <ProductSlider
            title="Special Offers"
            description="Great discounts on your favorite products"
            products={products.filter(p => p.compare_price && p.compare_price > p.price * 1.2)}
          />
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
        <section>
          <NewsletterSection
            title="Stay home & get your daily needs from our shop"
            description="Start Your Daily Shopping with Nest Mart"
          />
        </section>

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
