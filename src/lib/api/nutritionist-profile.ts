import { get, put } from "./client"

export interface NutritionistProfileData {
  id: number
  nutritionist_id: number
  specialization?: string
  certifications?: string
  experience_years?: number
  bio?: string
  consultation_fee?: string
  qualifications?: string
  created_at: string
  updated_at: string
}

export interface NutritionistProfileInput {
  specialization?: string
  certifications?: string
  experience_years?: number
  bio?: string
  consultation_fee?: string
  qualifications?: string
}

export const nutritionistProfileApi = {
  show() {
    return get<NutritionistProfileData>("/nutritionist/profile")
  },
  update(data: NutritionistProfileInput) {
    return put<NutritionistProfileData>("/nutritionist/profile", data)
  },
}
