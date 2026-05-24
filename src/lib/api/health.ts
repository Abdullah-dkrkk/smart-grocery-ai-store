import { get, put } from "./client"
import type { HealthProfile } from "./types"

export interface HealthProfileInput {
  age?: number
  weight?: number
  height?: number
  goals?: string
  allergies?: string[]
  dietary_type?: string
  activity_level?: string
  medical_conditions?: string
}

export const healthApi = {
  getProfile() {
    return get<HealthProfile>("/health-profile")
  },

  updateProfile(data: HealthProfileInput) {
    return put<HealthProfile>("/health-profile", data)
  },
}
