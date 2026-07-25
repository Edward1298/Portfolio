import { useMemo, lazy, Suspense } from 'react'
import { motion } from 'framer-motion'
import Nav from './components/Nav/Nav.jsx'
import Landing from './components/Landing/Landing.jsx'
import About from './components/About/About.jsx'
import Contact from './components/Contact/Contact.jsx'
import Footer from './components/Footer/Footer.jsx'
import LightningBackground from './components/LightningBackground/LightningBackground.jsx'
import FogBackground from './components/FogBackground/FogBackground.jsx'
import CursorSparkTrail from './components/CursorSparkTrail/CursorSparkTrail.jsx'
import EffectBoundary from './components/EffectBoundary/EffectBoundary.jsx'
import { useInView } from './hooks/useInView.js'
import { usePrefersReducedMotion } from './hooks/usePrefersReducedMotion.js'

// Lazy-load heavy sections — chunks load in parallel on initial render,
// Suspense fallback preserves layout height so the IntersectionObserver
// for active-section highlighting stays accurate during the load.
const LazySkills = lazy(() => import('./components/SkillsLoop/SkillsLoop.jsx'))
const LazyProjects = lazy(() => import('./components/Projects/Projects.jsx'))
const LazyCerts = lazy(() => import('./components/Certifications/Certifications.jsx'))

const sectionMotion = {
  initial: { opacity: 0, y: 60, scale: 0.95 },
  whileInView: { opacity: 1, y: 0, scale: 1 },
  viewport: { once: false, amount: 0.1 },
  transition: { duration: 1, ease: [0.22, 1, 0.36, 1] },
}

const lazyFallback = <div className="min-h-screen" />

export default function App() {
  const reduced = usePrefersReducedMotion()

  const [landingRef, landingInView] = useInView({ threshold: 0, rootMargin: '-15% 0px -15% 0px' })
  const [aboutRef, aboutInView] = useInView({ threshold: 0, rootMargin: '-15% 0px -15% 0px' })
  const [skillsRef, skillsInView] = useInView({ threshold: 0, rootMargin: '-15% 0px -15% 0px' })
  const [projectsRef, projectsInView] = useInView({ threshold: 0, rootMargin: '-15% 0px -15% 0px' })
  const [certificationsRef, certificationsInView] = useInView({ threshold: 0, rootMargin: '-15% 0px -15% 0px' })
  const [contactRef, contactInView] = useInView({ threshold: 0, rootMargin: '-10% 0px -10% 0px' })

  const activeSection = useMemo(() => {
    const sections = [
      { id: 'landing', inView: landingInView },
      { id: 'about', inView: aboutInView },
      { id: 'skills', inView: skillsInView },
      { id: 'projects', inView: projectsInView },
      { id: 'certifications', inView: certificationsInView },
      { id: 'contact', inView: contactInView },
    ]
    for (let i = sections.length - 1; i >= 0; i--) {
      if (sections[i].inView) return sections[i].id
    }
    return 'landing'
  }, [landingInView, aboutInView, skillsInView, projectsInView, certificationsInView, contactInView])

  const Wrapper = reduced ? 'div' : motion.div
  const wrapperProps = reduced ? {} : sectionMotion

  return (
    <>
      <EffectBoundary>
        <FogBackground />
      </EffectBoundary>
      <EffectBoundary>
        <LightningBackground />
      </EffectBoundary>
      <Nav activeSection={activeSection} />
      <div ref={landingRef}>
        <Landing />
      </div>
      <Wrapper ref={aboutRef} {...wrapperProps}>
        <About />
      </Wrapper>
      <Wrapper ref={skillsRef} {...wrapperProps}>
        <Suspense fallback={lazyFallback}>
          <LazySkills />
        </Suspense>
      </Wrapper>
      <Wrapper ref={projectsRef} {...wrapperProps}>
        <Suspense fallback={lazyFallback}>
          <LazyProjects />
        </Suspense>
      </Wrapper>
      <Wrapper ref={certificationsRef} {...wrapperProps}>
        <Suspense fallback={lazyFallback}>
          <LazyCerts />
        </Suspense>
      </Wrapper>
      <Wrapper ref={contactRef} {...wrapperProps}>
        <Contact />
      </Wrapper>
      <Footer />
      <EffectBoundary>
        <CursorSparkTrail />
      </EffectBoundary>
    </>
  )
}
