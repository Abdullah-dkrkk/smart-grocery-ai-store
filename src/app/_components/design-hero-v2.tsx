"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Sparkles } from "lucide-react"

interface Blob {
  x: number; y: number
  radius: number; radiusX: number; radiusY: number
  phase: number; speed: number
  color: string; color2: string
  alpha: number; rotation: number; rotSpeed: number
  homeX: number; homeY: number
}

export function DesignHeroV2() {
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

    let animId: number; let blobs: Blob[] = []
    let time = 0
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
      blobs = []
      for (let i = 0; i < 12; i++) {
        const x = Math.random() * w; const y = Math.random() * h
        const r = Math.random() * 80 + 40
        blobs.push({
          x, y, homeX: x, homeY: y,
          radius: r, radiusX: r * (Math.random() * 0.4 + 0.8), radiusY: r * (Math.random() * 0.4 + 0.8),
          phase: Math.random() * Math.PI * 2, speed: Math.random() * 0.005 + 0.003,
          color: `${120 + Math.random() * 40}, ${50 + Math.random() * 30}%, ${70 + Math.random() * 20}%`,
          color2: `${30 + Math.random() * 30}, ${60 + Math.random() * 30}%, ${75 + Math.random() * 20}%`,
          alpha: Math.random() * 0.15 + 0.08, rotation: Math.random() * Math.PI * 2, rotSpeed: (Math.random() - 0.5) * 0.002,
        })
      }
    }

    function drawBlob(c: CanvasRenderingContext2D, b: Blob, w: number, h: number) {
      const pulse = Math.sin(time * b.speed + b.phase) * 15
      let rx = b.radiusX + pulse
      let ry = b.radiusY + pulse * 0.7

      if (mouseActive) {
        const dx = b.x - mouseX; const dy = b.y - mouseY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 250 && dist > 0) {
          const force = (1 - dist / 250) * 0.3
          b.x += (dx / dist) * force
          b.y += (dy / dist) * force
          rx += (1 - dist / 250) * 20
          ry += (1 - dist / 250) * 15
        }
      }

      const returnX = (b.homeX - b.x) * 0.008
      const returnY = (b.homeY - b.y) * 0.008
      b.x += returnX + Math.sin(time * b.speed * 0.7 + b.phase) * 0.15
      b.y += returnY + Math.cos(time * b.speed * 0.5 + b.phase * 1.3) * 0.1
      b.rotation += b.rotSpeed

      if (b.x < -b.radius) { b.x = w + b.radius; b.homeX = w + b.radius }
      if (b.x > w + b.radius) { b.x = -b.radius; b.homeX = -b.radius }
      if (b.y < -b.radius) { b.y = h + b.radius; b.homeY = h + b.radius }
      if (b.y > h + b.radius) { b.y = -b.radius; b.homeY = -b.radius }

      c.save()
      c.translate(b.x, b.y)
      c.rotate(b.rotation)
      c.beginPath()

      for (let i = 0; i <= 100; i++) {
        const angle = (i / 100) * Math.PI * 2
        const r = rx * ry / Math.sqrt((ry * Math.cos(angle)) ** 2 + (rx * Math.sin(angle)) ** 2)
        const px = r * Math.cos(angle); const py = r * Math.sin(angle)
        if (i === 0) c.moveTo(px, py); else c.lineTo(px, py)
      }
      c.closePath()

      const grad = c.createRadialGradient(0, 0, 0, 0, 0, Math.max(rx, ry))
      grad.addColorStop(0, `hsla(${b.color}, ${b.alpha + 0.3})`)
      grad.addColorStop(0.6, `hsla(${b.color2}, ${b.alpha + 0.1})`)
      grad.addColorStop(1, `hsla(${b.color}, 0)`)
      c.fillStyle = grad
      c.fill()
      c.restore()
    }

    function draw() {
      if (!ctx || !container) return
      const rect = container.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)
      time++
      for (const b of blobs) drawBlob(ctx, b, rect.width, rect.height)
      animId = requestAnimationFrame(draw)
    }

    function onMove(clientX: number, clientY: number) {
      if (!container) return; const rect = container.getBoundingClientRect()
      mouseX = clientX - rect.left; mouseY = clientY - rect.top; mouseActive = true
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
      cancelAnimationFrame(animId); window.removeEventListener("resize", resize)
      container.removeEventListener("mousemove", onMouseMove); container.removeEventListener("mouseleave", onLeave)
      container.removeEventListener("touchmove", onTouchMove); container.removeEventListener("touchend", onLeave)
      ctxGsap.revert()
    }
  }, [])

  return (
    <section ref={containerRef} className="relative overflow-hidden bg-gradient-to-br from-green-50 via-white to-amber-50 py-24 md:py-36">
      <canvas ref={canvasRef} className="absolute inset-0 block pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div ref={badgeRef} className="inline-flex items-center gap-2 rounded-full border bg-white/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-xs mb-8">
            <Sparkles className="h-4 w-4 text-brand-green" />Organic Flow · Variation 2<Sparkles className="h-4 w-4 text-brand-orange" />
          </div>
          <h1 ref={titleRef} className="font-heading text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-none mb-6">
            Naturally <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-amber-500">Fresh</span>
          </h1>
          <p ref={subtitleRef} className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Organic produce, sustainably sourced. Good for you, good for the planet.
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  )
}
