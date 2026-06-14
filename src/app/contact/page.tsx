"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { MapPin, Phone, Mail, Clock, CheckCircle2 } from "lucide-react"
import { AnnouncementBarWrapper } from "@/components/sections/announcement-bar-wrapper"
import { Header } from "@/components/sections/header"
import { Footer } from "@/components/store/footer"

const contactInfo = [
  { icon: MapPin, title: "Address", detail: "123 Green Street, New York, NY 10001" },
  { icon: Phone, title: "Phone", detail: "+1 (555) 123-4567" },
  { icon: Mail, title: "Email", detail: "hello@smartgrocery.com" },
  { icon: Clock, title: "Hours", detail: "Mon - Sat: 7:00 AM - 10:00 PM" },
]

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    try {
      const res = await fetch("/api-proxy/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error("Failed to send message")
      setSending(false)
      setSubmitted(true)
    } catch {
      setSending(false)
      alert("Failed to send message. Please try again later.")
    }
  }

  return (
    <>
      <AnnouncementBarWrapper />
      <Header />
      <main className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-16 max-w-3xl">
          <div className="text-center mb-10">
            <span className="inline-block bg-brand-green text-white mb-4 text-xs px-3 py-1 rounded-full">Get in Touch</span>
            <h1 className="text-4xl md:text-5xl font-heading font-bold tracking-tight mb-4">Contact Us</h1>
            <p className="text-lg text-muted-foreground">Have a question? We&apos;d love to hear from you.</p>
          </div>

          {/* Form — centered, on top */}
          <div className="bg-card border border-border rounded-2xl p-8 mb-10">
            {submitted ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <span className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-green-light dark:bg-brand-green/20 mb-4">
                  <CheckCircle2 className="h-8 w-8 text-brand-green" />
                </span>
                <h2 className="text-xl font-semibold mb-2">Message Sent!</h2>
                <p className="text-muted-foreground">Thank you for reaching out. We&apos;ll get back to you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">Name</label>
                    <Input id="name" name="name" placeholder="Your name" value={form.name} onChange={handleChange} required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">Email</label>
                    <Input id="email" name="email" type="email" placeholder="your@email.com" value={form.email} onChange={handleChange} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">Subject</label>
                  <Input id="subject" name="subject" placeholder="How can we help?" value={form.subject} onChange={handleChange} required />
                </div>
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">Message</label>
                  <textarea id="message" name="message" placeholder="Tell us more..." rows={5} value={form.message} onChange={handleChange} required
                    className="flex min-h-[120px] w-full rounded-lg border bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" />
                </div>
                <Button type="submit" className="bg-brand-green hover:bg-brand-green/90 text-white h-11 px-8" disabled={sending}>
                  {sending ? "Sending..." : "Send Message"}
                </Button>
              </form>
            )}
          </div>

          {/* Contact Info — cards below the form */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {contactInfo.map((item) => {
              const Icon = item.icon
              return (
                <div key={item.title} className="flex flex-col items-center text-center bg-card border border-border rounded-2xl p-6">
                  <span className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-brand-green-light dark:bg-brand-green/20 mb-3">
                    <Icon className="h-6 w-6 text-brand-green" />
                  </span>
                  <h4 className="font-semibold text-sm">{item.title}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{item.detail}</p>
                </div>
              )
            })}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
