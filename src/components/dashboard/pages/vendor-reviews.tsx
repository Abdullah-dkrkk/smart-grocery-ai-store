"use client"

import { useEffect, useState } from "react"
import { Star, AlertCircle, MessageSquare } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/common/star-rating"

interface VendorReview {
  id: number
  customer: string
  product: string
  rating: number
  comment: string
  date: string
  replied: boolean
}

const mockReviews: VendorReview[] = [
  { id: 1, customer: "Alice J.", product: "Organic Fresh Apples", rating: 5, comment: "Best apples I've ever bought! Very fresh and sweet.", date: "2026-06-05", replied: true },
  { id: 2, customer: "Bob K.", product: "Whole Wheat Bread", rating: 4, comment: "Good quality bread, stays fresh for days.", date: "2026-06-03", replied: false },
  { id: 3, customer: "Carol M.", product: "Free Range Eggs (12pk)", rating: 5, comment: "Excellent quality eggs. Will order again!", date: "2026-06-01", replied: true },
]

export function VendorReviews() {
  const [reviews, setReviews] = useState<VendorReview[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => { setReviews(mockReviews); setLoading(false) }, 600)
    return () => clearTimeout(t)
  }, [])

  if (loading) return (
    <div className="space-y-6">
      <div className="space-y-2"><h2 className="text-2xl font-semibold">Reviews</h2><p className="text-base text-muted-foreground">Loading reviews...</p></div>
      {[1,2,3].map((i) => <div key={i} className="h-24 bg-card border rounded-xl animate-pulse" />)}
    </div>
  )

  const avgRating = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Product Reviews</h2>
        <p className="text-base text-muted-foreground">See what customers are saying about your products.</p>
      </div>

      <Card>
        <CardContent className="flex items-center gap-6 pt-6">
          <div className="flex flex-col items-center">
            <p className="text-4xl font-bold text-brand-green">{avgRating.toFixed(1)}</p>
            <StarRating rating={avgRating} size="sm" />
            <p className="text-xs text-muted-foreground mt-1">{reviews.length} reviews</p>
          </div>
          <div className="flex-1 space-y-1.5">
            {[5, 4, 3, 2, 1].map((star) => {
              const count = reviews.filter((r) => Math.round(r.rating) === star).length
              const pct = reviews.length ? (count / reviews.length) * 100 : 0
              return (
                <div key={star} className="flex items-center gap-2 text-xs">
                  <span className="w-8 text-muted-foreground">{star} star</span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-brand-green rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                  <span className="w-6 text-right text-muted-foreground">{count}</span>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {reviews.length === 0 ? (
        <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
            <MessageSquare className="h-8 w-8 text-muted-foreground/40" />
          </div>
          <h3 className="text-lg font-semibold mb-1">No reviews yet</h3>
          <p className="text-sm text-muted-foreground">Reviews will appear here once customers start purchasing.</p>
        </CardContent></Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green/10 text-sm font-semibold text-brand-green">
                        {review.customer.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{review.customer}</p>
                        <p className="text-xs text-muted-foreground">{review.product}</p>
                      </div>
                    </div>
                  </div>
                  <StarRating rating={review.rating} size="sm" />
                </div>
                <p className="text-sm ml-10 mb-2">{review.comment}</p>
                <div className="flex items-center justify-between ml-10">
                  <span className="text-xs text-muted-foreground">{new Date(review.date).toLocaleDateString()}</span>
                  {!review.replied && (
                    <button className="text-xs text-brand-green hover:underline font-medium cursor-pointer">Reply</button>
                  )}
                  {review.replied && <span className="text-xs text-muted-foreground">Replied</span>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
