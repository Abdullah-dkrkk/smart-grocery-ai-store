"use client"

import { useState, useMemo, use } from "react"
import { notFound } from "next/navigation"
import { AnnouncementBar } from "@/components/sections/announcement-bar"
import { Header } from "@/components/sections/header"
import { Breadcrumbs } from "@/components/common/breadcrumbs"
import { PriceDisplay } from "@/components/common/price-display"
import { StarRating } from "@/components/common/star-rating"
import { QuantitySelector } from "@/components/common/quantity-selector"
import { AddToCartButton } from "@/components/store/add-to-cart-button"
import { ProductSlider } from "@/components/store/product-slider"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Footer } from "@/components/store/footer"
import { Heart, Share2, Truck, ShieldCheck, RotateCcw, Check } from "lucide-react"
import { cn } from "@/lib/utils"
import type { Product, ProductCategory } from "@/types/product"

const announcements = [
  { text: "Grand opening — up to 15% off all items. Only 3 days left!" },
  { text: "Free delivery on orders over $50 — shop now!" },
  { text: "Trendy 25 silver jewelry — save up to 35% off today!" },
]

const allCategories: ProductCategory[] = [
  { id: 1, name: "Milks & Dairies", slug: "milks-dairies", description: "", image: "", icon: "", parent_id: null, product_count: 30 },
  { id: 2, name: "Wines & Drinks", slug: "wines-drinks", description: "", image: "", icon: "", parent_id: null, product_count: 25 },
  { id: 3, name: "Clothing & Beauty", slug: "clothing-beauty", description: "", image: "", icon: "", parent_id: null, product_count: 45 },
  { id: 4, name: "Pet Foods & Toys", slug: "pet-foods", description: "", image: "", icon: "", parent_id: null, product_count: 18 },
  { id: 5, name: "Baking Material", slug: "baking-material", description: "", image: "", icon: "", parent_id: null, product_count: 35 },
  { id: 6, name: "Fresh Fruit", slug: "fresh-fruit", description: "", image: "", icon: "", parent_id: null, product_count: 50 },
  { id: 7, name: "Vegetables", slug: "vegetables", description: "", image: "", icon: "", parent_id: null, product_count: 65 },
  { id: 8, name: "Bread & Juice", slug: "bread-juice", description: "", image: "", icon: "", parent_id: null, product_count: 28 },
  { id: 9, name: "Fresh Seafood", slug: "fresh-seafood", description: "", image: "", icon: "", parent_id: null, product_count: 22 },
  { id: 10, name: "Fast Food", slug: "fast-food", description: "", image: "", icon: "", parent_id: null, product_count: 40 },
  { id: 11, name: "Cake & Milk", slug: "cake-milk", description: "", image: "", icon: "", parent_id: null, product_count: 15 },
  { id: 12, name: "Coffee & Teas", slug: "coffee-teas", description: "", image: "", icon: "", parent_id: null, product_count: 33 },
]

const baseProduct = {
  description: "Premium quality product carefully sourced from trusted suppliers. Packed with essential nutrients and rich flavor, this product is perfect for your daily needs. Whether you're cooking a gourmet meal or enjoying a quick snack, our products deliver unmatched freshness and taste.",
  short_description: "Carefully sourced premium quality product from trusted suppliers.",
  cost_per_unit: null, images: [], category_id: 1,
  is_featured: true, is_on_sale: true,
  stock: 50, unit: "each", weight: null, tags: [] as string[],
  created_at: "2025-01-01",
}

