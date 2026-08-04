import { useMemo, useState } from 'react'
import Icon, { CATEGORY_ICON } from '../components/Icon'
import { FreshnessPill, Price, Sheet, StockBadge, TopBar } from '../components/ui'
import { km, rickshawMins, taka, walkMins } from '../lib/format'
import { useStore } from '../lib/store'

/**
 * SHOP DETAIL
 * Validation question (Shopper — Compelling Offer): what would make you stop
 * using the app? The script's churn risk is a wasted trip on a wrong listing.
 * So: the searched item's price / quantity / freshness sit above the fold, and
 * "Report wrong price or stock" is one tap away — a shopper who is let down
 * gets to fix the data instead of silently leaving.
 */

const REASONS = [
  { id: 'oos', label: 'It was out of stock', icon: 'box' },
  { id: 'price', label: 'Price is different', icon: 'sort' },
  { id: 'closed', label: 'Shop was closed', icon: 'clock' },
  { id: 'gone', label: 'Shop is not here anymore', icon: 'pin' },
]

export default function ShopDetail({ nav, params }) {
  const { shopId, sku } = params
  const { shops, productBySku, reportListing, reportFor, toggleAlert, hasAlert } = useStore()

  const shop = shops.find((s) => s.id === shopId)
  const listing = shop?.stock.find((s) => s.sku === sku)
  const product = productBySku(sku)

  const [reportOpen, setReportOpen] = useState(false)
  const [directionsOpen, setDirectionsOpen] = useState(false)
  const [reason, setReason] = useState(null)
  const [showAll, setShowAll] = useState(false)

  const others = useMemo(() => {
    if (!shop) return []
    const rest = shop.stock.filter((s) => s.sku !== sku)
    return showAll ? rest : rest.filter((s) => s.inStock)
  }, [shop, sku, showAll])

  if (!shop || !listing) return null
  const reported = reportFor(shop.id, sku)
  const alertKey = `price:${shop.id}:${sku}`
  const watching = hasAlert(alertKey)

  const submitReport = () => {
    reportListing(shop.id, sku, reason)
    setReportOpen(false)
    setReason(null)
  }

  return (
    <div className="flex h-full flex-col bg-canvas">
      <TopBar tone="dark" onBack={() => nav.pop()} title={shop.name} subtitle={`${shop.area} · ${km(shop.distanceKm)} away`} />

      <main className="flex-1 overflow-y-auto pb-28">
        {/* Shop identity */}
        <section className="shutter bg-jade-700 px-4 pb-5 text-white">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[12.5px] text-jade-100">
            {shop.sponsored && (
              <span className="tag bg-marigold-300 text-[#4A3405]">
                <Icon name="sparkle" size={11} strokeWidth={2.4} />
                Sponsored
              </span>
            )}
            <span className="flex items-center gap-1">
              <Icon name="star" size={13} className="text-marigold-300" fill="currentColor" strokeWidth={0} />
              <span className="tnum font-bold text-white">{shop.rating}</span>
              <span className="tnum">({shop.reviews})</span>
            </span>
            <span className="flex items-center gap-1">
              <Icon name="clock" size={13} />
              <span className={shop.openNow ? 'font-semibold text-marigold-200' : 'text-clay-300'}>
                {shop.openNow ? 'Open now' : 'Closed'}
              </span>
              <span className="text-jade-200/70">· {shop.hours}</span>
            </span>
          </div>
          <p className="mt-2 flex items-start gap-1.5 text-[13px] leading-snug text-jade-100/90">
            <Icon name="pin" size={14} className="mt-[1px] shrink-0" />
            {shop.address}
          </p>
        </section>

        {/* THE searched item — the whole reason this screen exists */}
        <section className="-mt-3 px-4">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-line bg-jade-50 px-4 py-2">
              <span className="text-[11.5px] font-bold uppercase tracking-[.07em] text-jade-700">
                You searched for
              </span>
              <FreshnessPill ts={listing.updatedAt} />
            </div>

            <div className="p-4">
              <div className="flex items-start gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-canvas text-jade-600">
                  <Icon name={CATEGORY_ICON[product?.category] || 'box'} size={21} />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="text-[16.5px] font-bold leading-tight">{product?.name}</h2>
                  <p className="mt-0.5 text-[12.5px] text-ink-50">{product?.sub}</p>
                </div>
              </div>

              {/* price / stock / distance — the three decision facts, biggest on screen */}
              <div className="mt-4 grid grid-cols-3 gap-2 rounded-xl bg-canvas p-3">
                <div>
                  <div className="mb-1 text-[10.5px] font-bold uppercase tracking-wider text-ink-30">Price</div>
                  <Price value={listing.price} size="md" />
                </div>
                <div>
                  <div className="mb-1 text-[10.5px] font-bold uppercase tracking-wider text-ink-30">Stock</div>
                  <div
                    className={`tnum text-[22px] font-extrabold leading-none ${
                      listing.inStock ? 'text-jade-800' : 'text-clay-600'
                    }`}
                  >
                    {listing.inStock ? listing.qty : 0}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold text-ink-50">
                    {listing.inStock ? 'units left' : 'out of stock'}
                  </div>
                </div>
                <div>
                  <div className="mb-1 text-[10.5px] font-bold uppercase tracking-wider text-ink-30">Distance</div>
                  <div className="tnum text-[22px] font-extrabold leading-none text-jade-800">
                    {shop.distanceKm.toFixed(1)}
                  </div>
                  <div className="mt-1 text-[11px] font-semibold text-ink-50">km · {rickshawMins(shop.distanceKm)} min</div>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <StockBadge inStock={listing.inStock} qty={listing.inStock ? listing.qty : null} />
                <button
                  onClick={() => setReportOpen(true)}
                  className="flex items-center gap-1.5 rounded-lg px-2 py-1 text-[12.5px] font-semibold text-ink-50 transition active:scale-95 hover:bg-canvas hover:text-clay-600"
                >
                  <Icon name="flag" size={14} />
                  Report wrong price or stock
                </button>
              </div>

              {reported && (
                <div className="anim-rise mt-3 flex items-start gap-2 rounded-xl bg-clay-50 p-3 text-[12.5px] leading-snug text-clay-600">
                  <Icon name="shield" size={15} className="mt-[1px] shrink-0" />
                  <span>
                    <b>Thanks — reported.</b> We’ve asked {shop.name} to re-confirm this listing. Other
                    shoppers now see a warning on it too.
                  </span>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Contact */}
        <section className="mt-3 px-4">
          <div className="card flex divide-x divide-line overflow-hidden">
            <a
              href={`tel:${shop.phone.replace(/[^0-9]/g, '')}`}
              className="flex flex-1 items-center justify-center gap-2 py-3.5 text-[13.5px] font-semibold text-jade-700
                transition duration-150 hover:bg-jade-50 focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-inset focus-visible:ring-jade-300 active:bg-jade-100"
            >
              <Icon name="phone" size={16} />
              Call shop
            </a>
            <button
              onClick={() => toggleAlert(alertKey, `${product?.name} at ${shop.name}`)}
              aria-pressed={watching}
              className={`flex flex-1 items-center justify-center gap-2 py-3.5 text-[13.5px] font-semibold
                transition duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset
                focus-visible:ring-jade-300 ${
                  watching
                    ? 'bg-jade-50 text-jade-700 hover:bg-jade-100'
                    : 'text-jade-700 hover:bg-jade-50 active:bg-jade-100'
                }`}
            >
              <Icon name={watching ? 'check' : 'bell'} size={16} strokeWidth={watching ? 2.5 : 1.75} />
              {watching ? 'Alert on' : 'Notify on price drop'}
            </button>
          </div>
        </section>

        {/* Other stock at this shop */}
        <section className="mt-6 px-4">
          <div className="mb-2.5 flex items-center justify-between">
            <h3 className="eyebrow">
              Also at this shop
            </h3>
            <button onClick={() => setShowAll((v) => !v)} className="btn-link -mr-2">
              {showAll ? 'In stock only' : 'Show all items'}
            </button>
          </div>

          <div className="card divide-y divide-line overflow-hidden">
            {others.map((it) => {
              const p = productBySku(it.sku)
              if (!p) return null
              return (
                // Tappable: compare this item across every nearby shop.
                <button
                  key={it.sku}
                  onClick={() => nav.push('results', { sku: it.sku, query: p.name })}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition duration-150
                    hover:bg-jade-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset
                    focus-visible:ring-jade-300 active:bg-jade-100"
                >
                  <span
                    className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg ${
                      it.inStock ? 'bg-jade-50 text-jade-600' : 'bg-canvas text-ink-30'
                    }`}
                  >
                    <Icon name={CATEGORY_ICON[p.category]} size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[14px] font-semibold leading-tight">{p.name}</span>
                    <span className="mt-1 flex items-center gap-2">
                      <StockBadge inStock={it.inStock} qty={it.inStock ? it.qty : null} size="sm" />
                      <FreshnessPill ts={it.updatedAt} size="sm" />
                    </span>
                  </span>
                  <Price value={it.price} size="sm" className={it.inStock ? '' : 'opacity-40'} />
                  <Icon name="next" size={15} className="shrink-0 text-ink-30" />
                </button>
              )
            })}
            {others.length === 0 && (
              <p className="px-4 py-6 text-center text-[13px] text-ink-30">Nothing else in stock right now.</p>
            )}
          </div>
        </section>
      </main>

      {/* Sticky primary action */}
      <div className="safe-b absolute inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur">
        <button
          onClick={() => setDirectionsOpen(true)}
          className="btn btn-lg btn-primary w-full"
          disabled={!listing.inStock}
        >
          <Icon name="nav" size={19} strokeWidth={2} />
          {listing.inStock ? 'Get Directions' : 'Out of stock — try another shop'}
        </button>
        {listing.inStock && (
          <p className="mt-1.5 text-center text-[11.5px] text-ink-30">
            {km(shop.distanceKm)} · {rickshawMins(shop.distanceKm)} min rickshaw · {walkMins(shop.distanceKm)} min walk
          </p>
        )}
      </div>

      {/* Report sheet — the lightweight trust loop */}
      <Sheet
        open={reportOpen}
        onClose={() => setReportOpen(false)}
        title="Something wrong with this listing?"
        subtitle="Takes one tap. It helps the next shopper too."
        footer={
          <button onClick={submitReport} disabled={!reason} className="btn btn-lg btn-primary w-full">
            Send report
          </button>
        }
      >
        <div className="space-y-2">
          {REASONS.map((r) => {
            const on = reason === r.id
            return (
              <button
                key={r.id}
                onClick={() => setReason(r.id)}
                className={`flex w-full items-center gap-3 rounded-xl border px-3.5 py-3 text-left text-[14.5px] font-medium transition duration-150 ease-swift
                  ${on ? 'border-jade-500 bg-jade-50 text-jade-800' : 'border-line bg-surface text-ink-70'}`}
              >
                <Icon name={r.icon} size={17} className={on ? 'text-jade-600' : 'text-ink-30'} />
                <span className="flex-1">{r.label}</span>
                {on && <Icon name="check" size={16} strokeWidth={2.6} className="text-jade-600" />}
              </button>
            )
          })}
          <p className="pt-1 text-[12px] leading-relaxed text-ink-30">
            Reports are sent straight to the shop and the listing is marked unconfirmed until they respond.
          </p>
        </div>
      </Sheet>

      {/* Directions sheet — simulated hand-off to maps */}
      <Sheet
        open={directionsOpen}
        onClose={() => setDirectionsOpen(false)}
        title={`Route to ${shop.name}`}
        subtitle={shop.address}
        footer={
          <button onClick={() => setDirectionsOpen(false)} className="btn btn-lg btn-primary w-full">
            <Icon name="arrow" size={17} />
            Open in Google Maps
          </button>
        }
      >
        <div className="mb-3 grid grid-cols-3 gap-2">
          {[
            { v: km(shop.distanceKm), l: 'distance' },
            { v: `${rickshawMins(shop.distanceKm)} min`, l: 'by rickshaw' },
            { v: `${walkMins(shop.distanceKm)} min`, l: 'walking' },
          ].map((s) => (
            <div key={s.l} className="rounded-xl bg-jade-50 px-3 py-2.5 text-center">
              <div className="tnum text-[17px] font-extrabold text-jade-700">{s.v}</div>
              <div className="text-[11px] text-jade-600/80">{s.l}</div>
            </div>
          ))}
        </div>
        <div className="rounded-xl bg-marigold-50 p-3.5 text-[13px] leading-relaxed text-marigold-700">
          <b>Before you go:</b> {shop.name} confirmed {product?.name} at {taka(listing.price)} · {listing.qty} in
          stock. Call ahead on <span className="tnum font-semibold">{shop.phone}</span> if you need more than{' '}
          {listing.qty}.
        </div>
      </Sheet>
    </div>
  )
}
