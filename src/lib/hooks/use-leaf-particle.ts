"use client"

import { useEffect, useRef } from "react"

interface Leaf {
  x: number; y: number; vx: number; vy: number
  size: number; rotation: number; rotSpeed: number
  color: string; alpha: number; sway: number; swaySpeed: number
}

const LEAF_COLORS = [
  "hsla(100, 60%, 28%, 0.5)", "hsla(125, 55%, 22%, 0.45)", "hsla(95, 65%, 18%, 0.5)",
  "hsla(155, 50%, 15%, 0.4)", "hsla(40, 55%, 20%, 0.45)", "hsla(170, 45%, 12%, 0.4)",
  "hsla(110, 50%, 16%, 0.45)", "hsla(130, 40%, 10%, 0.35)",
]

function createLeaf(w: number, h: number, i: number): Leaf {
  return {
    x: Math.random() * w, y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3, vy: Math.random() * 0.6 + 0.2,
    size: Math.random() * 24 + 8,
    rotation: Math.random() * Math.PI * 2,
    rotSpeed: (Math.random() - 0.5) * 0.025,
    color: LEAF_COLORS[i % LEAF_COLORS.length],
    alpha: Math.random() * 0.35 + 0.15, sway: 0, swaySpeed: Math.random() * 0.02 + 0.008,
  }
}

function drawLeaf(ctx: CanvasRenderingContext2D, leaf: Leaf) {
  leaf.sway += leaf.swaySpeed
  leaf.x += leaf.vx + Math.sin(leaf.sway) * 0.5
  leaf.y += leaf.vy
  leaf.rotation += leaf.rotSpeed

  leaf.vx *= 0.92
  leaf.vy *= 0.92

  const container = ctx.canvas.parentElement
  if (container) {
    const rect = container.getBoundingClientRect()
    if (leaf.y > rect.height + 40) { leaf.y = -30; leaf.x = Math.random() * rect.width; leaf.vy = Math.random() * 0.6 + 0.2 }
    if (leaf.x < -50) leaf.x = rect.width + 30
    if (leaf.x > rect.width + 50) leaf.x = -30
  }

  ctx.save(); ctx.translate(leaf.x, leaf.y); ctx.rotate(leaf.rotation); ctx.globalAlpha = leaf.alpha
  ctx.beginPath(); ctx.moveTo(0, 0)
  ctx.quadraticCurveTo(leaf.size * 0.5, -leaf.size * 0.4, leaf.size * 0.85, 0)
  ctx.quadraticCurveTo(leaf.size * 0.5, leaf.size * 0.4, 0, 0)
  ctx.closePath(); ctx.fillStyle = leaf.color; ctx.fill()
  ctx.globalAlpha = 1; ctx.restore()
}

export function useLeafParticle(canvasRef: React.RefObject<HTMLCanvasElement | null>) {
  const leavesRef = useRef<Leaf[]>([])
  const mouseRef = useRef({ x: -9999, y: -9999, active: false })
  const animIdRef = useRef<number>(0)

  useEffect(() => {
    const canvasEl = canvasRef.current
    if (!canvasEl) return
    const context = canvasEl.getContext("2d")
    if (!context) return

    const parentEl = canvasEl.parentElement
    if (!parentEl) return

    const canvas = canvasEl
    const ctx = context
    const container = parentEl

    function resize() {
      const rect = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      canvas.style.width = `${rect.width}px`
      canvas.style.height = `${rect.height}px`
      ctx.scale(dpr, dpr)
      leavesRef.current = Array.from({ length: 120 }, (_, i) => createLeaf(rect.width, rect.height, i))
    }

    function draw() {
      const rect = container.getBoundingClientRect()
      ctx.clearRect(0, 0, rect.width, rect.height)
      for (const leaf of leavesRef.current) drawLeaf(ctx, leaf)
      animIdRef.current = requestAnimationFrame(draw)
    }

    function onMove(clientX: number, clientY: number) {
      const rect = container.getBoundingClientRect()
      mouseRef.current = { x: clientX - rect.left, y: clientY - rect.top, active: true }
    }

    function onMouseMove(e: MouseEvent) { onMove(e.clientX, e.clientY) }
    function onTouchMove(e: TouchEvent) { const t = e.touches[0]; onMove(t.clientX, t.clientY) }
    function onLeave() { mouseRef.current = { x: -9999, y: -9999, active: false } }

    resize(); draw()
    window.addEventListener("resize", resize)
    container.addEventListener("mousemove", onMouseMove)
    container.addEventListener("mouseleave", onLeave)
    container.addEventListener("touchmove", onTouchMove, { passive: false })
    container.addEventListener("touchend", onLeave)

    return () => {
      cancelAnimationFrame(animIdRef.current)
      window.removeEventListener("resize", resize)
      container.removeEventListener("mousemove", onMouseMove)
      container.removeEventListener("mouseleave", onLeave)
      container.removeEventListener("touchmove", onTouchMove)
      container.removeEventListener("touchend", onLeave)
    }
  }, [canvasRef])
}
