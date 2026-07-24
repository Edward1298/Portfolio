import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { certifications } from '../../data/certifications.js'
import CertificationCard from './CertificationCard/CertificationCard.jsx'
import CertificationLightbox from './CertificationLightbox/CertificationLightbox.jsx'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'
import { useMediaQuery } from '../../hooks/useMediaQuery.js'

const N = certifications.length
const CARD_W = 520
const GAP = 48
const STEP = CARD_W + GAP
// card height: image (16:9) + body block
const CARD_H = Math.round((CARD_W * 9) / 16) + 150

// Signed shortest offset around the ring: -2..3 for N=6.
const offset = (i, idx) => {
  let d = i - idx
  if (d > N / 2) d -= N
  if (d < -N / 2) d += N
  return d
}

export default function Certifications() {
  const reduced = usePrefersReducedMotion()
  const isDesktop = useMediaQuery('(min-width: 640px)')
  const [index, setIndex] = useState(0)
  const [open, setOpen] = useState(false)

  const go = useCallback((dir) => setIndex((i) => (i + dir + N) % N), [])

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === 'ArrowLeft') {
        e.preventDefault()
        go(-1)
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        go(1)
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        setOpen(true)
      }
    },
    [go]
  )

  return (
    <section
      id="certifications"
      className="relative z-10 scroll-mt-20 pt-20 sm:pt-28 pb-40 sm:pb-[260px]"
    >
      <div className="mx-auto max-w-5xl px-6 sm:px-10 text-center">
        <span className="font-mono text-accent-glow text-sm tracking-widest uppercase">
          Credentials
        </span>
        <h2 className="font-display text-primary text-3xl sm:text-4xl font-semibold mt-2 mb-10 sm:mb-14">
          Certifications &amp; Degree
        </h2>
      </div>

      {/* Carousel — transform-based, 3 visible, infinite wrap, uniform card size */}
      <div
        tabIndex={0}
        onKeyDown={handleKeyDown}
        className="relative overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg"
      >
        <motion.div
          drag={reduced ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.2}
          dragSnapToOrigin
          onDragEnd={(_, info) => {
            if (info.offset.x < -50) go(1)
            else if (info.offset.x > 50) go(-1)
          }}
          className="relative cursor-grab active:cursor-grabbing"
          style={{ height: CARD_H }}
        >
          {certifications.map((cert, i) => {
            const d = offset(i, index)
            const isCenter = d === 0
            const isSide = Math.abs(d) === 1
            const visible = isCenter || isSide
            const x = d * STEP
            const opacity = !visible ? 0 : isCenter ? 1 : isDesktop ? 0.4 : 0
            const scale = isCenter ? 1 : 0.9
            const z = isCenter ? 10 : 1
            return (
              <CertificationCard
                key={cert.title}
                {...cert}
                x={x}
                opacity={opacity}
                scale={scale}
                z={z}
                cardW={CARD_W}
                reduced={reduced}
                onClick={() => (isCenter ? setOpen(true) : setIndex(i))}
              />
            )
          })}
        </motion.div>
      </div>

      {/* Arrow controls + dots */}
      <div className="mt-8 flex items-center justify-center gap-4">
        <button
          type="button"
          aria-label="Previous"
          onClick={() => go(-1)}
          className="inline-flex items-center justify-center rounded-full border border-subtle bg-surface p-2.5 text-accent transition-colors hover:border-accent hover:bg-accent/10 min-h-[44px] min-w-[44px]"
        >
          <ChevronLeft size={20} aria-hidden="true" />
        </button>

        <div className="flex items-center gap-1.5">
          {certifications.map((cert, i) => (
            <button
              key={cert.title}
              type="button"
              aria-label={`Go to ${cert.title}`}
              onClick={() => setIndex(i)}
              className={`rounded-full transition-all duration-300 ${
                i === index ? 'h-3 w-3 bg-accent animate-star-pulse' : 'h-2 w-2 bg-subtle hover:bg-accent/50'
              }`}
            />
          ))}
        </div>

        <button
          type="button"
          aria-label="Next"
          onClick={() => go(1)}
          className="inline-flex items-center justify-center rounded-full border border-subtle bg-surface p-2.5 text-accent transition-colors hover:border-accent hover:bg-accent/10 min-h-[44px] min-w-[44px]"
        >
          <ChevronRight size={20} aria-hidden="true" />
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <CertificationLightbox
            certifications={certifications}
            index={index}
            reduced={reduced}
            onClose={() => setOpen(false)}
            onPrev={() => setIndex((i) => (i - 1 + N) % N)}
            onNext={() => setIndex((i) => (i + 1) % N)}
          />
        )}
      </AnimatePresence>
    </section>
  )
}