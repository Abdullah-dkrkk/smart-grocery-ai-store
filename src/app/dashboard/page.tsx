"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Sidebar } from "@/components/dashboard/sidebar"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { Button } from "@/components/ui/button"
import { PanelLeftClose, PanelLeft, Bell, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

type Role = "user" | "vendor" | "nutritionist" | "super-admin"

const validRoles: Role[] = ["user", "vendor", "nutritionist", "super-admin"]

const roleInitials: Record<Role, string> = {
  user: "U",
  vendor: "V",
  nutritionist: "N",
  "super-admin": "SA",
}

export default function DashboardPage() {
  const searchParams = useSearchParams()
  const roleParam = searchParams.get("role") as Role | null
  const currentRole: Role = roleParam && validRoles.includes(roleParam) ? roleParam : "user"

  const [collapsed, setCollapsed] = useState(false)
  const [activeItem, setActiveItem] = useState("Overview")

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

          <div className="flex items-center gap-3 ml-auto">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-green text-[9px] font-bold text-white">
                3
              </span>
            </Button>

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-green/10 text-brand-green text-xs font-semibold">
              {roleInitials[currentRole]}
            </div>
          </div>
        </header>

        <DashboardContent role={currentRole} activeItem={activeItem} />
      </div>
    </div>
  )
}