const allProducts: Product[] = [
  { ...baseProduct, id: 1, name: "Seeds of Change Organic Quinoa", slug: "organic-quinoa", price: 28.85, compare_price: 32.8, image: "https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?w=400&h=500&fit=crop", category_name: "Milk & Diaries", category_slug: "milk-diaries", rating: 4, review_count: 45, badge: "Hot", badges: ["Hot"], images: [
    "https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1506803682981-6e718a9dd3ee?w=600&h=600&fit=crop&q=80",
  ] },
  { ...baseProduct, id: 2, name: "All Natural Italian-Style Chicken Meatballs", slug: "chicken-meatballs", price: 28.85, compare_price: 32.8, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=400&h=500&fit=crop", category_name: "Milk & Diaries", category_slug: "milk-diaries", rating: 5, review_count: 32, badge: "Sale", badges: ["Sale"], images: [
    "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&h=600&fit=crop",
    "https://images.unsplash.com/photo-1567620832903-9fc6debc209f?w=600&h=600&fit=crop",
  ] },
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

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = use(params)
  const product = allProducts.find((p) => p.slug === slug)
  if (!product) notFound()

  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [activeTab, setActiveTab] = useState("description")

  const images = product.images.length > 0
    ? product.images
    : [product.image]

  const relatedProducts = useMemo(
    () => allProducts
      .filter((p) => p.slug !== product.slug && p.category_slug === product.category_slug)
      .slice(0, 8),
    [product.slug, product.category_slug]
  )

  const reviews = [
    { id: 1, name: "James D.", rating: 5, text: "Excellent quality! Fresh and delicious. Will buy again.", date: "2 weeks ago" },
    { id: 2, name: "Sarah M.", rating: 4, text: "Great product for the price. Packaging was secure.", date: "1 month ago" },
    { id: 3, name: "Ahmed K.", rating: 5, text: "Exactly as described. Highly recommend!", date: "3 weeks ago" },
  ]

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar announcements={announcements} interval={5000} />
      <Header categories={allCategories} cartCount={3} wishlistCount={1} />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: "Products", href: "/products" },
            { label: product.category_name, href: `/products?category=${product.category_slug}` },
            { label: product.name },
          ]}
          className="mb-6"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border">
              <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
              {product.badge && (
                <Badge className="absolute top-4 left-4 bg-brand-green text-white text-xs px-3 py-1">{product.badge}</Badge>
              )}
              <Button variant="ghost" size="icon" className="absolute top-4 right-4 bg-background/80 hover:bg-background" onClick={() => setIsWishlisted(!isWishlisted)}>
                <Heart className={cn("h-5 w-5", isWishlisted ? "fill-red-500 text-red-500" : "")} />
              </Button>
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 thin-scroll">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all",
                      selectedImage === i ? "border-brand-green ring-1 ring-brand-green/30" : "border-transparent hover:border-muted-foreground/30"
                    )}
                  >
                    <img src={img} alt={`${product.name} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              {product.badges.length > 0 && (
                <div className="flex gap-2">
                  {product.badges.map((b) => (<Badge key={b} variant="secondary" className="text-xs">{b}</Badge>))}
                </div>
              )}
              <h1 className="text-2xl md:text-3xl font-heading font-bold leading-tight">{product.name}</h1>
              <div className="flex items-center gap-3 flex-wrap">
                <StarRating rating={product.rating} showValue reviewCount={product.review_count} size="md" />
              </div>
            </div>

            <Separator />

            <PriceDisplay price={product.price} comparePrice={product.compare_price} size="lg" unit={product.unit} />

            <p className="text-muted-foreground text-sm leading-relaxed">{product.short_description || product.description}</p>

            <Separator />

            <div className="flex items-center gap-4 flex-wrap">
              <QuantitySelector value={quantity} min={1} max={product.stock} onChange={setQuantity} size="md" />
              <AddToCartButton product={product} quantity={quantity} size="lg" className="flex-1 min-w-[160px]" />
              <Button variant="outline" size="icon" className="h-12 w-12" onClick={() => setIsWishlisted(!isWishlisted)}>
                <Heart className={cn("h-5 w-5", isWishlisted ? "fill-red-500 text-red-500" : "")} />
              </Button>
              <Button variant="outline" size="icon" className="h-12 w-12"><Share2 className="h-5 w-5" /></Button>
            </div>

            <p className={`text-sm flex items-center gap-2 ${product.stock > 0 ? "text-brand-green" : "text-destructive"}`}>
              <span className={cn("w-2 h-2 rounded-full inline-block", product.stock > 0 ? "bg-brand-green" : "bg-destructive")} />
              {product.stock > 0 ? `In Stock (${product.stock} available)` : "Out of Stock"}
            </p>

            <Separator />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-3">
                <Truck className="h-5 w-5 text-brand-green shrink-0" />
                <div><p className="text-xs font-medium">Free Delivery</p><p className="text-[11px] text-muted-foreground">Orders over $50</p></div>
              </div>
              <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-3">
                <ShieldCheck className="h-5 w-5 text-brand-green shrink-0" />
                <div><p className="text-xs font-medium">Secure Payment</p><p className="text-[11px] text-muted-foreground">100% protected</p></div>
              </div>
              <div className="flex items-center gap-3 bg-muted/50 rounded-xl p-3">
                <RotateCcw className="h-5 w-5 text-brand-green shrink-0" />
                <div><p className="text-xs font-medium">30-Day Returns</p><p className="text-[11px] text-muted-foreground">Easy returns</p></div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="w-full justify-start border-b rounded-none bg-transparent h-auto p-0 gap-0">
              {["description", "reviews", "shipping"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-none border-b-2 border-transparent data-[state=active]:border-brand-green data-[state=active]:text-brand-green bg-transparent px-6 py-3 text-sm font-medium capitalize"
                >
                  {tab === "shipping" ? "Shipping & Returns" : tab}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="description" className="pt-6">
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <p className="text-muted-foreground leading-relaxed">{product.description}</p>
                <h4 className="text-base font-semibold mt-6 mb-3">Key Features</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-brand-green mt-0.5 shrink-0" /> Premium quality sourced from trusted suppliers</li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-brand-green mt-0.5 shrink-0" /> Freshness guaranteed with fast delivery</li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-brand-green mt-0.5 shrink-0" /> Packed with essential nutrients and rich flavor</li>
                  <li className="flex items-start gap-2"><Check className="h-4 w-4 text-brand-green mt-0.5 shrink-0" /> Perfect for daily meals and special occasions</li>
                </ul>
              </div>
            </TabsContent>

            <TabsContent value="reviews" className="pt-6">
              <div className="space-y-6">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-5 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-sm">{review.name}</span>
                      <span className="text-xs text-muted-foreground">{review.date}</span>
                    </div>
                    <StarRating rating={review.rating} size="sm" className="mb-2" />
                    <p className="text-sm text-muted-foreground">{review.text}</p>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="shipping" className="pt-6">
              <div className="space-y-4 text-sm text-muted-foreground">
                <div className="flex gap-4 p-4 bg-muted/50 rounded-xl">
                  <Truck className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground mb-1">Free Delivery</p>
                    <p>Free standard delivery on all orders over $50. Express delivery available for an additional fee. Estimated delivery time: 2-5 business days.</p>
                  </div>
                </div>
                <div className="flex gap-4 p-4 bg-muted/50 rounded-xl">
                  <RotateCcw className="h-5 w-5 text-brand-green shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground mb-1">30-Day Return Policy</p>
                    <p>Not satisfied? Return your purchase within 30 days for a full refund. Items must be unopened and in original packaging. Contact our support team to initiate a return.</p>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <ProductSlider title="Related Products" description="You might also like" products={relatedProducts} />
          </div>
        )}
      </main>

      <div className="mt-16">
        <Footer />
      </div>
    </div>
  )
}
