import Icon from './Icon'
import { taka } from '../lib/format'

/**
 * A deliberately lightweight map: enough spatial context to judge "is this on
 * my way?", without pretending to be a routing engine. Pins are coloured by
 * the same three states used everywhere else — sponsored (marigold),
 * in stock (jade), out of stock (grey).
 */
export default function MapView({ rows, selectedId, onSelect }) {
  return (
    <div className="relative h-full w-full overflow-hidden bg-[#E8EEE9]">
      {/* Blocks + roads */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(#DDE7DF 1px, transparent 1px), linear-gradient(90deg, #DDE7DF 1px, transparent 1px)',
          backgroundSize: '46px 46px',
        }}
      />
      <div className="absolute inset-x-0 top-[41%] h-[14px] -rotate-[4deg] bg-white/85" />
      <div className="absolute inset-y-0 left-[38%] w-[12px] rotate-[3deg] bg-white/85" />
      <div className="absolute inset-x-0 top-[72%] h-[9px] rotate-[2deg] bg-white/70" />
      {/* River — the Surma runs through Sylhet */}
      <div className="absolute inset-x-0 top-[86%] h-[26px] -rotate-[3deg] bg-[#CFE0E6]" />
      <div className="absolute left-3 top-[87%] text-[9px] font-semibold uppercase tracking-widest text-[#8FA9B2]">
        Surma
      </div>

      {/* 2 km catchment */}
      <div className="absolute left-1/2 top-[56%] h-[230px] w-[230px] -translate-x-1/2 -translate-y-1/2 rounded-full border border-jade-400/40 bg-jade-400/[.07]" />

      {/* You */}
      <div className="absolute left-1/2 top-[56%] z-10 -translate-x-1/2 -translate-y-1/2">
        <div className="h-3.5 w-3.5 rounded-full border-[3px] border-white bg-jade-600 shadow-lift" />
        <div className="mt-1 -translate-x-1/2 whitespace-nowrap rounded-full bg-white/90 px-1.5 py-[1px] text-[9.5px] font-bold text-jade-700 shadow-card">
          You
        </div>
      </div>

      {/* Shops */}
      {rows.map(({ shop, listing }) => {
        const sel = shop.id === selectedId
        const tone = shop.sponsored
          ? 'bg-marigold-400 text-jade-900'
          : listing.inStock
            ? 'bg-jade-600 text-white'
            : 'bg-ink-30 text-white'
        return (
          <button
            key={shop.id}
            onClick={() => onSelect(shop.id)}
            style={{ left: `${shop.x}%`, top: `${shop.y}%` }}
            className={`absolute z-20 -translate-x-1/2 -translate-y-full transition duration-200 ease-swift ${
              sel ? 'scale-110' : 'hover:scale-105'
            }`}
            aria-label={shop.name}
          >
            <span
              className={`flex items-center gap-1 rounded-full px-2 py-1 text-[11px] font-extrabold shadow-lift ring-2 ${
                tone
              } ${sel ? 'ring-white' : 'ring-white/70'}`}
            >
              {shop.sponsored && <Icon name="sparkle" size={10} strokeWidth={2.5} />}
              <span className="tnum">{listing.inStock ? taka(listing.price) : '—'}</span>
            </span>
            <span
              className={`mx-auto block h-2 w-2 -translate-y-[3px] rotate-45 ${
                shop.sponsored ? 'bg-marigold-400' : listing.inStock ? 'bg-jade-600' : 'bg-ink-30'
              }`}
            />
          </button>
        )
      })}

      {/* Legend */}
      <div className="absolute left-3 top-3 flex flex-col gap-1 rounded-xl bg-white/90 px-2.5 py-2 text-[10px] font-medium text-ink-50 shadow-card backdrop-blur">
        <span className="flex items-center gap-1.5">
          <i className="h-2 w-2 rounded-full bg-marigold-400" /> Sponsored
        </span>
        <span className="flex items-center gap-1.5">
          <i className="h-2 w-2 rounded-full bg-jade-600" /> In stock
        </span>
        <span className="flex items-center gap-1.5">
          <i className="h-2 w-2 rounded-full bg-ink-30" /> Out of stock
        </span>
      </div>
    </div>
  )
}
