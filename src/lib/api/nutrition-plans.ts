import { get } from "./client"

export interface NutritionPlan {
  id: number
  user_id: number
  nutritionist_id: number
  title: string
  description?: string
  duration_days: number
  daily_calories: number
  meals: NutritionPlanMeal[]
  created_at: string
  updated_at: string
}

export interface NutritionPlanMeal {
  id: number
  meal_type: string
  name: string
  description?: string
  calories: number
  protein?: string
  carbs?: string
  fats?: string
}

export const nutritionPlansApi = {
  list() {
    return get<NutritionPlan[]>("/customer/nutrition-plans")
  },
  show(id: number) {
    return get<NutritionPlan>(`/customer/nutrition-plans/${id}`)
  },
}
