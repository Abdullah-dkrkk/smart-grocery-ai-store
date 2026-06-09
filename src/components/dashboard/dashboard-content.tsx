"use client"

import { HealthProfile } from "@/components/dashboard/pages/health-profile"
import { AiAssistant } from "@/components/dashboard/pages/ai-assistant"
import { ShoppingBag } from "lucide-react"
import { UserOverview } from "@/components/dashboard/overviews/user-overview"
import { VendorOverview } from "@/components/dashboard/overviews/vendor-overview"
import { NutritionistOverview } from "@/components/dashboard/overviews/nutritionist-overview"
import { SuperAdminOverview } from "@/components/dashboard/overviews/super-admin-overview"
import { MyOrders } from "@/components/dashboard/pages/my-orders"
import { Discounts } from "@/components/dashboard/pages/discounts"
import { MyProfile } from "@/components/dashboard/pages/my-profile"
import { Addresses } from "@/components/dashboard/pages/addresses"
import { PaymentMethods } from "@/components/dashboard/pages/payment-methods"
import { Reviews } from "@/components/dashboard/pages/reviews"
import { NutritionPlans } from "@/components/dashboard/pages/nutrition-plans"
import { VendorProducts } from "@/components/dashboard/pages/vendor-products"
import { VendorAddProduct } from "@/components/dashboard/pages/vendor-add-product"
import { OrdersReceived } from "@/components/dashboard/pages/orders-received"
import { Inventory } from "@/components/dashboard/pages/inventory"
import { Earnings } from "@/components/dashboard/pages/earnings"
import { StoreSettings } from "@/components/dashboard/pages/store-settings"
import { VendorReviews } from "@/components/dashboard/pages/vendor-reviews"
import { MyClients } from "@/components/dashboard/pages/my-clients"
import { DietCharts } from "@/components/dashboard/pages/diet-charts"
import { Consultations } from "@/components/dashboard/pages/consultations"
import { Appointments } from "@/components/dashboard/pages/appointments"
import { Articles } from "@/components/dashboard/pages/articles"
import { NutritionistProfile } from "@/components/dashboard/pages/nutritionist-profile"
import { MealPlans } from "@/components/dashboard/pages/meal-plans"
import { AdminUsers } from "@/components/dashboard/pages/admin-users"
import { AdminVendors } from "@/components/dashboard/pages/admin-vendors"
import { AdminNutritionists } from "@/components/dashboard/pages/admin-nutritionists"
import { AdminProducts } from "@/components/dashboard/pages/admin-products"
import { AdminOrders } from "@/components/dashboard/pages/admin-orders"
import { AdminPayments } from "@/components/dashboard/pages/admin-payments"
import { Analytics } from "@/components/dashboard/pages/analytics"
import { AdminSettings } from "@/components/dashboard/pages/admin-settings"
import { AuditLog } from "@/components/dashboard/pages/audit-log"

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

const pageComponents: Record<string, React.ElementType | null> = {
  "My Orders": MyOrders,
  "Discounts": Discounts,
  "My Profile": MyProfile,
  "Addresses": Addresses,
  "Payment Methods": PaymentMethods,
  "Reviews": Reviews,
  "Nutrition Plans": NutritionPlans,
  "AI Assistant": AiAssistant,
  "Health Profile": HealthProfile,
  "My Products": VendorProducts,
  "Add Product": VendorAddProduct,
  "Orders Received": OrdersReceived,
  "Inventory": Inventory,
  "Earnings": Earnings,
  "Store Settings": StoreSettings,
  "Product Reviews": VendorReviews,
  "My Clients": MyClients,
  "Meal Plans": MealPlans,
  "Diet Charts": DietCharts,
  "Consultations": Consultations,
  "Appointments": Appointments,
  "Articles": Articles,
  "Profile": NutritionistProfile,
  "Users": AdminUsers,
  "Vendors": AdminVendors,
  "Nutritionists": AdminNutritionists,
  "Products": AdminProducts,
  "Orders": AdminOrders,
  "Payments": AdminPayments,
  "Analytics": Analytics,
  "Settings": AdminSettings,
  "Audit Log": AuditLog,
}

export function DashboardContent({ role, activeItem }: DashboardContentProps) {
  const OverviewComponent = overviewComponents[role]
  const PageComponent = pageComponents[activeItem]

  if (activeItem === "Overview") {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
          <OverviewComponent />
        </div>
      </div>
    )
  }

  if (PageComponent) {
    return (
      <div className="flex-1 overflow-y-auto">
        <div className="p-6 max-w-7xl mx-auto">
          <PageComponent />
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-y-auto">
      <div className="p-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
            <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
          </div>
          <h3 className="text-xl font-semibold mb-1">{activeItem}</h3>
          <p className="text-base text-muted-foreground max-w-sm">
            This section is under development. Content will be available soon.
          </p>
        </div>
      </div>
    </div>
  )
}
