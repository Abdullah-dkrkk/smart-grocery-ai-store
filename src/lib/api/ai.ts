import { get, post } from "./client"
import type { AiResponse, DietPlan } from "./types"

export const aiApi = {
  ask(data: { question: string; conversation_id?: number }) {
    return post<AiResponse>("/customer/ai/ask", data)
  },

  suggestions(data: { query: string }) {
    return get<string[]>("/customer/ai/suggestions", data)
  },

  identifyProduct(data: FormData) {
    return post<{ name: string; description: string; estimated_price: string; category: string; nutrition_estimate: Record<string, unknown> }>("/customer/ai/identify", data)
  },

  generateDietPlan(params: { preferences?: string; duration_days?: number } = {}) {
    return get<DietPlan>("/customer/ai/diet-plan", params)
  },

  chatHistory() {
    return get<{ id: number; user_id: number; question: string; response: string; created_at: string }[]>("/customer/ai/chat/history")
  },
}
