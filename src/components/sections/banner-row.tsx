import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface Banner {
  title: string
  subtitle: string
  buttonLabel: string
  image?: string
  gradient?: string
}

interface BannerRowProps {
  banners: Banner[]
}

const defaultGradients = [
  "from-emerald-100/80 to-emerald-50/80 dark:from-emerald-950/40 dark:to-emerald-900/20",
  "from-orange-100/80 to-amber-50/80 dark:from-orange-950/40 dark:to-amber-900/20",
  "from-sky-100/80 to-blue-50/80 dark:from-sky-950/40 dark:to-blue-900/20",
]

const badgeColors = [
  "bg-emerald-500 text-white",
  "bg-orange-500 text-white",
  "bg-sky-500 text-white",
]

export function BannerRow({ banners }: BannerRowProps) {
  if (banners.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm">No banners available.</p>
      </div>
    )
  }

  return (
    <div className="grid md:grid-cols-3 gap-5">
      {banners.map((banner, idx) => (
        <div
          key={idx}
          className={`relative rounded-xl overflow-hidden bg-gradient-to-br ${banner.gradient || defaultGradients[idx % defaultGradients.length]} border p-6 min-h-[240px] flex flex-col justify-center`}
        >
          {banner.image && (
            <img
              src={banner.image}
              alt=""
              className="absolute right-4 top-1/2 -translate-y-1/2 h-[90%] w-auto object-contain opacity-50 dark:opacity-25 rounded-lg"
              loading="lazy"
            />
          )}
          <div className="relative z-10 max-w-[60%]">
            <Badge variant="secondary" className={`text-[11px] mb-2 font-medium border-0 ${badgeColors[idx % badgeColors.length]}`}>
              {banner.subtitle}
            </Badge>
            <h3 className="text-[17px] font-heading font-semibold leading-snug mb-4 whitespace-pre-line">
              {banner.title}
            </h3>
            <Button className="h-10 bg-brand-green hover:bg-brand-green/90 text-white font-semibold text-sm px-5">
              {banner.buttonLabel}
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
