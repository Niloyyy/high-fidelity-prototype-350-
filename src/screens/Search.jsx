import { useMemo, useRef, useState } from 'react'
import Icon, { CATEGORY_ICON } from '../components/Icon'
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
  const { searchProducts, listingsFor, recent, pushRecent, clearRecent } = useStore()
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
            className="chip border-white/25 bg-white/10 text-white"
            title="Switch role"
          >
            <Icon name="user" size={13} />
            Shopper
          </button>
        }
      >
        {/* Search field */}
        <div className="px-3 pb-3.5">
          <div className="flex items-center gap-2 rounded-2xl bg-white px-3.5 shadow-lift">
            <Icon name="search" size={19} className="text-jade-500" />
            <input
              ref={inputRef}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && runFreeText()}
              placeholder="Napa Extra, charger, wrench…"
              className="h-[46px] w-full bg-transparent text-[15px] text-ink outline-none placeholder:text-ink-30"
              autoComplete="off"
            />
            {q && (
              <button
                onClick={() => {
                  setQ('')
                  inputRef.current?.focus()
                }}
                aria-label="Clear"
                className="grid h-6 w-6 place-items-center rounded-full bg-canvas text-ink-50"
              >
                <Icon name="x" size={13} strokeWidth={2.4} />
              </button>
            )}
          </div>
        </div>

        {/* Category chips */}
        <div className="flex gap-2 overflow-x-auto px-3 pb-3.5">
          {CATEGORIES.map((c) => {
            const on = cat === c
            return (
              <button
                key={c}
                onClick={() => setCat(on ? null : c)}
                className={`chip ${
                  on
                    ? 'border-marigold-400 bg-marigold-400 text-jade-900'
                    : 'border-white/25 bg-white/10 text-white'
                }`}
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
                  <h2 className="text-[12px] font-bold uppercase tracking-[.08em] text-ink-30">
                    Recent searches
                  </h2>
                  <button onClick={clearRecent} className="text-[12px] font-semibold text-jade-600">
                    Clear
                  </button>
                </div>
                <div className="card divide-y divide-line overflow-hidden">
                  {recent.map((r) => (
                    <button
                      key={r}
                      onClick={() => setQ(r)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left transition active:bg-canvas"
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
              <h2 className="mb-2.5 text-[12px] font-bold uppercase tracking-[.08em] text-ink-30">
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
              <h2 className="mb-2.5 text-[12px] font-bold uppercase tracking-[.08em] text-ink-30">
                Browse by category
              </h2>
              <div className="grid grid-cols-2 gap-2.5">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCat(c)}
                    className="card flex items-center gap-3 p-3.5 text-left transition duration-200 ease-swift hover:border-jade-300 active:scale-[.98]"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-jade-50 text-jade-600">
                      <Icon name={CATEGORY_ICON[c]} size={19} />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13.5px] font-bold leading-tight">{c}</span>
                      <span className="bn block text-[11.5px] text-ink-30">{CATEGORY_META[c].bn}</span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </div>
        ) : results.length === 0 ? (
          <EmptyState
            title="Nothing on nearby shelves yet"
            body={`No shop within 2 km has listed “${q}”. We’ll notify you if one adds it.`}
            action={
              <button className="btn btn-md btn-quiet mt-5">
                <Icon name="bell" size={16} />
                Notify me when available
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
                    className="anim-rise flex w-full items-center gap-3 px-4 py-3 text-left transition active:bg-canvas"
                  >
                    <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-canvas text-jade-600">
                      <Icon name={CATEGORY_ICON[p.category]} size={18} />
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
