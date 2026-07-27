import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Loader2, Send, Paperclip, X } from 'lucide-react'
import { contactConfig } from '../../data/contact.js'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion.js'

const MAX_FILE_SIZE = 25 * 1024 * 1024
const ACCEPTED_TYPES = ['.pdf', '.png', '.jpg', '.jpeg']

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
  const [file, setFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef(null)
  const formRef = useRef(null)

  // Shared validation used by both the file picker and the drop event.
  const validateAndSetFile = (f) => {
    setFileError('')
    if (!f) {
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    if (f.size > MAX_FILE_SIZE) {
      setFileError(`File too large (${(f.size / 1024 / 1024).toFixed(1)}MB). Max 25MB.`)
      setFile(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }
    setFile(f)
  }

  const handleFileChange = (e) => {
    validateAndSetFile(e.target.files?.[0])
  }

  // HTML5 drag-and-drop on the dropzone. preventDefault on dragover is
  // what tells the browser this element accepts the drop.
  const handleDragOver = (e) => {
    e.preventDefault()
    if (status !== STATUS.SENDING) setIsDragging(true)
  }
  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }
  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragging(false)
    if (status === STATUS.SENDING) return
    const f = e.dataTransfer.files?.[0]
    if (f) validateAndSetFile(f)
  }

  const removeFile = () => {
    setFile(null)
    setFileError('')
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!configured) return

    setSubmitError('')
    setStatus(STATUS.SENDING)

    const form = e.target
    const formData = new FormData(form)
    formData.append('_subject', contactConfig.subject)
    if (file) formData.append('attachment', file, file.name)

    try {
      const res = await fetch(contactConfig.getEndpoint(), {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: formData,
      })

      if (res.ok) {
        setStatus(STATUS.SUCCESS)
        setFile(null)
        form.reset()
      } else {
        // Surface Formspree's actual error message (if any) so the user
        // can tell whether it's an unactivated form, a deactivated form,
        // a quota issue, or something else. Keep the 429 message specific.
        let msg = 'Something went wrong, please try again.'
        try {
          const data = await res.json()
          if (Array.isArray(data?.errors) && data.errors[0]?.message) {
            msg = data.errors[0].message
          } else if (typeof data?.error === 'string') {
            msg = data.error
          }
        } catch {
          // non-JSON body — keep the generic message
        }
        if (res.status === 429) {
          msg = 'Too many submissions. Please wait and try again.'
        }
        console.error('Formspree submission failed:', res.status, msg)
        setSubmitError(msg)
        setStatus(STATUS.ERROR)
      }
    } catch (err) {
      console.error('Contact form network error:', err)
      setSubmitError('Network error. Check your connection and try again.')
      setStatus(STATUS.ERROR)
    }
  }

  const formContent = (
    <>
      <p className="text-center font-sans text-secondary text-sm sm:text-base mb-6">
        Have a role or a project in mind? Drop a message — I read every one.
      </p>

      {configured ? (
        status === STATUS.SUCCESS ? (
          <div className="py-10 text-center">
            <p className="font-sans text-accent-glow text-lg font-medium">
              Message sent, thank you!
            </p>
            <p className="mt-2 font-sans text-secondary text-sm">
              I&apos;ll get back to you as soon as possible.
            </p>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
              {/* Left column — Full Name + Company + Email (smaller fields so
                  the three of them match the total height of the two right
                  fields: Attachment + Message). */}
              <div className="flex flex-col gap-5">
                <div>
                  <label htmlFor="name" className="block font-sans text-sm text-secondary mb-1.5">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    aria-required="true"
                    disabled={status === STATUS.SENDING}
                    className="w-full h-12 rounded-md border border-subtle bg-surface px-4 py-2.5 text-primary placeholder:text-secondary focus:border-accent focus:shadow-glow-sm focus:outline-none transition-colors"
                    placeholder="Your full name"
                  />
                </div>

                <div>
                  <label htmlFor="company" className="block font-sans text-sm text-secondary mb-1.5">
                    Company
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    disabled={status === STATUS.SENDING}
                    className="w-full h-12 rounded-md border border-subtle bg-surface px-4 py-2.5 text-primary placeholder:text-secondary focus:border-accent focus:shadow-glow-sm focus:outline-none transition-colors"
                    placeholder="Company name (optional)"
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
                    className="w-full h-12 rounded-md border border-subtle bg-surface px-4 py-2.5 text-primary placeholder:text-secondary focus:border-accent focus:shadow-glow-sm focus:outline-none transition-colors"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              {/* Right column — Attachment + Message */}
              <div className="flex flex-col gap-5">
                <div>
                  <label htmlFor="attachment" className="block font-sans text-sm text-secondary mb-1.5">
                    Attachment
                  </label>
                  <div
                    onDragOver={handleDragOver}
                    onDragEnter={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    className={`flex items-center gap-3 h-24 rounded-md border-2 border-dashed px-4 py-3 transition-colors ${
                      isDragging
                        ? 'border-accent bg-accent/10'
                        : fileError
                        ? 'border-cta'
                        : 'border-subtle hover:border-accent'
                    }`}
                  >
                    <Paperclip size={18} className="shrink-0 text-secondary" aria-hidden="true" />
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="attachment"
                      name="attachment"
                      accept={ACCEPTED_TYPES.join(',')}
                      onChange={handleFileChange}
                      disabled={status === STATUS.SENDING}
                      className="sr-only"
                      tabIndex={0}
                      aria-label="Attach a file (PDF, PNG, JPG — up to 25MB)"
                    />
                    {file ? (
                      <span className="flex-1 flex items-center gap-2 min-w-0">
                        <span className="truncate text-sm text-primary">{file.name}</span>
                        <span className="text-xs text-disabled shrink-0">
                          ({(file.size / 1024 / 1024).toFixed(1)}MB)
                        </span>
                        <button
                          type="button"
                          onClick={removeFile}
                          disabled={status === STATUS.SENDING}
                          className="ml-auto shrink-0 p-1 text-secondary hover:text-primary transition-colors"
                          aria-label="Remove file"
                        >
                          <X size={16} />
                        </button>
                      </span>
                    ) : (
                      <label htmlFor="attachment" className="flex-1 cursor-pointer">
                        <span className="text-sm text-secondary">
                          {isDragging ? 'Drop to attach' : 'Attach file or drag and drop'}{' '}
                          <span className="text-disabled">
                            (PDF, PNG, JPG — up to 25MB)
                          </span>
                        </span>
                      </label>
                    )}
                  </div>
                  {fileError && (
                    <p className="mt-1.5 text-cta text-xs font-medium" role="alert">
                      {fileError}
                    </p>
                  )}
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
                    rows={4}
                    disabled={status === STATUS.SENDING}
                    className="w-full h-24 rounded-md border border-subtle bg-surface px-4 py-3 text-primary placeholder:text-secondary focus:border-accent focus:shadow-glow-sm focus:outline-none transition-colors resize-none"
                    placeholder="Tell me about the role or project…"
                  />
                </div>
              </div>
            </div>

            {/* Submit — full width below both columns */}
            <div className="mt-5">
              <button
                type="submit"
                disabled={status === STATUS.SENDING}
                className="w-full inline-flex items-center justify-center gap-2 rounded-md bg-cta px-6 py-3 font-sans font-medium text-sm text-bg transition-all hover:brightness-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:opacity-55 disabled:cursor-default disabled:hover:brightness-100 min-h-[44px]"
              >
                {status === STATUS.SENDING ? (
                  <>
                    <Loader2 size={18} className="animate-spin" aria-hidden="true" />
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
                {submitError && (
                  <motion.p
                    key="error"
                    role="alert"
                    aria-live="assertive"
                    initial={reduced ? undefined : { opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={reduced ? undefined : { opacity: 0 }}
                    className="mt-3 text-cta text-sm font-medium text-center"
                  >
                    {submitError}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </form>
        )
      ) : (
        <div className="rounded-lg border border-subtle bg-surface p-6 text-center">
          <p className="font-sans text-secondary text-sm">
            Contact form is not configured.
          </p>
          <p className="mt-1.5 font-mono text-xs text-disabled">
            Add VITE_FORMSPREE_ID to .env
          </p>
        </div>
      )}
    </>
  )

  return (
    <section id="contact" className="relative z-10 scroll-mt-20 py-20 sm:py-28">
      <div className="mx-auto max-w-4xl px-6 sm:px-10">
        <div className="text-center mb-8">
          <span className="font-mono text-accent-glow text-sm tracking-widest uppercase">
            Get in touch
          </span>
          <h2 className="font-display text-primary text-3xl sm:text-4xl font-semibold mt-2">
            Let&apos;s work together
          </h2>
        </div>
        <div
          className="bg-surface border border-subtle shadow-card p-6 sm:p-8"
          style={{ borderRadius: 16, overflow: 'hidden' }}
        >
          {formContent}
        </div>
      </div>
    </section>
  )
}
