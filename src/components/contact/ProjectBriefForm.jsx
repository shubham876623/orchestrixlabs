import { useEffect, useId, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiPaperclip, FiX, FiCheck, FiFileText } from 'react-icons/fi'
import { submitContactRequest } from '../../lib/axios'
import { ACCEPT_ATTRIBUTE, attachmentError, formatFileSize } from '../../lib/attachment'
import { SITE, BOOKING_PATH, hasCalComBooking } from '../../lib/site'

const EMPTY = { name: '', email: '', message: '', website: '' }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate(form) {
  const errors = {}
  if (form.name.trim().length < 2) errors.name = 'Enter your full name.'
  if (!form.email.trim()) errors.email = 'Enter your email so we can reply.'
  else if (!EMAIL_RE.test(form.email.trim())) errors.email = 'This email address looks incomplete.'
  if (form.message.trim().length < 20) errors.message = 'Describe the project in a few sentences (20 characters or more).'
  return errors
}

function Field({ id, label, hint, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-navy-primary">
        {label}
      </label>
      {hint && <p id={`${id}-hint`} className="mt-0.5 text-sm text-navy-muted">{hint}</p>}
      <div className="mt-2">{children}</div>
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-sm text-status-error">
          {error}
        </p>
      )}
    </div>
  )
}

const inputBase =
  'block w-full rounded-lg border bg-paper-elevated px-3.5 py-3 text-base text-navy-primary ' +
  'placeholder:text-navy-disabled shadow-xs transition-colors duration-150 ' +
  'focus:outline-none focus:ring-2 focus:ring-cyan-accent/30 focus:border-cyan-accent'

const borderFor = (error) => (error ? 'border-status-error' : 'border-border-strong')

