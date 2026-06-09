import { get, post, put, del } from "./client"

export interface MealPlan {
  id: number
  nutritionist_id: number
  client_id?: number
  title: string
  description?: string
  duration_days: number
  daily_calories: number
  meals: MealPlanMeal[]
  client_name?: string
  created_at: string
  updated_at: string
}

export interface MealPlanMeal {
  id: number
  meal_type: string
  name: string
  description?: string
  calories: number
  protein?: string
  carbs?: string
  fats?: string
}

export interface MealPlanInput {
  title: string
  description?: string
  duration_days: number
  daily_calories: number
  client_id?: number
}

export const mealPlansApi = {
  list() {
    return get<MealPlan[]>("/nutritionist/meal-plans")
  },
  show(id: number) {
    return get<MealPlan>(`/nutritionist/meal-plans/${id}`)
  },
  create(data: MealPlanInput) {
    return post<MealPlan>("/nutritionist/meal-plans", data)
  },
  update(id: number, data: Partial<MealPlanInput>) {
    return put<MealPlan>(`/nutritionist/meal-plans/${id}`, data)
  },
  destroy(id: number) {
    return del<void>(`/nutritionist/meal-plans/${id}`)
  },
}
