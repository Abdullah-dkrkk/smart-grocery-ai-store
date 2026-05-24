"use client"

import { useState, useEffect, useCallback } from "react"

interface Announcement {
  text: string
}

interface AnnouncementBarProps {
  announcements: Announcement[]
  interval?: number
}

export function AnnouncementBar({ announcements, interval = 5000 }: AnnouncementBarProps) {
  const [current, setCurrent] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % announcements.length)
  }, [announcements.length])

  useEffect(() => {
    if (announcements.length <= 1 || isPaused) return
    const timer = setInterval(next, interval)
    return () => clearInterval(timer)
  }, [announcements.length, interval, isPaused, next])

  if (announcements.length === 0) return null

  return (
    <div
      className="bg-brand-green text-white overflow-hidden"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="relative h-10">
        {announcements.map((msg, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 flex items-center justify-center text-sm font-medium tracking-wide transition-all duration-500 ${
              idx === current
                ? "translate-y-0 opacity-100"
                : idx < current || (current === 0 && idx === announcements.length - 1)
                  ? "-translate-y-full opacity-0"
                  : "translate-y-full opacity-0"
            }`}
          >
            {msg.text}
          </div>
        ))}
      </div>
    </div>
  )
}
