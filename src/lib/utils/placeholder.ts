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

export function imgSrc(src: string | null | undefined, fallback?: string): string {
  if (src && src.trim()) return src
  return fallback || LIGHT_URL
}

export function handleImgError(e: React.SyntheticEvent<HTMLImageElement>) {
  const target = e.currentTarget
  if (target.src.startsWith("data:image/svg")) return
  target.src = LIGHT_URL
}
