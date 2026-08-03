import { useMemo, useRef, useState } from 'react'
import Icon, { CATEGORY_ICON } from '../components/Icon'
import { Sheet, Toggle, TopBar } from '../components/ui'
import { BARCODE_DB, CATEGORIES, CSV_ROWS } from '../data/mockData'
import { taka } from '../lib/format'
import { useStore } from '../lib/store'

/**
 * ADD / UPDATE ITEM
 * Validation question (Retailer — Compelling Offer): would you rather scan a
 * barcode, tick items manually, or upload a spreadsheet?
 * We refuse to assume. All three are offered as equal, first-class paths, and
 * the scanner and the CSV import are simulated end to end — so in a real
 * interview we can watch which one a shopkeeper reaches for first. That
 * observation is the finding; the UI is the instrument.
 */

export default function ItemEditor({ nav, params = {} }) {
  const editingSku = params.sku || null
  const { ownerShop, productBySku, catalog, saveItem, deleteItem, importRows, toast } = useStore()

  const existing = editingSku ? ownerShop.stock.find((s) => s.sku === editingSku) : null
  const existingProduct = editingSku ? productBySku(editingSku) : null

  const [name, setName] = useState(existingProduct?.name || '')
  const [category, setCategory] = useState(existingProduct?.category || 'Mobile Accessories')
  const [price, setPrice] = useState(existing ? String(existing.price) : '')
  const [qty, setQty] = useState(existing ? String(existing.qty) : '')
  const [inStock, setInStock] = useState(existing ? existing.inStock : true)

  const [scanOpen, setScanOpen] = useState(false)
  const [scanned, setScanned] = useState(null)
  const [csvOpen, setCsvOpen] = useState(false)
  const [csvStage, setCsvStage] = useState('idle') // idle | parsing | done
  const [deleteOpen, setDeleteOpen] = useState(false)
  const nameRef = useRef(null)

  const valid = name.trim() && Number(price) > 0

  /* ---- Simulated barcode scan ---- */
  const startScan = () => {
    setScanOpen(true)
    setTimeout(() => {
      // Pick a product the shop doesn't already stock, so the demo always lands.
      const owned = new Set(ownerShop.stock.map((s) => s.sku))
      const hit = BARCODE_DB.find((b) => !owned.has(b.sku)) || BARCODE_DB[0]
      const p = catalog.find((c) => c.sku === hit.sku)
      setScanOpen(false)
      setScanned({ ...hit, product: p })
      setName(p.name)
      setCategory(p.category)
      setPrice(String(hit.suggestedPrice))
      setQty('10')
      setInStock(true)
      toast('Barcode matched — details filled in', { tone: 'good', icon: 'barcode' })
    }, 1700)
  }

  /* ---- Simulated spreadsheet import ---- */
  const startCsv = () => {
    setCsvOpen(true)
    setCsvStage('parsing')
    setTimeout(() => setCsvStage('done'), 1400)
  }

  const commitCsv = () => {
    const { added, updated } = importRows(CSV_ROWS)
    setCsvOpen(false)
    setCsvStage('idle')
    toast(`${added} added · ${updated} updated from stock-sheet.csv`, { tone: 'good', icon: 'upload' })
    nav.pop()
  }

  const onSave = () => {
    saveItem({
      sku: editingSku,
      name: name.trim(),
      category,
      sub: existingProduct?.sub,
      price,
      qty: inStock ? Number(qty || 1) : 0,
      inStock,
    })
    toast(editingSku ? 'Item updated · shoppers see it now' : `${name.trim()} added to your shop`, {
      tone: 'good',
      icon: 'check',
    })
    nav.pop()
  }

  const csvPreview = useMemo(
    () => CSV_ROWS.map((r) => ({ ...r, product: catalog.find((c) => c.sku === r.sku) })),
    [catalog],
  )

  return (
    <div className="flex h-full flex-col bg-canvas">
      <TopBar
        tone="dark"
        onBack={() => nav.pop()}
        title={editingSku ? 'Update item' : 'Add an item'}
        subtitle={ownerShop.name}
        right={
          editingSku ? (
            <button
              onClick={() => setDeleteOpen(true)}
              aria-label="Delete item"
              className="grid h-9 w-9 place-items-center rounded-full text-white/80 transition hover:bg-white/15 active:scale-90"
            >
              <Icon name="trash" size={18} />
            </button>
          ) : null
        }
      />

      <main className="flex-1 overflow-y-auto pb-28">
        {/* ---- Three ways in. None is assumed to be the right one. ---- */}
        {!editingSku && (
          <section className="px-4 pt-4">
            <h2 className="mb-2.5 text-[12px] font-bold uppercase tracking-[.08em] text-ink-30">
              Fastest way to add
            </h2>
            <div className="grid grid-cols-3 gap-2.5">
              <button
                onClick={startScan}
                className="group flex flex-col items-center gap-2 rounded-2xl border border-jade-200 bg-jade-50 px-2 py-3.5 transition duration-200 ease-swift hover:border-jade-400 active:scale-[.97]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-jade-700 text-white">
                  <Icon name="barcode" size={20} strokeWidth={2} />
                </span>
                <span className="text-[12.5px] font-bold leading-tight text-jade-800">Scan barcode</span>
                <span className="text-[10.5px] leading-tight text-jade-600/80">~3 sec</span>
              </button>

              <button
                onClick={startCsv}
                className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-surface px-2 py-3.5 transition duration-200 ease-swift hover:border-jade-300 active:scale-[.97]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-canvas text-jade-700">
                  <Icon name="upload" size={20} strokeWidth={2} />
                </span>
                <span className="text-[12.5px] font-bold leading-tight">Spreadsheet</span>
                <span className="text-[10.5px] leading-tight text-ink-30">bulk</span>
              </button>

              <button
                onClick={() => nameRef.current?.focus()}
                className="flex flex-col items-center gap-2 rounded-2xl border border-line bg-surface px-2 py-3.5 transition duration-200 ease-swift hover:border-jade-300 active:scale-[.97]"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-canvas text-jade-700">
                  <Icon name="list" size={20} strokeWidth={2} />
                </span>
                <span className="text-[12.5px] font-bold leading-tight">Type it</span>
                <span className="text-[10.5px] leading-tight text-ink-30">1 item</span>
              </button>
            </div>
          </section>
        )}

        {scanned && (
          <section className="anim-rise px-4 pt-3">
            <div className="flex items-center gap-2.5 rounded-xl border border-jade-200 bg-jade-50 px-3.5 py-2.5">
              <Icon name="barcode" size={17} className="text-jade-600" />
              <p className="min-w-0 flex-1 text-[12.5px] leading-snug text-jade-800">
                Filled from barcode <span className="tnum font-semibold">{scanned.code}</span>
              </p>
              <button onClick={() => setScanned(null)} aria-label="Dismiss" className="text-jade-600">
                <Icon name="x" size={15} strokeWidth={2.4} />
              </button>
            </div>
          </section>
        )}

        {/* ---- The form ---- */}
        <section className="px-4 pt-5">
          <h2 className="mb-2.5 text-[12px] font-bold uppercase tracking-[.08em] text-ink-30">Item details</h2>

          <div className="card space-y-4 p-4">
            <div>
              <label className="label" htmlFor="item-name">
                Item name
              </label>
              <input
                id="item-name"
                ref={nameRef}
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. 65W Type-C Fast Charger"
                className="field"
              />
            </div>

            <div>
              <span className="label">Category</span>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => setCategory(c)}
                    className={`chip ${category === c ? 'chip-on' : 'chip-off'}`}
                  >
                    <Icon name={CATEGORY_ICON[c]} size={14} />
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label" htmlFor="item-price">
                  Price (BDT)
                </label>
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[15px] font-bold text-ink-30">
                    ৳
                  </span>
                  <input
                    id="item-price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value.replace(/[^0-9]/g, ''))}
                    inputMode="numeric"
                    placeholder="0"
                    className="field tnum pl-7 font-semibold"
                  />
                </div>
              </div>
              <div>
                <label className="label" htmlFor="item-qty">
                  Quantity
                </label>
                <input
                  id="item-qty"
                  value={qty}
                  onChange={(e) => setQty(e.target.value.replace(/[^0-9]/g, ''))}
                  inputMode="numeric"
                  placeholder="0"
                  className="field tnum font-semibold"
                  disabled={!inStock}
                />
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-canvas px-3.5 py-3">
              <div>
                <div className="text-[14px] font-semibold">In stock right now</div>
                <div className="mt-0.5 text-[12px] text-ink-50">
                  {inStock ? 'Shoppers can see and travel for this' : 'Hidden from “in stock” results'}
                </div>
              </div>
              <Toggle on={inStock} label="In stock" onChange={setInStock} />
            </div>
          </div>

          <p className="mt-3 px-1 text-[11.5px] leading-relaxed text-ink-30">
            Saving stamps this listing “updated just now”, which is what shoppers see before deciding to
            travel to your shop.
          </p>
        </section>
      </main>

      {/* Sticky save */}
      <div className="safe-b absolute inset-x-0 bottom-0 z-30 border-t border-line bg-surface/95 px-4 py-3 backdrop-blur">
        <button onClick={onSave} disabled={!valid} className="btn btn-lg btn-primary w-full">
          <Icon name="check" size={18} strokeWidth={2.4} />
          {editingSku ? 'Save changes' : 'Add to my shop'}
        </button>
      </div>

      {/* ---- Scanner overlay ---- */}
      {scanOpen && (
        <div className="anim-fade absolute inset-0 z-50 flex flex-col bg-ink/95">
          <div className="flex items-center justify-between px-4 pt-4 text-white">
            <span className="text-[14px] font-semibold">Point at the barcode</span>
            <button onClick={() => setScanOpen(false)} aria-label="Cancel scan" className="text-white/70">
              <Icon name="x" size={20} />
            </button>
          </div>

          <div className="flex flex-1 items-center justify-center">
            <div className="relative h-44 w-64 overflow-hidden rounded-2xl border-2 border-white/25">
              {/* corner marks */}
              {['left-0 top-0 border-l-4 border-t-4 rounded-tl-2xl', 'right-0 top-0 border-r-4 border-t-4 rounded-tr-2xl', 'left-0 bottom-0 border-l-4 border-b-4 rounded-bl-2xl', 'right-0 bottom-0 border-r-4 border-b-4 rounded-br-2xl'].map(
                (c) => (
                  <span key={c} className={`absolute h-7 w-7 border-marigold-400 ${c}`} />
                ),
              )}
              <div className="flex h-full items-center justify-center gap-[3px] opacity-40">
                {[3, 6, 2, 8, 3, 2, 7, 4, 2, 6, 3, 8, 2, 4, 6, 3].map((w, i) => (
                  <span key={i} className="h-20 bg-white" style={{ width: w }} />
                ))}
              </div>
              <div className="anim-scan absolute inset-x-0 top-1/2 h-[2px] bg-marigold-400 shadow-[0_0_14px_2px_rgba(237,167,31,.8)]" />
            </div>
          </div>

          <div className="flex items-center justify-center gap-2 pb-16 text-[13px] text-white/70">
            <Icon name="spinner" size={16} className="anim-spin" />
            Reading barcode…
          </div>
        </div>
      )}

      {/* ---- Spreadsheet import ---- */}
      <Sheet
        open={csvOpen}
        onClose={() => {
          setCsvOpen(false)
          setCsvStage('idle')
        }}
        title="Import from spreadsheet"
        subtitle="stock-sheet.csv · 8 rows"
        footer={
          csvStage === 'done' ? (
            <button onClick={commitCsv} className="btn btn-lg btn-primary w-full">
              Import {CSV_ROWS.length} rows
            </button>
          ) : null
        }
      >
        {csvStage === 'parsing' ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <Icon name="spinner" size={26} className="anim-spin text-jade-500" />
            <p className="text-[13.5px] text-ink-50">Reading columns: name, category, price, qty…</p>
          </div>
        ) : (
          <div>
            <div className="mb-3 flex items-center gap-2 rounded-xl bg-jade-50 px-3.5 py-2.5 text-[12.5px] font-medium text-jade-700">
              <Icon name="check" size={15} strokeWidth={2.6} />
              8 rows read · 5 already match your prices · {CSV_ROWS.length} to apply
            </div>
            <ul className="card divide-y divide-line overflow-hidden">
              {csvPreview.map((r) => (
                <li key={r.sku} className="flex items-center gap-3 px-3.5 py-2.5">
                  <Icon name={CATEGORY_ICON[r.product?.category] || 'box'} size={17} className="text-jade-600" />
                  <span className="min-w-0 flex-1 truncate text-[13.5px] font-semibold">{r.product?.name}</span>
                  <span className="tnum text-[13px] font-bold text-jade-700">{taka(r.price)}</span>
                  <span className="tnum w-10 text-right text-[12px] text-ink-50">×{r.qty}</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[11.5px] leading-relaxed text-ink-30">
              Simulated for the prototype. In interviews we want to see whether shopkeepers actually keep a
              sheet like this, or whether the barcode path wins.
            </p>
          </div>
        )}
      </Sheet>

      {/* ---- Delete confirm ---- */}
      <Sheet
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="Remove this item?"
        subtitle="It will disappear from nearby search results."
        footer={
          <button
            onClick={() => {
              deleteItem(editingSku)
              setDeleteOpen(false)
              toast('Item removed', { tone: 'bad', icon: 'trash' })
              nav.pop()
            }}
            className="btn btn-lg w-full bg-clay-500 text-white"
          >
            Remove {existingProduct?.name}
          </button>
        }
      >
        <p className="text-[13.5px] leading-relaxed text-ink-50">
          If you’ve only run out temporarily, use the stock switch on the dashboard instead — it keeps the
          listing and tells shoppers you’ll have it again.
        </p>
      </Sheet>
    </div>
  )
}
