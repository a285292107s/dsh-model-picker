/**
 * Reproduce the host's own composer-hiding mechanism against the live GUI and
 * measure what the open parameter panel does.
 *
 * The host's composer chain renders the question card as the elected entry and
 * keeps the default composer bar mounted but hidden
 * (`div[data-chain-overlay-fallback="conversation.composer"] { display: none }`),
 * so this probe flips that exact property on that exact element — the same
 * thing a question card does to the input box — instead of faking a card.
 *
 * Run: playwright-cli -s=dmp-verify --raw run-code --filename=./scripts/_anchor-loss-probe.cjs
 */
async page => {
  const out = {}
  const probe = () => page.evaluate(() => {
    const gear = document.querySelector('.dmp-settings-button')
    const panel = document.querySelector('.dmp-settings')
    const rect = el => el === null ? null : (() => {
      const r = el.getBoundingClientRect()
      return { top: +r.top.toFixed(1), left: +r.left.toFixed(1), w: +r.width.toFixed(1), h: +r.height.toFixed(1) }
    })()
    return {
      gear: rect(gear),
      gearRects: gear === null ? null : gear.getClientRects().length,
      gearConnected: gear?.isConnected ?? null,
      panel: rect(panel),
      panelVisible: panel === null ? null : getComputedStyle(panel).visibility,
      activeIsInPanel: panel !== null && panel.contains(document.activeElement),
      activeTag: document.activeElement?.tagName ?? null,
    }
  })

  // Open the parameter panel on the model in use.
  await page.locator('.dmp-settings-button').first().click()
  await page.waitForTimeout(700)
  out.opened = await probe()

  // Instrument: does a ResizeObserver on the gear fire when its box disappears,
  // and is there any way to notice without a render?
  await page.evaluate(() => {
    const gear = document.querySelector('.dmp-settings-button')
    const w = window
    w.__probe = { roFired: 0, lastRoRect: null }
    w.__probeRo = new ResizeObserver(entries => {
      w.__probe.roFired += 1
      w.__probe.lastRoRect = entries[entries.length - 1].contentRect.toJSON()
    })
    w.__probeRo.observe(gear)
  })

  // The host's exact move: the elected chain entry hides the fallback composer.
  await page.evaluate(() => {
    const fallback = document.querySelector('[data-chain-overlay-fallback="conversation.composer"]')
    if (fallback === null) { window.__probe.missingFallback = true; return }
    fallback.dataset.probeBefore = getComputedStyle(fallback).display
    fallback.style.display = 'none'
  })
  await page.waitForTimeout(400)
  out.afterHide = await probe()
  out.afterHide.observer = await page.evaluate(() => window.__probe)

  // Any scroll (the question card arrival usually scrolls the transcript) makes
  // useAnchoredPosition re-measure from a now-zero anchor rect.
  await page.evaluate(() => window.dispatchEvent(new Event('scroll')))
  await page.waitForTimeout(300)
  out.afterScroll = await probe()

  await page.evaluate(() => {
    const fallback = document.querySelector('[data-chain-overlay-fallback="conversation.composer"]')
    if (fallback !== null) fallback.style.display = ''
    window.__probeRo?.disconnect()
  })
  await page.waitForTimeout(300)
  await page.keyboard.press('Escape')
  await page.waitForTimeout(200)
  return JSON.stringify(out, null, 1)
}
