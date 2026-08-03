import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react'
import { CATALOG, INITIAL_RECENT, OWNER_SHOP_ID, SHOPS } from '../data/mockData'
import { slug } from './format'

/**
 * The whole prototype runs on this one in-memory store. No backend, no
 * persistence beyond the demo session — but every mutation is real, and both
 * user flows share it, so an edit made as a shop owner is visible to the
 * shopper on the very next search.
 */

const StoreCtx = createContext(null)

const clone = (v) => JSON.parse(JSON.stringify(v))

export function StoreProvider({ children }) {
  const [shops, setShops] = useState(() => clone(SHOPS))
  const [catalog, setCatalog] = useState(() => clone(CATALOG))
  const [recent, setRecent] = useState(INITIAL_RECENT)
  const [premium, setPremium] = useState(false)
  /** key = `${shopId}:${sku}` — listings a shopper has flagged as wrong. */
  const [reports, setReports] = useState({})
  const [toasts, setToasts] = useState([])
  /** sku that should flash in the dashboard after being added/edited. */
  const [highlight, setHighlight] = useState(null)

  const toastId = useRef(0)

  const toast = useCallback((message, opts = {}) => {
    const id = ++toastId.current
    setToasts((t) => [...t, { id, message, tone: opts.tone || 'default', icon: opts.icon }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), opts.duration || 2600)
  }, [])

  const productBySku = useCallback(
    (sku) => catalog.find((c) => c.sku === sku),
    [catalog],
  )

  /* ---------------- Shopper: search ---------------- */

  /** Item-level search across the catalogue. Returns matching products. */
  const searchProducts = useCallback(
    (query, category) => {
      const q = query.trim().toLowerCase()
      return catalog.filter((p) => {
        if (category && p.category !== category) return false
        if (!q) return true
        return (
          p.name.toLowerCase().includes(q) ||
          p.sub.toLowerCase().includes(q) ||
          (p.alt || '').includes(q) ||
          p.category.toLowerCase().includes(q)
        )
      })
    },
    [catalog],
  )

  /** Every shop carrying `sku`, joined with that shop's listing for it. */
  const listingsFor = useCallback(
    (sku) =>
      shops
        .map((shop) => {
          const listing = shop.stock.find((s) => s.sku === sku)
          return listing ? { shop, listing } : null
        })
        .filter(Boolean),
    [shops],
  )

  /** How many nearby shops currently have this in stock (for suggestions). */
  const inStockCount = useCallback(
    (sku) => listingsFor(sku).filter((r) => r.listing.inStock).length,
    [listingsFor],
  )

  const pushRecent = useCallback((term) => {
    setRecent((r) => [term, ...r.filter((x) => x !== term)].slice(0, 5))
  }, [])

  const clearRecent = useCallback(() => setRecent([]), [])

  /* ---------------- Shopper: trust loop ---------------- */

  const reportListing = useCallback(
    (shopId, sku, reason) => {
      setReports((r) => ({ ...r, [`${shopId}:${sku}`]: { reason, at: Date.now() } }))
      toast('Thanks — we’ll re-check with the shop', { tone: 'good', icon: 'flag' })
    },
    [toast],
  )

  const reportFor = useCallback((shopId, sku) => reports[`${shopId}:${sku}`], [reports])

  /* ---------------- Owner: inventory ---------------- */

  const mutateOwnerStock = useCallback((fn) => {
    setShops((prev) =>
      prev.map((s) => (s.id === OWNER_SHOP_ID ? { ...s, stock: fn(s.stock) } : s)),
    )
  }, [])

  /**
   * One tap. No confirm dialog, no save button — and the freshness stamp
   * resets to "just now", which is exactly what makes the shopper-side trust
   * indicator meaningful.
   */
  const ownerStock = useMemo(
    () => shops.find((s) => s.id === OWNER_SHOP_ID)?.stock ?? [],
    [shops],
  )

  const toggleStock = useCallback(
    (sku) => {
      const nowInStock = !ownerStock.find((it) => it.sku === sku)?.inStock
      mutateOwnerStock((stock) =>
        stock.map((it) =>
          it.sku === sku
            ? {
                ...it,
                inStock: nowInStock,
                qty: nowInStock ? Math.max(it.qty, 1) : 0,
                updatedAt: Date.now(),
              }
            : it,
        ),
      )
      return nowInStock
    },
    [mutateOwnerStock, ownerStock],
  )

  /** Bulk "yes, all of this is still accurate" — clears the stale-data nudge. */
  const confirmAllFresh = useCallback(() => {
    const week = 7 * 24 * 60 * 60 * 1000
    const n = ownerStock.filter((it) => Date.now() - it.updatedAt > week).length
    mutateOwnerStock((stock) => stock.map((it) => ({ ...it, updatedAt: Date.now() })))
    return n
  }, [mutateOwnerStock, ownerStock])

  const saveItem = useCallback(
    ({ sku, name, category, sub, price, qty, inStock }) => {
      let finalSku = sku
      if (!finalSku) {
        // New product: it joins the shared catalogue, so shoppers can search it.
        finalSku = `${slug(name)}-${Math.random().toString(36).slice(2, 6)}`
        setCatalog((c) => [
          ...c,
          { sku: finalSku, name, category, sub: sub || 'Added by shop', alt: name.toLowerCase() },
        ])
      } else {
        setCatalog((c) =>
          c.map((p) => (p.sku === finalSku ? { ...p, name, category, sub: sub || p.sub } : p)),
        )
      }

      mutateOwnerStock((stock) => {
        const exists = stock.some((s) => s.sku === finalSku)
        const row = { sku: finalSku, price: Number(price), qty: Number(qty), inStock, updatedAt: Date.now() }
        return exists ? stock.map((s) => (s.sku === finalSku ? { ...s, ...row } : s)) : [row, ...stock]
      })

      setHighlight(finalSku)
      setTimeout(() => setHighlight(null), 2200)
      return finalSku
    },
    [mutateOwnerStock],
  )

  const deleteItem = useCallback(
    (sku) => mutateOwnerStock((stock) => stock.filter((s) => s.sku !== sku)),
    [mutateOwnerStock],
  )

  /** Simulated spreadsheet import — adds/updates several rows at once. */
  const importRows = useCallback(
    (rows) => {
      const have = new Set(ownerStock.map((s) => s.sku))
      const added = rows.filter((r) => !have.has(r.sku)).length

      mutateOwnerStock((stock) => {
        const next = [...stock]
        rows.forEach(({ sku, price, qty }) => {
          const i = next.findIndex((s) => s.sku === sku)
          const row = { sku, price, qty, inStock: qty > 0, updatedAt: Date.now() }
          if (i >= 0) next[i] = { ...next[i], ...row }
          else next.unshift(row)
        })
        return next
      })

      return { added, updated: rows.length - added }
    },
    [mutateOwnerStock, ownerStock],
  )

  /* ---------------- Owner: premium ---------------- */

  const subscribePremium = useCallback(() => {
    setPremium(true)
    // The owner's shop is now Sponsored in the shopper flow — cross-flow proof
    // that the ৳500 actually buys the placement the banner promised.
    setShops((prev) => prev.map((s) => (s.id === OWNER_SHOP_ID ? { ...s, sponsored: true } : s)))
    toast('Premium active — you’re now ranked first nearby', { tone: 'gold', icon: 'sparkle' })
  }, [toast])

  const cancelPremium = useCallback(() => {
    setPremium(false)
    setShops((prev) => prev.map((s) => (s.id === OWNER_SHOP_ID ? { ...s, sponsored: false } : s)))
  }, [])

  const ownerShop = useMemo(() => shops.find((s) => s.id === OWNER_SHOP_ID), [shops])

  const value = useMemo(
    () => ({
      shops,
      catalog,
      ownerShop,
      premium,
      recent,
      toasts,
      highlight,
      productBySku,
      searchProducts,
      listingsFor,
      inStockCount,
      pushRecent,
      clearRecent,
      reportListing,
      reportFor,
      toggleStock,
      confirmAllFresh,
      saveItem,
      deleteItem,
      importRows,
      subscribePremium,
      cancelPremium,
      toast,
    }),
    [
      shops,
      catalog,
      ownerShop,
      premium,
      recent,
      toasts,
      highlight,
      productBySku,
      searchProducts,
      listingsFor,
      inStockCount,
      pushRecent,
      clearRecent,
      reportListing,
      reportFor,
      toggleStock,
      confirmAllFresh,
      saveItem,
      deleteItem,
      importRows,
      subscribePremium,
      cancelPremium,
      toast,
    ],
  )

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>
}

export function useStore() {
  const ctx = useContext(StoreCtx)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}
