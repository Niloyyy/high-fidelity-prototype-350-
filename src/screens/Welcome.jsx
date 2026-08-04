import { useEffect, useState } from 'react'
import Icon, { CATEGORY_ICON } from '../components/Icon'
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
    <div className="flex h-full flex-col overflow-y-auto bg-canvas">
      {/* Brand hero */}
      <div className="shutter relative overflow-hidden bg-jade-800 px-6 pb-9 pt-11 text-white">
        <div className="grain pointer-events-none absolute inset-0 opacity-40" />
        <div
          className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full"
          style={{ background: 'radial-gradient(closest-side, rgba(243,190,78,.28), transparent)' }}
        />

        <div className="relative">
          <div className="mb-7 flex items-center gap-2.5">
            <div className="grid h-9 w-9 place-items-center rounded-xl bg-marigold-300 text-[#4A3405]">
              <Icon name="store" size={19} strokeWidth={2} />
            </div>
            <div className="leading-none">
              <div className="text-[17px] font-extrabold tracking-tight">KacherPonno</div>
              <div className="bn mt-0.5 text-[12px] text-jade-200">কাছের পণ্য</div>
            </div>
          </div>

          <h1 className="anim-rise max-w-[15rem] text-[30px] font-extrabold leading-[1.12] tracking-tight">
            Search your neighbourhood’s shelves.
          </h1>
          <p className="anim-rise mt-3 max-w-[19rem] text-[14.5px] leading-relaxed text-jade-100/90">
            See which nearby shop has your item — the price, whether it’s actually in stock, and how far
            it is — <span className="font-semibold text-white">before you leave the house.</span>
          </p>

          <div className="mt-6 flex items-center gap-5 text-[12.5px] text-jade-200">
            <div>
              <div className="tnum text-[19px] font-bold text-white">128</div>
              shops nearby
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div>
              <div className="tnum text-[19px] font-bold text-white">2,400+</div>
              items listed
            </div>
            <div className="h-8 w-px bg-white/15" />
            <div>
              <div className="tnum text-[19px] font-bold text-white">2 km</div>
              around you
            </div>
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
          <span className="shrink-0 text-[11px] font-medium text-jade-500">{tick.when}</span>
        </div>
      </div>

      {/* Categories strip */}
      <div className="px-5 pt-6">
        <p className="mb-2.5 eyebrow">
          Covering
        </p>
        <div className="grid grid-cols-4 gap-2">
          {CATEGORIES.map((c) => (
            <div key={c} className="rounded-xl border border-line bg-surface px-1 py-2.5 text-center">
              <Icon name={CATEGORY_ICON[c]} size={18} className="mx-auto text-jade-500" />
              <div className="bn mt-1.5 text-[11px] font-semibold text-ink-70">{CATEGORY_META[c].bn}</div>
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

        <div className="mt-5 flex items-center justify-center gap-1.5 text-[11.5px] text-ink-30">
          <Icon name="pin" size={13} />
          Sylhet, Bangladesh · demo data
        </div>
      </div>
    </div>
  )
}
