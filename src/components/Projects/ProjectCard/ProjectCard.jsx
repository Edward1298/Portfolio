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
  fill = false,
}) {
  const paddedIndex = String(index + 1).padStart(2, '0')
  const image = images[0]

  return (
    <article
      className={`overflow-hidden rounded-lg border border-subtle bg-surface shadow-card transition-colors hover:border-accent/40 ${
        fill ? 'flex h-full min-h-0 flex-col' : ''
      }`}
    >
      {/* Header */}
      <div className="flex shrink-0 items-center justify-between gap-2 sm:gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-4">
          <span className="shrink-0 font-display text-2xl sm:text-4xl lg:text-5xl font-bold text-accent leading-none">
            {paddedIndex}
          </span>
          <div className="min-w-0">
            <span className="font-mono text-[10px] sm:text-xs text-secondary tracking-widest uppercase">
              {category}
            </span>
            <h3 className="font-display text-primary text-sm sm:text-xl lg:text-2xl font-semibold mt-0.5 truncate">
              {title}
            </h3>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1.5 sm:gap-2">
          <a
            href={repo}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 rounded-md border border-subtle px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-accent transition-colors hover:border-accent hover:bg-accent/10 min-h-[40px]"
          >
            <Github size={14} aria-hidden="true" />
            <span className="hidden sm:inline">Code</span>
          </a>

          {live ? (
            <a
              href={live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-full border border-accent px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-accent transition-colors hover:bg-accent/10 min-h-[40px]"
            >
              <ExternalLink size={14} aria-hidden="true" />
              <span className="hidden sm:inline">Live project</span>
            </a>
          ) : (
            <span className="inline-flex items-center rounded-full border border-subtle px-2.5 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-secondary">
              {liveBadge}
            </span>
          )}
        </div>
      </div>

      {/* Image — takes remaining height when fill=true */}
      {image && (
        <div className={fill ? 'relative min-h-0 flex-1' : 'relative h-[280px] sm:h-[400px] lg:h-[480px]'}>
          <img
            src={image}
            alt={`${title} screenshot`}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        </div>
      )}

      {/* Story */}
      <div className="shrink-0 px-4 py-3 sm:px-6 sm:py-4">
        <p className="font-sans text-secondary text-xs sm:text-sm lg:text-base leading-relaxed text-center max-w-3xl mx-auto line-clamp-3 sm:line-clamp-none">
          {story}
        </p>
      </div>
    </article>
  )
}
