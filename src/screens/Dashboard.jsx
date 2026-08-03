import { useMemo, useState } from 'react'
import Icon, { CATEGORY_ICON } from '../components/Icon'
import { EmptyState, FreshnessPill, Segmented, Sheet, StatTile, Toggle, TopBar } from '../components/ui'
import { OWNER_STATS } from '../data/mockData'
import { taka } from '../lib/format'
import { useStore } from '../lib/store'

/**
 * INVENTORY DASHBOARD
 * Validation question (Retailer — Compelling Offer): realistically how many
 * minutes a day would you spend on this, and is BDT 500/month worth it?
 * Answers: (1) a stock change is one tap on the row — nothing opens, nothing
 * saves; (2) the upsell never just says "Go Premium", it states the measured
 * loss (42 nearby searches, 12 shoppers who chose shops ranked above you) and
 * prices it at roughly ৳17/day.
 */

const WEEK = 7 * 24 * 60 * 60 * 1000

export default function Dashboard({ nav }) {
  const { ownerShop, productBySku, toggleStock, confirmAllFresh, premium, subscribePremium, highlight, toast } =
    useStore()

  const [q, setQ] = useState('')
  const [filter, setFilter] = useState('all')
  const [premiumOpen, setPremiumOpen] = useState(false)
  const [proofPicked, setProofPicked] = useState(null)

  const items = useMemo(() => {
    const term = q.trim().toLowerCase()
    return ownerShop.stock
      .map((it) => ({ it, p: productBySku(it.sku) }))
      .filter(({ it, p }) => {
        if (!p) return false
        if (filter === 'in' && !it.inStock) return false
        if (filter === 'out' && it.inStock) return false
        return !term || p.name.toLowerCase().includes(term) || p.category.toLowerCase().includes(term)
      })
  }, [ownerShop.stock, productBySku, q, filter])

  const counts = useMemo(() => {
    const inStock = ownerShop.stock.filter((s) => s.inStock).length
    const stale = ownerShop.stock.filter((s) => Date.now() - s.updatedAt > WEEK).length
    return { total: ownerShop.stock.length, inStock, out: ownerShop.stock.length - inStock, stale }
  }, [ownerShop.stock])

  const handleToggle = (sku, name) => {
    const nowIn = toggleStock(sku)
    toast(nowIn ? `${name} is back in stock` : `${name} marked out of stock`, {
      tone: nowIn ? 'default' : 'bad',
      icon: nowIn ? 'check' : 'x',
    })
  }

  const handleConfirmAll = () => {
    const n = confirmAllFresh()
    toast(`${n} listing${n === 1 ? '' : 's'} confirmed · shoppers see “just now”`, { tone: 'good', icon: 'shield' })
  }

  return (
    <div className="flex h-full flex-col bg-canvas">
      <TopBar
        tone="dark"
        onBack={() => nav.pop()}
        title={ownerShop.name}
        subtitle={`${ownerShop.area} · ${counts.inStock} of ${counts.total} items in stock`}
        right={
          <span
            className={`tag ${premium ? 'bg-marigold-400 text-jade-900' : 'border border-white/25 text-white'}`}
          >
            {premium ? 'Premium' : 'Free plan'}
          </span>
        }
      >
        <div className="grid grid-cols-3 gap-2 px-3 pb-3.5">
          <div className="rounded-xl bg-white/10 px-3 py-2">
            <div className="tnum text-[18px] font-extrabold leading-none text-white">
              {OWNER_STATS.updatedThisWeek}
            </div>
            <div className="mt-1 text-[10.5px] leading-tight text-jade-200">edits this week</div>
          </div>
          <div className="rounded-xl bg-white/10 px-3 py-2">
            <div className="tnum text-[18px] font-extrabold leading-none text-white">
              {OWNER_STATS.updateSeconds}s
            </div>
            <div className="mt-1 text-[10.5px] leading-tight text-jade-200">total time spent</div>
          </div>
          <div className="rounded-xl bg-white/10 px-3 py-2">
            <div className="tnum text-[18px] font-extrabold leading-none text-white">
              {OWNER_STATS.appearedIn}
            </div>
            <div className="mt-1 text-[10.5px] leading-tight text-jade-200">search appearances</div>
          </div>
        </div>
      </TopBar>

      <main className="flex-1 overflow-y-auto pb-24">
        {/* ---- Premium: quantified, never generic ---- */}
        <section className="px-4 pt-4">
          {premium ? (
            <div className="anim-rise overflow-hidden rounded-2xl border border-marigold-200 bg-marigold-50 p-4">
              <div className="flex items-center gap-2">
                <Icon name="sparkle" size={18} className="text-marigold-600" strokeWidth={2.2} />
                <h2 className="text-[15px] font-bold text-marigold-700">Premium is active</h2>
              </div>
              <p className="mt-1.5 text-[13px] leading-relaxed text-marigold-700/90">
                You now rank <b>#1</b> for nearby searches in Electronics &amp; Mobile Accessories, and your
                listings carry a Sponsored label. Switch to the shopper flow and search{' '}
                <b>“65W Type-C Fast Charger”</b> to see yourself at the top.
              </p>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <StatTile tone="gold" value={`#${OWNER_STATS.projectedRank}`} label="rank nearby" />
                <StatTile tone="gold" value={`+${OWNER_STATS.projectedVisits}`} label="projected visits / mo" />
                <StatTile tone="gold" value={taka(OWNER_STATS.premiumPrice)} label="billed monthly" />
              </div>
            </div>
          ) : (
            <div className="anim-rise relative overflow-hidden rounded-2xl border border-marigold-200 bg-surface shadow-card">
              <div className="absolute inset-y-0 left-0 w-[3px] bg-marigold-400" />
              <div className="p-4">
                <div className="flex items-start gap-2">
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-marigold-100 text-marigold-600">
                    <Icon name="trend" size={17} strokeWidth={2} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <h2 className="text-[15px] font-bold leading-tight">
                      You’re being found — but not chosen.
                    </h2>
                    <p className="mt-1 text-[12.5px] leading-relaxed text-ink-50">
                      Last 7 days, within 2 km of your shop.
                    </p>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-2">
                  <StatTile tone="gold" value={OWNER_STATS.nearbySearches} label="searches for items you carry" />
                  <StatTile tone="clay" value={OWNER_STATS.lostToCompetitors} label="tapped directions to shops above you" />
                  <StatTile value={`#${OWNER_STATS.avgRank}`} label="your average position" />
                </div>

                <button onClick={() => setPremiumOpen(true)} className="btn btn-md btn-gold mt-3.5 w-full">
                  <Icon name="sparkle" size={16} strokeWidth={2.2} />
                  See what ৳500/month changes
                </button>
                <p className="mt-1.5 text-center text-[11px] text-ink-30">
                  ৳500/month ≈ ৳17/day · cancel anytime
                </p>
              </div>
            </div>
          )}
        </section>

        {/* ---- Stale-listing nudge: ties owner effort to shopper trust ---- */}
        {counts.stale > 0 && (
          <section className="anim-rise px-4 pt-3">
            <div className="flex items-center gap-3 rounded-2xl border border-line bg-surface p-3.5 shadow-card">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-clay-50 text-clay-500">
                <Icon name="alert" size={18} />
              </span>
              <p className="min-w-0 flex-1 text-[12.5px] leading-snug text-ink-70">
                <b className="tnum">{counts.stale} items</b> haven’t been confirmed in over a week. Shoppers
                see these as <span className="font-semibold text-ink-50">Unconfirmed</span>.
              </p>
              <button onClick={handleConfirmAll} className="btn btn-sm btn-quiet shrink-0">
                Confirm all
              </button>
            </div>
          </section>
        )}

        {/* ---- Inventory controls ---- */}
        <section className="px-4 pt-5">
          <div className="mb-2.5 flex items-center justify-between">
            <h2 className="text-[12px] font-bold uppercase tracking-[.08em] text-ink-30">Your inventory</h2>
            <button
              onClick={() => nav.push('additem')}
              className="btn btn-sm btn-primary"
            >
              <Icon name="plus" size={15} strokeWidth={2.4} />
              Add item
            </button>
          </div>

          <div className="mb-2.5 flex items-center gap-2 rounded-xl border border-line bg-surface px-3">
            <Icon name="search" size={17} className="text-ink-30" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Find an item in your shop…"
              className="h-11 w-full bg-transparent text-[14.5px] outline-none placeholder:text-ink-30"
            />
            {q && (
              <button onClick={() => setQ('')} aria-label="Clear" className="text-ink-30">
                <Icon name="x" size={15} strokeWidth={2.4} />
              </button>
            )}
          </div>

          <Segmented
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: `All ${counts.total}` },
              { value: 'in', label: `In stock ${counts.inStock}` },
              { value: 'out', label: `Out ${counts.out}` },
            ]}
          />
        </section>

        {/* ---- The list. One tap per row. ---- */}
        <section className="px-4 pt-3">
          {items.length === 0 ? (
            <EmptyState icon="box" title="No items match" body="Try a different search or filter." />
          ) : (
            <ul className="card divide-y divide-line overflow-hidden">
              {items.map(({ it, p }) => (
                <li
                  key={it.sku}
                  className={`flex items-center gap-3 px-3.5 py-3 ${highlight === it.sku ? 'anim-flash' : ''}`}
                >
                  <button
                    onClick={() => nav.push('additem', { sku: it.sku })}
                    className="flex min-w-0 flex-1 items-center gap-3 text-left"
                  >
                    <span
                      className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors ${
                        it.inStock ? 'bg-jade-50 text-jade-600' : 'bg-canvas text-ink-30'
                      }`}
                    >
                      <Icon name={CATEGORY_ICON[p.category]} size={19} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span
                        className={`block truncate text-[14.5px] font-semibold leading-tight transition-colors ${
                          it.inStock ? 'text-ink' : 'text-ink-30 line-through decoration-1'
                        }`}
                      >
                        {p.name}
                      </span>
                      <span className="mt-1 flex items-center gap-2 text-[12px]">
                        <span className="tnum font-bold text-jade-700">{taka(it.price)}</span>
                        <span className="text-ink-30">·</span>
                        <span className="tnum text-ink-50">{it.inStock ? `${it.qty} left` : '0 left'}</span>
                        <FreshnessPill ts={it.updatedAt} size="sm" />
                      </span>
                    </span>
                  </button>

                  <Toggle
                    on={it.inStock}
                    label={`${p.name} in stock`}
                    onChange={() => handleToggle(it.sku, p.name)}
                  />
                </li>
              ))}
            </ul>
          )}

          <p className="mt-4 px-1 text-center text-[11.5px] leading-relaxed text-ink-30">
            Tap the switch to change stock instantly — no save button.
            <br />
            Tap the item name to edit price or quantity.
          </p>
        </section>
      </main>

      {/* ---- Premium sheet: the fee, argued with numbers ---- */}
      <Sheet
        open={premiumOpen}
        onClose={() => setPremiumOpen(false)}
        title="Premium · ৳500/month"
        subtitle="What actually changes for your shop"
        footer={
          <div>
            <button
              onClick={() => {
                subscribePremium()
                setPremiumOpen(false)
              }}
              className="btn btn-lg btn-gold w-full"
            >
              Start Premium — first month free
            </button>
            <button
              onClick={() => setPremiumOpen(false)}
              className="mt-1 h-9 w-full text-[13px] font-semibold text-ink-50"
            >
              Not now
            </button>
          </div>
        }
      >
        {/* Before / after ranking */}
        <div className="mb-4 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-line bg-canvas p-3">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink-30">Today</div>
            {['Sylhet Mobile Gallery', 'Digital Point', 'Two more shops…'].map((n, i) => (
              <div key={n} className="mb-1 flex items-center gap-1.5 text-[11.5px] text-ink-50">
                <span className="tnum w-3 font-bold">{i + 1}</span>
                <span className="truncate">{n}</span>
              </div>
            ))}
            <div className="mt-1.5 flex items-center gap-1.5 rounded-lg bg-clay-50 px-1.5 py-1 text-[11.5px] font-bold text-clay-600">
              <span className="tnum w-3">6</span>
              <span className="truncate">You</span>
            </div>
          </div>
          <div className="rounded-xl border border-marigold-300 bg-marigold-50 p-3">
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-marigold-600">
              With Premium
            </div>
            <div className="mb-1 flex items-center gap-1.5 rounded-lg bg-marigold-400 px-1.5 py-1 text-[11.5px] font-bold text-jade-900">
              <span className="tnum w-3">1</span>
              <span className="truncate">You</span>
              <Icon name="sparkle" size={11} strokeWidth={2.5} />
            </div>
            {['Sylhet Mobile Gallery', 'Digital Point', 'Two more shops…'].map((n, i) => (
              <div key={n} className="mb-1 flex items-center gap-1.5 text-[11.5px] text-marigold-700/80">
                <span className="tnum w-3 font-bold">{i + 2}</span>
                <span className="truncate">{n}</span>
              </div>
            ))}
          </div>
        </div>

        <ul className="mb-4 space-y-2.5">
          {[
            { i: 'trend', t: 'Top placement', d: `Your ${OWNER_STATS.nearbySearches} weekly nearby searches land on you first.` },
            { i: 'eye', t: 'Basic analytics', d: 'See which items are searched, and how many tapped Get Directions.' },
            { i: 'bell', t: 'Push offers', d: 'Send one offer a week to shoppers within 2 km.' },
          ].map((b) => (
            <li key={b.t} className="flex gap-2.5">
              <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-jade-50 text-jade-600">
                <Icon name={b.i} size={16} />
              </span>
              <div>
                <div className="text-[13.5px] font-bold leading-tight">{b.t}</div>
                <div className="mt-0.5 text-[12.5px] leading-snug text-ink-50">{b.d}</div>
              </div>
            </li>
          ))}
        </ul>

        {/* This block is a live validation instrument, not decoration:
            the retailer interview asks exactly this question. */}
        <div className="rounded-xl border border-line bg-canvas p-3.5">
          <p className="mb-2 text-[12.5px] font-bold">What would prove ৳500 was worth it?</p>
          <div className="flex flex-wrap gap-1.5">
            {['More customers walking in', 'More phone calls', 'Proof I appeared in searches'].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setProofPicked(c)
                  toast('Noted — we’ll report exactly that', { icon: 'check' })
                }}
                className={`chip ${proofPicked === c ? 'chip-on' : 'chip-off'}`}
              >
                {c}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11.5px] leading-relaxed text-ink-30">
            Asked in-product so the answer comes from real shopkeepers, not from us guessing.
          </p>
        </div>
      </Sheet>
    </div>
  )
}
