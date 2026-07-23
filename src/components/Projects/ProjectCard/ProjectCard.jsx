import { Github, ExternalLink } from 'lucide-react'

export default function ProjectCard({
  index,
  title,
  category,
  repo,
  live,
  liveBadge,
  images = [],
  story,
}) {
  const paddedIndex = String(index + 1).padStart(2, '0')

  return (
    <article className="overflow-hidden rounded-lg border border-subtle bg-surface shadow-card transition-colors hover:border-accent/40">
      {/* Header — index centered with category+title on left, buttons on right */}
      <div className="flex items-center justify-between gap-4 p-5 sm:p-6">
        <div className="flex items-center gap-4">
          <span className="font-display text-4xl sm:text-5xl font-bold text-accent leading-none">
            {paddedIndex}
          </span>
          <div>
            <span className="font-mono text-xs text-secondary tracking-widest uppercase">
              {category}
            </span>
            <h3 className="font-display text-primary text-lg sm:text-2xl font-semibold mt-0.5">
              {title}
            </h3>
          </div>
        </div>

        {/* Repo + Live buttons in header */}
        <div className="shrink-0 flex items-center gap-2">
          <a
            href={repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-subtle px-3 py-1.5 text-xs sm:text-sm font-medium text-accent transition-colors hover:border-accent hover:bg-accent/10 min-h-[40px]"
          >
            <Github size={14} aria-hidden="true" />
            <span className="hidden sm:inline">Code</span>
          </a>

          {live ? (
            <a
              href={live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-accent px-3 py-1.5 text-xs sm:text-sm font-medium text-accent transition-colors hover:bg-accent/10 min-h-[40px]"
            >
              <ExternalLink size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Live project</span>
            </a>
          ) : (
            <span className="inline-flex items-center rounded-full border border-subtle px-3 py-1.5 text-xs sm:text-sm font-medium text-secondary">
              {liveBadge}
            </span>
          )}
        </div>
      </div>

      {/* Images — 1 full width or 2 side by side */}
      {images.length > 0 && (
        <div
          className={`grid gap-2 ${
            images.length === 2 ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'
          }`}
        >
          {images.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`${title} screenshot ${i + 1}`}
              loading="lazy"
              className="h-[380px] sm:h-[520px] lg:h-[600px] w-full object-cover"
            />
          ))}
        </div>
      )}

      {/* Story — centered, no buttons (moved to header) */}
      <div className="p-6 sm:p-8 lg:p-10">
        <p className="font-sans text-secondary text-sm sm:text-base leading-relaxed text-center max-w-2xl mx-auto">
          {story}
        </p>
      </div>
    </article>
  )
}