/** Contact form v2: name, email, project description and an optional requirements file. */
export default function ProjectBriefForm({ initialMessage = '' }) {
  const uid = useId()
  const fileInput = useRef(null)
  const [form, setForm] = useState({ ...EMPTY, message: initialMessage })
  const [file, setFile] = useState(null)
  const [errors, setErrors] = useState({})
  const [dragging, setDragging] = useState(false)
  const [status, setStatus] = useState('idle') // idle | sending | sent | failed
  const [progress, setProgress] = useState(0)
  const [receipt, setReceipt] = useState(null)
  const thanksHeading = useRef(null)

  // Bring the confirmation into view (on phones it starts above the fold) and announce it.
  useEffect(() => {
    if (status !== 'sent' || !thanksHeading.current) return
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
    thanksHeading.current.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' })
    thanksHeading.current.focus({ preventScroll: true })
  }, [status])

  const update = (event) => {
    const { name, value } = event.target
    setForm((f) => ({ ...f, [name]: value }))
    if (errors[name]) setErrors((e) => ({ ...e, [name]: '' }))
  }

  const pickFile = (picked) => {
    if (!picked) return
    const problem = attachmentError(picked)
    setErrors((e) => ({ ...e, attachment: problem }))
    setFile(problem ? null : picked)
  }

  const clearFile = () => {
    setFile(null)
    setErrors((e) => ({ ...e, attachment: '' }))
    if (fileInput.current) fileInput.current.value = ''
  }

  const onDrop = (event) => {
    event.preventDefault()
    setDragging(false)
    pickFile(event.dataTransfer.files?.[0])
  }

  const submit = async (event) => {
    event.preventDefault()
    const found = validate(form)
    if (Object.keys(found).length) {
      setErrors((e) => ({ ...e, ...found }))
      document.getElementById(`${uid}-${Object.keys(found)[0]}`)?.focus()
      return
    }
    setStatus('sending')
    setProgress(0)
    try {
      const fields = { name: form.name.trim(), email: form.email.trim(), message: form.message.trim(), website: form.website }
      await submitContactRequest(fields, file, setProgress)
      setReceipt({ firstName: fields.name.split(/\s+/)[0], email: fields.email, fileName: file?.name || '' })
      setStatus('sent')
      setForm(EMPTY)
      setFile(null)
    } catch (err) {
      const data = err?.response?.data
      if (data && typeof data === 'object' && !data.detail) {
        const mapped = {}
        for (const [key, value] of Object.entries(data)) mapped[key] = Array.isArray(value) ? value[0] : String(value)
        setErrors(mapped)
        setStatus('idle')
      } else {
        setStatus(err?.response?.status === 429 ? 'limited' : 'failed')
      }
    }
  }

  if (status === 'sent' && receipt) {
    return (
      <div className="rounded-xl border border-border bg-paper-elevated p-8 sm:p-10" role="status" aria-live="polite">
        <span className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-status-success-bg text-status-success">
          <FiCheck size={22} aria-hidden="true" />
        </span>
        <h2 ref={thanksHeading} tabIndex={-1} className="mt-5 text-2xl font-semibold tracking-tight text-navy-primary focus:outline-none">
          Thank you, {receipt.firstName}. Your project brief is in.
        </h2>
        <p className="mt-2 max-w-prose text-navy-secondary">
          Our team will contact you soon at <span className="font-medium text-navy-primary">{receipt.email}</span>,
          usually within {SITE.responseTime}.
        </p>
        <dl className="mt-6 grid gap-3 border-t border-border pt-6 text-sm sm:grid-cols-2">
          <div>
            <dt className="text-navy-muted">Project description</dt>
            <dd className="mt-0.5 font-medium text-navy-primary">Received</dd>
          </div>
          <div>
            <dt className="text-navy-muted">Requirements file</dt>
            <dd className="mt-0.5 font-medium text-navy-primary break-all">{receipt.fileName || 'None attached'}</dd>
          </div>
        </dl>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          {hasCalComBooking() && (
            <Link to={BOOKING_PATH} className="btn-primary">Book a 30-min call</Link>
          )}
          <button type="button" onClick={() => { setStatus('idle'); setReceipt(null) }} className="btn-secondary">
            Send another brief
          </button>
        </div>
      </div>
    )
  }

  const sending = status === 'sending'
  return (
    <form
      onSubmit={submit}
      noValidate
      className="relative rounded-xl border border-border bg-paper-elevated p-6 sm:p-8"
      data-clarity-mask="true"
      aria-describedby={`${uid}-privacy`}
    >
      <h2 className="text-xl font-semibold tracking-tight text-navy-primary">Send us your project brief</h2>
      <p className="mt-1 text-navy-secondary">Three fields. Attach a spec if you have one.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <Field id={`${uid}-name`} label="Your name" error={errors.name}>
          <input
            id={`${uid}-name`} name="name" type="text" autoComplete="name" value={form.name} onChange={update}
            aria-invalid={!!errors.name} aria-describedby={errors.name ? `${uid}-name-error` : undefined}
            className={`${inputBase} ${borderFor(errors.name)}`}
          />
        </Field>
        <Field id={`${uid}-email`} label="Work email" error={errors.email}>
          <input
            id={`${uid}-email`} name="email" type="email" autoComplete="email" inputMode="email" value={form.email}
            onChange={update} aria-invalid={!!errors.email}
            aria-describedby={errors.email ? `${uid}-email-error` : undefined}
            className={`${inputBase} ${borderFor(errors.email)}`}
          />
        </Field>
      </div>

      <div className="mt-6">
        <Field
          id={`${uid}-message`}
          label="Project description"
          hint="What are you building, who uses it, and what has to work by when?"
          error={errors.message}
        >
          <textarea
            id={`${uid}-message`} name="message" rows={7} value={form.message} onChange={update}
            aria-invalid={!!errors.message}
            aria-describedby={`${uid}-message-hint${errors.message ? ` ${uid}-message-error` : ''}`}
            className={`${inputBase} ${borderFor(errors.message)} min-h-[11rem] resize-y leading-relaxed`}
          />
        </Field>
      </div>

      <div className="mt-6">
        <p id={`${uid}-file-label`} className="text-sm font-medium text-navy-primary">Requirements file (optional)</p>
        {file ? (
          <div className="mt-2 flex items-center gap-3 rounded-lg border border-cyan-accent/40 bg-cyan-subtle px-4 py-3">
            <FiFileText className="shrink-0 text-cyan-hover" size={20} aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-navy-primary">{file.name}</p>
              <p className="text-sm text-navy-secondary">{formatFileSize(file.size)}</p>
            </div>
            <button
              type="button" onClick={clearFile} disabled={sending}
              className="rounded-md p-2 text-navy-secondary hover:bg-paper-elevated hover:text-navy-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-accent"
              aria-label={`Remove ${file.name}`}
            >
              <FiX size={18} aria-hidden="true" />
            </button>
          </div>
        ) : (
          <label
            htmlFor={`${uid}-file`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
            onDragLeave={() => setDragging(false)}
            onDrop={onDrop}
            className={`mt-2 flex cursor-pointer items-center gap-4 rounded-lg border border-dashed px-4 py-4 transition-colors duration-150 focus-within:ring-2 focus-within:ring-cyan-accent/30 ${
              dragging ? 'border-cyan-accent bg-cyan-subtle' : errors.attachment ? 'border-status-error' : 'border-border-strong hover:border-cyan-accent'
            }`}
          >
            <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-paper-subtle text-navy-secondary">
              <FiPaperclip size={18} aria-hidden="true" />
            </span>
            <span className="text-sm">
              <span className="font-medium text-cyan-hover">Choose a file</span>
              <span className="text-navy-secondary"> or drop it here. PDF, Word or .txt, up to 10 MB.</span>
            </span>
            <input
              id={`${uid}-file`} ref={fileInput} type="file" name="attachment" accept={ACCEPT_ATTRIBUTE}
              className="sr-only" aria-labelledby={`${uid}-file-label`}
              aria-describedby={errors.attachment ? `${uid}-file-error` : undefined}
              onChange={(e) => pickFile(e.target.files?.[0])}
            />
          </label>
        )}
        {errors.attachment && (
          <p id={`${uid}-file-error`} role="alert" className="mt-1.5 text-sm text-status-error">{errors.attachment}</p>
        )}
      </div>

      {/* Honeypot: hidden from people; bots that fill it are rejected by the server. */}
      <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
        <label htmlFor={`${uid}-website`}>Website</label>
        <input id={`${uid}-website`} type="text" name="website" tabIndex={-1} autoComplete="off" value={form.website} onChange={update} />
      </div>

      {(status === 'failed' || status === 'limited') && (
        <p role="alert" className="mt-6 rounded-lg border border-status-error/30 bg-status-error-bg px-4 py-3 text-sm text-navy-body">
          {status === 'limited'
            ? 'We received several briefs from this connection in the last hour. Email it instead: '
            : 'Your brief was not sent because of a connection or server problem. Try again, or email it to '}
          <a href={`mailto:${SITE.email}`} className="font-medium underline underline-offset-2">{SITE.email}</a>.
        </p>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id={`${uid}-privacy`} className="text-sm text-navy-muted sm:max-w-sm">
          We use your details only to reply about this project. See our{' '}
          <Link to="/privacy-policy" className="underline underline-offset-2 hover:text-navy-primary">privacy policy</Link>.
        </p>
        <button type="submit" disabled={sending} className="btn-primary btn-lg shrink-0" aria-live="polite">
          {sending
            ? file ? `Uploading ${progress}%` : 'Sending brief'
            : 'Send project brief'}
        </button>
      </div>
    </form>
  )
}
