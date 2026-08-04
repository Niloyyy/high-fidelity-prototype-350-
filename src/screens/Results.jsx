import { useMemo, useState } from 'react'
import Icon from '../components/Icon'
import MapView from '../components/MapView'
import { EmptyState, FreshnessPill, Price, Segmented, Sheet, SponsoredTag, StockBadge, TopBar } from '../components/ui'
import { km, rickshawMins, taka } from '../lib/format'
import { useStore } from '../lib/store'

/**
 * RESULTS
 * Validation question (Shopper — Compelling Offer): what do you need to see
 * before you'd trust this enough to tap "Get Directions"?
 * Answer, made structural: price / stock / distance are the three biggest
 * things in every row, and each row states when the shop last confirmed it.
 * Sponsored rows are pinned first but are labelled and explained on tap —
 * we never let paid placement look like an organic best match.
 */

export default function Results({ nav, params }) {
  const { sku, query } = params
  const { productBySku, listingsFor, reportFor } = useStore()
  const product = productBySku(sku)

  const [sort, setSort] = useState('match')
  const [view, setView] = useState('list')
  const [inStockOnly, setInStockOnly] = useState(false)
  const [radius, setRadius] = useState(0) // 0 = no limit
  const [selected, setSelected] = useState(null)
  const [showSponsoredInfo, setShowSponsoredInfo] = useState(false)

  const rows = useMemo(() => {
    let r = listingsFor(sku)
    if (inStockOnly) r = r.filter((x) => x.listing.inStock)
    if (radius) r = r.filter((x) => x.shop.distanceKm <= radius)

    const cmp = {
      price: (a, b) => a.listing.price - b.listing.price,
      distance: (a, b) => a.shop.distanceKm - b.shop.distanceKm,
      match: (a, b) =>
        Number(b.listing.inStock) - Number(a.listing.inStock) ||
        b.listing.updatedAt - a.listing.updatedAt ||
        a.shop.distanceKm - b.shop.distanceKm,
    }[sort]

    // Sponsored placement is the revenue model, so it is honoured in every
    // sort order — but only ever as a pinned, labelled block on top.
    const sponsored = r.filter((x) => x.shop.sponsored).sort(cmp)
    const organic = r.filter((x) => !x.shop.sponsored).sort(cmp)
    return [...sponsored, ...organic]
  }, [listingsFor, sku, sort, inStockOnly, radius])

  const totalNearby = listingsFor(sku).length

  const liveRows = rows.filter((r) => r.listing.inStock)
  const cheapest = liveRows.length ? Math.min(...liveRows.map((r) => r.listing.price)) : null
  const nearest = liveRows.length ? Math.min(...liveRows.map((r) => r.shop.distanceKm)) : null
  const selectedRow = rows.find((r) => r.shop.id === selected)

  const openShop = (shopId) => nav.push('shop', { shopId, sku })

  return (
    <div className="flex h-full flex-col bg-canvas">
      <TopBar
        tone="dark"
        onBack={() => nav.pop()}
        title={product?.name || query}
        subtitle={
          liveRows.length
            ? `${liveRows.length} of ${rows.length} shops have it · from ${taka(cheapest)} · nearest ${km(nearest)}`
            : `${rows.length} shops list it · none in stock right now`
        }
      >
        <div className="flex items-center gap-2 px-3 pb-3">
          <Segmented
            tone="dark"
            className="flex-1"
            value={sort}
            onChange={setSort}
            options={[
              { value: 'match', label: 'Best match' },
              { value: 'price', label: 'Price', icon: 'sort' },
              { value: 'distance', label: 'Distance', icon: 'pin' },
            ]}
          />
          <button
            onClick={() => setView(view === 'list' ? 'map' : 'list')}
            className="grid h-[40px] w-[40px] shrink-0 place-items-center rounded-xl bg-white/10 text-white
              transition duration-150 hover:bg-white/20 focus-visible:outline-none focus-visible:ring-[3px]
              focus-visible:ring-white/50 active:scale-95"
            aria-label={view === 'list' ? 'Show map' : 'Show list'}
          >
            <Icon name={view === 'list' ? 'map' : 'list'} size={18} />
          </button>
        </div>
      </TopBar>

      {/* Filter strip — both filters actually narrow the result set */}
      <div className="shrink-0 border-b border-line bg-surface">
        <div className="flex items-center gap-2 overflow-x-auto px-4 py-2.5">
          <button
            onClick={() => setInStockOnly((v) => !v)}
            aria-pressed={inStockOnly}
            className={`chip ${inStockOnly ? 'chip-on' : 'chip-off'}`}
          >
            <Icon name="check" size={13} strokeWidth={2.5} />
            In stock only
          </button>
          <span className="h-5 w-px shrink-0 bg-line" />
          {[
            { v: 1, l: 'Within 1 km' },
            { v: 2, l: 'Within 2 km' },
            { v: 0, l: 'Any distance' },
          ].map((r) => (
            <button
              key={r.l}
              onClick={() => setRadius(r.v)}
              aria-pressed={radius === r.v}
              className={`chip ${radius === r.v ? 'chip-on' : 'chip-off'}`}
            >
              {r.l}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1.5 px-4 pb-2 text-[11.5px] font-medium text-ink-30">
          <Icon name="refresh" size={13} />
          Showing <span className="tnum font-bold text-ink-50">{rows.length}</span> of {totalNearby} shops
          that list this · stock confirmed by the shops themselves
        </div>
      </div>

      {view === 'map' ? (
        <div className="relative flex-1">
          <MapView rows={rows} selectedId={selected} onSelect={setSelected} />
          {selectedRow && (
            <div className="anim-rise absolute inset-x-3 bottom-3">
              <button
                onClick={() => openShop(selectedRow.shop.id)}
                className="flex w-full items-center gap-3 rounded-2xl bg-surface p-3.5 text-left shadow-lift"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    {selectedRow.shop.sponsored && (
                      <span className="tag bg-marigold-100 text-marigold-700">Sponsored</span>
                    )}
                    <span className="truncate text-[14.5px] font-bold">{selectedRow.shop.name}</span>
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-[12px] text-ink-50">
                    <StockBadge inStock={selectedRow.listing.inStock} size="sm" />
                    <span className="tnum">{km(selectedRow.shop.distanceKm)}</span>
                    <FreshnessPill ts={selectedRow.listing.updatedAt} size="sm" />
                  </div>
                </div>
                <div className="text-right">
                  <Price value={selectedRow.listing.price} size="sm" />
                  <div className="mt-1 flex items-center justify-end gap-0.5 text-[11.5px] font-semibold text-jade-600">
                    View <Icon name="next" size={12} strokeWidth={2.5} />
                  </div>
                </div>
              </button>
            </div>
          )}
          {!selectedRow && (
            <div className="anim-fade absolute inset-x-3 bottom-3 rounded-2xl bg-surface/95 px-4 py-3 text-center text-[12.5px] font-medium text-ink-50 shadow-lift backdrop-blur">
              Tap a price pin to see the shop
            </div>
          )}
        </div>
      ) : (
        <main className="flex-1 overflow-y-auto px-4 pb-8 pt-3.5">
          {rows.length === 0 ? (
            <EmptyState
              icon="box"
              title="Nothing matches these filters"
              body="Widen the distance or turn off “in stock only” to see shops that carry it but are currently out."
              action={
                <button
                  onClick={() => {
                    setInStockOnly(false)
                    setRadius(0)
                  }}
                  className="btn btn-md btn-quiet mt-5"
                >
                  <Icon name="refresh" size={16} />
                  Clear filters
                </button>
              }
            />
          ) : (
            <ul className="space-y-2.5">
              {rows.map(({ shop, listing }, idx) => {
                const reported = reportFor(shop.id, sku)
                const isCheapest = listing.inStock && listing.price === cheapest
                const isNearest = listing.inStock && shop.distanceKm === nearest
                return (
                  <li
                    key={shop.id}
                    style={{ animationDelay: `${Math.min(idx, 8) * 28}ms` }}
                    className="anim-rise"
                  >
                    {/* A div, not a button: the row contains its own "why sponsored?" control. */}
                    <div
                      role="button"
                      tabIndex={0}
                      onClick={() => openShop(shop.id)}
                      onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openShop(shop.id)}
                      className={`relative w-full cursor-pointer overflow-hidden rounded-2xl border bg-surface p-3.5 text-left shadow-card
                        transition duration-200 ease-swift hover:shadow-lift active:scale-[.99]
                        ${shop.sponsored ? 'border-marigold-200' : 'border-line'}`}
                    >
                      {shop.sponsored && (
                        <span className="absolute inset-y-0 left-0 w-[3px] bg-marigold-300" />
                      )}

                      <div className="flex items-start gap-3">
                        <div className="min-w-0 flex-1">
                          <div className="mb-1.5 flex flex-wrap items-center gap-1.5">
                            {shop.sponsored && (
                              <SponsoredTag
                                onInfo={(e) => {
                                  e.stopPropagation()
                                  setShowSponsoredInfo(true)
                                }}
                              />
                            )}
                            {isCheapest && !shop.sponsored && (
                              <span className="tag bg-jade-100 text-jade-700">Lowest price</span>
                            )}
                            {isNearest && !isCheapest && !shop.sponsored && (
                              <span className="tag bg-jade-100 text-jade-700">Closest</span>
                            )}
                          </div>

                          <h3 className="truncate text-[15.5px] font-bold leading-tight">{shop.name}</h3>
                          <p className="mt-0.5 flex items-center gap-1 text-[12.5px] text-ink-50">
                            <Icon name="pin" size={12} />
                            {shop.area}
                            <span className="text-ink-30">·</span>
                            <span className={shop.openNow ? 'text-jade-600' : 'text-clay-600'}>
                              {shop.openNow ? 'Open now' : 'Closed'}
                            </span>
                          </p>
                        </div>

                        {/* Price block: the largest element on the row */}
                        <div className="shrink-0 text-right">
                          <Price value={listing.price} />
                          <div className="tnum mt-1 flex items-center justify-end gap-1 text-[13px] font-bold text-ink-70">
                            <Icon name="nav" size={13} className="text-jade-500" />
                            {km(shop.distanceKm)}
                          </div>
                        </div>
                      </div>

                      {/* Stock + freshness: the trust line */}
                      <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-line pt-2.5">
                        <StockBadge inStock={listing.inStock} qty={listing.inStock ? listing.qty : null} />
                        <FreshnessPill ts={listing.updatedAt} />
                        <span className="ml-auto flex items-center gap-1 text-[11.5px] font-medium text-ink-30">
                          <Icon name="clock" size={12} />
                          {rickshawMins(shop.distanceKm)} min by rickshaw
                        </span>
                      </div>

                      {reported && (
                        <div className="mt-2 flex items-center gap-1.5 rounded-lg bg-clay-50 px-2.5 py-1.5 text-[11.5px] font-semibold text-clay-600">
                          <Icon name="flag" size={12} />
                          You reported this listing — we’re re-checking with the shop
                        </div>
                      )}
                    </div>
                  </li>
                )
              })}
            </ul>
          )}

          <p className="mt-5 px-1 text-center text-[11.5px] leading-relaxed text-ink-30">
            Distances are from Zindabazar point. Stock is what each shop last confirmed —
            <br />
            tap a shop to report anything that looks wrong.
          </p>
        </main>
      )}

      <Sheet
        open={showSponsoredInfo}
        onClose={() => setShowSponsoredInfo(false)}
        title="Why is this shop first?"
        subtitle="Sponsored placement, explained"
        footer={
          <button className="btn btn-lg btn-primary w-full" onClick={() => setShowSponsoredInfo(false)}>
            Got it
          </button>
        }
      >
        <div className="space-y-3 text-[14px] leading-relaxed text-ink-70">
          <p>
            This shop pays <span className="font-bold text-ink">৳500/month</span> for premium placement, so
            it appears at the top of nearby results and is always labelled{' '}
            <span className="tag bg-marigold-100 align-middle text-marigold-700">Sponsored</span>.
          </p>
          <p>
            Paying <span className="font-semibold">never</span> changes the price, the stock status or the
            distance you see. Those come straight from the shop’s own listing, with the time it was last
            confirmed.
          </p>
          <div className="rounded-xl bg-jade-50 p-3.5 text-[13px] text-jade-800">
            <span className="font-bold">Sort by Price or Distance</span> at any time — sponsored shops stay
            labelled, and the lowest price is always tagged wherever it sits.
          </div>
        </div>
      </Sheet>
    </div>
  )
}
