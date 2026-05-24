import { cn } from "@/lib/utils"

const typeScale = [
  {
    name: "Display 2XL",
    tag: "text-9xl",
    size: "clamp(3.5rem, 10vw, 5rem)",
    css: "var(--text-9xl)",
    lineHeight: "1.05",
    className: "text-9xl",
  },
  {
    name: "Display XL",
    tag: "text-8xl",
    size: "clamp(3rem, 8vw, 4.5rem)",
    css: "var(--text-8xl)",
    lineHeight: "1.1",
    className: "text-8xl",
  },
  {
    name: "Display LG",
    tag: "text-7xl",
    size: "clamp(2.625rem, 6.5vw, 4rem)",
    css: "var(--text-7xl)",
    lineHeight: "1.15",
    className: "text-7xl",
  },
  {
    name: "Display MD",
    tag: "text-6xl",
    size: "clamp(2.25rem, 5.5vw, 3.25rem)",
    css: "var(--text-6xl)",
    lineHeight: "1.2",
    className: "text-6xl",
  },
  {
    name: "Display SM",
    tag: "text-5xl",
    size: "clamp(1.875rem, 4.5vw, 2.5rem)",
    css: "var(--text-5xl)",
    lineHeight: "1.25",
    className: "text-5xl",
  },
  {
    name: "Heading 1",
    tag: "text-4xl",
    size: "clamp(1.625rem, 4vw, 2rem)",
    css: "var(--text-4xl)",
    lineHeight: "1.3",
    className: "text-4xl",
  },
  {
    name: "Heading 2",
    tag: "text-3xl",
    size: "1.5rem (24px)",
    css: "var(--text-3xl)",
    lineHeight: "1.35",
    className: "text-3xl",
  },
  {
    name: "Heading 3",
    tag: "text-2xl",
    size: "1.25rem (20px)",
    css: "var(--text-2xl)",
    lineHeight: "1.4",
    className: "text-2xl",
  },
  {
    name: "Heading 4",
    tag: "text-xl",
    size: "1.125rem (18px)",
    css: "var(--text-xl)",
    lineHeight: "1.45",
    className: "text-xl",
  },
  {
    name: "Body Large",
    tag: "text-lg",
    size: "1rem (16px)",
    css: "var(--text-lg)",
    lineHeight: "1.5",
    className: "text-lg",
  },
  {
    name: "Body",
    tag: "text-base",
    size: "0.875rem (14px)",
    css: "var(--text-base)",
    lineHeight: "1.5",
    className: "text-base",
  },
  {
    name: "Body Small",
    tag: "text-sm",
    size: "0.8125rem (13px)",
    css: "var(--text-sm)",
    lineHeight: "1.5",
    className: "text-sm",
  },
  {
    name: "Caption",
    tag: "text-xs",
    size: "0.75rem (12px)",
    css: "var(--text-xs)",
    lineHeight: "1.5",
    className: "text-xs",
  },
]

const fontFamilies = [
  {
    name: "Inter",
    usage: "Body, UI, Labels",
    token: "--font-sans",
    css: "Inter, sans-serif",
    className: "font-sans",
    sample: "The quick brown fox jumps over the lazy dog 1234567890",
    sampleSize: "text-base",
  },
  {
    name: "Bricolage Grotesque",
    usage: "Headings, Display, Titles",
    token: "--font-heading",
    css: "Bricolage Grotesque, sans-serif",
    className: "font-heading",
    sample: "The quick brown fox jumps over the lazy dog 1234567890",
    sampleSize: "text-xl",
  },
  {
    name: "JetBrains Mono",
    usage: "Code, Tokens, Technical",
    token: "--font-mono",
    css: "JetBrains Mono, monospace",
    className: "font-mono",
    sample: "The quick brown fox jumps over the lazy dog 1234567890",
    sampleSize: "text-sm",
  },
]

export function TypographySection() {
  return (
    <section className="py-section border-b">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="mb-12">
          <h2 className="text-4xl md:text-5xl font-heading font-semibold tracking-tight mb-4">
            Typography
          </h2>
          <p className="text-base text-muted-foreground max-w-2xl">
            Using Inter for clean UI readability and Bricolage Grotesque for distinctive headings. Body set at 14px for a compact, information-dense layout.
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-xl font-heading font-semibold mb-6">Font Families</h3>
          <div className="grid md:grid-cols-3 gap-6">
            {fontFamilies.map((font) => (
              <div
                key={font.name}
                className="rounded-xl border bg-card p-6"
              >
                <div className="mb-4">
                  <p className="text-lg font-heading font-semibold">{font.name}</p>
                  <p className="text-sm text-muted-foreground">{font.usage}</p>
                </div>
                <div className="space-y-1 mb-4">
                  <p className="text-xs font-mono text-muted-foreground">{font.token}</p>
                  <p className="text-xs font-mono text-muted-foreground">{font.css}</p>
                </div>
                <p className={cn(font.sampleSize, font.className)}>{font.sample}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-heading font-semibold mb-6">Type Scale</h3>
          <div className="space-y-6">
            {typeScale.map((type) => (
              <div
                key={type.name}
                className="flex flex-col sm:flex-row sm:items-baseline gap-4 pb-6 border-b last:border-0"
              >
                <div className="w-36 shrink-0">
                  <p className="text-sm font-medium">{type.name}</p>
                  <p className="text-xs font-mono text-muted-foreground">{type.tag}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn(type.className, "font-heading font-semibold truncate")}>
                    SmartGrocery Fresh
                  </p>
                </div>
                <div className="w-56 shrink-0 text-right">
                  <p className="text-xs font-mono text-muted-foreground">{type.size}</p>
                  <p className="text-xs font-mono text-muted-foreground">lh: {type.lineHeight}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
