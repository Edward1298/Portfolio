const LINKS = [
  { label: 'Landing', href: '#landing' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Certifications', href: '#certifications' },
  { label: 'Contact', href: '#contact' },
]

export default function Nav({ activeSection = 'landing' }) {
  return (
    <header className="fixed top-4 sm:top-6 inset-x-0 z-50 flex justify-center">
      <nav aria-label="Main">
        <ul className="flex items-center justify-center gap-0 sm:gap-1">
          {LINKS.map(({ label, href }) => {
            const isActive = activeSection === href.slice(1)
            return (
              <li key={href}>
                <a
                  href={href}
                  className={`inline-flex items-center px-1.5 sm:px-3 py-2 text-xs sm:text-sm font-medium transition-all duration-300 rounded-md min-h-[44px] ${
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
