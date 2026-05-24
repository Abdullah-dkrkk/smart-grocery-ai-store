import { cn } from "@/lib/utils"

const brandColors = [
  { name: "Brand Green", token: "brand-green", value: "#059669", class: "bg-brand-green" },
  { name: "Brand Green Light", token: "brand-green-light", value: "#ecfdf5", class: "bg-brand-green-light border", textClass: "text-foreground" },
  { name: "Brand Green Dark", token: "brand-green-dark", value: "#065f46", class: "bg-brand-green-dark" },
  { name: "Brand Orange", token: "brand-orange", value: "#f97316", class: "bg-brand-orange" },
  { name: "Brand Orange Light", token: "brand-orange-light", value: "#fff7ed", class: "bg-brand-orange-light border", textClass: "text-foreground" },
  { name: "Brand Orange Dark", token: "brand-orange-dark", value: "#c2410c", class: "bg-brand-orange-dark" },
]

const semanticColors = [
  { name: "Background", token: "background", value: "#ffffff", class: "bg-background border", textClass: "text-foreground" },
  { name: "Foreground", token: "foreground", value: "#0c1222", class: "bg-foreground" },
  { name: "Card", token: "card", value: "#ffffff", class: "bg-card border", textClass: "text-foreground" },
  { name: "Card Foreground", token: "card-foreground", value: "#0c1222", class: "bg-card-foreground" },
  { name: "Primary", token: "primary", value: "#059669", class: "bg-primary" },
  { name: "Primary Foreground", token: "primary-foreground", value: "#ffffff", class: "bg-primary-foreground border", textClass: "text-foreground" },
  { name: "Secondary", token: "secondary", value: "#f1f5f9", class: "bg-secondary border", textClass: "text-foreground" },
  { name: "Secondary Foreground", token: "secondary-foreground", value: "#1e293b", class: "bg-secondary-foreground" },
  { name: "Muted", token: "muted", value: "#f8fafc", class: "bg-muted border", textClass: "text-foreground" },
  { name: "Muted Foreground", token: "muted-foreground", value: "#64748b", class: "bg-muted-foreground" },
  { name: "Accent", token: "accent", value: "#fff7ed", class: "bg-accent border", textClass: "text-foreground" },
  { name: "Accent Foreground", token: "accent-foreground", value: "#c2410c", class: "bg-accent-foreground" },
  { name: "Border", token: "border", value: "#e2e8f0", class: "bg-border border-2 border-foreground/10", textClass: "text-foreground" },
  { name: "Input", token: "input", value: "#e2e8f0", class: "bg-input border-2 border-foreground/10", textClass: "text-foreground" },
  { name: "Ring", token: "ring", value: "#059669", class: "bg-ring" },
  { name: "Destructive", token: "destructive", value: "#ef4444", class: "bg-destructive" },
]

function Swatch({ name, token, value, class: bgClass, textClass }: { name: string; token: string; value: string; class: string; textClass?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className={cn("h-20 w-full rounded-lg", bgClass, textClass === "text-foreground" ? "flex items-end p-2" : "")}>
        {textClass === "text-foreground" && (
          <span className="text-[10px] font-mono text-muted-foreground">{value}</span>
        )}
      </div>
      <div>
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs font-mono text-muted-foreground">--{token}</p>
        <p className="text-xs font-mono text-muted-foreground">{value}</p>
      </div>
    </div>
  )
}

export function ColorSection() {
  return (
    <section className="py-section border-b">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-heading font-semibold tracking-tight mb-4">
            Colors
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl">
            A balanced palette combining fresh green and warm orange tones for a professional, inviting grocery experience.
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-xl font-heading font-semibold mb-6">Brand Colors</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {brandColors.map((color) => (
              <Swatch key={color.token} {...color} />
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-heading font-semibold mb-6">Semantic Colors</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {semanticColors.map((color) => (
              <Swatch key={color.token} {...color} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
