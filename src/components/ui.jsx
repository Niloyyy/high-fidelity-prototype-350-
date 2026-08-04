import { useEffect, useState } from 'react'
import Icon from './Icon'
import { freshness, taka, timeAgo } from '../lib/format'

/* ------------------------------------------------------------------ */
/*  Chrome                                                             */
/* ------------------------------------------------------------------ */

export function TopBar({ title, subtitle, onBack, right, tone = 'light', children }) {
  const dark = tone === 'dark'
  return (
    <header
      className={`relative z-20 shrink-0 ${
        dark ? 'band text-white' : 'border-b border-line bg-surface/95 text-ink backdrop-blur'
      }`}
    >
      <div className="flex items-center gap-1.5 px-3 pb-3 pt-3.5">
        {onBack && (
          <button
            onClick={onBack}
            aria-label="Go back"
            className={`-ml-1 ${dark ? 'icon-btn-on-dark' : 'icon-btn-on-light'}`}
          >
            <Icon name="back" size={21} strokeWidth={2} />
          </button>
        )}
        <div className="min-w-0 flex-1 py-0.5">
          {title && <h1 className="truncate text-[17px] font-bold leading-tight">{title}</h1>}
          {subtitle && (
            <p className={`mt-0.5 truncate text-[12.5px] ${dark ? 'text-jade-200' : 'text-ink-50'}`}>
              {subtitle}
            </p>
          )}
        </div>
        {right}
      </div>
      {children}
    </header>
  )
}

/* ------------------------------------------------------------------ */
/*  Trust primitives — the heart of the shopper flow                   */
/* ------------------------------------------------------------------ */

/**
 * "Last updated Xm ago" with a colour-coded, breathing dot.
 * Directly answers: what does a shopper need to see to trust a listing?
 */
export function FreshnessPill({ ts, size = 'md', className = '' }) {
  const f = freshness(ts)
  const small = size === 'sm'
  return (
    <span
      title={`Shop last confirmed this ${timeAgo(ts)}`}
      className={`inline-flex items-center gap-1.5 rounded-full px-2 py-[3px] font-semibold ${f.bg} ${
        small ? 'text-[10.5px]' : 'text-[11.5px]'
      } ${f.text} ${className}`}
    >
      <span className={`h-[6px] w-[6px] rounded-full ${f.dot} ${f.tier === 'live' ? 'dot-live' : ''}`} />
      <span className="tnum">{timeAgo(ts)}</span>
    </span>
  )
}

