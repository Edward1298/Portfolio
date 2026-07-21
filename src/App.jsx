import { useMemo } from 'react'
import Nav from './components/Nav/Nav.jsx'
import Landing from './components/Landing/Landing.jsx'
import About from './components/About/About.jsx'
import SkillsKeyboard from './components/SkillsKeyboard/SkillsKeyboard.jsx'
import Projects from './components/Projects/Projects.jsx'
import Certifications from './components/Certifications/Certifications.jsx'
import Contact from './components/Contact/Contact.jsx'
import LightningBackground from './components/LightningBackground/LightningBackground.jsx'
import CursorSparkTrail from './components/CursorSparkTrail/CursorSparkTrail.jsx'
import EffectBoundary from './components/EffectBoundary/EffectBoundary.jsx'
import { useInView } from './hooks/useInView.js'

export default function App() {
  const [landingRef, landingInView] = useInView({ threshold: 0.3, rootMargin: '-20% 0px -20% 0px' })
  const [aboutRef, aboutInView] = useInView({ threshold: 0.3, rootMargin: '-20% 0px -20% 0px' })
  const [skillsRef, skillsInView] = useInView({ threshold: 0.3, rootMargin: '-20% 0px -20% 0px' })
  const [projectsRef, projectsInView] = useInView({ threshold: 0.3, rootMargin: '-20% 0px -20% 0px' })
  const [certificationsRef, certificationsInView] = useInView({ threshold: 0.3, rootMargin: '-20% 0px -20% 0px' })
  const [contactRef, contactInView] = useInView({ threshold: 0.3, rootMargin: '-10% 0px -10% 0px' })

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

  return (
    <>
      <EffectBoundary>
        <LightningBackground />
      </EffectBoundary>
      <Nav activeSection={activeSection} />
      <div ref={landingRef}>
        <Landing />
      </div>
      <div ref={aboutRef}>
        <About />
      </div>
      <div ref={skillsRef}>
        <SkillsKeyboard />
      </div>
      <div ref={projectsRef}>
        <Projects />
      </div>
      <div ref={certificationsRef}>
        <Certifications />
      </div>
      <div ref={contactRef}>
        <Contact />
      </div>
      <EffectBoundary>
        <CursorSparkTrail />
      </EffectBoundary>
    </>
  )
}
