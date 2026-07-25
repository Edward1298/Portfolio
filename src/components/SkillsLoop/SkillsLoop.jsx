import { useState, useMemo } from 'react'
import { skills } from '../../data/skills.js'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'
import './SkillsLoop.css'

const CATEGORIES = [
  { key: 'backend', label: 'Backend', dir: 'left' },
  { key: 'tools', label: 'Tools', dir: 'right' },
  { key: 'frontend', label: 'Frontend', dir: 'left' },
]

function getMonogram(name) {
  const parts = name.split(/(?=[A-Z])|\s+/).filter(Boolean)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.slice(0, 2).toUpperCase()
}

export default function SkillsLoop() {
  const reduced = usePrefersReducedMotion()

  const grouped = useMemo(() => {
    const map = {}
    CATEGORIES.forEach(({ key }) => {
      map[key] = skills.filter(s => s.category === key)
    })
    return map
  }, [])

  return (
    <section id="skills" className="relative z-10 scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-8 lg:px-10">
        <div className="text-center mb-10">
          <span className="font-mono text-accent-glow text-sm tracking-widest uppercase">
            Toolbox
          </span>
          <h2 className="font-display text-primary text-3xl sm:text-4xl font-semibold mt-2">
            Skills
          </h2>
        </div>
        <div className="flex flex-col gap-0">
          {CATEGORIES.map(({ key, label, dir }, idx) => {
            const items = grouped[key]
            return (
              <div key={key}>
                <div className="skill-row">
                  <div className="skill-row__label">
                    <span className="skill-row__dot" aria-hidden="true" />
                    <span className="skill-row__name">{label}</span>
                  </div>
                <div
                  className={`skill-row__track ${reduced ? 'skill-row__track--static' : ''}`}
                  aria-label={`${label} skills: ${items.map(s => s.name).join(', ')}`}
                >
                  {reduced ? (
                    <div className="skill-row__static">
                      {items.map(skill => (
                        <SkillChip key={skill.name} skill={skill} />
                      ))}
                    </div>
                  ) : (
                    <div className={`skill-row__marquee skill-row__marquee--${dir}`}>
                      <div className="skill-row__marquee-inner">
                        {items.map(skill => (
                          <SkillChip key={skill.name} skill={skill} />
                        ))}
                      </div>
                      <div className="skill-row__marquee-inner" aria-hidden="true">
                        {items.map(skill => (
                          <SkillChip key={skill.name} skill={skill} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {idx < CATEGORIES.length - 1 && (
                <div className="skill-divider" role="presentation">
                  <div className="skill-divider__line" />
                  <div className={`skill-divider__dot ${reduced ? '' : `skill-divider__dot--${dir}`}`} />
                </div>
              )}
            </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function SkillChip({ skill }) {
  const [imgError, setImgError] = useState(false)

  return (
    <div className="skill-chip" role="presentation">
      {imgError ? (
        <span className="skill-chip__monogram" aria-hidden="true">
          {getMonogram(skill.name)}
        </span>
      ) : (
        <img
          className="skill-chip__icon"
          src={skill.icon}
          alt=""
          loading="lazy"
          onError={() => setImgError(true)}
        />
      )}
      <span className="skill-chip__name">{skill.name}</span>
    </div>
  )
}
