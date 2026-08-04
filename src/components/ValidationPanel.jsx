import Icon from './Icon'
import { VALIDATION } from '../data/mockData'

/**
 * The feedback loop, made visible. Every screen declares the single
 * validation-interview question it exists to answer, and the design decision
 * that answers it. Shown as a side panel on a laptop (for the live pitch) and
 * as a sheet on a phone.
 */
export default function ValidationPanel({ screen, onJump, current }) {
  const v = VALIDATION[screen] || VALIDATION.welcome

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center gap-2.5">
        <div className="grid h-9 w-9 place-items-center rounded-xl bg-marigold-300 text-[#4A3405]">
          <Icon name="store" size={19} strokeWidth={2} />
        </div>
        <div className="leading-none">
          <div className="text-[15px] font-extrabold tracking-tight text-white">KacherPonno</div>
          <div className="bn mt-1 text-[11.5px] text-jade-300">কাছের পণ্য · Sylhet</div>
        </div>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[.06] p-5 backdrop-blur">
        <div className="mb-3 flex items-center gap-2">
          <span className="tag bg-marigold-300 text-[#4A3405]">{v.screen}</span>
          <span className="text-[11px] font-medium text-jade-300">{v.source}</span>
        </div>

        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[.09em] text-jade-400">
          The validation question
        </p>
        <p className="mb-5 text-[15px] font-semibold leading-snug text-white">“{v.question}”</p>

        <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[.09em] text-jade-400">
          What we designed in response
        </p>
        <p className="text-[13.5px] leading-relaxed text-jade-100/90">{v.decision}</p>
      </div>

      <p className="mb-2.5 mt-7 text-[11px] font-bold uppercase tracking-[.09em] text-jade-400">
        Jump to a state
      </p>
      <div className="space-y-1.5">
        {[
          { id: 'welcome', label: 'Welcome · pick a role', icon: 'store' },
          { id: 'search', label: 'Shopper · search', icon: 'search' },
          { id: 'results', label: 'Shopper · results for a charger', icon: 'list' },
          { id: 'shop', label: 'Shopper · shop detail', icon: 'pin' },
          { id: 'dashboard', label: 'Owner · inventory', icon: 'box' },
          { id: 'additem', label: 'Owner · add item', icon: 'plus' },
        ].map((s) => (
          <button
            key={s.id}
            onClick={() => onJump(s.id)}
            className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-2 text-left text-[13px] font-medium transition
              ${
                current === s.id
                  ? 'bg-white/15 text-white'
                  : 'text-jade-200 hover:bg-white/10 hover:text-white'
              }`}
          >
            <Icon name={s.icon} size={15} />
            {s.label}
          </button>
        ))}
      </div>

      <p className="mt-auto pt-7 text-[11.5px] leading-relaxed text-jade-400/70">
        CSE 350 · high-fidelity prototype. All data is mock and lives in memory — stock toggles and new
        items persist for the length of the demo, and changes made in the shop-owner flow are visible in
        the shopper flow.
      </p>
    </div>
  )
}
