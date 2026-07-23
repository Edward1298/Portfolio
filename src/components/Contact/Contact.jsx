import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Send } from 'lucide-react'
import { contactConfig } from '../../data/contact.js'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'

const STATUS = {
  IDLE: 'idle',
  SENDING: 'sending',
  SUCCESS: 'success',
  ERROR: 'error',
}

export default function Contact() {
  const reduced = usePrefersReducedMotion()
  const configured = contactConfig.isConfigured()
  const [status, setStatus] = useState(STATUS.IDLE)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!configured) return

    setStatus(STATUS.SENDING)
    const form = e.target
    const formData = new FormData(form)
    formData.append('_subject', contactConfig.subject)

    try {
      const res = await fetch(contactConfig.getEndpoint(), {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })

      if (res.ok) {
        setStatus(STATUS.SUCCESS)
        form.reset()
      } else {
        setStatus(STATUS.ERROR)
      }
    } catch {
      setStatus(STATUS.ERROR)
    }
  }

  const StatusMessage = () => {
    if (status === STATUS.IDLE) return null

    const config = {
      [STATUS.SENDING]: {
        text: 'Sending…',
        className: 'text-secondary',
        role: 'status',
        ariaLive: 'polite',
      },
      [STATUS.SUCCESS]: {
        text: 'Message sent, thank you for contacting',
        className: 'text-accent-glow',
        role: 'status',
        ariaLive: 'polite',
      },
      [STATUS.ERROR]: {
        text: 'Something went wrong, please try again.',
        className: 'text-cta',
        role: 'alert',
        ariaLive: 'assertive',
      },
    }

    const { text, className, role, ariaLive } = config[status]

    const Msg = reduced ? 'p' : motion.p
    const msgProps = reduced
      ? {}
      : {
          initial: { opacity: 0 },
          animate: { opacity: 1 },
          exit: { opacity: 0 },
        }

    return (
      <Msg
        role={role}
        aria-live={ariaLive}
        className={`mt-4 text-sm font-medium ${className}`}
        {...msgProps}
      >
        {status === STATUS.SENDING && (
          <Loader2
            size={14}
            aria-hidden="true"
            className={`mr-2 inline-block ${reduced ? '' : 'animate-spin'}`}
          />
        )}
        {text}
      </Msg>
    )
  }

  return (
    <section id="contact" className="relative z-10 scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-lg px-6 sm:px-10">
        <span className="font-mono text-accent-glow text-sm tracking-widest uppercase">
          Get in touch
        </span>
        <h2 className="font-display text-primary text-3xl sm:text-4xl font-semibold mt-2">
          Let&apos;s work together
        </h2>
        <p className="mt-3 font-sans text-secondary text-base leading-relaxed">
          Have a role or a project in mind? Drop a message — I read every one.
        </p>

        {configured ? (
          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div>
              <label htmlFor="name" className="block font-sans text-sm text-secondary mb-1.5">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                aria-required="true"
                disabled={status === STATUS.SENDING}
                className="w-full rounded-md border border-subtle bg-surface px-4 py-3 text-primary placeholder:text-secondary focus:border-accent focus:shadow-glow-sm focus:outline-none transition-colors min-h-[44px]"
                placeholder="Your name"
              />
            </div>

            <div>
              <label htmlFor="email" className="block font-sans text-sm text-secondary mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                aria-required="true"
                disabled={status === STATUS.SENDING}
                className="w-full rounded-md border border-subtle bg-surface px-4 py-3 text-primary placeholder:text-secondary focus:border-accent focus:shadow-glow-sm focus:outline-none transition-colors min-h-[44px]"
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label htmlFor="message" className="block font-sans text-sm text-secondary mb-1.5">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                aria-required="true"
                rows={5}
                disabled={status === STATUS.SENDING}
                className="w-full rounded-md border border-subtle bg-surface px-4 py-3 text-primary placeholder:text-secondary focus:border-accent focus:shadow-glow-sm focus:outline-none transition-colors resize-none"
                placeholder="Tell me about the role or project…"
              />
            </div>

            <button
              type="submit"
              disabled={status === STATUS.SENDING}
              className="inline-flex items-center justify-center gap-2 rounded-md bg-cta px-4 py-3 font-display text-base font-medium text-bg transition-colors hover:bg-cta-hover hover:shadow-glow-sm focus:outline-none min-h-[44px] disabled:opacity-50"
            >
              {status === STATUS.SENDING ? (
                <>
                  {reduced ? null : <Loader2 size={18} className="animate-spin" aria-hidden="true" />}
                  Sending…
                </>
              ) : (
                <>
                  <Send size={18} aria-hidden="true" />
                  Send message
                </>
              )}
            </button>

            <AnimatePresence mode="wait">
              <StatusMessage key={status} />
            </AnimatePresence>
          </form>
        ) : (
          <div className="mt-8 rounded-lg border border-subtle bg-surface p-6 text-center">
            <p className="font-sans text-secondary text-sm">
              Contact form is not configured.
            </p>
            <p className="mt-1.5 font-mono text-xs text-disabled">
              Add VITE_FORMSPREE_ID to .env
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
