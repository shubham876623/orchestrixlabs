/** Client-side mirror of the backend's contact attachment rules (contact/uploads.py). */
export const MAX_ATTACHMENT_BYTES = 10 * 1024 * 1024
export const ACCEPTED_EXTENSIONS = ['.pdf', '.doc', '.docx', '.txt']
export const ACCEPT_ATTRIBUTE = [
  ...ACCEPTED_EXTENSIONS,
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
].join(',')

/** Returns a user-facing error, or '' when the file can be sent. The server re-checks the content. */
export function attachmentError(file) {
  if (!file) return ''
  const name = String(file.name || '').toLowerCase()
  if (!ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext))) {
    return 'Attach a PDF, Word (.doc, .docx) or .txt file.'
  }
  if (!file.size) return 'This file is empty.'
  if (file.size > MAX_ATTACHMENT_BYTES) return 'This file is over 10 MB. Send a smaller version or email it to us.'
  return ''
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
