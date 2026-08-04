/**
 * A single hand-drawn icon set (24px grid, 1.75 stroke, round caps) so the
 * iconography reads as one family rather than borrowed from three libraries.
 */
const P = {
  search: 'M11 4a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM20 20l-4-4',
  x: 'M6 6l12 12M18 6L6 18',
  back: 'M15 5l-7 7 7 7',
  next: 'M9 5l7 7-7 7',
  down: 'M6 9l6 6 6-6',
  up: 'M6 15l6-6 6 6',
  pin: 'M12 21s7-5.6 7-11a7 7 0 1 0-14 0c0 5.4 7 11 7 11Z M12 10.5v.01',
  nav: 'M21 3 3.5 10.5l7.6 2.9 2.9 7.6L21 3Z',
  clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Z M12 7.5V12l3 2',
  check: 'M5 12.5 10 17l9-10',
  plus: 'M12 5v14M5 12h14',
  barcode: 'M4 6v12M7.5 6v12M11 6v8M14.5 6v12M18 6v8M20.5 6v12',
  upload: 'M12 16V4m0 0L8 8m4-4 4 4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2',
  sort: 'M4 7h16M6 12h12M9 17h6',
  map: 'M9 4 3 6.5v13L9 17l6 2.5 6-2.5v-13L15 7 9 4Zm0 0v13m6-10v12.5',
  list: 'M4 6h16M4 12h16M4 18h16',
  star: 'm12 3.6 2.5 5.2 5.6.8-4 4 .9 5.7-5-2.7-5 2.7.9-5.7-4-4 5.6-.8L12 3.6Z',
  phone: 'M6.5 3.5h4l1.5 4-2.2 1.6a12 12 0 0 0 5.1 5.1L16.5 12l4 1.5v4a2 2 0 0 1-2.2 2A16.5 16.5 0 0 1 4.5 5.7a2 2 0 0 1 2-2.2Z',
  alert: 'M12 4 2.8 20h18.4L12 4Zm0 6v4m0 3v.01',
  flag: 'M5 21V4m0 0h11l-2 3.5L16 11H5',
  sparkle: 'm12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9L12 3Z',
  store: 'M4 9.5 5.5 4h13L20 9.5M4 9.5V19a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V9.5M4 9.5a3 3 0 0 0 5.3 1.9M20 9.5a3 3 0 0 1-5.3 1.9m-5.4 0a3 3 0 0 0 5.4 0',
  user: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4.5 20a7.5 7.5 0 0 1 15 0',
  trash: 'M4 7h16M9 7V4.5h6V7m-8 0 .8 12.2a1.5 1.5 0 0 0 1.5 1.3h5.4a1.5 1.5 0 0 0 1.5-1.3L17 7',
  camera: 'M4 8.5h3l1.5-2.5h7L17 8.5h3a1 1 0 0 1 1 1V19a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5a1 1 0 0 1 1-1Zm8 3a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Z',
  bolt: 'M13 3 5 13.5h6L10.5 21 19 10.5h-6L13 3Z',
  pill: 'M8.5 4.5a5 5 0 0 1 7 7l-4 4a5 5 0 0 1-7-7l4-4Zm-1.7 8.7 7-7',
  plug: 'M9 3v5m6-5v5M6.5 8h11v3.5a5.5 5.5 0 0 1-11 0V8ZM12 17v4',
  wrench: 'M15.5 3.5a5.5 5.5 0 0 0-5 8.2L3.8 18.4a1.7 1.7 0 0 0 2.4 2.4l6.7-6.7a5.5 5.5 0 0 0 6.9-7.3l-3 3-2.6-.6-.6-2.6 2.9-2.9a5.6 5.6 0 0 0-1-.2Z',
  mobile: 'M7.5 2.5h9a1.5 1.5 0 0 1 1.5 1.5v16a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 20V4a1.5 1.5 0 0 1 1.5-1.5Zm3 16.5h3',
  eye: 'M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Zm9.5 2.8a2.8 2.8 0 1 0 0-5.6 2.8 2.8 0 0 0 0 5.6Z',
  trend: 'M3 17l5.5-5.5 3.5 3.5L21 6m0 0h-5m5 0v5',
  shield: 'M12 3 5 6v5.5c0 4.3 3 8.1 7 9.5 4-1.4 7-5.2 7-9.5V6l-7-3Zm-2.5 8.8 2 2 3.5-4',
  info: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18Zm0 4v.01M12 11v6',
  refresh: 'M20 12a8 8 0 1 1-2.6-5.9M20 4v4h-4',
  arrow: 'M5 19 19 5m0 0h-9m9 0v9',
  filter: 'M4 6h16l-6.5 7.5V20l-3-2v-4.5L4 6Z',
  box: 'M12 3 4 7v10l8 4 8-4V7l-8-4Zm0 0v18M4 7l8 4 8-4',
  bell: 'M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5h-15S6 13 6 9Zm4 8.5a2 2 0 0 0 4 0',
  spinner: 'M12 3a9 9 0 0 1 9 9',
}

export default function Icon({ name, size = 20, className = '', strokeWidth = 1.75, fill = 'none' }) {
  const d = P[name]
  if (!d) return null
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill={fill}
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={`shrink-0 ${className}`}
      aria-hidden="true"
    >
      <path d={d} />
    </svg>
  )
}

export const CATEGORY_ICON = {
  Pharmacy: 'pill',
  Electronics: 'plug',
  'Mobile Accessories': 'mobile',
  Hardware: 'wrench',
}

/**
 * Category wayfinding colours. Used ONLY to identify a vertical — never to
 * signal status, which is always jade (good) / marigold (paid) / clay (bad).
 * Four muted tints so a shopper can tell a pharmacy row from a hardware row
 * at a glance without reading it.
 */
export const CATEGORY_TINT = {
  Pharmacy: 'bg-cat-pharmacy-bg text-cat-pharmacy',
  Electronics: 'bg-cat-electronics-bg text-cat-electronics',
  'Mobile Accessories': 'bg-cat-mobile-bg text-cat-mobile',
  Hardware: 'bg-cat-hardware-bg text-cat-hardware',
}
