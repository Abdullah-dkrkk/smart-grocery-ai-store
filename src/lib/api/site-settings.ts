import { get } from "./client"

export interface SiteSettings {
  support_phone: string
  support_text: string
  mega_menu_banner_enabled: boolean
}

export const siteSettingsApi = {
  get() {
    return get<SiteSettings>("/site-settings")
  },
}
