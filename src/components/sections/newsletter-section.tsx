"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

interface NewsletterSectionProps {
  title?: string
  description?: string
  placeholder?: string
  buttonLabel?: string
}

export function NewsletterSection({
  title = "Stay home & get your daily needs from our shop",
  description = "Start Your Daily Shopping with Nest Mart",
  placeholder = "Your email address",
  buttonLabel = "Subscribe",
}: NewsletterSectionProps) {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !email.includes("@")) {
      setStatus("error")
      return
    }
    setStatus("loading")
    setTimeout(() => {
      setStatus("success")
      setEmail("")
    }, 1000)
  }

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-green/90 to-emerald-600/90 dark:from-brand-green dark:to-emerald-800">
      {/* Decorative background elements - right side only */}
      <div className="absolute right-0 top-0 w-[45%] h-full">
        <div className="absolute -top-16 -right-16 w-80 h-80 rounded-full bg-white/5 blur-3xl" />
        <div className="absolute top-[10%] -right-8 w-64 h-64 rounded-full bg-emerald-300/8 blur-3xl" />
        <div className="absolute bottom-[15%] right-[15%] w-48 h-48 rounded-full bg-white/5 blur-2xl" />
        <div className="absolute top-[30%] right-[20%] w-32 h-32 rotate-45 border border-white/15 rounded-2xl" />
        <div className="absolute bottom-[10%] right-[8%] w-24 h-24 border border-white/10 rounded-full" />
        <div className="absolute top-[20%] right-[45%] w-16 h-16 border border-white/10 rounded-xl rotate-12" />
        <div className="absolute top-[55%] right-[12%] w-4 h-4 rounded-full bg-white/20" />
        <div className="absolute top-[75%] right-[35%] w-3 h-3 rounded-full bg-white/15" />
        <div className="absolute top-[8%] right-[35%] w-2 h-2 rounded-full bg-white/12" />
        <svg className="absolute bottom-[25%] right-[22%] w-20 h-20 text-white/8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
        </svg>
      </div>

      <div className="relative z-10 p-8 md:p-12">
        <div className="max-w-2xl">
          <h2 className="text-2xl md:text-3xl font-heading font-semibold text-white leading-tight">
            {title}
          </h2>
          <p className="text-white/80 mt-2 text-[15px]">{description}</p>

          <form onSubmit={handleSubmit} className="flex gap-2 mt-6 max-w-lg">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="email"
                placeholder={placeholder}
                value={email}
                onChange={(e) => { setEmail(e.target.value); setStatus("idle") }}
                className="pl-10 h-11 bg-white border-0 focus-visible:ring-2 focus-visible:ring-brand-orange font-sans"
                disabled={status === "loading" || status === "success"}
              />
            </div>
            <Button
              type="submit"
              disabled={status === "loading" || status === "success"}
              className="bg-brand-orange hover:bg-brand-orange/90 text-white h-11 px-6 shrink-0"
            >
              {status === "loading" ? "Subscribing..." : status === "success" ? "Subscribed!" : buttonLabel}
            </Button>
          </form>
          {status === "error" && (
            <p className="text-red-200 text-xs mt-2">Please enter a valid email address.</p>
          )}
          {status === "success" && (
            <p className="text-emerald-200 text-xs mt-2">Thank you for subscribing!</p>
          )}
        </div>
      </div>
    </section>
  )
}
