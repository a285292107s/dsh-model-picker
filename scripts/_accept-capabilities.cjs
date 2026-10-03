/**
 * §5.19 acceptance, run against the live GUI: the facts an ADAPTER published.
 *
 * What this has to prove, and why no unit gate can: the store is fed by Remote
 * namespaces that mount asynchronously and belong to OTHER plugins, so "does
 * `remote.opencodeGoModels` answer for `dsh-opencode-go` in this deployment" is a
 * fact about the running Host, not about this code. Everything else — the
 * precedence, the copy decisions, the guard against endpoint probes — is already
 * asserted by `test-params.mjs`.
 *
 *  - The cache is disabled before the reload. The loader keys client modules by
 *    a `rev` it computes itself, so a browser-cached body can be served under the
 *    URL of a new build; `bundleIsNew` is asserted before any verdict is recorded
 *    (DESIGN §8.7).
 *  - It is READ-ONLY: it opens the model menu and the parameter panel and reads
 *    them. It never selects a model, never toggles a switch, never writes.
 *
 * Run: playwright-cli -s=verify --raw run-code --filename=./scripts/_accept-capabilities.cjs
 * Screenshots land in the CLI daemon's working directory, so start the browser
 * session from this package directory for `./shots/…` to be the repo's own.
 */
async page => {
  const client = await page.context().newCDPSession(page)
  await client.send('Network.setCacheDisabled', { cacheDisabled: true })
  await page.reload({ waitUntil: 'load' })
  await page.waitForSelector('.dmp-root', { timeout: 30000 })
  await page.waitForTimeout(1200)

  // --- 0. the bundle under test is the bundle that shipped -------------------
  const bundleUrl = await page.evaluate(() =>
    performance.getEntriesByType('resource').map(entry => entry.name)
      .find(name => /rabbit-model-picker/i.test(name)) ?? null)
  const bundleText = bundleUrl === null
    ? ''
    : await page.evaluate(async href => await (await fetch(href)).text(), bundleUrl)
  const bundleIsNew = bundleText.includes('opencodeGoModels') && bundleText.includes('dsh-opencode-go')
  if (!bundleIsNew) return { ok: false, step: 'bundle-freshness', bundleUrl, bytes: bundleText.length }

  // --- 1. the row: a built-in-catalog model states all four facts -----------
  // The row to read is the SELECTED one (`aria-checked`), never one matched by
  // name: several providers ship a model called "DeepSeek V4.1 Flash", and only
  // the session's own route is the built-in-catalog one this acceptance is
  // about. Matching by name picked a declared route on the first run — the
  // acceptance would have "passed" while proving nothing.
  await page.click('.dmp-trigger')
  await page.waitForSelector('.dmp-row', { timeout: 20000 })
  // The reads are fire-and-forget by design; the strip fills in when the adapter
  // answers. Waiting on the facts (not on the row) is deliberate: a fact that
  // never arrives is exactly what this script must be able to report.
  await page.waitForFunction(() => {
    const title = document.querySelector('.dmp-row[aria-checked="true"] .dmp-badges')?.getAttribute('title') ?? ''
    return title.includes('上下文窗口')
  }, undefined, { timeout: 30000 }).catch(() => {})
  await page.waitForTimeout(1500)
  const rows = await page.evaluate(() => [...document.querySelectorAll('.dmp-row')].map(row => ({
    name: row.querySelector('.dmp-row-name')?.textContent ?? '',
    facts: row.querySelector('.dmp-badges')?.getAttribute('title') ?? '',
    aria: row.getAttribute('aria-label') ?? '',
    selected: row.getAttribute('aria-checked') === 'true',
  })))
  const row = rows.find(candidate => candidate.selected) ?? null
  const sameName = rows.filter(candidate => candidate.name === row?.name).length
  // Evidence, not decoration: the strip is the surface a screenshot settles, and
  // `shots/` is where the other surfaces of this plugin are recorded.
  await page.screenshot({ path: './shots/accept-capabilities-menu.png' })
  await page.keyboard.press('Escape')
  await page.waitForTimeout(400)

  // --- 2. the panel: the same facts, naming their source, still read-only ---
  // The screenshot has to be taken the moment the card exists: this seat closes
  // its popovers when the seat root stops occupying the page (§5.18), and a
  // click that lands while the composer re-renders can therefore close the card
  // between two reads of it.
  await page.click('.dmp-settings-button')
  await page.waitForSelector('.dmp-settings', { timeout: 20000 })
  await page.waitForTimeout(900)
  await page.screenshot({ path: './shots/accept-capabilities-panel.png' })
  const panel = await page.evaluate(() => {
    const surface = document.querySelector('.dmp-settings')
    if (surface === null) return null
    const field = surface.querySelector('.dmp-settings-input input')
    return {
      notice: surface.querySelector('.dmp-settings-notice')?.textContent ?? null,
      hints: [...surface.querySelectorAll('.dmp-settings-hint')].map(item => item.textContent ?? ''),
      labels: [...surface.querySelectorAll('.dmp-settings-label')].map(item => item.textContent ?? ''),
      switches: [...surface.querySelectorAll('[role="switch"]')].map(item => ({
        label: item.getAttribute('aria-label') ?? '',
        checked: item.getAttribute('aria-checked') ?? '',
        disabled: item.hasAttribute('disabled'),
      })),
      field: field === null ? null : {
        value: field.value,
        placeholder: field.getAttribute('placeholder') ?? '',
        disabled: field.hasAttribute('disabled'),
      },
      target: surface.querySelector('.dmp-settings-target')?.getAttribute('title') ?? null,
    }
  })

  const hints = panel?.hints ?? []
  const switches = panel?.switches ?? []
  const placement = await page.evaluate(() => {
    const surface = document.querySelector('.dmp-settings')
    if (surface === null) return null
    const rect = surface.getBoundingClientRect()
    const style = getComputedStyle(surface)
    return {
      rect: { x: Math.round(rect.x), y: Math.round(rect.y), width: Math.round(rect.width), height: Math.round(rect.height) },
      visibility: style.visibility,
      display: style.display,
      opacity: style.opacity,
    }
  })
  await page.keyboard.press('Escape')

  return {
    ok: true,
    bundleUrl,
    bytes: bundleText.length,
    rowName: row?.name ?? null,
    sameNameRows: sameName,
    row,
    panel,
    placement,
    claims: {
      'row states text input': (row?.facts ?? '').includes('文字输入'),
      'row states image input': (row?.facts ?? '').includes('图片输入'),
      'row states the window': /上下文窗口 1M/.test(row?.facts ?? ''),
      'panel names the adapter catalog as the source': hints.some(hint => hint.includes('适配器内置目录公布')),
      'panel states the published window': hints.some(hint => hint.includes('1M')),
      'both modality switches read as on': switches.length === 2 && switches.every(item => item.checked === 'true'),
      'every switch of the panel is disabled': switches.length > 0 && switches.every(item => item.disabled),
      'the field stays empty with the window as its placeholder': panel?.field?.value === '' && panel?.field?.placeholder === '1M',
      'the view-only reason is still stated': (panel?.notice ?? '').includes('只能查看'),
    },
  }
}
