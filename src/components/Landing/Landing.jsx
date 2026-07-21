import { motion } from 'framer-motion'
import { Github, Linkedin, FileDown } from 'lucide-react'
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

const containerVariants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.18, delayChildren: 0.3 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 50, scale: 0.9, filter: 'blur(12px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.9, ease: [0.22, 1, 0.36, 1] },
  },
}

export default function Landing() {
  const reduced = usePrefersReducedMotion()

  const Wrapper = reduced ? 'div' : motion.div
  const wrapperProps = reduced
    ? {}
    : { variants: containerVariants, initial: 'hidden', animate: 'visible' }

  const Item = reduced ? 'div' : motion.div
  const itemProps = reduced ? {} : { variants: itemVariants }

  return (
    <section
      id="landing"
      className="relative z-10 min-h-screen flex items-center"
    >
      <div className="mx-auto w-full max-w-7xl px-6 sm:px-10 lg:px-16">
        <div className="max-w-2xl">
          <Wrapper {...wrapperProps} className="flex flex-col gap-5">
            <Item {...itemProps}>
              <span className="font-mono text-accent text-sm tracking-widest uppercase">
                Hello, I&apos;m
              </span>
            </Item>

            <Item {...itemProps}>
              <h1 className="font-display font-semibold leading-[0.88] tracking-tight bg-gradient-to-br from-primary via-highlight to-accent-glow bg-clip-text text-transparent text-6xl sm:text-7xl md:text-8xl lg:text-[9rem]">
                Eduardo
                <br />
                Céspedes
              </h1>
            </Item>

            <Item {...itemProps}>
              <p className="font-sans text-secondary text-lg md:text-2xl font-medium">
                Software Developer &amp; DevOps Engineer
              </p>
            </Item>

            <Item {...itemProps}>
              <div className="h-px w-32 bg-gradient-to-r from-accent via-accent-glow to-transparent" />
            </Item>

            <Item {...itemProps}>
              <nav aria-label="Social links">
                <ul className="flex items-center gap-3">
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
            </Item>
          </Wrapper>
        </div>
      </div>
    </section>
  )
}
