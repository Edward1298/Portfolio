import { useEffect, useRef } from 'react'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'

function randomBetween(a, b) {
  return a + Math.random() * (b - a)
}

function buildBolt(x1, y1, x2, y2, roughness, depth) {
  if (depth === 0) return [{ x: x1, y: y1 }, { x: x2, y: y2 }]

  const mx = (x1 + x2) / 2 + randomBetween(-roughness, roughness)
  const my = (y1 + y2) / 2 + randomBetween(-roughness * 0.3, roughness * 0.3)

  return [
    ...buildBolt(x1, y1, mx, my, roughness / 1.8, depth - 1),
    ...buildBolt(mx, my, x2, y2, roughness / 1.8, depth - 1).slice(1),
  ]
}

function createStrike(canvasW, canvasH) {
  const startX = randomBetween(canvasW * 0.1, canvasW * 0.9)
  const endX = startX + randomBetween(-canvasW * 0.2, canvasW * 0.2)
  const endY = randomBetween(canvasH * 0.3, canvasH * 0.9)

  const mainPoints = buildBolt(startX, 0, endX, endY, 90, 5)

  const branches = []
  const branchCount = Math.floor(randomBetween(1, 3))
  for (let b = 0; b < branchCount; b++) {
    const idx = Math.floor(randomBetween(mainPoints.length * 0.25, mainPoints.length * 0.65))
    const origin = mainPoints[idx]
    const bEndX = origin.x + randomBetween(-90, 90)
    const bEndY = origin.y + randomBetween(50, 180)
    branches.push(buildBolt(origin.x, origin.y, bEndX, bEndY, 40, 4))
  }

  return { mainPoints, branches }
}

export default function LightningBackground() {
  const canvasRef = useRef(null)
  const prefersReduced = usePrefersReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 768px)')

  useEffect(() => {
    if (prefersReduced) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    const maxStrikes = isDesktop ? 3 : 1 // Throttle to 1 bolt on mobile for smoothness
    let animId = null
    let strikes = []
    let nextStrike = 0
    let started = false

    const ACCENT = '91, 143, 255'

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

  function drawBolt(points, alpha, lineWidth) {
    if (points.length < 2) return
    ctx.beginPath()
    ctx.moveTo(points[0].x, points[0].y)
    for (let i = 1; i < points.length; i++) ctx.lineTo(points[i].x, points[i].y)

    ctx.strokeStyle = `rgba(${ACCENT}, ${alpha})`
    ctx.lineWidth = lineWidth
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.shadowColor = `rgba(${ACCENT}, ${alpha * 0.7})`
    ctx.shadowBlur = isDesktop ? 28 : 14
    ctx.stroke()

    ctx.strokeStyle = `rgba(210, 230, 255, ${alpha * 0.65})`
    ctx.lineWidth = lineWidth * 0.3
    ctx.shadowBlur = isDesktop ? 7 : 3
    ctx.stroke()

    ctx.shadowBlur = 0
  }

  function loop(now) {
    animId = requestAnimationFrame(loop)
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (now >= nextStrike && strikes.length < maxStrikes) {
      strikes.push({ ...createStrike(canvas.width, canvas.height), born: now })
      nextStrike = now + randomBetween(1400, 4000)
    }

    // First pass: age + compute flash alpha, drop expired strikes
    let flashAlpha = 0
    strikes = strikes.filter((s) => {
      const age = now - s.born
      const duration = 450
      if (age > duration) return false

      const t = age / duration
      const alpha = t < 0.1 ? t / 0.1 : 1 - ((t - 0.1) / 0.9)
      if (alpha > flashAlpha) flashAlpha = alpha
      s._alpha = alpha
      return true
    })

    // Full-canvas flash — illuminates the fog below (canvas sits above fog at z 1).
    // Peaks at strike birth, fades with the bolt. Bluish-white to match bolt core.
    if (flashAlpha > 0) {
      ctx.fillStyle = `rgba(210, 230, 255, ${flashAlpha * 0.12})`
      ctx.fillRect(0, 0, canvas.width, canvas.height)
    }

    // Bolts render on top of the flash
    strikes.forEach((s) => {
      drawBolt(s.mainPoints, s._alpha * 1.0, 1.8)
      s.branches.forEach((b) => drawBolt(b, s._alpha * 0.5, 1.0))
    })
  }

    function startLoop() {
      if (!started) {
        started = true
        animId = requestAnimationFrame(loop)
      }
    }

    const target = document.getElementById('landing')
    if (!target) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          startLoop()
        }
      },
      { threshold: 0 }
    )

    observer.observe(target)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      observer.disconnect()
    }
  }, [prefersReduced, isDesktop])

  if (prefersReduced) return null

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
        opacity: 0.7,
      }}
    />
  )
}
