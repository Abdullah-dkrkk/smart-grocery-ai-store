"use client"

import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  Star,
  User,
  MapPin,
  CreditCard,
  Apple,
  Package,
  PlusCircle,
  Truck,
  Warehouse,
  DollarSign,
  Store,
  Users,
  Stethoscope,
  ClipboardList,
  Calendar,
  BookOpen,
  Settings,
  BarChart3,
  Shield,
  LogOut,
} from "lucide-react"

type Role = "user" | "vendor" | "nutritionist" | "super-admin"

interface NavItem {
  label: string
  icon: React.ElementType
  href?: string
  badge?: string
}

const roleNavItems: Record<Role, { section: string; items: NavItem[] }[]> = {
  user: [
    {
      section: "Main",
      items: [
        { label: "Overview", icon: LayoutDashboard },
        { label: "My Orders", icon: ShoppingBag, badge: "3" },
        { label: "Wishlist", icon: Heart },
        { label: "Reviews", icon: Star },
      ],
    },
    {
      section: "Account",
      items: [
        { label: "My Profile", icon: User },
        { label: "Addresses", icon: MapPin },
        { label: "Payment Methods", icon: CreditCard },
      ],
    },
    {
      section: "Nutrition",
      items: [
        { label: "Nutrition Plans", icon: Apple },
      ],
    },
  ],
  vendor: [
    {
      section: "Main",
      items: [
        { label: "Overview", icon: LayoutDashboard },
        { label: "My Products", icon: Package },
        { label: "Add Product", icon: PlusCircle },
        { label: "Orders Received", icon: Truck, badge: "12" },
      ],
    },
    {
      section: "Business",
      items: [
        { label: "Inventory", icon: Warehouse },
        { label: "Earnings", icon: DollarSign },
        { label: "Store Settings", icon: Store },
      ],
    },
    {
      section: "Feedback",
      items: [
        { label: "Reviews", icon: Star },
      ],
    },
  ],
  nutritionist: [
    {
      section: "Main",
      items: [
        { label: "Overview", icon: LayoutDashboard },
        { label: "My Clients", icon: Users },
        { label: "Meal Plans", icon: ClipboardList },
        { label: "Diet Charts", icon: BookOpen },
      ],
    },
    {
      section: "Schedule",
      items: [
        { label: "Consultations", icon: Stethoscope },
        { label: "Appointments", icon: Calendar, badge: "2" },
      ],
    },
    {
      section: "Resources",
      items: [
        { label: "Articles", icon: BookOpen },
        { label: "Profile", icon: User },
      ],
    },
  ],
  "super-admin": [
    {
      section: "Main",
      items: [
        { label: "Overview", icon: LayoutDashboard },
        { label: "Users", icon: Users },
        { label: "Vendors", icon: Store },
        { label: "Nutritionists", icon: Stethoscope },
      ],
    },
    {
      section: "Management",
      items: [
        { label: "Products", icon: Package },
        { label: "Orders", icon: ShoppingBag, badge: "45" },
        { label: "Payments", icon: DollarSign },
      ],
    },
    {
      section: "System",
      items: [
        { label: "Analytics", icon: BarChart3 },
        { label: "Settings", icon: Settings },
        { label: "Audit Log", icon: Shield },
      ],
    },
  ],
}

const roleLabels: Record<Role, { name: string; color: string }> = {
  user: { name: "User", color: "bg-brand-green/10 text-brand-green" },
  vendor: { name: "Vendor", color: "bg-brand-orange/10 text-brand-orange" },
  nutritionist: { name: "Nutritionist", color: "bg-blue-50 text-blue-600" },
  "super-admin": { name: "Super Admin", color: "bg-purple-50 text-purple-600" },
}

interface SidebarProps {
  role: Role
  activeItem: string
  onItemClick: (item: string) => void
  collapsed: boolean
  onToggle: () => void
}

export function Sidebar({ role, activeItem, onItemClick, collapsed, onToggle }: SidebarProps) {
  const sections = roleNavItems[role]
  const roleInfo = roleLabels[role]

  return (
    <aside
      className={cn(
        "flex flex-col border-r bg-sidebar transition-all duration-300",
        collapsed ? "w-[72px]" : "w-64"
      )}
    >
      <div className="flex h-16 items-center gap-3 border-b px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-green text-white text-sm font-bold">
          SG
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-tight">
            <span className="text-sm font-semibold">SmartGrocery</span>
            <span className="text-[11px] text-muted-foreground">Dashboard</span>
          </div>
        )}
      </div>

      <div className={cn("border-b px-4 py-3", collapsed && "px-2")}>
        <div className={cn("flex items-center gap-2", collapsed && "justify-center")}>
          <div className={cn("flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold", roleInfo.color)}>
            {role === "super-admin" ? "SA" : role === "nutritionist" ? "N" : role === "vendor" ? "V" : "U"}
          </div>
          {!collapsed && (
            <span className="text-xs font-medium">{roleInfo.name}</span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-4">
        {sections.map((section) => (
          <div key={section.section} className="mb-5">
            {!collapsed && (
              <p className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {section.section}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const Icon = item.icon
                const isActive = activeItem === item.label
                return (
                  <button
                    key={item.label}
                    onClick={() => onItemClick(item.label)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm transition-colors",
                      collapsed && "justify-center px-0",
                      isActive
                        ? "bg-brand-green/10 text-brand-green font-medium"
                        : "text-sidebar-foreground/70 hover:bg-brand-green/10 hover:text-brand-green-dark"
                    )}
                    title={collapsed ? item.label : undefined}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {!collapsed && (
                      <span className="flex-1 text-left">{item.label}</span>
                    )}
                    {!collapsed && item.badge && (
                      <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-green/10 px-1.5 text-[11px] font-medium text-brand-green">
                        {item.badge}
                      </span>
                    )}
                    {collapsed && item.badge && (
                      <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-green text-[9px] font-bold text-white">
                        {item.badge}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="border-t px-3 py-3">
        <button
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-2 py-2 text-sm text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive",
            collapsed && "justify-center px-0"
          )}
          title={collapsed ? "Sign Out" : undefined}
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  )
}
