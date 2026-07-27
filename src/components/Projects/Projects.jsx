import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { projects } from '../../data/projects.js'
import ProjectCard from './ProjectCard/ProjectCard.jsx'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'

// Scroll math: card i slides up (y 100%→0%) during segment [(i-1)/n, i/n];
// once covered, it scales 1→1-(n-1-i)*0.04 and dims to 0.7 over [i/n, 1].
function StackedCard({ project, index, total, progress }) {
  const enterStart = (index - 1) / total
  const enterEnd = index / total
  const targetScale = 1 - (total - 1 - index) * 0.04
  const isLast = index === total - 1

  const y = useTransform(progress, [enterStart, enterEnd], ['100%', '0%'])
  const scale = useTransform(progress, [enterEnd, 1], [1, targetScale])
  const opacity = useTransform(progress, [enterEnd, 1], [1, isLast ? 1 : 0.7])

  return (
    <motion.div
      style={{ y, scale, opacity, zIndex: index + 1, transformOrigin: 'top center' }}
      className="absolute inset-0 flex items-center justify-center p-3 sm:p-6 lg:p-10"
    >
      {/* Fixed viewport-bound frame so header + image + story always fit */}
      <div className="w-full max-w-[1400px] h-[min(88vh,920px)]">
        <ProjectCard index={index} {...project} fill />
      </div>
    </motion.div>
  )
}

function StackedTrack() {
  const trackRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  return (
    <div ref={trackRef} className="relative" style={{ height: `${projects.length * 100}vh` }}>
      <div className="sticky top-0 h-[100dvh] overflow-hidden">
        {projects.map((project, index) => (
          <StackedCard
            key={project.title}
            project={project}
            index={index}
            total={projects.length}
            progress={scrollYProgress}
          />
        ))}
      </div>
    </div>
  )
}

function CardList({ items }) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-10 flex flex-col gap-8">
      {items.map((project, index) => (
        <div key={project.title} className="h-[min(80vh,720px)]">
          <ProjectCard index={index} {...project} fill />
        </div>
      ))}
    </div>
  )
}

export default function Projects() {
  const reduced = usePrefersReducedMotion()

  return (
    <section id="projects" className="relative z-10 scroll-mt-20 py-16 sm:py-24">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-10 text-center">
        <span className="font-mono text-accent-glow text-sm tracking-widest uppercase">
          Selected work
        </span>
        <h2 className="font-display text-primary text-3xl sm:text-4xl font-semibold mt-2 mb-8 sm:mb-12">
          Projects
        </h2>
      </div>

      {reduced ? <CardList items={projects} /> : <StackedTrack />}
    </section>
  )
}
