"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Sparkles } from "lucide-react"

interface Produce {
  x: number; y: number; vx: number; vy: number
  radius: number; color: string; swayOffset: number; swaySpeed: number
  homeX: number; homeY: number
}

const PRODUCE_COLORS = [
  "#ef4444", "#f97316", "#10b981", "#f59e0b", "#8b5cf6",
  "#ec4899", "#14b8a6", "#22c55e", "#eab308", "#a855f7",
]

export function DesignHeroV1() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let items: Produce[] = []
    let mouseX = -9999, mouseY = -9999, mouseActive = false

    function resize() {
      if (!container || !canvas || !ctx) return
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.scale(dpr, dpr)
      init(rect.width, rect.height)
    }

    function init(w: number, h: number) {
      items = []
      for (let i = 0; i < 40; i++) {
        const x = Math.random() * w
        const y = Math.random() * h
        items.push({
          x, y, homeX: x, homeY: y,
          vx: 0, vy: -(Math.random() * 0.4 + 0.15),
          radius: Math.random() * 18 + 8,
          color: PRODUCE_COLORS[i % PRODUCE_COLORS.length],
          swayOffset: Math.random() * Math.PI * 2,
          swaySpeed: Math.random() * 0.008 + 0.004,
        })
      }
    }

    function draw() {
      if (!ctx || !container) return
      const rect = container.getBoundingClientRect()
      const w = rect.width; const h = rect.height
      ctx.clearRect(0, 0, w, h)

      for (const p of items) {
        p.swayOffset += p.swaySpeed
        p.vx += Math.sin(p.swayOffset) * 0.02
        p.vy *= 0.998

        if (mouseActive) {
          const dx = p.x - mouseX; const dy = p.y - mouseY
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 180 && dist > 0) {
            const force = (1 - dist / 180) * 0.4
            p.vx += (dx / dist) * force
            p.vy += (dy / dist) * force
            if (dist < 50) {
              const repel = (1 - dist / 50) * 1.2
              p.vx += (dx / dist) * repel
              p.vy += (dy / dist) * repel
            }
          }
        }

        const returnX = (p.homeX - p.x) * 0.003
        const returnY = (p.homeY - p.y) * 0.003
        p.vx += returnX
        p.vy += returnY + (p.homeY > h * 0.5 ? -0.05 : 0.05)
        p.vx *= 0.97
        p.vy *= 0.97

        p.x += p.vx
        p.y += p.vy

        if (p.y + p.radius < -50) { p.y = h + 50; p.homeY = h + 50 }
        if (p.y > h + 50) { p.y = -50; p.homeY = -50 }
        if (p.x < -50) { p.x = w + 50; p.homeX = w + 50 }
        if (p.x > w + 50) { p.x = -50; p.homeX = -50 }

        ctx.save()
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color + "18"
        ctx.fill()
        ctx.closePath()

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 0.7, 0, Math.PI * 2)
        ctx.fillStyle = p.color + "12"
        ctx.fill()
        ctx.closePath()

        ctx.beginPath()
        ctx.arc(p.x - p.radius * 0.25, p.y - p.radius * 0.25, p.radius * 0.3, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255,255,255,0.25)"
        ctx.fill()
        ctx.closePath()
        ctx.restore()
      }

      animId = requestAnimationFrame(draw)
    }

    function onMove(clientX: number, clientY: number) {
      if (!container) return
      const rect = container.getBoundingClientRect()
      mouseX = clientX - rect.left
      mouseY = clientY - rect.top
      mouseActive = true
    }

    function onMouseMove(e: MouseEvent) { onMove(e.clientX, e.clientY) }
    function onTouchMove(e: TouchEvent) { e.preventDefault(); const t = e.touches[0]; onMove(t.clientX, t.clientY) }
    function onLeave() { mouseActive = false; mouseX = -9999; mouseY = -9999 }

    resize()
    draw()
    window.addEventListener("resize", resize)
    container.addEventListener("mousemove", onMouseMove)
    container.addEventListener("mouseleave", onLeave)
    container.addEventListener("touchmove", onTouchMove, { passive: false })
    container.addEventListener("touchend", onLeave)

    const ctxGsap = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      tl.fromTo(badgeRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
        .fromTo(titleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.4")
        .fromTo(subtitleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.5")
    }, container)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
      container.removeEventListener("mousemove", onMouseMove)
      container.removeEventListener("mouseleave", onLeave)
      container.removeEventListener("touchmove", onTouchMove)
      container.removeEventListener("touchend", onLeave)
      ctxGsap.revert()
    }
  }, [])

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-gradient-to-b from-emerald-50 via-white to-orange-50 py-24 md:py-36">
      <canvas ref={canvasRef} className="absolute inset-0 block pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div ref={badgeRef} className="inline-flex items-center gap-2 rounded-full border bg-white/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-xs mb-8">
            <Sparkles className="h-4 w-4 text-brand-orange" />
            Fresh Float · Variation 1
            <Sparkles className="h-4 w-4 text-brand-green" />
          </div>
          <h1 ref={titleRef} className="font-heading text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-none mb-6">
            Fresh{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-orange-500">Groceries</span>
            {" "}Delivered
          </h1>
          <p ref={subtitleRef} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Farm-fresh produce, dairy, and pantry staples — picked at peak ripeness and delivered to your doorstep.
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  )
}
