import { motion } from 'framer-motion'
import { entries } from '../../../data/timeline.js'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion.js'

const leftVariants = {
  hidden: { opacity: 0, x: -40, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}

const rightVariants = {
  hidden: { opacity: 0, x: 40, scale: 0.95 },
  visible: { opacity: 1, x: 0, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
}

const terminatorVariants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: 'easeOut' } },
}

export default function Timeline() {
  const reduced = usePrefersReducedMotion()

  return (
    <div className="relative">
      {/* Straight throbbing center line */}
      <div
        className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-[2px]"
        aria-hidden="true"
      >
        <div
          className={`absolute inset-0 bg-gradient-to-b from-transparent via-accent/50 to-transparent ${
            reduced ? '' : 'animate-throb'
          }`}
        />
        {!reduced && (
          <div className="absolute inset-x-0 top-0 bottom-0 overflow-hidden">
            <div className="absolute left-0 w-full h-28 bg-gradient-to-b from-transparent via-highlight/70 to-transparent animate-travel-pulse" />
          </div>
        )}
      </div>

      {/* Entries — alternating left/right */}
      <div className="relative">
        {entries.map((entry, index) => {
          const isTerminator = entry.date === 'Present'
          const isLeft = index % 2 === 0

          if (isTerminator) {
            const Terminator = reduced ? 'div' : motion.div
            return (
              <Terminator
                key={index}
                {...(reduced
                  ? {}
                  : {
                      variants: terminatorVariants,
                      initial: 'hidden',
                      whileInView: 'visible',
                      viewport: { once: false, amount: 0.5 },
                    })}
                className="relative flex flex-col items-center pt-12"
              >
                <span
                  aria-hidden="true"
                  className="h-4 w-4 rounded-full bg-highlight shadow-glow-md animate-pulse-dot"
                />
                <span className="font-mono text-highlight text-sm tracking-widest uppercase mt-4">
                  Present
                </span>
              </Terminator>
            )
          }

          const Entry = reduced ? 'div' : motion.div
          const variants = isLeft ? leftVariants : rightVariants

          return (
            <Entry
              key={index}
              {...(reduced
                ? {}
                : {
                    variants,
                    initial: 'hidden',
                    whileInView: 'visible',
                    viewport: { once: false, amount: 0.3 },
                  })}
              className="relative grid grid-cols-2 gap-x-8 sm:gap-x-16 mb-14 sm:mb-20 last:mb-0"
            >
              {/* Node on the center line */}
              <span
                aria-hidden="true"
                className="absolute left-1/2 -translate-x-1/2 top-2 h-3.5 w-3.5 rounded-full border-2 border-accent-glow bg-bg shadow-glow-sm"
              />

              {/* Left side */}
              <div
                className={`pr-6 sm:pr-12 text-right ${isLeft ? '' : 'invisible'}`}
              >
                <span className="font-mono text-accent/70 text-xs sm:text-sm">
                  {entry.date}
                </span>
                <h3 className="font-display text-primary text-base sm:text-xl font-medium mt-1">
                  {entry.role}
                </h3>
                <p className="font-sans text-secondary text-xs sm:text-sm mt-0.5">
                  {entry.place}
                </p>
              </div>

              {/* Right side */}
              <div
                className={`pl-6 sm:pl-12 text-left ${!isLeft ? '' : 'invisible'}`}
              >
                <span className="font-mono text-accent/70 text-xs sm:text-sm">
                  {entry.date}
                </span>
                <h3 className="font-display text-primary text-base sm:text-xl font-medium mt-1">
                  {entry.role}
                </h3>
                <p className="font-sans text-secondary text-xs sm:text-sm mt-0.5">
                  {entry.place}
                </p>
              </div>
            </Entry>
          )
        })}
      </div>
    </div>
  )
}
