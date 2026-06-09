"use client"

import { useEffect, useState } from "react"
import { AnnouncementBar } from "@/components/sections/announcement-bar"
import { announcementsApi } from "@/lib/api/announcements"
import { HEADER_ANNOUNCEMENTS } from "@/lib/constants"

export function AnnouncementBarWrapper() {
  const [items, setItems] = useState<{ text: string }[]>(HEADER_ANNOUNCEMENTS)

  useEffect(() => {
    announcementsApi.list()
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setItems(res.data.map((a) => ({ text: a.text })))
        }
      })
      .catch(() => {})
  }, [])

  return <AnnouncementBar announcements={items} interval={5000} />
}
