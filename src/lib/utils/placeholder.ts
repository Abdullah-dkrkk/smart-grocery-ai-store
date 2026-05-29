const SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
  <rect width="400" height="500" fill="{bg}"/>
  <g transform="translate(200,220) scale(1.5)">
    <rect x="-40" y="-60" width="80" height="120" rx="8" fill="{box}"/>
    <rect x="-25" y="-40" width="50" height="15" rx="4" fill="{inner}"/>
    <rect x="-25" y="-18" width="35" height="8" rx="4" fill="{inner}"/>
    <circle cx="0" cy="15" r="12" fill="{circle}"/>
    <path d="M-10 30 Q0 25 10 30" stroke="{inner}" fill="none" stroke-width="1.5"/>
  </g>
  <text x="200" y="340" text-anchor="middle" font-family="system-ui" font-size="14" fill="{inner}">Product Image</text>
</svg>`

const DARK = { bg: "#1e293b", box: "#334155", inner: "#64748b", circle: "#475569" }
const LIGHT = { bg: "#f1f5f9", box: "#cbd5e1", inner: "#94a3b8", circle: "#e2e8f0" }

function buildSvg(dark: boolean) {
  const c = dark ? DARK : LIGHT
  return SVG.replace(/\{bg\}/g, c.bg).replace(/\{box\}/g, c.box).replace(/\{inner\}/g, c.inner).replace(/\{circle\}/g, c.circle)
}

function toDataUrl(svg: string): string {
  return "data:image/svg+xml," + encodeURIComponent(svg)
}

const LIGHT_URL = toDataUrl(buildSvg(false))
const DARK_URL = toDataUrl(buildSvg(true))

export function getPlaceholderImage(): string {
  return LIGHT_URL
}

const CATEGORY_PATHS: Record<string, string> = {
  "milks-dairies": "M8 2h8l1 3H7l1-3zM6 5h12l-1 14a3 3 0 0 1-3 3H10a3 3 0 0 1-3-3L6 5zM10 11v6M14 11v6",
  "wines-drinks": "M12 2v12M8 14a4 4 0 0 0 8 0M6 14c0 2.5 1.5 5 6 5s6-2.5 6-5M9 2h6",
  "clothing-beauty": "M6 2L2 6v5h4v9a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-9h4V6l-4-4H6zM9 14h6",
  "pet-foods": "M5 7a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5M19 7a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5M12 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4M4 16c0-2.5 2-4 4-4h8c2 0 4 1.5 4 4M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2",
  "baking-material": "M18 2l-8 8M20 4l-8 8M6 18a4 4 0 1 0 0-8 4 4 0 0 0 0 8M6 14v-2a4 4 0 0 1 4-4h4",
  "fresh-fruit": "M12 7c-3.3 0-6 2.7-6 6s2.7 6 6 6 6-2.7 6-6-2.7-6-6-6zM12 3v4M8 5c-2 1-3 3-3 5M16 5c2 1 3 3 3 5M9 13h6M12 10v6",
  "vegetables": "M7 13c-1.5-1-3-3-3-6 0-2.5 2-4 4-4 1.5 0 3 1 4 2.5M7 13l-3 8h8l-2-4M11 9c1.5-1 3-2 5-2 2.5 0 4 1.5 4 4 0 2-1 4-2.5 5M13 11l3 7h-6l1-3",
  "bread-juice": "M4 8c0-1.5 1-3 2.5-3h11C19 5 20 6.5 20 8v1c0 1-1 2-2 2H6c-1 0-2-1-2-2V8zM4 11v3c0 1.5 1.5 3 3 3h10c1.5 0 3-1.5 3-3v-3M15 14h2",
  "fresh-seafood": "M4 18c2-2 5-3 8-3s6 1 8 3M2 14c3-3 6-5 10-5s7 2 10 5M6 10c2-2 5-3 8-3s5 1 7 3",
  "fast-food": "M3 15c0-1.5.5-3 1.5-3.5C5.5 11 7 12 8 13c1-1 2.5-2 3.5-1.5S13 13 14 14c1-1 2.5-2 3.5-1.5S19 14 20 15M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4M12 4v3M9 5v2M15 5v2",
  "cake-milk": "M3 15c0-1.5.5-3 1.5-3.5C5.5 11 7 12 8 13c1-1 2.5-2 3.5-1.5S13 13 14 14c1-1 2.5-2 3.5-1.5S19 14 20 15M3 15v4a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-4M12 4v3M9 5v2M15 5v2",
  "coffee-teas": "M18 8h1a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2h-1M4 4h12v10a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4V4zM8 2v2M12 2v2",
  "meat-poultry": "M4 18c2-2 5-3 8-3s6 1 8 3M2 14c3-3 6-5 10-5s7 2 10 5M6 10c2-2 5-3 8-3s5 1 7 3",
}

const CATEGORY_COLORS: Record<string, string> = {
  "milks-dairies": "#3b82f6",
  "wines-drinks": "#ec4899",
  "clothing-beauty": "#22c55e",
  "pet-foods": "#eab308",
  "baking-material": "#ef4444",
  "fresh-fruit": "#22c55e",
  "vegetables": "#10b981",
  "bread-juice": "#f97316",
  "fresh-seafood": "#06b6d4",
  "fast-food": "#ef4444",
  "cake-milk": "#d946ef",
  "coffee-teas": "#78716c",
  "meat-poultry": "#dc2626",
}

const CATEGORY_BGS: Record<string, string> = {
  "milks-dairies": "#eff6ff",
  "wines-drinks": "#fdf2f8",
  "clothing-beauty": "#f0fdf4",
  "pet-foods": "#fefce8",
  "baking-material": "#fef2f2",
  "fresh-fruit": "#f0fdf4",
  "vegetables": "#ecfdf5",
  "bread-juice": "#fff7ed",
  "fresh-seafood": "#ecfeff",
  "fast-food": "#fef2f2",
  "cake-milk": "#fdf2f8",
  "coffee-teas": "#f5f5f4",
  "meat-poultry": "#fef2f2",
}

export function getCategoryPlaceholderImage(slug: string): string {
  const path = CATEGORY_PATHS[slug]
  const fg = CATEGORY_COLORS[slug] || "#6b7280"
  const bg = CATEGORY_BGS[slug] || "#f3f4f6"

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500">
    <rect width="400" height="500" fill="${bg}"/>
    <g transform="translate(200,190) scale(1.8)">
      <path d="${path || 'M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0'}" fill="none" stroke="${fg}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <rect x="0" y="340" width="400" height="1" fill="${fg}20"/>
    <text x="200" y="380" text-anchor="middle" font-family="system-ui, sans-serif" font-size="13" fill="${fg}" font-weight="600" letter-spacing="0.5">Product Image</text>
  </svg>`

  return "data:image/svg+xml," + encodeURIComponent(svg)
}

export function imgSrc(src: string | null | undefined, fallback?: string): string {
  if (src && src.trim()) return src
  return fallback || LIGHT_URL
}

export function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  const target = e.currentTarget
  if (target.src.startsWith("data:image/svg")) return
  target.src = LIGHT_URL
}
