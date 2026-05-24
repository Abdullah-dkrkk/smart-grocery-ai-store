import { get, post } from "./client"
import type { AiResponse, DietPlan } from "./types"

export const aiApi = {
  ask(data: { question: string; conversation_id?: number }) {
    return post<AiResponse>("/ai/ask", data)
  },

  suggestions(data: { query: string }) {
    return get<string[]>("/ai/suggestions", data)
  },

  identifyProduct(data: FormData) {
    return post<{ name: string; description: string; estimated_price: string; category: string; nutrition_estimate: Record<string, unknown> }>("/ai/identify-product", data)
  },

  generateDietPlan(data: { preferences?: string; duration_days?: number }) {
    return post<DietPlan>("/ai/diet-plan", data)
  },

  chatHistory() {
    return get<{ id: number; user_id: number; question: string; response: string; created_at: string }[]>("/ai/chat-history")
  },
}
