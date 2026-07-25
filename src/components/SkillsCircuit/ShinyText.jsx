import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'

const SHINE_KEYFRAMES = `
@keyframes shine {
  0% { background-position: 150% center; }
  100% { background-position: -50% center; }
}
`

export default function ShinyText({
  text,
  speed = 2.5,
  color = '#5B8FFF',
  shineColor = '#DFE8F5',
}) {
  const reduced = usePrefersReducedMotion()

  return (
    <>
      {!reduced && <style>{SHINE_KEYFRAMES}</style>}
      <span
        style={{
          backgroundImage: `linear-gradient(120deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
          backgroundSize: '200% auto',
          WebkitBackgroundClip: 'text',
          backgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          animation: reduced ? 'none' : `shine ${speed}s linear infinite`,
          fontFamily: 'JetBrains Mono, ui-monospace, monospace',
          fontSize: '11px',
          letterSpacing: '0.2em',
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}
      >
        {text}
      </span>
    </>
  )
}
