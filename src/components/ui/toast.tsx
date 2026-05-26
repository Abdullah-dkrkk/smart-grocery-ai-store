"use client"

import { useState, useCallback, createContext, useContext, type ReactNode } from "react"
import { cn } from "@/lib/utils"
import { CheckCircle, X } from "lucide-react"

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

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([])

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3000)
  }, [])

  const remove = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-5 right-5 z-[999] flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-xl shadow-lg border text-sm font-medium animate-in slide-in-from-right",
              toast.type === "success"
                ? "bg-brand-green text-white border-brand-green/30"
                : "bg-destructive text-destructive-foreground border-destructive/30"
            )}
          >
            <CheckCircle className="h-5 w-5 shrink-0" />
            <span className="flex-1">{toast.message}</span>
            <button onClick={() => remove(toast.id)} className="shrink-0 hover:opacity-70">
              <X className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}
