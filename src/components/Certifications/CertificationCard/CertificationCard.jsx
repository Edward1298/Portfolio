import { ExternalLink } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CertificationCard({
  title,
  image,
  type,
  issuer,
  date,
  credentialUrl,
  x,
  opacity,
  scale,
  z,
  cardW,
  reduced,
  onClick,
}) {
  return (
    <motion.article
      onClick={onClick}
      initial={false}
      animate={{ x, opacity, scale, zIndex: z }}
      transition={{ duration: reduced ? 0 : 0.35, ease: 'easeOut' }}
      style={{ width: cardW, marginLeft: -cardW / 2 }}
      className="absolute left-1/2 top-0 cursor-pointer overflow-hidden rounded-lg border bg-surface shadow-card select-none border-subtle"
    >
      <div className="relative">
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="aspect-video w-full object-cover"
        />
        {/* Bottom gradient — fades the cert's hard edge into the card surface */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-surface to-transparent"
        />
        {/* Type badge — reads on light or dark cert backgrounds */}
        <span className="absolute top-3 right-3 rounded-full border border-subtle/80 bg-surface/85 px-2.5 py-1 font-mono text-[10px] text-secondary backdrop-blur-sm shadow-sm">
          {type}
        </span>
      </div>

      <div className="p-5">
        <h3 className="font-display text-primary text-base font-semibold">
          {title}
        </h3>
        <p className="mt-1.5 font-sans text-secondary text-sm">{issuer}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="font-mono text-xs text-secondary">{date}</span>
          {credentialUrl && (
            <a
              href={credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-accent transition-colors hover:text-accent-glow"
            >
              <ExternalLink size={14} aria-hidden="true" />
              Verify
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}