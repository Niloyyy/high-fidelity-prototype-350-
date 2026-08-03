/** Formatting helpers. Everything money-shaped is BDT. */

export const taka = (n) => `৳${Number(n).toLocaleString('en-BD')}`

/** "just now" · "12m ago" · "3h ago" · "8d ago" */
export function timeAgo(ts, now = Date.now()) {
  const s = Math.max(0, Math.floor((now - ts) / 1000))
  if (s < 45) return 'just now'
  const m = Math.floor(s / 60)
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return `${d}d ago`
}

/**
 * Freshness tiers drive the colour of the dot next to every stock listing.
 * This is the single most important trust signal in the shopper flow.
 */
export function freshness(ts, now = Date.now()) {
  const mins = (now - ts) / 60000
  if (mins < 60) return { tier: 'live', label: 'Live', dot: 'bg-jade-500', text: 'text-jade-600' }
  if (mins < 12 * 60) return { tier: 'recent', label: 'Recent', dot: 'bg-marigold-400', text: 'text-marigold-600' }
  return { tier: 'stale', label: 'Unconfirmed', dot: 'bg-ink-30', text: 'text-ink-50' }
}

export const km = (d) => `${d.toFixed(1)} km`

/** Rickshaw is the default short hop in Sylhet — ~4.5 min per km. */
export const rickshawMins = (d) => Math.max(2, Math.round(d * 4.5))
export const walkMins = (d) => Math.max(2, Math.round(d * 12))

export const slug = (s) =>
  s
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
