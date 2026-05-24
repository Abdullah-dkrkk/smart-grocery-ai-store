"use client"

import { StarRating } from "@/components/common/star-rating"
import type { TestimonialItem } from "@/types/common"

interface TestimonialSectionProps {
  title?: string
  subtitle?: string
  testimonials: TestimonialItem[]
}

export function TestimonialSection({ title = "What our Clients say", subtitle, testimonials }: TestimonialSectionProps) {
  if (testimonials.length === 0) {
    return (
      <section>
        <div className="text-center py-12 text-muted-foreground">
          <p className="text-sm">No testimonials available.</p>
        </div>
      </section>
    )
  }

  return (
    <section>
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-heading font-semibold tracking-tight">{title}</h2>
        {subtitle && <p className="text-[15px] text-muted-foreground mt-1">{subtitle}</p>}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {testimonials.map((t) => (
          <div key={t.id} className="bg-card border rounded-xl p-6 transition-shadow hover:shadow-md flex flex-col">
            <StarRating rating={t.rating} size="md" />
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed flex-1">
              &ldquo;{t.text}&rdquo;
            </p>
            <div className="flex items-center gap-3 mt-4 pt-4 border-t">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-green to-brand-orange flex items-center justify-center text-white font-semibold text-sm">
                {t.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div>
                <p className="text-sm font-medium">{t.name}</p>
                <p className="text-xs text-muted-foreground">{t.date}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
