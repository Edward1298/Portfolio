import { useRef, useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Howl } from 'howler'
import { skills } from '../../data/skills.js'
import SkillKey from './SkillKey/SkillKey.jsx'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'
import './SkillsKeyboard.css'

// Sound — plays once public/sounds/key-press.mp3 exists. Missing file → Howler
// logs a warning and stays silent; the UI remains fully usable.
let keySound = null
try {
  keySound = new Howl({ src: ['/sounds/key-press.mp3'], preload: true })
} catch {
  /* file missing — no sound, no crash */
}

function playKeySound() {
  try {
    keySound?.play()
  } catch {
    /* silent */
  }
}

function createSparkBurst(cx, cy) {
  const count = 8 + Math.floor(Math.random() * 5)
  return Array.from({ length: count }, (_, i) => ({
    id: `${Date.now()}-${i}`,
    x: cx,
    y: cy,
    angle: (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4,
    distance: 26 + Math.random() * 24,
    color: Math.random() > 0.4 ? '#D2E6FF' : '#5B8FFF',
    size: 1.5 + Math.random() * 2.5,
  }))
}

export default function SkillsKeyboard() {
  const reduced = usePrefersReducedMotion()
  const boardRef = useRef(null)
  const hoveredRef = useRef(null)
  const pressingRef = useRef(false)

  // Spotlight
  const [spotlightOn, setSpotlightOn] = useState(false)
  const [spotPos, setSpotPos] = useState({ x: 0, y: 0 })

  // Sparks
  const [sparks, setSparks] = useState([])

  // Idle glow flicker
  const [flickerIndex, setFlickerIndex] = useState(null)
  const flickerTimerRef = useRef(null)

  // --- Spotlight handlers ---
  const handleBoardMove = useCallback((e) => {
    if (!boardRef.current) return
    const rect = boardRef.current.getBoundingClientRect()
    setSpotPos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
  }, [])

  const handleBoardEnter = useCallback(() => {
    if (!reduced) setSpotlightOn(true)
  }, [reduced])

  const handleBoardLeave = useCallback(() => {
    setSpotlightOn(false)
  }, [])

  // --- Key press (sound + sparks) ---
  const handleBoardClick = useCallback(
    (e) => {
      const btn = e.target.closest('button')
      if (!btn || !boardRef.current) return

      playKeySound()
      pressingRef.current = true

      if (reduced) return

      const btnRect = btn.getBoundingClientRect()
      const boardRect = boardRef.current.getBoundingClientRect()
      const cx = btnRect.left + btnRect.width / 2 - boardRect.left
      const cy = btnRect.top + btnRect.height / 2 - boardRect.top

      setFlickerIndex(null)
      const burst = createSparkBurst(cx, cy)
      setSparks((prev) => [...prev, ...burst])
    },
    [reduced]
  )

  const handleBoardMouseUp = useCallback(() => {
    pressingRef.current = false
  }, [])

  // --- Idle flicker interval ---
  useEffect(() => {
    if (reduced) return

    flickerTimerRef.current = setInterval(() => {
      if (pressingRef.current) return
      let idx
      // Retry up to 5 times to avoid the hovered key
      for (let attempt = 0; attempt < 5; attempt++) {
        idx = Math.floor(Math.random() * skills.length)
        if (idx !== hoveredRef.current) break
      }
      setFlickerIndex(idx)
      setTimeout(() => setFlickerIndex(null), 350)
    }, 4000)

    return () => clearInterval(flickerTimerRef.current)
  }, [reduced])

  // Clean spark particles once their animation finishes
  const removeSpark = useCallback((id) => {
    setSparks((prev) => prev.filter((s) => s.id !== id))
  }, [])

  // --- Staggered entrance delay ---
  const getDelay = (index) => {
    const row = Math.floor(index / 6)
    const col = index % 6
    return row * 0.08 + col * 0.03
  }

  return (
    <section id="skills" className="relative z-10 scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <span className="font-mono text-accent-glow text-sm tracking-widest uppercase">
          Toolbox
        </span>
        <h2 className="font-display text-primary text-3xl sm:text-4xl font-semibold mt-2 mb-10 sm:mb-14">
          Skills
        </h2>

        {/* Board with permanent tilt */}
        <div className={`tilt-wrapper ${reduced ? '' : 'tilt-active'}`}>
          <div
            ref={boardRef}
            className={`tilt-grid relative overflow-hidden rounded-2xl border border-subtle bg-surface-elevated p-4 shadow-card sm:p-6 md:p-8 ${reduced ? '' : 'tilted'}`}
            onMouseMove={handleBoardMove}
            onMouseEnter={handleBoardEnter}
            onMouseLeave={handleBoardLeave}
            onClick={handleBoardClick}
            onMouseUp={handleBoardMouseUp}
          >
            {/* Accent underglow edge */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-8 -bottom-px h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
            />

            {/* Cursor-follow spotlight */}
            {spotlightOn && !reduced && (
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 z-10 fast-fade-in"
              >
                <div
                  className="absolute rounded-full opacity-20 blur-3xl"
                  style={{
                    width: 288,
                    height: 288,
                    background: 'radial-gradient(circle, #5B8FFF 0%, transparent 70%)',
                    left: spotPos.x - 144,
                    top: spotPos.y - 144,
                    willChange: 'left, top',
                  }}
                />
              </div>
            )}

            {/* Keycap grid */}
            <div
              className="relative z-10 grid grid-cols-3 gap-2.5 sm:gap-3 md:grid-cols-4 md:gap-4 lg:grid-cols-6"
              onMouseOver={(e) => {
                const btn = e.target.closest('button')
                if (btn) {
                  hoveredRef.current = btn.getAttribute('aria-label')
                }
              }}
              onMouseOut={(e) => {
                const btn = e.target.closest('button')
                if (btn && btn.getAttribute('aria-label') === hoveredRef.current) {
                  hoveredRef.current = null
                }
              }}
            >
              {skills.map((skill, index) => {
                const Wrapper = reduced ? 'div' : motion.div
                const wrapperProps = reduced
                  ? {}
                  : {
                      initial: { opacity: 0, y: 24 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, amount: 0.2 },
                      transition: {
                        delay: getDelay(index),
                        duration: 0.45,
                        ease: 'easeOut',
                      },
                    }

                return (
                  <Wrapper
                    key={skill.name}
                    className={flickerIndex === index ? 'flicker-glow' : ''}
                    {...wrapperProps}
                  >
                    <SkillKey
                      name={skill.name}
                      icon={skill.icon}
                      monogram={skill.monogram}
                    />
                  </Wrapper>
                )
              })}
            </div>

            {/* Spark burst particles */}
            <AnimatePresence>
              {sparks.map((spark) => (
                <motion.div
                  key={spark.id}
                  initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                  animate={{
                    x: Math.cos(spark.angle) * spark.distance,
                    y: Math.sin(spark.angle) * spark.distance,
                    opacity: 0,
                    scale: 0,
                  }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4, ease: 'easeOut' }}
                  onAnimationComplete={() => removeSpark(spark.id)}
                  className="pointer-events-none absolute z-20 rounded-full"
                  style={{
                    left: spark.x,
                    top: spark.y,
                    width: spark.size,
                    height: spark.size,
                    background: spark.color,
                    boxShadow: `0 0 4px ${spark.color}`,
                  }}
                />
              ))}
            </AnimatePresence>
          </div>
        </div>

        <p className="mt-4 text-right font-mono text-[10px] text-disabled sm:text-xs">
          24 keys — press any of them
        </p>
      </div>
    </section>
  )
}
