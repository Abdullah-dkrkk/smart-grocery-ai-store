"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Star, AlertCircle, MessageSquare } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/common/star-rating"
import { vendorReviewsApi } from "@/lib/api/vendor-reviews"
import { setAuthToken } from "@/lib/api/config"

interface VendorReview {
  id: number
  customer: string
  product: string
  rating: number
  comment: string
  date: string
  replied: boolean
}

export function VendorReviews() {
  const { data: session, status: authStatus } = useSession()
  const [reviews, setReviews] = useState<VendorReview[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false); setError("Please sign in.")
      return
    }
    setAuthToken(session.user.token)
    vendorReviewsApi.list()
      .then((res) => {
        const mapped: VendorReview[] = (res.data || []).map((item: any) => ({
          id: item.id,
          customer: item.user?.name || `Customer #${item.user_id}`,
          product: item.product?.name || `Product #${item.product_id}`,
          rating: item.rating,
          comment: item.comment || "",
          date: item.created_at,
          replied: !!item.vendor_reply,
        }))
        setReviews(mapped)
      })
      .catch((err) => setError(err.message || "Failed to load reviews."))
      .finally(() => setLoading(false))
  }, [authStatus, session])

  if (loading) return (
    <div className="space-y-6">
      <div className="space-y-2"><h2 className="text-2xl font-semibold">Reviews</h2><p className="text-base text-muted-foreground">Loading reviews...</p></div>
      {[1,2,3].map((i) => <div key={i} className="h-24 bg-card border rounded-xl animate-pulse" />)}
    </div>
  )

  if (error) return (
    <div className="space-y-6">
      <Card><CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Unable to load reviews</h3>
        <p className="text-sm text-muted-foreground mb-6">{error}</p>
      </CardContent></Card>
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
