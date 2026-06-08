"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { Star, AlertCircle, MessageSquare } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { StarRating } from "@/components/common/star-rating"
import { ordersApi } from "@/lib/api/orders"
import { setAuthToken } from "@/lib/api/config"
import type { Order } from "@/lib/api/types"

export function Reviews() {
  const { data: session, status: authStatus } = useSession()
  const [orders, setOrders] = useState<Order[]>([])
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
    ordersApi.history(1, 50)
      .then((res) => {
        const data = res.data || []
        setOrders(data.filter((o: Order) => o.status === "delivered"))
      })
      .catch((err) => setError(err.message || "Failed to load data."))
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

  const deliveredOrders = orders

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">My Reviews</h2>
        <p className="text-base text-muted-foreground">Rate and review your purchased products.</p>
      </div>

      {deliveredOrders.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-muted mb-4">
              <MessageSquare className="h-8 w-8 text-muted-foreground/40" />
            </div>
            <h3 className="text-lg font-semibold mb-1">No reviews yet</h3>
            <p className="text-sm text-muted-foreground mb-6">You can review products after they are delivered.</p>
            <a href="/products" className="inline-flex items-center justify-center rounded-lg bg-brand-green hover:bg-brand-green/90 text-white h-10 px-6 text-sm font-medium transition-all">
              Start Shopping
            </a>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {deliveredOrders.map((order) => (
            <Card key={order.id}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-medium">Order #{order.order_number}</p>
                  <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleDateString()}</p>
                </div>
                <div className="space-y-3">
                  {(order.items || []).slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-t">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.product_name}</p>
                        <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <StarRating rating={0} size="sm" />
                        <button className="text-xs text-brand-green hover:underline cursor-pointer">Write Review</button>
                      </div>
                    </div>
                  ))}
                  {(order.items || []).length > 3 && (
                    <p className="text-xs text-muted-foreground text-center pt-1">+{order.items.length - 3} more items</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
