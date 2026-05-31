"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { wishlistApi } from "@/lib/api/wishlist"
import { getAuthToken } from "@/lib/api/config"
import type { Product } from "@/types/product"

const WISHLIST_KEY = "wishlist_items"
const WISHLIST_EVENT = "wishlist-updated"

function getStoredWishlist(): number[] {
  if (typeof window === "undefined") return []
  try {
    const stored = localStorage.getItem(WISHLIST_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function setStoredWishlist(ids: number[]) {
  localStorage.setItem(WISHLIST_KEY, JSON.stringify(ids))
}

function dispatchWishlistEvent() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(WISHLIST_EVENT))
}

type ToastFn = (msg: string, type?: "success" | "error") => void

export function useWishlist(showToast?: ToastFn) {
  const [wishlistIds, setWishlistIds] = useState<number[]>([])
  const [loadingId, setLoadingId] = useState<number | null>(null)
  const latestIds = useRef<number[]>([])

  // Keep ref in sync with state — always access latest IDs without closure issues
  useEffect(() => {
    latestIds.current = wishlistIds
  }, [wishlistIds])

  // Init: localStorage → API sync (merge, never replace)
  useEffect(() => {
    const local = getStoredWishlist()
    setWishlistIds(local)

    const token = getAuthToken()
    if (token) {
      wishlistApi.list()
        .then((res) => {
          if (!res.data || res.data.length === 0) return
          const apiIds = res.data.map((item) => item.product_id)
          const merged = [...new Set([...apiIds, ...getStoredWishlist()])]
          setWishlistIds(merged)
          setStoredWishlist(merged)
        })
        .catch(() => {})
    }

    const handler = () => {
      const stored = getStoredWishlist()
      setWishlistIds(stored)
      latestIds.current = stored
    }
    window.addEventListener(WISHLIST_EVENT, handler)
    return () => window.removeEventListener(WISHLIST_EVENT, handler)
  }, [])

  const isWishlisted = useCallback((productId: number) => {
    return wishlistIds.includes(productId)
  }, [wishlistIds])

  const toggleWishlist = useCallback(async (product: Product) => {
    const prev = latestIds.current
    const wasListed = prev.includes(product.id)
    const next = wasListed
      ? prev.filter((id) => id !== product.id)
      : [...prev, product.id]

    // Optimistic toast
    showToast?.(wasListed ? "Removed from Wishlist" : "Added to Wishlist!")

    // Optimistic update
    setLoadingId(product.id)
    setWishlistIds(next)
    setStoredWishlist(next)
    dispatchWishlistEvent()

    // API sync
    try {
      if (wasListed) {
        await wishlistApi.remove(product.id)
      } else {
        await wishlistApi.add(product.id)
      }
    } catch {
      showToast?.("Failed to sync wishlist", "error")
    }

    setLoadingId(null)
  }, [showToast])

  const addWishlist = useCallback(async (product: Product) => {
    const prev = latestIds.current
    if (prev.includes(product.id)) return

    const next = [...prev, product.id]
    showToast?.("Added to Wishlist!")

    setLoadingId(product.id)
    setWishlistIds(next)
    setStoredWishlist(next)
    dispatchWishlistEvent()

    try {
      await wishlistApi.add(product.id)
    } catch {
      showToast?.("Failed to add to wishlist", "error")
    }

    setLoadingId(null)
  }, [showToast])

  const removeWishlist = useCallback(async (productId: number) => {
    const prev = latestIds.current
    if (!prev.includes(productId)) return

    const next = prev.filter((id) => id !== productId)
    showToast?.("Removed from Wishlist")

    setLoadingId(productId)
    setWishlistIds(next)
    setStoredWishlist(next)
    dispatchWishlistEvent()

    try {
      await wishlistApi.remove(productId)
    } catch {
      showToast?.("Failed to remove from wishlist", "error")
    }

    setLoadingId(null)
  }, [showToast])

  return {
    wishlistIds,
    loadingId,
    isWishlisted,
    toggleWishlist,
    addWishlist,
    removeWishlist,
  }
}