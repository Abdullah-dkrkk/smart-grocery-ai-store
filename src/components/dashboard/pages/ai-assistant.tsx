"use client"

import { useEffect, useState, useRef } from "react"
import { useSession } from "next-auth/react"
import { Send, Bot, User, Sparkles, Camera, Apple, Loader2, AlertCircle, Lightbulb, ImageUp, X, ChevronRight, ShoppingBag } from "lucide-react"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { aiApi } from "@/lib/api/ai"
import { setAuthToken } from "@/lib/api/config"
import type { AiResponse, DietPlan } from "@/lib/api/types"

type Message = {
  id: string
  role: "user" | "assistant"
  content: string
  suggested_products?: AiResponse["suggested_products"]
  timestamp: Date
}

export function AiAssistant() {
  const { data: session, status: authStatus } = useSession()
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hello! I'm your AI grocery assistant. I can help you with meal planning, product recommendations, nutrition advice, and more. How can I help you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<number | undefined>(undefined)
  const [chatHistoryLoading, setChatHistoryLoading] = useState(true)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [dietPlan, setDietPlan] = useState<DietPlan | null>(null)
  const [dietPlanLoading, setDietPlanLoading] = useState(false)
  const [identifyingProduct, setIdentifyingProduct] = useState(false)
  const [identifiedProduct, setIdentifiedProduct] = useState<Record<string, unknown> | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    if (authStatus === "loading") return
    if (authStatus !== "authenticated" || !session?.user?.token) {
      setChatHistoryLoading(false)
      return
    }
    setAuthToken(session.user.token)
    setChatHistoryLoading(true)
    aiApi.chatHistory()
      .then((res) => {
        const history = Array.isArray(res) ? res : []
        if (history.length > 0) {
          const historyMessages: Message[] = []
          for (const h of history) {
            historyMessages.push({ id: `hist-q-${h.id}`, role: "user", content: h.question, timestamp: new Date(h.created_at) })
            historyMessages.push({ id: `hist-a-${h.id}`, role: "assistant", content: h.response, timestamp: new Date(h.created_at) })
          }
          setConversationId(history[history.length - 1].id)
          setMessages((prev) => [...prev, ...historyMessages])
        }
      })
      .catch(() => {})
      .finally(() => setChatHistoryLoading(false))
  }, [authStatus, session])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleAsk = async (question: string) => {
    const trimmed = question.trim()
    if (!trimmed || loading) return

    const userMessage: Message = { id: `user-${Date.now()}`, role: "user", content: trimmed, timestamp: new Date() }
    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setSuggestions([])
    setShowSuggestions(false)
    setLoading(true)
    setError(null)

    try {
      const res = await aiApi.ask({ question: trimmed, conversation_id: conversationId })
      const data = res.data || res
      setConversationId(data.conversation_id)
      const assistantMessage: Message = {
        id: `ai-${Date.now()}`,
        role: "assistant",
        content: data.response,
        suggested_products: data.suggested_products,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, assistantMessage])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    handleAsk(input)
  }

  const handleSuggestions = async (query: string) => {
    if (!query.trim()) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    try {
      const res = await aiApi.suggestions({ query })
      const data = Array.isArray(res) ? res : (res as { data?: string[] }).data || []
      setSuggestions(data.slice(0, 5))
      setShowSuggestions(data.length > 0)
    } catch {
      setShowSuggestions(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInput(val)
    if (val.length >= 2) {
      handleSuggestions(val)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const formData = new FormData()
    formData.append("image", file)
    setIdentifyingProduct(true)
    setIdentifiedProduct(null)
    setError(null)

    try {
      const res = await aiApi.identifyProduct(formData)
      setIdentifiedProduct(res.data || res)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to identify product.")
    } finally {
      setIdentifyingProduct(false)
      if (fileInputRef.current) fileInputRef.current.value = ""
    }
  }

  const handleGenerateDietPlan = async () => {
    setDietPlanLoading(true)
    setDietPlan(null)
    setError(null)

    try {
      const res = await aiApi.generateDietPlan()
      setDietPlan(res.data || res)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate diet plan.")
    } finally {
      setDietPlanLoading(false)
    }
  }

  if (chatHistoryLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold">AI Assistant</h2>
          <p className="text-base text-muted-foreground">Loading your conversations...</p>
        </div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-card border rounded-xl animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">AI Assistant</h2>
        <p className="text-base text-muted-foreground">Your intelligent grocery companion — ask anything about products, recipes, nutrition, and more.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Card className="flex flex-col h-[600px]">
            <CardHeader className="border-b pb-3 shrink-0">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-green">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-base">SmartGrocery AI</CardTitle>
                  <p className="text-xs text-muted-foreground">Powered by advanced AI</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === "user" ? "flex-row-reverse" : ""}`}>
                  <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${msg.role === "assistant" ? "bg-brand-green/10" : "bg-muted"}`}>
                    {msg.role === "assistant" ? <Bot className="h-4 w-4 text-brand-green" /> : <User className="h-4 w-4 text-muted-foreground" />}
                  </div>
                  <div className={`max-w-[80%] ${msg.role === "user" ? "bg-brand-green text-white rounded-2xl rounded-tr-md px-4 py-2.5" : "bg-muted/50 rounded-2xl rounded-tl-md px-4 py-2.5"}`}>
                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                    {msg.suggested_products && msg.suggested_products.length > 0 && (
                      <div className="mt-3 space-y-2">
                        <Separator className="opacity-30" />
                        <p className="text-xs font-semibold flex items-center gap-1">
                          <ShoppingBag className="h-3 w-3" />
                          Recommended Products
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {msg.suggested_products.map((p) => (
                            <div key={p.id} className="flex items-center gap-2 p-2 rounded-lg bg-background/80 text-foreground">
                              {p.image_url && (
                                <img src={p.image_url} alt={p.name} className="h-10 w-10 rounded-md object-cover shrink-0" />
                              )}
                              <div className="min-w-0">
                                <p className="text-xs font-medium truncate">{p.name}</p>
                                <p className="text-xs text-muted-foreground">${p.price}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    <p className="text-[10px] text-muted-foreground/50 mt-1">
                      {msg.role === "user" ? "You" : "AI"} &middot; {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex gap-3">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-green/10">
                    <Bot className="h-4 w-4 text-brand-green" />
                  </div>
                  <div className="bg-muted/50 rounded-2xl rounded-tl-md px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-brand-green/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 rounded-full bg-brand-green/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 rounded-full bg-brand-green/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </CardContent>
            <div className="border-t p-4 shrink-0">
              {showSuggestions && suggestions.length > 0 && (
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => { setInput(s); setShowSuggestions(false); handleAsk(s) }}
                      className="inline-flex items-center gap-1 text-xs bg-muted hover:bg-brand-green/10 hover:text-brand-green rounded-full px-3 py-1 transition-colors"
                    >
                      <Lightbulb className="h-3 w-3" />
                      {s}
                    </button>
                  ))}
                </div>
              )}
              <form onSubmit={handleSubmit} className="flex gap-2">
                <Input
                  value={input}
                  onChange={handleInputChange}
                  placeholder="Ask me anything about groceries, recipes, nutrition..."
                  className="flex-1"
                  disabled={loading}
                />
                <Button type="submit" size="icon" disabled={loading || !input.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </form>
            </div>
          </Card>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-brand-orange" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3" onClick={() => handleAsk("What are some healthy meal ideas for this week?")}>
                <Apple className="h-4 w-4 text-brand-green" />
                <span className="text-left text-xs">Meal Ideas</span>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3" onClick={() => handleAsk("What are the best budget-friendly grocery tips?")}>
                <Lightbulb className="h-4 w-4 text-brand-orange" />
                <span className="text-left text-xs">Budget Tips</span>
              </Button>
              <Button variant="outline" className="w-full justify-start gap-2 h-auto py-3" onClick={() => handleAsk("What organic products do you recommend for a healthy diet?")}>
                <ShoppingBag className="h-4 w-4 text-brand-green" />
                <span className="text-left text-xs">Product Recs</span>
              </Button>
              <Separator />
              <Button
                className="w-full justify-start gap-2 h-auto py-3"
                onClick={handleGenerateDietPlan}
                disabled={dietPlanLoading}
              >
                {dietPlanLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                <span className="text-left text-xs">{dietPlanLoading ? "Generating..." : "Generate Diet Plan"}</span>
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Camera className="h-4 w-4 text-brand-orange" />
                Identify Product
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-xs text-muted-foreground">Upload an image to identify a product and get nutrition info.</p>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              <Button
                variant="outline"
                className="w-full justify-center gap-2"
                onClick={() => fileInputRef.current?.click()}
                disabled={identifyingProduct}
              >
                {identifyingProduct ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <ImageUp className="h-4 w-4" />
                )}
                {identifyingProduct ? "Analyzing..." : "Upload Photo"}
              </Button>
              {identifiedProduct && (
                <div className="p-3 rounded-lg bg-brand-green/5 border border-brand-green/10 space-y-1">
                  {Object.entries(identifiedProduct as Record<string, unknown>).map(([key, val]) => (
                    <div key={key} className="flex justify-between text-xs">
                      <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}</span>
                      <span className="font-medium">{String(val)}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {dietPlan && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Apple className="h-4 w-4 text-brand-green" />
                  Your Diet Plan
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Duration</span>
                  <span className="text-xs font-medium">{dietPlan.duration_days} days</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Daily Calories</span>
                  <span className="text-xs font-medium">{dietPlan.total_calories} kcal</span>
                </div>
                <Separator />
                <p className="text-xs text-muted-foreground line-clamp-4">{dietPlan.plan}</p>
                <Button size="sm" variant="outline" className="w-full gap-1 text-xs" onClick={() => handleAsk("Tell me more about my diet plan and give me meal suggestions.")}>
                  Ask about this plan
                  <ChevronRight className="h-3 w-3" />
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
