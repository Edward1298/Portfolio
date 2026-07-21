import { useEffect, useState } from 'react'

const LINKS = [
  { label: 'Landing', href: '#landing' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav({ activeSection = 'landing' }) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mql = window.matchMedia('(max-width: 767px)')
    setIsMobile(mql.matches)
    const handler = (e) => setIsMobile(e.matches)
    mql.addEventListener('change', handler)
    return () => mql.removeEventListener('change', handler)
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur-sm border-b border-subtle">
      <nav
        className={`mx-auto max-w-7xl px-4 ${
          isMobile ? 'overflow-x-auto' : ''
        }`}
        aria-label="Main"
      >
        <ul className={`flex items-center gap-1 ${isMobile ? 'min-w-max' : 'justify-end'} py-3`}>
          {LINKS.map(({ label, href }) => {
            const isActive = activeSection === href.slice(1)
            return (
              <li key={href}>
                <a
                  href={href}
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium transition-colors rounded-md min-h-[44px] min-w-[44px] ${
                    isActive
                      ? 'text-accent shadow-glow-sm'
                      : 'text-secondary hover:text-primary'
                  }`}
                >
                  {label}
                </a>
              </li>
            )
          })}
        </ul>
      </nav>
    </header>
  )
}
