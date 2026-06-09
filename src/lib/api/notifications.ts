import { get, put } from "./client"

export interface Notification {
  id: number
  user_id: number
  type: string
  title: string
  message: string
  data?: Record<string, unknown>
  is_read: boolean
  created_at: string
}

export const notificationsApi = {
  list() {
    return get<Notification[]>("/notifications")
  },
  markAsRead(id: number) {
    return put<void>(`/notifications/${id}/read`)
  },
  markAllAsRead() {
    return put<void>("/notifications/read-all")
  },
}
