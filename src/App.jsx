import { useCallback, useRef, useState } from 'react'
import Icon from './components/Icon'
import ValidationPanel from './components/ValidationPanel'
import { Sheet, Toasts } from './components/ui'
import { StoreProvider, useStore } from './lib/store'
import { VALIDATION } from './data/mockData'

import Welcome from './screens/Welcome'
import Search from './screens/Search'
import Results from './screens/Results'
import ShopDetail from './screens/ShopDetail'
import Dashboard from './screens/Dashboard'
import ItemEditor from './screens/ItemEditor'

const SCREENS = {
  welcome: Welcome,
  search: Search,
  results: Results,
  shop: ShopDetail,
  dashboard: Dashboard,
  additem: ItemEditor,
}

/** Pre-built stacks so a grader (or we, mid-pitch) can jump straight to a state. */
const JUMPS = {
  welcome: [{ screen: 'welcome', params: {} }],
  search: [{ screen: 'welcome', params: {} }, { screen: 'search', params: {} }],
  results: [
    { screen: 'welcome', params: {} },
    { screen: 'search', params: {} },
    { screen: 'results', params: { sku: 'charger-65w', query: '65W Type-C Fast Charger' } },
  ],
  shop: [
    { screen: 'welcome', params: {} },
    { screen: 'search', params: {} },
    { screen: 'results', params: { sku: 'charger-65w', query: '65W Type-C Fast Charger' } },
    { screen: 'shop', params: { shopId: 's6', sku: 'charger-65w' } },
  ],
  dashboard: [{ screen: 'welcome', params: {} }, { screen: 'dashboard', params: {} }],
  additem: [
    { screen: 'welcome', params: {} },
    { screen: 'dashboard', params: {} },
    { screen: 'additem', params: {} },
  ],
}

function Prototype() {
  const { toasts } = useStore()
  const keyRef = useRef(1)
  const [stack, setStack] = useState([{ key: 0, screen: 'welcome', params: {} }])
  const [exiting, setExiting] = useState(null)
  const [dir, setDir] = useState('forward')
  const [whyOpen, setWhyOpen] = useState(false)

  const current = stack[stack.length - 1]

  const settle = useCallback(() => setTimeout(() => setExiting(null), 340), [])

  const push = useCallback(
    (screen, params = {}) => {
      setDir('forward')
      setExiting(current)
      setStack((s) => [...s, { key: keyRef.current++, screen, params }])
      settle()
    },
    [current, settle],
  )

  const pop = useCallback(() => {
    if (stack.length <= 1) return
    setDir('back')
    setExiting(current)
    setStack((s) => s.slice(0, -1))
    settle()
  }, [current, stack.length, settle])

  const reset = useCallback(
    (screen, params = {}) => {
      setDir('back')
      setExiting(current)
      setStack([{ key: keyRef.current++, screen, params }])
      settle()
    },
    [current, settle],
  )

  const jump = useCallback(
    (id) => {
      const next = (JUMPS[id] || JUMPS.welcome).map((s) => ({ ...s, key: keyRef.current++ }))
      setDir('forward')
      setExiting(current)
      setStack(next)
      settle()
    },
    [current, settle],
  )

  const nav = { push, pop, reset, jump }

  const frames = []
  if (exiting) {
    frames.push({
      ...exiting,
      anim: dir === 'forward' ? 'anim-push-out' : 'anim-pop-out',
      z: dir === 'forward' ? 10 : 20,
    })
  }
  frames.push({
    ...current,
    anim: exiting ? (dir === 'forward' ? 'anim-push-in' : 'anim-pop-in') : '',
    z: exiting && dir === 'back' ? 10 : 20,
  })

  const v = VALIDATION[current.screen] || VALIDATION.welcome

  return (
    <div
      className="flex h-full w-full items-center justify-center gap-8 overflow-hidden lg:p-6 xl:gap-14"
      style={{
        // Soft, low-chroma backdrop: deep enough to make the device read as a
        // device, calm enough to sit behind for a 3-minute pitch.
        backgroundImage:
          'radial-gradient(120% 90% at 15% 0%, #1C483D 0%, #143029 45%, #0F241F 100%)',
      }}
    >
      {/* ---------------- Device ----------------
          Height is clamped to the viewport so the frame can never be clipped
          on a smaller laptop screen — the bug that showed up in the pitch. */}
      <div className="relative h-full w-full lg:h-[min(844px,calc(100dvh-3rem))] lg:w-[390px] lg:shrink-0">
        <div className="relative flex h-full w-full flex-col overflow-hidden bg-canvas lg:rounded-[42px] lg:border-[9px] lg:border-ink lg:shadow-frame">
          {/* Fake status bar, laptop only — sells the mobile context in a pitch */}
          <div className="band-deep hidden shrink-0 items-center justify-between px-6 pb-1 pt-2.5 text-[12px] font-semibold text-white lg:flex">
            <span className="tnum">9:41</span>
            <span className="flex items-center gap-1.5">
              <span className="flex items-end gap-[2px]">
                {[5, 7, 9, 11].map((h) => (
                  <i key={h} className="w-[3px] rounded-sm bg-white" style={{ height: h }} />
                ))}
              </span>
              <span className="ml-1 flex h-[11px] w-[20px] items-center rounded-[3px] border border-white/70 p-[1.5px]">
                <i className="h-full w-[70%] rounded-[1px] bg-white" />
              </span>
            </span>
          </div>

          {/* Screen stack */}
          <div className="relative min-h-0 flex-1 overflow-hidden">
            <div className="relative h-full w-full">
              {frames.map((f) => {
                const C = SCREENS[f.screen]
                return (
                  <div
                    key={f.key}
                    className={`absolute inset-0 bg-canvas ${f.anim}`}
                    style={{ zIndex: f.z }}
                    aria-hidden={f !== frames[frames.length - 1]}
                  >
                    <C nav={nav} params={f.params} />
                  </div>
                )
              })}

              <Toasts items={toasts} />

              {/* Phone-sized "why this screen" trigger */}
              <button
                onClick={() => setWhyOpen(true)}
                className="absolute bottom-[104px] right-3 z-40 grid h-10 w-10 place-items-center rounded-full bg-ink/85 text-white shadow-lift backdrop-blur transition active:scale-90 lg:hidden"
                aria-label="Why this screen?"
              >
                <Icon name="info" size={19} />
              </button>

              <Sheet
                open={whyOpen}
                onClose={() => setWhyOpen(false)}
                title={`${v.screen} — why it looks like this`}
                subtitle={v.source}
                footer={
                  <button onClick={() => setWhyOpen(false)} className="btn btn-lg btn-primary w-full">
                    Back to the prototype
                  </button>
                }
              >
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[.09em] text-ink-30">
                  The validation question
                </p>
                <p className="mb-4 text-[15px] font-semibold leading-snug">“{v.question}”</p>
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-[.09em] text-ink-30">
                  What we designed in response
                </p>
                <p className="text-[13.5px] leading-relaxed text-ink-70">{v.decision}</p>
              </Sheet>
            </div>
          </div>
        </div>
      </div>

      {/* ---------------- Pitch panel (laptop) ---------------- */}
      <aside className="hidden h-[min(844px,calc(100dvh-3rem))] w-[360px] shrink-0 overflow-y-auto lg:block xl:w-[400px]">
        <ValidationPanel screen={current.screen} current={current.screen} onJump={jump} />
      </aside>
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Prototype />
    </StoreProvider>
  )
}
