"use client"

import { useState, use } from "react"
import { notFound } from "next/navigation"
import Link from "next/link"
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
import { Skeleton } from "@/components/ui/skeleton"
import { Footer } from "@/components/store/footer"
import { useProductBySlug, useProduct } from "@/lib/hooks/use-products"
import { useWishlist } from "@/lib/hooks/use-wishlist"
import { useToast } from "@/components/ui/toast"
import { useCartContext } from "@/lib/providers/cart-provider"
import { Heart, Share2, Truck, ShieldCheck, RotateCcw, Check, Loader2, Store } from "lucide-react"
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

interface ProductDetailPageProps {
  params: Promise<{ slug: string }>
}

function ProductDetailSkeleton() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <Skeleton className="h-5 w-64 mb-6" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <Skeleton className="aspect-square rounded-2xl" />
            <div className="flex gap-3">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="w-20 h-20 rounded-xl" />
              ))}
            </div>
          </div>
          <div className="space-y-6">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-48" />
            <Separator />
            <Skeleton className="h-10 w-32" />
            <Skeleton className="h-16 w-full" />
            <Separator />
            <div className="flex gap-4">
              <Skeleton className="h-12 w-28" />
              <Skeleton className="h-12 flex-1" />
              <Skeleton className="h-12 w-12 rounded-lg" />
              <Skeleton className="h-12 w-12 rounded-lg" />
            </div>
            <Skeleton className="h-5 w-40" />
            <Separator />
            <div className="grid grid-cols-3 gap-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-16 rounded-xl" />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { slug } = use(params)
  const { showToast } = useToast()
  const { isWishlisted, toggleWishlist, loadingId } = useWishlist()
  const { addItem } = useCartContext()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [activeTab, setActiveTab] = useState("description")

  const { data: listProduct, isLoading: listLoading, error } = useProductBySlug(slug)
  const productId = listProduct?.id ?? 0
  const { data: detailProduct, isLoading: detailLoading } = useProduct(productId)
  const isLoading = listLoading || (detailLoading && !!listProduct)

  const product = detailProduct ?? listProduct
  const images = product?.images?.length
    ? product.images
    : product?.image
      ? [product.image]
      : []
  const relatedProducts: Product[] = []
  const wishlisted = product ? isWishlisted(product.id) : false
  const loading = product ? loadingId === product.id : false

  const reviews = [
    { id: 1, name: "James D.", rating: 5, text: "Excellent quality! Fresh and delicious. Will buy again.", date: "2 weeks ago" },
    { id: 2, name: "Sarah M.", rating: 4, text: "Great product for the price. Packaging was secure.", date: "1 month ago" },
    { id: 3, name: "Ahmed K.", rating: 5, text: "Exactly as described. Highly recommend!", date: "3 weeks ago" },
  ]

  if (isLoading) return <ProductDetailSkeleton />
  if (!product || error) notFound()

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar announcements={announcements} interval={5000} />
      <Header categories={allCategories} cartCount={3} />

      <main className="container mx-auto px-4 py-8">
        <Breadcrumbs
          items={[
            { label: "Products", href: "/products" },
            { label: product.category_name || "Category", href: `/products?category=${product.category_slug}` },
            { label: product.name },
          ]}
          className="mb-6"
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          <div className="space-y-4">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-muted border">
              {loading && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/20 backdrop-blur-[1px]">
                  <Loader2 className="h-10 w-10 animate-spin text-white" />
                </div>
              )}
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              {product.badge && (
                <Badge className="absolute top-4 left-4 bg-brand-green text-white text-xs px-3 py-1">{product.badge}</Badge>
              )}
              <button
                type="button"
                className="absolute top-4 right-4 bg-background/80 hover:bg-background cursor-pointer flex items-center justify-center h-10 w-10 rounded-full outline-none focus:outline-none active:outline-none border-0"
                onClick={async () => {
                  await toggleWishlist(product)
                  showToast(wishlisted ? "Removed from Wishlist" : "Added to Wishlist!")
                }}
              >
                <Heart className={cn("h-5 w-5 transition-colors", wishlisted ? "fill-brand-green text-brand-green" : "")} />
              </button>
            </div>
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2 thin-scroll">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={cn(
                      "w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 transition-all cursor-pointer",
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

            {product.vendor && (
              <div className="flex items-center gap-3 bg-muted/30 rounded-xl p-3 border">
                <div className="h-10 w-10 rounded-full bg-brand-green/10 flex items-center justify-center">
                  <Store className="h-5 w-5 text-brand-green" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Sold by {product.vendor?.name || "Vendor"}</p>
                  <Link href={`/vendor/${product.vendor?.slug || product.vendor?.name?.toLowerCase().replace(/\s+/g, "-")}`} className="text-xs text-brand-green hover:underline">
                    Visit Store
                  </Link>
                </div>
              </div>
            )}

            <Separator />

            <div className="flex items-center gap-4 flex-wrap">
              <QuantitySelector value={quantity} min={1} max={product.stock} onChange={setQuantity} size="md" />
              <AddToCartButton product={product} quantity={quantity} size="lg" className="flex-1 min-w-[160px]" onAddToCart={(p, q) => { addItem(p, q); return true }} />
              <button
                type="button"
                className="h-12 w-12 cursor-pointer flex items-center justify-center rounded-lg border border-border bg-background hover:bg-muted transition-colors outline-none focus:outline-none active:outline-none"
                onClick={async () => {
                  await toggleWishlist(product)
                  showToast(wishlisted ? "Removed from Wishlist" : "Added to Wishlist!")
                }}
              >
                {loading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Heart className={cn("h-5 w-5 transition-colors", wishlisted ? "fill-brand-green text-brand-green" : "")} />
                )}
              </button>
              <Button variant="outline" size="icon" className="h-12 w-12 cursor-pointer"><Share2 className="h-5 w-5" /></Button>
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
