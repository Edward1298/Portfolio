import { useEffect, useRef } from 'react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'

export default function CursorSparkTrail() {
  const canvasRef = useRef(null)
  const prefersReduced = usePrefersReducedMotion()

  useEffect(() => {
    if (prefersReduced) return

    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')

    let animId = null
    let sparks = []
    let initialized = false

    function resize() {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function addSpark(x, y) {
      if (sparks.length > 120) sparks.shift()
      sparks.push({
        x,
        y,
        born: performance.now(),
        duration: 300 + Math.random() * 200, // 300–500ms
        size: 1 + Math.random() * 2,
      })
    }

    function loop() {
      animId = requestAnimationFrame(loop)
      const now = performance.now()
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      sparks = sparks.filter((s) => {
        const age = now - s.born
        if (age > s.duration) return false
        const alpha = 1 - age / s.duration
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(91, 143, 255, ${alpha})`
        ctx.fill()
        return true
      })
    }

    function onPointerMove(e) {
      addSpark(e.clientX, e.clientY)
    }

    function init() {
      if (initialized) return
      initialized = true
      window.removeEventListener('pointerdown', init)
      window.removeEventListener('pointermove', init)
      window.addEventListener('pointermove', onPointerMove)
      animId = requestAnimationFrame(loop)
    }

    window.addEventListener('pointerdown', init)
    window.addEventListener('pointermove', init)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointerdown', init)
      window.removeEventListener('pointermove', init)
      window.removeEventListener('pointermove', onPointerMove)
    }
  }, [prefersReduced])

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
      }}
    />
  )
}
