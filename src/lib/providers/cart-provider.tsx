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
  updateQuantity: (itemId: number, quantity: number) => Promise<void>
  clearCart: () => void
  loading: boolean
}

const CartContext = createContext<CartContextType | null>(null)

export function useCartContext() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error("useCartContext must be used within CartProvider")
  return ctx
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

async function fetchCartFromApi(): Promise<CartItem[]> {
  const res = await cartApi.list()
  if (!res?.data?.items) return []
  return res.data.items.map(apiItemToCartItem)
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const { showToast } = useToast()
  const { data: session, status } = useSession()
  const isLoggedIn = status === "authenticated" && !!session?.user?.token
  const sessionSettled = status !== "loading"

  useEffect(() => {
    if (!sessionSettled) return

    if (!isLoggedIn) {
      removeAuthToken()
      setItems([])
      setLoading(false)
      return
    }

    setAuthToken(session!.user!.token!)

    fetchCartFromApi()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false))
  }, [sessionSettled, isLoggedIn, session])

  const openDrawer = useCallback(() => setIsDrawerOpen(true), [])
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), [])
  const toggleDrawer = useCallback(() => setIsDrawerOpen((prev) => !prev), [])

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce((sum, item) => sum + item.total, 0)

  const addItem = useCallback(
    async (product: Product, quantity = 1) => {
      try {
        await cartApi.add({ product_id: product.id, quantity })
        const apiItems = await fetchCartFromApi()
        setItems(apiItems)
        showToast(`${product.name} added to cart!`)
      } catch {
        showToast("Failed to add item to cart", "error")
      }
    },
    [showToast],
  )

  const removeItem = useCallback(async (itemId: number, productId: number) => {
    try {
      await cartApi.remove(itemId)
      const apiItems = await fetchCartFromApi()
      setItems(apiItems)
    } catch {
      showToast("Failed to remove item", "error")
    }
  }, [showToast])

  const updateQuantity = useCallback(async (itemId: number, quantity: number) => {
    if (quantity <= 0) return
    try {
      const item = items.find((i) => i.id === itemId)
      if (!item) return
      await cartApi.add({ product_id: item.product_id, quantity })
      const apiItems = await fetchCartFromApi()
      setItems(apiItems)
    } catch {
      showToast("Failed to update quantity", "error")
    }
  }, [items, showToast])

  const clearCart = useCallback(() => {
    cartApi.clear()
      .then(() => setItems([]))
      .catch(() => showToast("Failed to clear cart", "error"))
  }, [showToast])

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
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
