import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, ExternalLink } from 'lucide-react'

export default function CertificationLightbox({
  certifications,
  index,
  reduced,
  onClose,
  onPrev,
  onNext,
}) {
  const dialogRef = useRef(null)
  const cert = certifications[index]

  // Close on Esc, focus the dialog on open, lock body scroll while open.
  useEffect(() => {
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onPrev()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        onNext()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', onKey)
    }
  }, [onClose, onPrev, onNext])

  if (!cert) return null

  const transition = reduced ? { duration: 0 } : { duration: 0.3, ease: 'easeOut' }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm p-4 sm:p-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={transition}
        onClick={onClose}
      >
        <motion.div
          ref={dialogRef}
          tabIndex={-1}
          role="dialog"
          aria-modal="true"
          aria-label={`${cert.title} — ${cert.type}`}
          onClick={(e) => e.stopPropagation()}
          initial={{ scale: reduced ? 1 : 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: reduced ? 1 : 0.92, opacity: 0 }}
          transition={transition}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-auto rounded-lg border border-subtle bg-surface shadow-glow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          {/* Close */}
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="absolute top-3 right-3 z-10 inline-flex items-center justify-center rounded-full border border-subtle bg-surface/85 p-2 text-secondary transition-colors hover:text-accent hover:border-accent min-h-[44px] min-w-[44px]"
          >
            <X size={18} aria-hidden="true" />
          </button>

          {/* Prev / Next */}
          <button
            type="button"
            aria-label="Previous certification"
            onClick={onPrev}
            className="absolute left-3 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center rounded-full border border-subtle bg-surface/85 p-2 text-accent transition-colors hover:border-accent hover:bg-accent/10 min-h-[44px] min-w-[44px]"
          >
            <ChevronLeft size={20} aria-hidden="true" />
          </button>
          <button
            type="button"
            aria-label="Next certification"
            onClick={onNext}
            className="absolute right-3 top-1/2 -translate-y-1/2 z-10 inline-flex items-center justify-center rounded-full border border-subtle bg-surface/85 p-2 text-accent transition-colors hover:border-accent hover:bg-accent/10 min-h-[44px] min-w-[44px]"
          >
            <ChevronRight size={20} aria-hidden="true" />
          </button>

          {/* Image — keyed per index so prev/next crossfade cleanly */}
          <div className="w-full max-h-[60vh] flex items-center justify-center bg-black/40">
            <AnimatePresence mode="wait">
              <motion.img
                key={index}
                src={cert.image}
                alt={cert.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={transition}
                className="max-h-[60vh] w-auto object-contain"
              />
            </AnimatePresence>
          </div>

          <div className="p-6">
            <div className="flex items-center gap-3">
              <span className="rounded-full border border-subtle/80 bg-surface-elevated/85 px-2.5 py-1 font-mono text-[10px] text-secondary">
                {cert.type}
              </span>
              <span className="font-mono text-xs text-secondary">
                {cert.date}
              </span>
            </div>
            <h3 className="mt-3 font-display text-primary text-xl sm:text-2xl font-semibold">
              {cert.title}
            </h3>
            <p className="mt-1.5 font-sans text-secondary text-sm">
              {cert.issuer}
            </p>
            {cert.credentialUrl && (
              <a
                href={cert.credentialUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-glow"
              >
                <ExternalLink size={15} aria-hidden="true" />
                Verify credential
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}