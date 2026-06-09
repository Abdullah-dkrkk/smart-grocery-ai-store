import { get, post, put } from "./client"

export interface Appointment {
  id: number
  nutritionist_id: number
  client_id: number
  client_name?: string
  type: string
  scheduled_at: string
  status: string
  notes?: string
  created_at: string
  updated_at: string
}

export interface AppointmentInput {
  client_id?: number
  type: string
  scheduled_at: string
  notes?: string
}

export const appointmentsApi = {
  list() {
    return get<Appointment[]>("/nutritionist/appointments")
  },
  show(id: number) {
    return get<Appointment>(`/nutritionist/appointments/${id}`)
  },
  create(data: AppointmentInput) {
    return post<Appointment>("/nutritionist/appointments", data)
  },
  updateStatus(id: number, data: { status: string; notes?: string }) {
    return put<Appointment>(`/nutritionist/appointments/${id}/status`, data)
  },
}
