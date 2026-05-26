import { get, post } from "./client"
import { setAuthToken } from "./config"
import type { AuthResponse, User } from "./types"

export const authApi = {
  register(data: { name: string; email: string; password: string; password_confirmation: string }) {
    return post<AuthResponse>("/auth/register", data)
  },

  login(data: { email: string; password: string }) {
    return post<AuthResponse>("/auth/login", data)
  },

  logout() {
    return post<void>("/auth/logout")
  },

  me() {
    return get<User>("/auth/me")
  },

  forgotPassword(data: { email: string }) {
    return post<{ message: string }>("/auth/forgot-password", data)
  },

  resetPassword(data: { token: string; email: string; password: string; password_confirmation: string }) {
    return post<{ message: string }>("/auth/reset-password", data)
  },

  async loginAndStore(data: { email: string; password: string }) {
    const res = await this.login(data)
    setAuthToken(res.data.token)
    return res.data
  },

  async registerAndStore(data: { name: string; email: string; password: string; password_confirmation: string }) {
    const res = await this.register(data)
    setAuthToken(res.data.token)
    return res.data
  },
}
