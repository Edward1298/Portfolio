import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { projects } from '../../data/projects.js'
import ProjectCard from './ProjectCard/ProjectCard.jsx'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'

// Scroll math: card i slides up (y 100%→0%) during segment [(i-1)/n, i/n];
// once covered, it scales 1→1-(n-1-i)*0.04 and dims to 0.7 over [i/n, 1].
// Stacking works on all screen sizes — only disabled by reduced-motion.
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
      className="absolute inset-0 flex items-center justify-center px-4 sm:px-8 lg:px-10"
    >
      <div className="w-full max-w-[1400px]">
        <ProjectCard index={index} {...project} />
      </div>
    </motion.div>
  )
}

function CardList({ items }) {
  return (
    <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-10 flex flex-col gap-8">
      {items.map((project, index) => (
        <div key={project.title}>
          <ProjectCard index={index} {...project} />
        </div>
      ))}
    </div>
  )
}

export default function Projects() {
  const reduced = usePrefersReducedMotion()
  const trackRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ['start start', 'end end'],
  })

  const usePinnedStack = !reduced

  return (
    <section id="projects" className="relative z-10 scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl px-6 sm:px-10 mb-10 sm:mb-14">
        <span className="font-mono text-accent-glow text-sm tracking-widest uppercase">
          Selected work
        </span>
        <h2 className="font-display text-primary text-3xl sm:text-4xl font-semibold mt-2">
          Projects
        </h2>
      </div>

      {usePinnedStack ? (
        <div ref={trackRef} className="relative" style={{ height: `${projects.length * 100}vh` }}>
          <div className="sticky top-0 h-screen overflow-hidden">
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
      ) : (
        <CardList items={projects} />
      )}
    </section>
  )
}
