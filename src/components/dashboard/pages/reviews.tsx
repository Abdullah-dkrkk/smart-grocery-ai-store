"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { AlertCircle, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/common/star-rating"
import { reviewsApi, setAuthToken } from "@/lib/api"
import type { ReviewItem } from "@/lib/api/types"

export function Reviews() {
  const { data: session, status: authStatus } = useSession()
  const [reviews, setReviews] = useState<ReviewItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setLoading(false)
      setError("Please sign in to view your reviews.")
      return
    }
    setAuthToken(session.user.token)
    setLoading(true)
    reviewsApi.myReviews()
      .then((res) => setReviews(res.data || []))
      .catch((err) => setError(err.message || "Failed to load reviews."))
      .finally(() => setLoading(false))
  }, [authStatus, session])

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">My Reviews</h2>
          <p className="text-base text-muted-foreground">Loading your reviews...</p>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-card border rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10 mb-4">
              <AlertCircle className="h-8 w-8 text-destructive" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Unable to load reviews</h3>
            <p className="text-sm text-muted-foreground mb-6">{error}</p>
            <Button variant="outline" onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">My Reviews</h2>
        <p className="text-base text-muted-foreground">Your reviews and ratings.</p>
      </div>

      {reviews.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No reviews yet</h3>
            <p className="text-sm text-muted-foreground mb-6">You haven&apos;t written any reviews yet.</p>
            <a href="/products" className="inline-flex items-center justify-center rounded-lg bg-brand-green hover:bg-brand-green/90 text-white h-10 px-6 text-sm font-medium transition-all">
              Start Shopping
            </a>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium">Product #{review.product_id}</p>
                  <p className="text-xs text-muted-foreground">{new Date(review.created_at).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <StarRating rating={review.rating} size="sm" />
                  <span className="text-sm text-muted-foreground">({review.rating}/5)</span>
                </div>
                {review.comment && (
                  <p className="text-sm text-muted-foreground mt-2">{review.comment}</p>
                )}
                {review.vendor_reply && (
                  <div className="mt-3 pl-4 border-l-2 border-muted">
                    <p className="text-xs font-medium text-muted-foreground">Vendor reply:</p>
                    <p className="text-sm mt-1">{review.vendor_reply}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
