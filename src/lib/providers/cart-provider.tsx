"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { useSession } from "next-auth/react"
import type { CartItem } from "@/types/cart"
import type { Product } from "@/types/product"
import { useToast } from "@/components/ui/toast"
import { cartApi } from "@/lib/api/cart"
import { setAuthToken, removeAuthToken } from "@/lib/api/config"
import { adaptProduct } from "@/lib/adapters/product-adapter"

interface CartContextType {
  items: CartItem[]
  itemCount: number
  subtotal: number
  isDrawerOpen: boolean
  openDrawer: () => void
  closeDrawer: () => void
  toggleDrawer: () => void
  addItem: (product: Product, quantity?: number) => Promise<void>
  removeItem: (itemId: number, productId: number) => Promise<void>
  updateQuantity: (itemId: number, quantity: number) => void
  clearCart: () => void
  isApiReady: boolean
  hydrated: boolean
  loading: boolean
}

const CartContext = createContext<CartContextType | null>(null)

export function useCartContext() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCartContext must be used within CartProvider")
  return ctx
}

const STORAGE_KEY = "smartgrocery-cart"
const CART_EVENT = "cart-updated"

function dispatchCartEvent() {
  if (typeof window === "undefined") return
  window.dispatchEvent(new CustomEvent(CART_EVENT))
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

function loadCartFromStorage(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function apiItemToCartItem(i: any): CartItem {
  const unitPrice = Number(i.product?.price ?? i.unit_price ?? 0)
  const product = adaptProduct(i.product) ?? i.product
  return {
    id: i.id,
    product_id: i.product_id,
    product,
    quantity: i.quantity,
    unit_price: unitPrice,
    total: unitPrice * i.quantity,
  }
}

function refreshCartFromApi(): Promise<CartItem[] | null> {
  return cartApi.list().then((res) => {
    if (!res?.data?.items) return null
    return res.data.items.map(apiItemToCartItem)
  }).catch(() => null)
}

let nextItemId = Date.now()
function genId() { return ++nextItemId }

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [isApiReady, setIsApiReady] = useState(false)
  const [hydrated, setHydrated] = useState(false)
  const [sessionSettled, setSessionSettled] = useState(false)
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()
  const { data: session, status } = useSession()
  const isLoggedIn = status === "authenticated" && !!session?.user?.token

  useEffect(() => {
    if (status !== "loading") setSessionSettled(true)
  }, [status])

  useEffect(() => {
    saveCart(items)
    dispatchCartEvent()
  }, [items])

  useEffect(() => {
    if (hydrated) return
    setItems(loadCartFromStorage())
    setHydrated(true)
  }, [hydrated])

  useEffect(() => {
    if (!sessionSettled || !hydrated) return

    if (!isLoggedIn) {
      removeAuthToken()
      setIsApiReady(false)
      setLoading(false)
      return
    }

    setAuthToken(session!.user!.token!)
    setIsApiReady(true)

    refreshCartFromApi().then((apiItems) => {
      if (apiItems) {
        setItems(apiItems)
      }
      setLoading(false)
    })
  }, [sessionSettled, isLoggedIn, session, hydrated])

  const openDrawer = useCallback(() => setIsDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])
  const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), [])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.total, 0)

  const addItem = useCallback(
    async (product: Product, quantity = 1) => {
      setItems((prev) => {
        const existing = prev.find((item) => item.product_id === product.id)
        if (existing) {
          return prev.map((item) =>
            item.id === existing.id
              ? { ...item, quantity: item.quantity + quantity, total: (item.quantity + quantity) * item.unit_price }
              : item,
          )
        }
        const newItem: CartItem = {
          id: genId(),
          product_id: product.id,
          product,
          quantity,
          unit_price: product.price,
          total: product.price * quantity,
        }
        return [...prev, newItem]
      })

      try {
        await cartApi.add({ product_id: product.id, quantity })
        const apiItems = await refreshCartFromApi()
        if (apiItems) setItems(apiItems)
      } catch {
        // API unavailable — local state fallback
      }

      showToast(`${product.name} added to cart!`)
    },
    [showToast],
  )

  const removeItem = useCallback(async (itemId: number, productId: number) => {
    setItems((prev) => prev.filter((item) => item.id !== itemId))

    try {
      await cartApi.remove(itemId)
      const apiItems = await refreshCartFromApi()
      if (apiItems) setItems(apiItems)
    } catch {
      // local-only fallback
    }
  }, [])

  const updateQuantity = useCallback((itemId: number, quantity: number) => {
    if (quantity <= 0) {
      setItems((prev) => prev.filter((item) => item.id !== itemId))
      return
    }
    setItems((prev) =>
      prev.map((item) =>
        item.id === itemId ? { ...item, quantity, total: item.unit_price * quantity } : item,
      ),
    )
  }, [])

  const clearCart = useCallback(() => {
    setItems([])
    cartApi.clear().catch(() => {})
  }, [])

  return (
    <CartContext.Provider
      value={{
        items,
        itemCount,
        subtotal,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        toggleDrawer,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        isApiReady,
        hydrated,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCartCount() {
  const [count, setCount] = useState(0)

  useEffect(() => {
    function getCount() {
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) return 0
        const items: CartItem[] = JSON.parse(raw)
        return items.reduce((sum, item) => sum + item.quantity, 0)
      } catch {
        return 0
      }
    }

    setCount(getCount())

    const handler = () => setCount(getCount())
    window.addEventListener(CART_EVENT, handler)
    return () => window.removeEventListener(CART_EVENT, handler)
  }, [])

  return count
}
