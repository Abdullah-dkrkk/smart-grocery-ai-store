"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Mail, CheckCircle } from "lucide-react"

interface NewsletterFormProps {
  title?: string
  description?: string
  onSubmit?: (email: string) => Promise<boolean>
  className?: string
  variant?: "default" | "banner"
}

export function NewsletterForm({
  title = "Stay Updated",
  description = "Get the latest deals and fresh arrivals directly to your inbox.",
  onSubmit,
  className,
  variant = "default",
}: NewsletterFormProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [errorMsg, setErrorMsg] = useState("")

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("Please enter a valid email")
      setStatus("error")
      return
    }
    setStatus("loading")
    try {
      const success = await onSubmit?.(email)
      if (success !== false) {
        setStatus("success")
        setEmail("")
      }
    } catch {
      setErrorMsg("Something went wrong. Try again.")
      setStatus("error")
    }
  }

  const isBanner = variant === "banner"

  if (status === "success") {
    return (
      <div className={cn("flex items-center gap-3 text-brand-green", isBanner && "justify-center", className)}>
        <CheckCircle className="h-5 w-5" />
        <p className="text-sm font-medium">Thanks for subscribing!</p>
      </div>
    )
  }

  return (
    <div className={cn(isBanner && "text-center", className)}>
      {isBanner && (
        <div className="mb-4">
          <h3 className="text-xl md:text-2xl font-heading font-semibold">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      )}
      <form onSubmit={handleSubmit} className={cn("flex gap-2", isBanner ? "max-w-md mx-auto" : "")}>
        <div className="relative flex-1">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => { setEmail(e.target.value); setStatus("idle") }}
            className="pl-9 h-10"
            disabled={status === "loading"}
          />
        </div>
        <Button type="submit" className="h-10 shrink-0" disabled={status === "loading"}>
          {status === "loading" ? "Subscribing..." : "Subscribe"}
        </Button>
      </form>
      {status === "error" && <p className="text-xs text-destructive mt-1.5">{errorMsg}</p>}
    </div>
  )
}
