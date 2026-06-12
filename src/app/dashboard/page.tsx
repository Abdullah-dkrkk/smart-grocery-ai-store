"use client"

import { Suspense, useState, useRef, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { useSession } from "next-auth/react"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { Button } from "@/components/ui/button"
import { PanelLeftClose, PanelLeft, Search, Bell, BellOff, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"

type Role = "user" | "vendor" | "nutritionist" | "super-admin"

const validRoles: Role[] = ["user", "vendor", "nutritionist", "super-admin"]

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <DashboardContentInner />
    </Suspense>
  )
}

function DashboardContentInner() {
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const sessionRole = (session?.user?.role as Role | undefined) || "user"
  const currentRole: Role = validRoles.includes(sessionRole) ? sessionRole : "user"
  const tabParam = searchParams.get("tab")

  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState(tabParam || "Overview")
  const [notifOpen, setNotifOpen] = useState(false)
  const notifRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  if (status !== "authenticated" && status !== "unauthenticated") {
    return (
      <div className="flex h-dvh items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-brand-green" />
      </div>
    )
  }

  return (
    <div className="flex h-dvh overflow-hidden bg-background">
      <Sidebar
        role={currentRole}
        activeItem={activeItem}
        onItemClick={setActiveItem}
        collapsed={collapsed}
        onToggle={() => setCollapsed(!collapsed)}
      />

      <div className="flex flex-1 flex-col min-w-0">
        <header className="flex h-16 shrink-0 items-center gap-4 border-b bg-background px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="shrink-0"
          >
            {collapsed ? <PanelLeft className="h-4 w-4" /> : <PanelLeftClose className="h-4 w-4" />}
          </Button>

          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search dashboard..." className="pl-9 h-9 text-sm" />
          </div>

          <div className="flex items-center gap-1 ml-auto">
            <div ref={notifRef} className="relative">
              <button
                onClick={() => setNotifOpen(!notifOpen)}
                className="relative p-2 hover:bg-muted rounded-lg transition-colors cursor-pointer"
              >
                <Bell className="h-5 w-5" />
              </button>
              {notifOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-card border rounded-xl shadow-xl z-50 overflow-hidden">
                  <div className="p-4 border-b">
                    <p className="text-sm font-semibold">Notifications</p>
                  </div>
                  <div className="flex flex-col items-center justify-center py-10 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted mb-3">
                      <BellOff className="h-6 w-6 text-muted-foreground/40" />
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">No notifications</p>
                    <p className="text-xs text-muted-foreground/60 mt-1">You&apos;re all caught up.</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        <DashboardContent role={currentRole} activeItem={activeItem} />
      </div>
    </div>
  )
}
