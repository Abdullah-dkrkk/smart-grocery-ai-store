"use client"

import { useState, useCallback, createContext, useContext, useEffect, useRef, type ReactNode } from "react"
import { CheckCircle, X } from "lucide-react"
import gsap from "gsap"

interface Toast {
  id: number
  message: string
  type: "success" | "error"
}

interface ToastContextType {
  showToast: (message: string, type?: "success" | "error") => void
}

const ToastContext = createContext<ToastContextType>({ showToast: () => {} })

export function useToast() {
  return useContext(ToastContext)
}

let toastId = 0

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast
  onRemove: (id: number) => void
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    gsap.fromTo(
      el,
      { x: -40, opacity: 0, scale: 0.95 },
      { x: 0, opacity: 1, scale: 1, duration: 0.35, ease: "power2.out" },
    )
  }, [])

  const handleClose = () => {
    const el = ref.current
    if (!el) return
    gsap.to(el, {
      x: -40,
      opacity: 0,
      scale: 0.95,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => onRemove(toast.id),
    })
  }

  return (
    <div
      ref={ref}
      className={`flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border border-white/10 text-sm font-medium pointer-events-auto ${
        toast.type === "success"
          ? "bg-brand-green text-white"
          : "bg-destructive text-destructive-foreground"
      }`}
    >
      <CheckCircle className="h-5 w-5 shrink-0" />
      <span className="flex-1">{toast.message}</span>
      <button onClick={handleClose} className="shrink-0 hover:opacity-70 cursor-pointer">
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const remove = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-5 left-5 z-[999] flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
