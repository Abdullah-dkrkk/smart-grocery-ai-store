"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { Sparkles } from "lucide-react"

interface TextParticle {
  x: number; y: number; vx: number; vy: number
  homeX: number; homeY: number; radius: number
  color: string; alpha: number
}

export function DesignHeroV5() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    const headingEl = headingRef.current
    if (!canvas || !container || !headingEl) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let particles: TextParticle[] = []
    let mouseX = -9999, mouseY = -9999, mouseActive = false
    let isScattered = false
    const COLORS = ["#059669", "#10b981", "#34d399", "#f97316", "#fb9234", "#fbbf24"]

    function getTextShape(): { particles: { x: number; y: number }[]; w: number; h: number } | null {
      if (!headingEl || !container) return null

      const containerRect = container.getBoundingClientRect()
      const rect = headingEl.getBoundingClientRect()
      const text = headingEl.textContent || ""

      const style = window.getComputedStyle(headingEl)
      const font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`

      const offscreen = document.createElement("canvas")
      const offCtx = offscreen.getContext("2d")
      if (!offCtx) return null

      offCtx.font = font
      const metrics = offCtx.measureText(text)
      const textW = metrics.width
      const textH = parseFloat(style.fontSize) * 1.3

      const padding = 20
      const cw = Math.ceil(textW + padding * 2)
      const ch = Math.ceil(textH + padding * 2)
      offscreen.width = cw
      offscreen.height = ch

      offCtx.fillStyle = "#ffffff"
      offCtx.font = font
      offCtx.textAlign = "left"
      offCtx.textBaseline = "middle"
      offCtx.fillText(text, padding, ch / 2)

      const imageData = offCtx.getImageData(0, 0, cw, ch)
      const data = imageData.data
      const sampleStep = 4
      const result: { x: number; y: number }[] = []

      for (let y = 0; y < ch; y += sampleStep) {
        for (let x = 0; x < cw; x += sampleStep) {
          const idx = (y * cw + x) * 4
          if (data[idx + 3] > 128) {
            const lx = rect.left - containerRect.left + x - padding
            const ly = rect.top - containerRect.top + y - ch / 2
            result.push({ x: lx, y: ly })
          }
        }
      }

      return { particles: result, w: cw, h: ch }
    }

    function initParticles() {
      const shape = getTextShape()
      if (!shape) return

      particles = shape.particles.map((p) => ({
        x: p.x, y: p.y, vx: 0, vy: 0,
        homeX: p.x, homeY: p.y,
        radius: Math.random() * 2.2 + 1.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        alpha: Math.random() * 0.5 + 0.4,
      }))
    }

    function resize() {
      if (!container || !canvas || !ctx) return
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.scale(dpr, dpr)
      initParticles()
    }

    function draw() {
      if (!ctx || !container) return
      const rect = container.getBoundingClientRect()
      const w = rect.width; const h = rect.height
      ctx.clearRect(0, 0, w, h)

      if (!headingEl) { animId = requestAnimationFrame(draw); return }
      const headingRect = headingEl.getBoundingClientRect()
      const headingCX = headingRect.left - rect.left + headingRect.width / 2
      const headingCY = headingRect.top - rect.top + headingRect.height / 2
      const headingR = Math.max(headingRect.width, headingRect.height) * 0.8

      const mouseNearHeading = mouseActive &&
        Math.sqrt((mouseX - headingCX) ** 2 + (mouseY - headingCY) ** 2) < headingR + 60

      if (mouseNearHeading && !isScattered) isScattered = true
      if (!mouseNearHeading && isScattered) isScattered = false

      for (const p of particles) {
        if (mouseActive) {
          const mdx = p.x - mouseX; const mdy = p.y - mouseY
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy)

          if (mouseNearHeading && mdist < headingR + 80) {
            const force = Math.max(0, 1 - mdist / (headingR + 80)) * 2.0
            const angle = Math.atan2(mdy, mdx)
            const pushX = Math.cos(angle) * force
            const pushY = Math.sin(angle) * force
            p.vx += pushX
            p.vy += pushY

            if (mdist < 40) {
              p.vx += (mdx / Math.max(mdist, 1)) * 0.8
              p.vy += (mdy / Math.max(mdist, 1)) * 0.8
            }
          }

          if (mdist < 120 && mdist > 0) {
            p.vx += (mdx / mdist) * Math.max(0, 1 - mdist / 120) * 0.3
            p.vy += (mdy / mdist) * Math.max(0, 1 - mdist / 120) * 0.3
          }
        }

        const returnX = (p.homeX - p.x) * 0.025
        const returnY = (p.homeY - p.y) * 0.025
        p.vx += returnX
        p.vy += returnY
        p.vx *= 0.88
        p.vy *= 0.88
        p.x += p.vx
        p.y += p.vy

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color
        ctx.globalAlpha = p.alpha
        ctx.fill()
        ctx.globalAlpha = 1
      }

      for (let i = 0; i < particles.length; i += 4) {
        const p = particles[i]
        const dx = p.x - headingCX; const dy = p.y - headingCY
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < headingR * 0.6) {
          const alpha = (1 - dist / (headingR * 0.6)) * 0.04
          ctx.beginPath(); ctx.moveTo(p.x, p.y)
          ctx.lineTo(headingCX, headingCY)
          ctx.strokeStyle = `rgba(5,150,105,${alpha})`
          ctx.lineWidth = 0.3; ctx.stroke()
        }
      }

      if (mouseActive) {
        const grad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 40)
        grad.addColorStop(0, "rgba(249,115,22,0.12)")
        grad.addColorStop(1, "rgba(249,115,22,0)")
        ctx.beginPath(); ctx.arc(mouseX, mouseY, 40, 0, Math.PI * 2)
        ctx.fillStyle = grad; ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    function onMove(clientX: number, clientY: number) {
      if (!container) return
      const rect = container.getBoundingClientRect()
      mouseX = clientX - rect.left; mouseY = clientY - rect.top; mouseActive = true
    }
    function onMouseMove(e: MouseEvent) { onMove(e.clientX, e.clientY) }
    function onTouchMove(e: TouchEvent) { e.preventDefault(); const t = e.touches[0]; onMove(t.clientX, t.clientY) }
    function onLeave() { mouseActive = false; mouseX = -9999; mouseY = -9999; isScattered = false }

    setTimeout(() => { resize(); initParticles() }, 100)

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
        .fromTo(headingRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.4")
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
    <section ref={containerRef} className="relative overflow-hidden bg-gradient-to-br from-emerald-950 via-slate-900 to-amber-950 py-24 md:py-36">
      <canvas ref={canvasRef} className="absolute inset-0 block" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div ref={badgeRef} className="inline-flex items-center gap-2 rounded-full border bg-white/10 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-white/60 shadow-xs mb-8">
            <Sparkles className="h-4 w-4 text-orange-400" />
            Particle Text · Variation 5
            <Sparkles className="h-4 w-4 text-emerald-400" />
          </div>
          <h1
            ref={headingRef}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-none mb-6 text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-emerald-400 to-orange-300 pointer-events-none"
          >
            Scatter Effect
          </h1>
          <p ref={subtitleRef} className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
            Hover over the heading — each letter breaks into particles that scatter with your cursor movement.
          </p>
        </div>
      </div>
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  )
}
