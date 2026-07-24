import { motion } from 'framer-motion'
import { Github, Linkedin, FileDown, ChevronDown } from 'lucide-react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'

const LINKS = [
  {
    label: 'GitHub profile',
    href: 'https://github.com/Edward1298',
    icon: Github,
    external: true,
  },
  {
    label: 'LinkedIn profile',
    href: 'https://www.linkedin.com/in/eduardo-cespedes-osorio',
    icon: Linkedin,
    external: true,
  },
  {
    label: 'Download CV',
    href: '/cv.pdf',
    icon: FileDown,
    download: true,
  },
]

const helloVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 1.2, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const eduardoVariants = {
  hidden: { opacity: 0, x: 120 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { delay: 1.7, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const cespedesVariants = {
  hidden: { opacity: 0, y: -50 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 2.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const roleVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { delay: 2.5, duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

const socialVariants = {
  hidden: { opacity: 0, y: -30, scale: 0.8 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: 3.3 + i * 0.25, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
  }),
}

export default function Landing() {
  const reduced = usePrefersReducedMotion()

  if (reduced) {
    return (
      <section
        id="landing"
        className="relative z-10 min-h-screen flex items-center justify-center"
      >
        <div className="mx-auto w-full max-w-2xl text-center px-6">
          <span className="font-mono text-accent text-sm tracking-widest uppercase">
            Hello, I&apos;m
          </span>
          <h1 className="mt-3 font-display font-semibold leading-[0.88] tracking-tight bg-gradient-to-br from-primary via-highlight to-accent-glow bg-clip-text text-transparent text-5xl sm:text-6xl md:text-7xl lg:text-[7rem]">
            Eduardo
            <br />
            Céspedes
          </h1>
          <p className="mt-4 font-sans text-secondary text-lg md:text-2xl font-medium">
            Software Developer &amp; DevOps Engineer
          </p>
          <nav aria-label="Social links" className="mt-8">
            <ul className="flex items-center justify-center gap-3">
              {LINKS.map(({ label, href, icon: Icon, external, download }) => (
                <li key={href}>
                  <a
                    href={href}
                    aria-label={label}
                    {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    {...(download ? { download: true } : {})}
                    className="inline-flex items-center justify-center p-3 text-accent hover:text-highlight hover:shadow-glow-md rounded-xl border border-subtle hover:border-accent-glow bg-surface/50 backdrop-blur-sm transition-all duration-300 min-h-[48px] min-w-[48px]"
                  >
                    <Icon size={22} aria-hidden="true" />
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none">
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-disabled">
            Scroll
          </span>
          <ChevronDown size={16} className="text-disabled animate-bounce" />
        </div>
      </section>
    )
  }

  const scrollVariants = {
    hidden: { opacity: 0, y: -8 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { delay: 4.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  }

  return (
    <section
      id="landing"
      className="relative z-10 min-h-screen flex items-center justify-center overflow-x-hidden"
    >
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 0 }}
        transition={{ delay: 1.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 bg-bg pointer-events-none"
      />

      <div className="mx-auto w-full max-w-4xl text-center px-6 relative z-10">
        <motion.span
          variants={helloVariants}
          initial="hidden"
          animate="visible"
          className="block font-mono text-accent text-sm tracking-widest uppercase"
        >
          Hello, I&apos;m
        </motion.span>

        <motion.div
          variants={eduardoVariants}
          initial="hidden"
          animate="visible"
          className="mt-3 bg-gradient-to-br from-primary via-highlight to-accent-glow bg-clip-text text-transparent font-display font-semibold leading-[0.88] tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-[7rem]"
        >
          <span className="block">Eduardo</span>
        </motion.div>

        <motion.span
          variants={cespedesVariants}
          initial="hidden"
          animate="visible"
          className="block bg-gradient-to-br from-primary via-highlight to-accent-glow bg-clip-text text-transparent font-display font-semibold leading-[0.88] tracking-tight text-5xl sm:text-6xl md:text-7xl lg:text-[7rem]"
        >
          Céspedes
        </motion.span>

        <motion.p
          variants={roleVariants}
          initial="hidden"
          animate="visible"
          className="mt-4 font-sans text-secondary text-lg md:text-2xl font-medium"
        >
          Software Developer &amp; DevOps Engineer
        </motion.p>

        <nav aria-label="Social links" className="mt-8">
          <ul className="flex items-center justify-center gap-4 sm:gap-5">
            {LINKS.map(({ label, href, icon: Icon, external, download }, i) => (
              <motion.li
                key={href}
                custom={i}
                variants={socialVariants}
                initial="hidden"
                animate="visible"
              >
                <a
                  href={href}
                  aria-label={label}
                  {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  {...(download ? { download: true } : {})}
                  className="inline-flex items-center justify-center p-3 text-accent hover:text-highlight hover:shadow-glow-md rounded-xl border border-subtle hover:border-accent-glow bg-surface/50 backdrop-blur-sm transition-all duration-300 min-h-[48px] min-w-[48px]"
                >
                  <Icon size={22} aria-hidden="true" />
                </a>
              </motion.li>
            ))}
          </ul>
        </nav>
      </div>

      <motion.div
        variants={scrollVariants}
        initial="hidden"
        animate="visible"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 pointer-events-none"
      >
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-disabled">
          Scroll
        </span>
        <ChevronDown size={16} className="text-disabled animate-bounce" />
      </motion.div>
    </section>
  )
}
