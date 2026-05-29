"use client"

import { ShoppingBag } from "lucide-react"
import { UserOverview } from "@/components/dashboard/overviews/user-overview"
import { VendorOverview } from "@/components/dashboard/overviews/vendor-overview"
import { NutritionistOverview } from "@/components/dashboard/overviews/nutritionist-overview"
import { SuperAdminOverview } from "@/components/dashboard/overviews/super-admin-overview"

type Role = "user" | "vendor" | "nutritionist" | "super-admin"

interface DashboardContentProps {
  role: Role
  activeItem: string
}

const overviewComponents: Record<Role, React.ElementType> = {
  user: UserOverview,
  vendor: VendorOverview,
  nutritionist: NutritionistOverview,
  "super-admin": SuperAdminOverview,
}

const roleLabels: Record<Role, string> = {
  user: "my account",
  vendor: "my store",
  nutritionist: "my practice",
  "super-admin": "the platform",
}

export function DashboardContent({ role, activeItem }: DashboardContentProps) {
  const OverviewComponent = overviewComponents[role]

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-7xl mx-auto">
        {activeItem === "Overview" ? (
          <OverviewComponent />
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
              <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
            </div>
            <h3 className="text-xl font-semibold mb-1">{activeItem}</h3>
            <p className="text-base text-muted-foreground max-w-sm">
              This section is under development. Content will be available soon.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
