import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ArrowRight } from "lucide-react"

interface DealBannerProps {
  title: string
  description?: string
  buttonLabel?: string
  onAction?: () => void
  image?: string
  variant?: "green" | "orange" | "dark"
  className?: string
}

const variantStyles = {
  green: "bg-gradient-to-br from-brand-green to-brand-green-dark text-white",
  orange: "bg-gradient-to-br from-brand-orange to-brand-orange-dark text-white",
  dark: "bg-gradient-to-br from-gray-900 to-gray-800 text-white",
}

export function DealBanner({ title, description, buttonLabel, onAction, image, variant = "green", className }: DealBannerProps) {
  return (
    <div className={cn("relative rounded-xl overflow-hidden p-8 md:p-12", variantStyles[variant], className)}>
      {image && (
        <div className="absolute inset-0 opacity-15">
          <img src={image} alt="" className="w-full h-full object-cover" />
        </div>
      )}
      <div className="relative z-10 max-w-lg">
        <h3 className="text-2xl md:text-3xl font-heading font-semibold tracking-tight mb-3">{title}</h3>
        {description && <p className="text-base opacity-90 mb-6">{description}</p>}
        {buttonLabel && onAction && (
          <Button variant="secondary" className="rounded-full" onClick={onAction}>
            {buttonLabel}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
