import { ChevronUp } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="relative z-10 border-t border-subtle py-8">
      <div className="mx-auto max-w-5xl px-6 sm:px-10 flex items-center justify-between">
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-disabled">
          &copy; {new Date().getFullYear()} Eduardo C&eacute;spedes.
        </span>
        <a
          href="#landing"
          aria-label="Back to top"
          className="text-disabled hover:text-accent transition-colors duration-300 min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
        >
          <ChevronUp size={16} />
        </a>
        <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-disabled">
          Built with React + Vite
        </span>
      </div>
    </footer>
  )
}
