import { motion } from 'framer-motion'
import Timeline from './Timeline/Timeline.jsx'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'

const BIO =
  'Passionate software developer since 2020, and tech lover forever. I build things end-to-end — from APIs in C#/.NET to interfaces in React — and I genuinely enjoy the process, not just the result. I build fast with AI-assisted tools like Claude Code, and I\'m always tinkering with something new.'

export default function About() {
  const reduced = usePrefersReducedMotion()
  const BioWrapper = reduced ? 'div' : motion.div
  const bioProps = reduced
    ? {}
    : {
        initial: { opacity: 0, y: 20 },
        whileInView: { opacity: 1, y: 0, transition: { duration: 0.6 } },
        viewport: { once: false, amount: 0.3 },
      }

  return (
    <section id="about" className="relative z-10 scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6 sm:px-10">
        <BioWrapper {...bioProps} className="text-center">
          <span className="font-mono text-accent-glow text-sm tracking-widest uppercase">
            About Me
          </span>
          <h2 className="font-display text-primary text-3xl sm:text-4xl font-semibold mt-2 mb-6">
            Who I am
          </h2>
          <p className="font-sans text-primary text-base sm:text-lg leading-relaxed max-w-2xl mx-auto text-center">
            {BIO}
          </p>
        </BioWrapper>

        <div className="mt-16 sm:mt-24 text-center">
          <span className="font-mono text-accent text-sm tracking-widest uppercase">
            My journey
          </span>
          <div className="mt-10">
            <Timeline />
          </div>
        </div>
      </div>
    </section>
  )
}
