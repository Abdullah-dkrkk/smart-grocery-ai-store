"use client"

import { useState, useCallback, useEffect } from "react"
import type { Product } from "@/types/product"

const WISHLIST_KEY = "wishlist_items"

function getStoredWishlist(): number[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(WISHLIST_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

export function useWishlist() {
  const [wishlistIds, setWishlistIds] = useState<number[]>([])
  const [loadingId, setLoadingId] = useState<number | null>(null)

  useEffect(() => {
    setWishlistIds(getStoredWishlist())
  }, [])

  const isWishlisted = useCallback((productId: number) => {
    return wishlistIds.includes(productId)
  }, [wishlistIds])

  const toggleWishlist = useCallback(async (product: Product) => {
    setLoadingId(product.id)
    await new Promise((r) => setTimeout(r, 600))

    setWishlistIds((prev) => {
      const exists = prev.includes(product.id)
      const next = exists ? prev.filter((id) => id !== product.id) : [...prev, product.id]
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(next))
      return next
    })
    setLoadingId(null)
  }, [])

  const addWishlist = useCallback(async (product: Product) => {
    setLoadingId(product.id)
    await new Promise((r) => setTimeout(r, 600))

    setWishlistIds((prev) => {
      if (prev.includes(product.id)) return prev
      const next = [...prev, product.id]
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(next))
      return next
    })
    setLoadingId(null)
  }, [])

  const removeWishlist = useCallback(async (productId: number) => {
    setLoadingId(productId)
    await new Promise((r) => setTimeout(r, 400))

    setWishlistIds((prev) => {
      const next = prev.filter((id) => id !== productId)
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(next))
      return next
    })
    setLoadingId(null)
  }, [])

  return {
    wishlistIds,
    loadingId,
    isWishlisted,
    toggleWishlist,
    addWishlist,
    removeWishlist,
  }
}
