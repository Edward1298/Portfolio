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
    <header className="fixed top-6 left-1/2 -translate-x-1/2 z-50">
      <nav
        className={isMobile ? 'overflow-x-auto' : ''}
        aria-label="Main"
      >
        <ul
          className={`flex items-center justify-center gap-0.5 sm:gap-1 ${isMobile ? 'min-w-max' : ''}`}
        >
          {LINKS.map(({ label, href }) => {
            const isActive = activeSection === href.slice(1)
            return (
              <li key={href}>
                <a
                  href={href}
                  className={`inline-flex items-center px-2 sm:px-3 py-2 text-sm font-medium transition-all duration-300 rounded-md min-h-[44px] ${
                    isActive
                      ? 'text-accent'
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
