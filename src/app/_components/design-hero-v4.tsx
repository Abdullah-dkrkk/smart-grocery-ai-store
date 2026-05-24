"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Sparkles } from "lucide-react"

interface Droplet {
  x: number; y: number; vx: number; vy: number
  radius: number; alpha: number; life: number; maxLife: number
  color: string; homeX: number; homeY: number
}

export function DesignHeroV4() {
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

    let animId: number; let drops: Droplet[] = []
    let mouseX = -9999, mouseY = -9999, mouseActive = false

    function resize() {
      if (!container || !canvas || !ctx) return
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr; canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`; canvas.style.height = `${rect.height}px`
      ctx.scale(dpr, dpr)
    }

    function spawn(w: number, h: number) {
      if (drops.length < 50) {
        const x = Math.random() * w; const y = h + 5
        drops.push({
          x, y, homeX: x, homeY: y,
          vx: (Math.random() - 0.5) * 0.2, vy: -(Math.random() * 0.5 + 0.2),
          radius: Math.random() * 3.5 + 1.5, alpha: Math.random() * 0.4 + 0.15,
          life: 0, maxLife: Math.random() * 200 + 150,
          color: Math.random() > 0.5 ? `rgba(16,185,129,` : `rgba(249,115,22,`,
        })
      }
    }

    function draw() {
      if (!ctx || !container) return
      const rect = container.getBoundingClientRect(); const w = rect.width; const h = rect.height
      ctx.clearRect(0, 0, w, h)

      if (Math.random() < 0.3) spawn(w, h)

      for (let i = drops.length - 1; i >= 0; i--) {
        const d = drops[i]; d.life++
        const progress = d.life / d.maxLife
        if (progress > 1 || d.y < -10) { drops.splice(i, 1); continue }

        if (mouseActive) {
          const dx = mouseX - d.x; const dy = mouseY - d.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 120 && dist > 0) {
            const force = (1 - dist / 120) * 0.15
            d.vx += (dx / dist) * force
            d.vy += (dy / dist) * force * 0.5
            d.radius += 0.05
          }
        }

        d.vx *= 0.98; d.vy *= 0.98
        d.x += d.vx + Math.sin(d.life * 0.02) * 0.2
        d.y += d.vy

        const currentAlpha = d.alpha * (1 - progress) * 0.6
        ctx.beginPath(); ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2)
        ctx.fillStyle = d.color + currentAlpha + ")"; ctx.fill()
        ctx.beginPath()
        ctx.arc(d.x + d.radius * 0.3, d.y - d.radius * 0.3, d.radius * 0.4, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${currentAlpha * 0.3})`; ctx.fill()
      }

      if (drops.length < 50 && Math.random() < 0.1) {
        ctx.beginPath()
        ctx.arc(Math.random() * w, Math.random() * h, Math.random() * 1.5 + 0.5, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255,255,255,${Math.random() * 0.4 + 0.1})`; ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    function onMove(clientX: number, clientY: number) {
      if (!container) return; const rect = container.getBoundingClientRect()
      mouseX = clientX - rect.left; mouseY = clientY - rect.top; mouseActive = true
    }
    function onMouseMove(e: MouseEvent) { onMove(e.clientX, e.clientY) }
    function onTouchMove(e: TouchEvent) { e.preventDefault(); const t = e.touches[0]; onMove(t.clientX, t.clientY) }
    function onLeave() { mouseActive = false; mouseX = -9999; mouseY = -9999 }

    resize(); draw()
    window.addEventListener("resize", resize)
    container.addEventListener("mousemove", onMouseMove); container.addEventListener("mouseleave", onLeave)
    container.addEventListener("touchmove", onTouchMove, { passive: false }); container.addEventListener("touchend", onLeave)

    const ctxGsap = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })
      tl.fromTo(badgeRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
        .fromTo(titleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.4")
        .fromTo(subtitleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.5")
    }, container)

    return () => {
      cancelAnimationFrame(animId); window.removeEventListener("resize", resize)
      container.removeEventListener("mousemove", onMouseMove); container.removeEventListener("mouseleave", onLeave)
      container.removeEventListener("touchmove", onTouchMove); container.removeEventListener("touchend", onLeave)
      ctxGsap.revert()
    }
  }, [])

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-gradient-to-b from-sky-50 via-white to-emerald-50 py-24 md:py-36">
      <canvas ref={canvasRef} className="absolute inset-0 block pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div ref={badgeRef} className="inline-flex items-center gap-2 rounded-full border bg-white/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-xs mb-8">
            <Sparkles className="h-4 w-4 text-sky-500" />Dew Drops · Variation 4<Sparkles className="h-4 w-4 text-emerald-500" />
          </div>
          <h1 ref={titleRef} className="font-heading text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-none mb-6">
            Morning <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-500 to-emerald-500">Fresh</span>
          </h1>
          <p ref={subtitleRef} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The freshest produce, chilled dairy, and artisan goods — delivered with the morning dew.
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  )
}
