import { useMemo, useRef, useState } from 'react'
import Icon, { CATEGORY_ICON, CATEGORY_TINT } from '../components/Icon'
import { Chip, EmptyState, TopBar } from '../components/ui'
import { CATEGORIES, CATEGORY_META, TRENDING } from '../data/mockData'
import { taka } from '../lib/format'
import { useStore } from '../lib/store'

/**
 * SEARCH
 * Validation question (Shopper — Solution): what did you actually do the last
 * time you needed a specialty item — how many shops did you call or visit?
 * The answer in the script is "rang around / walked the market", so search is
 * item-first and every suggestion already carries the shop count and the
 * lowest nearby price. The ring-around is answered before you even commit.
 */

export default function Search({ nav }) {
  const { searchProducts, listingsFor, recent, pushRecent, clearRecent, toggleAlert, hasAlert } = useStore()
  const [q, setQ] = useState('')
  const [cat, setCat] = useState(null)
  const inputRef = useRef(null)

  const browsing = q.trim().length > 0 || cat
  const results = useMemo(() => (browsing ? searchProducts(q, cat) : []), [q, cat, browsing, searchProducts])

  const meta = (sku) => {
    const rows = listingsFor(sku)
    const live = rows.filter((r) => r.listing.inStock)
    const min = live.length ? Math.min(...live.map((r) => r.listing.price)) : null
    const nearest = live.length ? Math.min(...live.map((r) => r.shop.distanceKm)) : null
    return { count: live.length, min, nearest }
  }

  const open = (product) => {
    pushRecent(product.name)
    nav.push('results', { sku: product.sku, query: product.name })
  }

  const runFreeText = () => {
    const hit = results[0]
    if (hit) open(hit)
  }

  return (
    <div className="flex h-full flex-col bg-canvas">
      <TopBar
        tone="dark"
        onBack={() => nav.pop()}
        title="Find an item near you"
        subtitle="Zindabazar, Sylhet · within 2 km"
        right={
          <button
            onClick={() => nav.reset('welcome')}
            className="chip chip-on-dark"
            title="Switch role"
          >
            <Icon name="user" size={13} />
            Shopper
          </button>
        }
      >
        {/* Search field */}
        <div className="px-3 pb-3.5">
          <div className="flex items-center gap-2 rounded-2xl bg-white px-3.5 shadow-lift ring-1 ring-black/5 transition focus-within:ring-2 focus-within:ring-marigold-300">
            <Icon name="search" size={19} className="text-jade-500" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runFreeText()}
              placeholder="Napa Extra, charger, wrench…"
              aria-label="Search for an item"
              className="h-[48px] w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-30"
              autoComplete="off"
            />
            {q && (
              <button
                onClick={() => {
                  setQ('')
                  inputRef.current?.focus()
                }}
                aria-label="Clear search"
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-canvas text-ink-50 transition
                  hover:bg-line hover:text-ink focus-visible:outline-none focus-visible:ring-2
                  focus-visible:ring-jade-400 active:scale-90"
              >
                <Icon name="x" size={14} strokeWidth={2.4} />
              </button>
            )}
          </div>
        </div>

        {/* Category chips — masked at the right edge so a clipped chip reads
            as "scroll for more" rather than as a broken layout. */}
        <div className="scroll-fade-r flex gap-2 overflow-x-auto px-3 pb-3.5">
          {CATEGORIES.map((c) => {
            const on = cat === c
            return (
              <button
                key={c}
                onClick={() => setCat(on ? null : c)}
                aria-pressed={on}
                className={`chip ${on ? 'chip-gold' : 'chip-on-dark'}`}
              >
                <Icon name={CATEGORY_ICON[c]} size={14} />
                {c}
              </button>
            )
          })}
        </div>
      </TopBar>

      <main className="flex-1 overflow-y-auto">
        {!browsing ? (
          <div className="px-5 pb-8 pt-5">
            {recent.length > 0 && (
              <section className="mb-7">
                <div className="mb-2.5 flex items-center justify-between">
                  <h2 className="eyebrow">
                    Recent searches
                  </h2>
                  <button onClick={clearRecent} className="btn-link -mr-2">
                    Clear
                  </button>
                </div>
                <div className="card divide-y divide-line overflow-hidden">
                  {recent.map((r) => (
                    <button
                      key={r}
                      onClick={() => setQ(r)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition duration-150
                        hover:bg-jade-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset
                        focus-visible:ring-jade-300 active:bg-jade-100"
                    >
                      <Icon name="clock" size={16} className="text-ink-30" />
                      <span className="min-w-0 flex-1 truncate text-[14.5px]">{r}</span>
                      <Icon name="arrow" size={15} className="text-ink-30" />
                    </button>
                  ))}
                </div>
              </section>
            )}

            <section className="mb-7">
              <h2 className="mb-2.5 eyebrow">
                Trending around you
              </h2>
              <div className="flex flex-wrap gap-2">
                {TRENDING.map((t) => (
                  <Chip key={t} icon="trend" onClick={() => setQ(t)}>
                    {t}
                  </Chip>
                ))}
              </div>
            </section>

            <section>
              <h2 className="mb-2.5 eyebrow">
                Browse by category
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className="card-tap flex items-center gap-3 p-3.5 text-left focus-visible:outline-none
                      focus-visible:ring-[3px] focus-visible:ring-jade-300"
                  >
                    <span className={`grid h-11 w-11 place-items-center rounded-xl ${CATEGORY_TINT[c]}`}>
                      <Icon name={CATEGORY_ICON[c]} size={20} strokeWidth={2} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13.5px] font-bold leading-tight">{c}</span>
                      <span lang="bn" className="bn block text-[11.5px] text-ink-50">{CATEGORY_META[c].bn}</span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            title="Nothing on nearby shelves yet"
            body={`No shop within 2 km has listed “${q.trim()}”. We can watch for it instead.`}
            action={
              // A dead end is where shoppers churn, so the empty state does
              // something real: it registers an alert you can see turn on.
              <button
                onClick={() => toggleAlert(`want:${q.trim().toLowerCase()}`, `“${q.trim()}” near you`)}
                aria-pressed={hasAlert(`want:${q.trim().toLowerCase()}`)}
                className={`btn btn-md mt-5 ${
                  hasAlert(`want:${q.trim().toLowerCase()}`) ? 'btn-primary' : 'btn-quiet'
                }`}
              >
                <Icon
                  name={hasAlert(`want:${q.trim().toLowerCase()}`) ? 'check' : 'bell'}
                  size={16}
                  strokeWidth={2.2}
                />
                {hasAlert(`want:${q.trim().toLowerCase()}`)
                  ? 'We’ll tell you when a shop adds it'
                  : 'Notify me when available'}
              </button>
            }
          />
        ) : (
          <div className="px-4 pb-8 pt-4">
            <p className="mb-2.5 px-1 text-[12px] font-semibold text-ink-50">
              <span className="tnum">{results.length}</span> item{results.length > 1 ? 's' : ''} match
              {cat && <> in {cat}</>}
            </p>
            <div className="card divide-y divide-line overflow-hidden">
              {results.map((p, idx) => {
                const m = meta(p.sku)
                return (
                  <button
                    key={p.sku}
                    onClick={() => open(p)}
                    style={{ animationDelay: `${Math.min(idx, 8) * 22}ms` }}
                    className="anim-rise flex w-full items-center gap-3 px-4 py-3 text-left transition duration-150
                      hover:bg-jade-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset
                      focus-visible:ring-jade-300 active:bg-jade-100"
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${
                        CATEGORY_TINT[p.category]
                      }`}
                    >
                      <Icon name={CATEGORY_ICON[p.category]} size={18} strokeWidth={2} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[14.5px] font-semibold leading-tight">
                        {p.name}
                      </span>
                      <span className="mt-1 flex items-center gap-1.5 text-[12px] text-ink-50">
                        {m.count > 0 ? (
                          <>
                            <span className="font-semibold text-jade-600">
                              In stock at {m.count} shop{m.count > 1 ? 's' : ''}
                            </span>
                            <span className="text-ink-30">·</span>
                            <span className="tnum">from {taka(m.min)}</span>
                            <span className="text-ink-30">·</span>
                            <span className="tnum">{m.nearest?.toFixed(1)} km</span>
                          </>
                        ) : (
                          <span className="text-clay-600">Not in stock nearby right now</span>
                        )}
                      </span>
                    </span>
                    <Icon name="next" size={17} className="text-ink-30" />
                  </button>
                )
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
