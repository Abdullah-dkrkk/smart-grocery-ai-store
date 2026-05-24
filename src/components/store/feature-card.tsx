import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <Card className={cn("border-0 shadow-sm hover:shadow-md transition-all", className)}>
      <CardContent className="pt-6 text-center sm:text-left">
        <div className="h-10 w-10 rounded-lg bg-brand-green/10 flex items-center justify-center text-brand-green mb-4 mx-auto sm:mx-0">
          {icon}
        </div>
        <h3 className="text-base font-semibold mb-1.5">{title}</h3>
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </CardContent>
    </Card>
  )
}
