"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Sparkles } from "lucide-react"

interface Leaf {
  x: number; y: number; vx: number; vy: number
  size: number; rotation: number; rotSpeed: number
  color: string; alpha: number; sway: number; swaySpeed: number
}

export function DesignHeroV3() {
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

    let animId: number; let leaves: Leaf[] = []
    let mouseX = -9999, mouseY = -9999, mouseActive = false

    function resize() {
      if (!container || !canvas || !ctx) return
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr; canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`; canvas.style.height = `${rect.height}px`
      ctx.scale(dpr, dpr)
      init(rect.width, rect.height)
    }

    function init(w: number, h: number) {
      leaves = []
      for (let i = 0; i < 120; i++) {
        leaves.push({
          x: Math.random() * w, y: Math.random() * h,
          vx: (Math.random() - 0.5) * 0.3, vy: Math.random() * 0.6 + 0.2,
          size: Math.random() * 28 + 10,
          rotation: Math.random() * Math.PI * 2,
          rotSpeed: (Math.random() - 0.5) * 0.025,
          color: [
            `hsl(${90 + Math.random() * 40}, ${55 + Math.random() * 25}%, ${30 + Math.random() * 30}%)`,
            `hsl(${110 + Math.random() * 30}, ${50 + Math.random() * 30}%, ${40 + Math.random() * 25}%)`,
            `hsl(${80 + Math.random() * 30}, ${60 + Math.random() * 20}%, ${50 + Math.random() * 20}%)`,
            `hsl(${140 + Math.random() * 30}, ${50 + Math.random() * 25}%, ${35 + Math.random() * 20}%)`,
          ][i % 4],
          alpha: Math.random() * 0.35 + 0.15, sway: 0, swaySpeed: Math.random() * 0.02 + 0.008,
        })
      }
    }

    function drawLeaf(c: CanvasRenderingContext2D, l: Leaf) {
      l.sway += l.swaySpeed
      l.x += l.vx + Math.sin(l.sway) * 0.6
      l.y += l.vy
      l.rotation += l.rotSpeed

      if (mouseActive) {
        const dx = l.x - mouseX; const dy = l.y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 250 && dist > 0) {
          const force = (1 - dist / 250) * 1.0
          l.vx += (dx / dist) * force * 0.6
          l.vy += (dy / dist) * force * 0.4
          l.rotSpeed += (Math.random() - 0.5) * 0.05 * (1 - dist / 250)
        }
      }

      l.vx *= 0.97

      if (!container) return
      const rect = container.getBoundingClientRect()
      if (l.y > rect.height + 40) { l.y = -30; l.x = Math.random() * rect.width; l.vy = Math.random() * 0.6 + 0.2 }
      if (l.x < -50) l.x = rect.width + 30
      if (l.x > rect.width + 50) l.x = -30

      c.save(); c.translate(l.x, l.y); c.rotate(l.rotation); c.globalAlpha = l.alpha
      c.beginPath(); c.moveTo(0, 0)
      c.quadraticCurveTo(l.size * 0.5, -l.size * 0.45, l.size * 0.9, 0)
      c.quadraticCurveTo(l.size * 0.5, l.size * 0.45, 0, 0)
      c.closePath(); c.fillStyle = l.color; c.fill()
      c.beginPath(); c.moveTo(0, 0); c.lineTo(l.size * 0.9, 0)
      c.strokeStyle = l.color.replace(")", ",0.5)").replace("hsl", "hsla")
      c.lineWidth = 0.7; c.stroke()
      c.globalAlpha = 1; c.restore()
    }

    function draw() {
      if (!ctx || !container) return
      const rect = container.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)
      for (const l of leaves) drawLeaf(ctx, l)
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
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-b from-lime-50 via-white to-green-50 min-h-[500px] md:min-h-[600px] flex flex-col"
    >
      <canvas ref={canvasRef} className="absolute inset-0 block pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10 flex-1 flex items-center justify-center py-20 md:py-28">
        <div className="max-w-4xl mx-auto text-center">
          <div ref={badgeRef} className="inline-flex items-center gap-2 rounded-full border bg-white/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-xs mb-8">
            <Sparkles className="h-4 w-4 text-brand-green" />
            Leaf Drift — Final
            <Sparkles className="h-4 w-4 text-emerald-600" />
          </div>
          <h1 ref={titleRef} className="font-heading text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-none mb-6">
            From <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">Farm</span> to Table
          </h1>
          <p ref={subtitleRef} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Freshly harvested produce sourced directly from local farms. Taste the difference of farm-to-table.
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  )
}
