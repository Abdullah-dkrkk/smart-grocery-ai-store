import { get, post, put } from "./client"

export interface Consultation {
  id: number
  nutritionist_id: number
  client_id: number
  client_name?: string
  type: string
  notes: string
  recommendations?: string
  follow_up_date?: string
  created_at: string
  updated_at: string
}

export interface ConsultationInput {
  client_id?: number
  type: string
  notes: string
  recommendations?: string
  follow_up_date?: string
}

export const consultationsApi = {
  list() {
    return get<Consultation[]>("/nutritionist/consultations")
  },
  show(id: number) {
    return get<Consultation>(`/nutritionist/consultations/${id}`)
  },
  create(data: ConsultationInput) {
    return post<Consultation>("/nutritionist/consultations", data)
  },
  update(id: number, data: Partial<ConsultationInput>) {
    return put<Consultation>(`/nutritionist/consultations/${id}`, data)
  },
}
