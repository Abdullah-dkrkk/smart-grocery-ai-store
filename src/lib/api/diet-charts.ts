import { get, post, put, del } from "./client"

export interface DietChart {
  id: number
  nutritionist_id: number
  client_id?: number
  title: string
  description?: string
  duration_days: number
  days: DietChartDay[]
  client_name?: string
  created_at: string
  updated_at: string
}

export interface DietChartDay {
  id: number
  day_number: number
  meals: string
  notes?: string
}

export interface DietChartInput {
  title: string
  description?: string
  duration_days: number
  client_id?: number
}

export const dietChartsApi = {
  list() {
    return get<DietChart[]>("/nutritionist/diet-charts")
  },
  show(id: number) {
    return get<DietChart>(`/nutritionist/diet-charts/${id}`)
  },
  create(data: DietChartInput) {
    return post<DietChart>("/nutritionist/diet-charts", data)
  },
  update(id: number, data: Partial<DietChartInput>) {
    return put<DietChart>(`/nutritionist/diet-charts/${id}`, data)
  },
  destroy(id: number) {
    return del<void>(`/nutritionist/diet-charts/${id}`)
  },
}
