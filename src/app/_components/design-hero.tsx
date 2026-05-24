"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Sparkles, Paintbrush, Type, Grid3x3 } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  baseX: number
  baseY: number
}

export function DesignHero() {
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const badgeRef = useRef<HTMLDivElement>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const container = containerRef.current
    if (!canvas || !container) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animId: number
    let particles: Particle[] = []
    let mouseX = -9999
    let mouseY = -9999
    let mouseActive = false

    const PARTICLE_COUNT = 90
    const CONNECTION_DIST = 160
    const MOUSE_INFLUENCE = 200
    const MOUSE_FORCE = 0.08
    const COLORS = { primary: "59, 150, 105", accent: "249, 115, 22" }

    function resize() {
      if (!container || !canvas || !ctx) return
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.scale(dpr, dpr)

      initParticles(rect.width, rect.height)
    }

    function initParticles(w: number, h: number) {
      particles = []
      for (let i = 0; i < PARTICLE_COUNT; i++) {
        const x = Math.random() * w
        const y = Math.random() * h
        particles.push({
          x,
          y,
          vx: 0,
          vy: 0,
          radius: Math.random() * 2.5 + 1,
          baseX: x,
          baseY: y,
        })
      }
    }

    function draw() {
      if (!ctx || !container) return
      const rect = container.getBoundingClientRect()
      const w = rect.width
      const h = rect.height

      ctx.clearRect(0, 0, w, h)

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]

        const dx = p.baseX - p.x
        const dy = p.baseY - p.y
        p.vx += dx * 0.01
        p.vy += dy * 0.01

        p.vx += (Math.random() - 0.5) * 0.15
        p.vy += (Math.random() - 0.5) * 0.15

        if (mouseActive) {
          const mdx = p.x - mouseX
          const mdy = p.y - mouseY
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy)

          if (mdist < MOUSE_INFLUENCE && mdist > 0) {
            const force = (1 - mdist / MOUSE_INFLUENCE) * MOUSE_FORCE
            p.vx += (mdx / mdist) * force
            p.vy += (mdy / mdist) * force

            if (mdist < 60) {
              const repel = (1 - mdist / 60) * 0.3
              p.vx += (mdx / mdist) * repel * 2
              p.vy += (mdy / mdist) * repel * 2
            }
          }
        }

        p.vx *= 0.94
        p.vy *= 0.94

        p.x += p.vx
        p.y += p.vy

        if (p.x < 0) p.x = 0
        if (p.x > w) p.x = w
        if (p.y < 0) p.y = 0
        if (p.y > h) p.y = h

        const color = i % 5 === 0 ? COLORS.accent : COLORS.primary
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color}, 0.5)`
        ctx.fill()

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius * 2, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${color}, 0.1)`
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < CONNECTION_DIST) {
            const alpha = (1 - dist / CONNECTION_DIST) * 0.25
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.strokeStyle = `rgba(${COLORS.primary}, ${alpha})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }

        if (mouseActive) {
          const mdx = p.x - mouseX
          const mdy = p.y - mouseY
          const mdist = Math.sqrt(mdx * mdx + mdy * mdy)

          if (mdist < MOUSE_INFLUENCE) {
            const alpha = (1 - mdist / MOUSE_INFLUENCE) * 0.35
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(mouseX, mouseY)
            ctx.strokeStyle = `rgba(${COLORS.accent}, ${alpha})`
            ctx.lineWidth = 0.6
            ctx.stroke()
          }
        }
      }

      if (mouseActive) {
        const grad = ctx.createRadialGradient(mouseX, mouseY, 0, mouseX, mouseY, 80)
        grad.addColorStop(0, `rgba(${COLORS.accent}, 0.15)`)
        grad.addColorStop(1, `rgba(${COLORS.accent}, 0)`)
        ctx.beginPath()
        ctx.arc(mouseX, mouseY, 80, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()

        ctx.beginPath()
        ctx.arc(mouseX, mouseY, 3, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${COLORS.accent}, 0.8)`
        ctx.fill()
      }

      animId = requestAnimationFrame(draw)
    }

    function onMouseMove(e: MouseEvent) {
      if (!container) return
      const rect = container.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top
      mouseActive = true
    }

    function onMouseLeave() {
      mouseActive = false
      mouseX = -9999
      mouseY = -9999
    }

    function onTouchMove(e: TouchEvent) {
      if (!container) return
      const rect = container.getBoundingClientRect()
      const touch = e.touches[0]
      mouseX = touch.clientX - rect.left
      mouseY = touch.clientY - rect.top
      mouseActive = true
    }

    function onTouchEnd() {
      mouseActive = false
      mouseX = -9999
      mouseY = -9999
    }

    resize()
    draw()

    window.addEventListener("resize", resize)
    container.addEventListener("mousemove", onMouseMove)
    container.addEventListener("mouseleave", onMouseLeave)
    container.addEventListener("touchmove", onTouchMove, { passive: true })
    container.addEventListener("touchend", onTouchEnd)

    const ctxGsap = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } })

      tl.fromTo(badgeRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 })
        .fromTo(titleRef.current, { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.9 }, "-=0.4")
        .fromTo(subtitleRef.current, { y: 40, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7 }, "-=0.5")
        .fromTo(statsRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.6 }, "-=0.3")

      ScrollTrigger.create({
        trigger: container,
        start: "top top",
        end: "bottom top",
        onUpdate: (self) => {
          if (canvas) {
            gsap.to(canvas, { opacity: 1 - self.progress * 0.5, duration: 0.1, ease: "none" })
          }
        },
      })
    }, container)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener("resize", resize)
      container.removeEventListener("mousemove", onMouseMove)
      container.removeEventListener("mouseleave", onMouseLeave)
      container.removeEventListener("touchmove", onTouchMove)
      container.removeEventListener("touchend", onTouchEnd)
      ctxGsap.revert()
    }
  }, [])

  return (
    <section
      ref={containerRef}
      className="relative overflow-hidden bg-gradient-to-br from-brand-green-light via-white to-brand-orange-light py-24 md:py-36"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 block pointer-events-none"
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <div
            ref={badgeRef}
            className="inline-flex items-center gap-2 rounded-full border bg-white/80 backdrop-blur-sm px-4 py-1.5 text-sm font-medium text-muted-foreground shadow-xs mb-8"
          >
            <Sparkles className="h-4 w-4 text-brand-orange" />
            SmartGrocery Design System v1.0
            <Sparkles className="h-4 w-4 text-brand-green" />
          </div>

          <h1
            ref={titleRef}
            className="font-heading text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-none mb-6"
          >
            Design{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-green to-brand-orange">
              System
            </span>
          </h1>

          <p
            ref={subtitleRef}
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          >
            A scalable, consistent design foundation for SmartGrocery — combining the freshness of green with the warmth of orange for a modern grocery experience.
          </p>

          <div
            ref={statsRef}
            className="mt-12 flex flex-wrap items-center justify-center gap-8 md:gap-16"
          >
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green/10 backdrop-blur-sm">
                <Paintbrush className="h-5 w-5 text-brand-green" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">6</p>
                <p className="text-xs text-muted-foreground">Color Families</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-orange/10 backdrop-blur-sm">
                <Type className="h-5 w-5 text-brand-orange" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">7</p>
                <p className="text-xs text-muted-foreground">Type Scales</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-green/10 backdrop-blur-sm">
                <Grid3x3 className="h-5 w-5 text-brand-green" />
              </div>
              <div className="text-left">
                <p className="text-sm font-medium">5</p>
                <p className="text-xs text-muted-foreground">Shadow Levels</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border to-transparent" />
    </section>
  )
}
