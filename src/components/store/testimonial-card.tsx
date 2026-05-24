import { Card, CardContent } from "@/components/ui/card"
import { StarRating } from "@/components/common/star-rating"
import { cn } from "@/lib/utils"
import type { TestimonialItem } from "@/types/common"

interface TestimonialCardProps {
  testimonial: TestimonialItem
  className?: string
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  return (
    <Card className={cn("border-0 shadow-sm", className)}>
      <CardContent className="p-6 space-y-4">
        <StarRating rating={testimonial.rating} size="sm" />
        <p className="text-sm text-foreground/80 leading-relaxed italic">&ldquo;{testimonial.text}&rdquo;</p>
        <div className="flex items-center gap-3 pt-2 border-t">
          <div className="h-9 w-9 rounded-full bg-brand-green/10 flex items-center justify-center text-brand-green text-sm font-medium shrink-0">
            {testimonial.avatar ? (
              <img src={testimonial.avatar} alt={testimonial.name} className="h-full w-full rounded-full object-cover" />
            ) : (
              testimonial.name.charAt(0)
            )}
          </div>
          <div>
            <p className="text-sm font-medium">{testimonial.name}</p>
            {testimonial.date && <p className="text-xs text-muted-foreground">{testimonial.date}</p>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