export function StockBadge({ inStock, qty, size = 'md' }) {
  const small = size === 'sm'
  return (
    <span
      className={`tag ${small ? 'text-[10px]' : ''} ${
        inStock ? 'bg-jade-100 text-jade-700' : 'bg-clay-100 text-clay-600'
      }`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${inStock ? 'bg-jade-500' : 'bg-clay-400'}`} />
      {inStock ? (qty != null ? `In stock · ${qty}` : 'In stock') : 'Out of stock'}
    </span>
  )
}

export function SponsoredTag({ onInfo }) {
  return (
    <button
      onClick={onInfo}
      className="tag bg-marigold-100 text-marigold-700 transition duration-150 hover:bg-marigold-200
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-marigold-300 active:scale-95"
      aria-label="Why is this shop sponsored?"
    >
      <Icon name="sparkle" size={11} strokeWidth={2.2} />
      Sponsored
      <Icon name="info" size={10} strokeWidth={2.4} className="opacity-60" />
    </button>
  )
}

/** Price is the largest thing on the row. That is deliberate. */
export function Price({ value, size = 'md', className = '' }) {
  const s = { sm: 'text-[17px]', md: 'text-[22px]', lg: 'text-[34px]' }[size]
  return (
    <span className={`tnum font-extrabold leading-none tracking-tight text-jade-800 ${s} ${className}`}>
      {taka(value)}
    </span>
  )
}

/* ------------------------------------------------------------------ */
/*  Controls                                                           */
/* ------------------------------------------------------------------ */

/** One tap, no confirmation. The retailer interview's core requirement. */
export function Toggle({ on, onChange, label, disabled }) {
  return (
    <button
      role="switch"
      aria-checked={on}
      aria-label={label}
      disabled={disabled}
      onClick={(e) => {
        e.stopPropagation()
        onChange(!on)
      }}
      className={`relative h-[32px] w-[54px] shrink-0 rounded-full transition-colors duration-200 ease-swift
        focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-jade-300 focus-visible:ring-offset-2
        ${on ? 'bg-jade-500 hover:bg-jade-600' : 'bg-ink-20 hover:bg-ink-30'} disabled:opacity-40`}
    >
      <span
        className={`absolute top-[3px] grid h-[26px] w-[26px] place-items-center rounded-full bg-white shadow-soft
          transition-transform duration-200 ease-swift ${on ? 'translate-x-[25px]' : 'translate-x-[3px]'}`}
      >
        <Icon
          name={on ? 'check' : 'x'}
          size={13}
          strokeWidth={3}
          className={on ? 'text-jade-600' : 'text-ink-30'}
          aria-hidden="true"
        />
      </span>
    </button>
  )
}

/** `tone="dark"` for the segmented control that sits on the jade header. */
export function Segmented({ options, value, onChange, className = '', tone = 'light' }) {
  const dark = tone === 'dark'
  return (
    <div className={`flex min-w-0 rounded-xl p-1 ${dark ? 'bg-white/10' : 'bg-canvas'} ${className}`}>
      {options.map((o) => {
        const active = o.value === value
        const state = active
          ? 'bg-surface text-jade-700 shadow-card'
          : dark
            ? 'text-jade-200 hover:text-white'
            : 'text-ink-50 hover:text-ink-70'
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`flex min-w-0 flex-1 items-center justify-center gap-1.5 truncate rounded-lg px-2 py-1.5
              text-[13px] font-semibold transition duration-150 ease-swift
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-jade-300
              active:scale-[.97] ${state}`}
          >
            {o.icon && <Icon name={o.icon} size={15} />}
            {o.label}
          </button>
        )
      })}
    </div>
  )
}

export function Chip({ active, children, onClick, icon }) {
  return (
    <button onClick={onClick} className={`chip ${active ? 'chip-on' : 'chip-off'}`}>
      {icon && <Icon name={icon} size={14} />}
      {children}
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Overlays                                                           */
/* ------------------------------------------------------------------ */

export function Sheet({ open, onClose, title, subtitle, children, footer }) {
  const [mounted, setMounted] = useState(open)
  useEffect(() => {
    if (open) setMounted(true)
  }, [open])

  // Escape closes the sheet — the backdrop was the only way out before, which
  // leaves keyboard users stuck.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!mounted || !open) return null

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={title}
      className="absolute inset-0 z-50 flex flex-col justify-end"
    >
      <button
        aria-label="Close"
        onClick={onClose}
        className="anim-fade absolute inset-0 bg-ink/40 backdrop-blur-[2px]"
      />
      <div className="anim-sheet relative max-h-[88%] overflow-y-auto rounded-t-3xl bg-surface shadow-sheet">
        <div className="sticky top-0 z-10 bg-surface/95 px-5 pb-3 pt-3 backdrop-blur">
          <div className="mx-auto mb-3 h-1 w-9 rounded-full bg-ink-20" />
          {title && (
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <h2 className="text-[18px] font-bold leading-tight">{title}</h2>
                {subtitle && <p className="mt-1 text-[13px] leading-snug text-ink-50">{subtitle}</p>}
              </div>
              <button onClick={onClose} aria-label="Close" className="icon-btn-on-light -mr-1.5 -mt-1.5">
                <Icon name="x" size={18} strokeWidth={2.2} />
              </button>
            </div>
          )}
        </div>
        <div className="px-5 pb-5">{children}</div>
        {footer && (
          <div className="safe-b sticky bottom-0 border-t border-line bg-surface/95 px-5 py-3 backdrop-blur">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

export function Toasts({ items }) {
  if (!items.length) return null
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-6 z-[60] flex flex-col items-center gap-2 px-5">
      {items.map((t) => (
        <div
          key={t.id}
          role="status"
          className={`anim-toast flex max-w-full items-center gap-2 rounded-full px-4 py-2.5 text-[13.5px] font-semibold shadow-lift
            ${
              t.tone === 'gold'
                ? 'bg-marigold-300 text-[#4A3405]'
                : t.tone === 'bad'
                  ? 'bg-clay-500 text-white'
                  : t.tone === 'good'
                    ? 'bg-jade-700 text-white'
                    : 'bg-ink text-white'
            }`}
        >
          {t.icon && <Icon name={t.icon} size={15} strokeWidth={2.2} />}
          <span className="truncate">{t.message}</span>
        </div>
      ))}
    </div>
  )
}

export function EmptyState({ icon = 'search', title, body, action }) {
  return (
    <div className="anim-rise flex flex-col items-center px-8 py-14 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-jade-50 text-jade-400">
        <Icon name={icon} size={26} />
      </div>
      <h3 className="text-[16px] font-bold">{title}</h3>
      {body && <p className="mt-1.5 max-w-[16rem] text-[13.5px] leading-relaxed text-ink-50">{body}</p>}
      {action}
    </div>
  )
}

export function StatTile({ value, label, tone = 'jade' }) {
  const tones = {
    jade: 'bg-jade-50 text-jade-700 ring-jade-100',
    gold: 'bg-marigold-50 text-marigold-700 ring-marigold-100',
    clay: 'bg-clay-50 text-clay-600 ring-clay-100',
    plain: 'bg-canvas text-ink-70 ring-line',
  }
  return (
    <div className={`rounded-xl px-3 py-2.5 ring-1 ${tones[tone]}`}>
      <div className="tnum text-[20px] font-extrabold leading-none">{value}</div>
      <div className="mt-1.5 text-[11px] font-medium leading-tight opacity-85">{label}</div>
    </div>
  )
}
