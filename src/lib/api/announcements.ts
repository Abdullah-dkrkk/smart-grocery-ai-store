import { get, post, put, del } from "./client"

export interface Announcement {
  id: number
  text: string
  is_active: boolean
  sort_order: number
  created_at: string
  updated_at: string
}

export const announcementsApi = {
  list() {
    return get<Announcement[]>("/announcements")
  },

  adminList() {
    return get<Announcement[]>("/admin/announcements")
  },

  create(data: { text: string; is_active?: boolean; sort_order?: number }) {
    return post<Announcement>("/admin/announcements", data)
  },

  update(id: number, data: { text?: string; is_active?: boolean; sort_order?: number }) {
    return put<Announcement>(`/admin/announcements/${id}`, data)
  },

  destroy(id: number) {
    return del<void>(`/admin/announcements/${id}`)
  },
}
