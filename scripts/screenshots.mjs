/**
 * Capture the README screenshots straight from the running prototype.
 *
 *   npm run dev            # in one terminal
 *   npm run screenshots    # in another
 *
 * Requires a local Chrome (set CHROME_PATH to override) and puppeteer-core.
 * Every shot is taken by driving the real UI — clicking the real controls —
 * so the images can never drift from what the app actually does.
 */
import puppeteer from 'puppeteer-core'
import { mkdir } from 'node:fs/promises'

const URL = process.env.APP_URL || 'http://localhost:5180/'
const CHROME = process.env.CHROME_PATH || '/usr/bin/google-chrome'
const OUT = 'docs/screenshots'

const PHONE = { width: 400, height: 860, deviceScaleFactor: 2 }
const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 2 }

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function clickText(page, text, sel = 'button, [role=button], a') {
  const ok = await page.evaluate(
    (text, sel) => {
      const el = [...document.querySelectorAll(sel)].find((e) => e.textContent.includes(text))
      if (!el) return false
      el.click()
      return true
    },
    text,
    sel,
  )
  if (!ok) throw new Error(`could not find control: "${text}"`)
  await wait(650)
}

async function clickSelector(page, selector) {
  await page.waitForSelector(selector, { timeout: 5000 })
  await page.click(selector)
  await wait(650)
}

async function type(page, selector, value) {
  await page.waitForSelector(selector, { timeout: 5000 })
  await page.click(selector)
  await page.type(selector, value, { delay: 18 })
  await wait(500)
}

async function shot(page, name) {
  await page.screenshot({ path: `${OUT}/${name}.png` })
  console.log(`  captured ${name}.png`)
}

const run = async () => {
  await mkdir(OUT, { recursive: true })
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--font-render-hinting=none', '--force-color-profile=srgb'],
  })

  const page = await browser.newPage()
  await page.setViewport(PHONE)

  const load = async () => {
    await page.goto(URL, { waitUntil: 'networkidle0' })
    // The floating "why this screen?" control is demo scaffolding, not part of
    // the product — keep it out of the documentation images.
    await page.addStyleTag({
      content: '[aria-label="Why this screen?"]{display:none !important}',
    })
    // Let the webfonts settle so type never renders in the fallback face.
    await page.evaluateHandle('document.fonts.ready')
    await wait(700)
  }

  console.log('Shopper flow:')
  await load()
  await shot(page, '01-welcome')

  await clickText(page, 'I’m a Shopper')
  await shot(page, '02-search')

  await type(page, 'input[aria-label="Search for an item"]', 'charger')
  await shot(page, '03-search-live')

  await clickText(page, '65W Type-C Fast Charger')
  await shot(page, '04-results')

  await clickSelector(page, '[aria-label="Show map"]')
  // Map pins are labelled, not captioned — their text is just the price.
  await clickSelector(page, '[aria-label="Sylhet Mobile Gallery"]')
  await shot(page, '05-results-map')

  await clickSelector(page, '[aria-label="Show list"]')
  await clickText(page, 'Sylhet Mobile Gallery', '[role=button]')
  await shot(page, '06-shop-detail')

  await clickText(page, 'Report wrong price')
  await clickText(page, 'It was out of stock')
  await shot(page, '07-report-sheet')

  console.log('Shop-owner flow:')
  await load()
  await clickText(page, 'I’m a Shop Owner')
  await shot(page, '08-dashboard')

  await clickText(page, 'Unlock with Premium')
  await shot(page, '09-premium')

  await clickText(page, 'Not now')
  await clickText(page, 'Add item')
  await shot(page, '10-add-item')

  // The scanner auto-resolves after ~1.7s, so grab it mid-scan.
  await page.evaluate(() => {
    const el = [...document.querySelectorAll('button')].find((e) =>
      e.textContent.includes('Scan barcode'),
    )
    el?.click()
  })
  await wait(700)
  await shot(page, '11-barcode-scan')

  console.log('Pitch view:')
  await page.setViewport(DESKTOP)
  await load()
  await clickText(page, 'Shopper · results for a charger')
  await shot(page, '12-pitch-panel')

  await browser.close()
  console.log('\nDone.')
}

run().catch((e) => {
  console.error(e.message)
  process.exit(1)
})
