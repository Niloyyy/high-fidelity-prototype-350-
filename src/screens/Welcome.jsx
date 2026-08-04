import { useEffect, useState } from 'react'
import Icon, { CATEGORY_ICON, CATEGORY_TINT } from '../components/Icon'
import { CATEGORIES, CATEGORY_META } from '../data/mockData'

/**
 * WELCOME
 * Validation question (Shopper — Compelling Offer): how do people react to
 * "Google Search for your local shelves"? The pitch is stated plainly and
 * then immediately backed with local supply numbers, because an abstract
 * promise is what the interview is designed to stress-test.
 */

const TICKER = [
  { q: 'Napa Extra 500mg', where: 'Zindabazar', when: 'just now' },
  { q: '65W Type-C Charger', where: 'Bandar Bazar', when: '2 min ago' },
  { q: 'Measuring Tape 5m', where: 'Kumarpara', when: '4 min ago' },
  { q: 'Orsaline-N (ORS)', where: 'Subid Bazar', when: '6 min ago' },
]

export default function Welcome({ nav }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % TICKER.length), 2800)
    return () => clearInterval(t)
  }, [])
  const tick = TICKER[i]

  return (
    // A plain scroll container, NOT a flex column: as a flex parent, the hero
    // was being shrunk to fit and its own overflow-hidden then clipped the
    // headline right off the screen.
    <div className="h-full overflow-y-auto bg-canvas">
      {/* Brand hero */}
      <div className="shutter relative overflow-hidden bg-jade-800 px-6 pb-10 pt-10 text-white">
        <div className="grain pointer-events-none absolute inset-0 opacity-40" />
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgba(243,190,78,.28), transparent)' }}
        />

        <div className="relative">
          <div className="mb-8 flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-xl bg-marigold-300 text-[#4A3405] shadow-[0_6px_16px_-8px_rgba(0,0,0,.6)]">
              <Icon name="store" size={20} strokeWidth={2} />
            </div>
            <div className="leading-none">
              <div className="font-display text-[18px] font-extrabold tracking-[-.02em]">KacherPonno</div>
              <div lang="bn" className="bn mt-1 text-[12.5px] text-jade-200">কাছের পণ্য</div>
            </div>
          </div>

          <h1 className="anim-rise max-w-[16rem] text-[33px] font-extrabold leading-[1.1] tracking-[-.025em]">
            Search your neighbourhood’s shelves.
          </h1>
          <p className="anim-rise mt-3.5 max-w-[19.5rem] text-[14.5px] leading-relaxed text-jade-100/90">
            See which nearby shop has your item — the price, whether it’s actually in stock, and how far
            it is — <span className="font-semibold text-white">before you leave the house.</span>
          </p>

          <div className="mt-7 grid grid-cols-3 gap-2">
            {[
              { v: '128', l: 'shops nearby' },
              { v: '2,400+', l: 'items listed' },
              { v: '2 km', l: 'around you' },
            ].map((s) => (
              <div key={s.l} className="rounded-xl bg-white/10 px-3 py-2.5 ring-1 ring-white/10">
                <div className="tnum text-[19px] font-extrabold leading-none text-white">{s.v}</div>
                <div className="mt-1.5 text-[11.5px] leading-tight text-jade-200">{s.l}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Live ticker — proof the local index is moving right now */}
      <div className="-mt-4 px-5">
        <div key={i} className="anim-rise flex items-center gap-2.5 rounded-full border border-line bg-surface px-3.5 py-2.5 shadow-card">
          <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-jade-50 text-jade-500">
            <Icon name="search" size={13} strokeWidth={2.2} />
          </span>
          <p className="min-w-0 flex-1 truncate text-[12.5px] text-ink-50">
            <span className="font-semibold text-ink">“{tick.q}”</span> searched in {tick.where}
          </p>
          <span className="shrink-0 text-[11px] font-semibold text-jade-600">{tick.when}</span>
        </div>
      </div>

      {/* Categories strip */}
      <div className="px-5 pt-6">
        <p className="mb-2.5 eyebrow">
          Covering
        </p>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map((c) => (
            <div
              key={c}
              className="rounded-2xl border border-line bg-surface px-1 py-3 text-center shadow-card"
            >
              <span
                className={`mx-auto grid h-9 w-9 place-items-center rounded-xl ${CATEGORY_TINT[c]}`}
              >
                <Icon name={CATEGORY_ICON[c]} size={18} strokeWidth={2} />
              </span>
              <div lang="bn" className="bn mt-2 text-[11.5px] font-semibold text-ink-70">{CATEGORY_META[c].bn}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Role doors */}
      <div className="mt-7 flex-1 px-5 pb-6">
        <p className="mb-2.5 eyebrow">Continue as</p>

        <button
          onClick={() => nav.push('search')}
          className="group mb-3 flex w-full items-center gap-3.5 rounded-2xl border border-line bg-surface p-4 text-left
            shadow-card transition duration-200 ease-swift hover:border-jade-300 hover:shadow-lift
            focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-jade-300 focus-visible:ring-offset-2
            active:scale-[.985]"
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-jade-700 text-white">
            <Icon name="search" size={22} strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[16px] font-bold">I’m a Shopper</div>
            <div className="mt-0.5 text-[13px] leading-snug text-ink-50">
              Find an item near me and compare price, stock &amp; distance
            </div>
          </div>
          <Icon name="next" size={20} className="text-ink-30 transition group-hover:translate-x-0.5 group-hover:text-jade-500" />
        </button>

        <button
          onClick={() => nav.push('dashboard')}
          className="group flex w-full items-center gap-3.5 rounded-2xl border border-line bg-surface p-4 text-left
            shadow-card transition duration-200 ease-swift hover:border-marigold-300 hover:shadow-lift
            focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-marigold-300
            focus-visible:ring-offset-2 active:scale-[.985]"
        >
          <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-marigold-300 text-[#4A3405]">
            <Icon name="store" size={22} strokeWidth={2} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="text-[16px] font-bold">I’m a Shop Owner</div>
            <div className="mt-0.5 text-[13px] leading-snug text-ink-50">
              List your stock free · update in one tap · reach 2 km around you
            </div>
          </div>
          <Icon name="next" size={20} className="text-ink-30 transition group-hover:translate-x-0.5 group-hover:text-marigold-500" />
        </button>

        <div className="mt-5 flex items-center justify-center gap-1.5 text-[11.5px] text-ink-50">
          <Icon name="pin" size={13} />
          Sylhet, Bangladesh · demo data
        </div>
      </div>
    </div>
  )
}
