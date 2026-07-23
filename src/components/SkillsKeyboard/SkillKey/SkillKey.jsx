import { memo, useState } from 'react'

function SkillKey({ name, icon, monogram }) {
  const [imgFailed, setImgFailed] = useState(false)
  const showMonogram = !icon || imgFailed
  const glyph = monogram ?? name.slice(0, 2).toUpperCase()

  return (
    <button
      type="button"
      aria-label={name}
      className="keycap group flex aspect-square flex-col items-center justify-center gap-1.5 rounded-lg border border-subtle bg-surface p-2 hover:border-accent/50 focus-visible:border-accent"
    >
      {showMonogram ? (
        <span className="font-mono text-lg font-semibold text-accent md:text-xl">
          {glyph}
        </span>
      ) : (
        <img
          src={icon}
          alt={name}
          loading="lazy"
          onError={() => setImgFailed(true)}
          className="h-8 w-8 object-contain transition-transform duration-150 group-hover:scale-110 md:h-10 md:w-10"
        />
      )}
      <span className="w-full truncate text-center font-mono text-[10px] text-secondary md:text-xs">
        {name}
      </span>
    </button>
  )
}

export default memo(SkillKey)
