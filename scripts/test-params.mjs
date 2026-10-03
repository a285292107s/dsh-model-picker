/**
 * Unit gates for the parameter resolution and the row facts — the part of the
 * panel that decides WHICH settings path a route's parameters live at, and the
 * part of a model row that decides what its badges may claim. A wrong index or
 * field name would silently write into another model's declaration; a wrongly
 * derived fact would put a claim on screen that no declaration backs. So these
 * assertions run against synthetic snapshots rather than a browser, and the
 * browser acceptance (`scripts/_accept-anchor-loss.cjs`) covers the live Host half.
 *
 * The modules under test import types only, so they bundle to a
 * dependency-free ESM file that plain node can import. The dictionary is
 * bundled too: the badge copy assertions run against the REAL zh/en strings.
 *
 * Run: node scripts/test-params.mjs
 *
 * @module dsh-rabbit-model-picker/test-params
 */

import { build } from 'esbuild'
import { mkdtempSync, rmSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
let failures = 0

/**
 * Record one assertion.
 * @param label - what is being asserted.
 * @param ok - whether it held.
 * @param detail - evidence printed on failure.
 */
function check(label, ok, detail) {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}${ok ? '' : ` — ${JSON.stringify(detail)}`}`)
  if (!ok) failures += 1
}

/** Compare two values structurally, printing the first difference. */
function equal(label, actual, expected) {
  const left = JSON.stringify(actual)
  const right = JSON.stringify(expected)
  check(label, left === right, { actual, expected })
}

const work = mkdtempSync(join(tmpdir(), 'dmp-params-'))
const outfile = join(work, 'params.mjs')

try {
  await build({
    stdin: {
      contents: [
        "export * from './src/client/params.ts'",
        "export * from './src/client/format.ts'",
        "export * from './src/client/badges.ts'",
        "export * from './src/client/prefs.ts'",
        "export * from './src/client/recent.ts'",
        "export * from './src/client/dictionary.ts'",
        "export * from './src/client/panelCopy.ts'",
      ].join('\n'),
      resolveDir: root,
      sourcefile: 'unit-entry.ts',
      loader: 'ts',
    },
    outfile,
    bundle: true,
    platform: 'neutral',
    format: 'esm',
    target: 'es2022',
    logLevel: 'silent',
  })

  const {
    resolveRoute, parseContext, formatContext, formatWindow, PANEL_MODALITIES,
    BADGE_FACTS, badgeSpecsOf, zh, en, interpolate,
    readProviderFilter, rememberProviderFilter, providerKeyOf, retireLegacyProviderFilter,
    recentGroupsFor, RECENT_ID, readRecent, remember,
    noticeOf, inputHintOf, contextHintOf, contextFieldOf, shownInputOf, showsContextField, capacityAction,
    restoreIsEmpty,
  } = await import(pathToFileURL(outfile).href)

  /** A translator over the real dictionary, the way the shell binds it. */
  const t = (key, params) => interpolate(zh[key] ?? en[key] ?? key, params)
  /** The badge facts of one route: [fact, off, value] triples, copy left aside. */
  const shapeOf = (specs) => specs.map(spec => [spec.fact, spec.off, spec.value])

  // --- capacity parsing -----------------------------------------------------
  equal('capacity: 128K parses', parseContext('128K'), 128000)
  equal('capacity: 1M parses', parseContext('1M'), 1000000)
  equal('capacity: 262144 parses', parseContext('262144'), 262144)
  equal('capacity: text is refused', parseContext('two fifty six'), null)
  equal('capacity: below the floor is refused', parseContext('0'), null)
  equal('capacity: above the ceiling is refused', parseContext('11M'), null)
  equal('capacity: 1000000 renders as 1M', formatContext(1000000), '1M')
  equal('capacity: 262144 renders verbatim', formatContext(262144), '262144')
  equal('panel modalities are text then image', [...PANEL_MODALITIES], ['text', 'image'])

  // --- the row's window figure ---------------------------------------------
  // The badge states a size; the panel field has to survive a round trip. The
  // two formats are asserted apart so neither can be "fixed" into the other.
  equal('window: 1000000 reads as 1M', formatWindow(1000000), '1M')
  equal('window: 1048576 reads as 1M (no written-out binaries)', formatWindow(1048576), '1M')
  equal('window: 128000 reads as 128K', formatWindow(128000), '128K')
  equal('window: 262144 reads as 262K', formatWindow(262144), '262K')
  equal('window: 786432 reads as 786K (never a fraction)', formatWindow(786432), '786K')
  equal('window: 700000 reads as 700K', formatWindow(700000), '700K')
  equal('window: 250000 reads as 250K', formatWindow(250000), '250K')
  equal('window: 65536 reads as 66K', formatWindow(65536), '66K')
  equal('window: 4096 reads as 4K', formatWindow(4096), '4K')
  equal('window: 999 is too small to have a unit', formatWindow(999), '999')
  equal('window: 1000 is the first K', formatWindow(1000), '1K')
  equal('window: a rounding into the next unit is spelled right', formatWindow(999_900), '1M')
  equal('window: a just-under-a-million figure is still K', formatWindow(999_499), '999K')
  // Big declared defaults: the panel clamps at MAX_CONTEXT, but the badge reads
  // the Host's defaultContextWindow unbounded, so the M branch has to stay
  // whole-numbered and unit-correct rather than silently rereading 1e9 as 1M.
  equal('window: a thousand million tokens reads 1000M, not 1M', formatWindow(1_000_000_000), '1000M')
  equal('window: 5M stays 5M', formatWindow(5_000_000), '5M')
  equal('window: the largest safe integer stays a whole number',
    /^\d+M$/.test(formatWindow(Number.MAX_SAFE_INTEGER)), true)
  // An unusable count is reported as absent, never spelled: a badge that says
  // "context: NaNK" is a claim no declaration backs.
  for (const unusable of [0, -1, NaN, Infinity, -Infinity]) {
    equal(`window: ${String(unusable)} is reported as absent`, formatWindow(unusable), '')
  }
  // Every reachable figure is digits plus at most one K/M: no decimal point can
  // reach the capsule, which is the user-visible requirement here.
  const offenders = []
  for (let tokens = 1; tokens <= 2_000_000; tokens += 137) {
    const text = formatWindow(tokens)
    if (!/^\d+[KM]?$/.test(text)) offenders.push([tokens, text])
  }
  equal('window: no figure in range carries a decimal point', offenders, [])

  // --- the remembered provider filter --------------------------------------
  // The narrowing is a preference, so it has to survive the page it was set on —
  // and it has to fail soft: a store that is denied, full or holding junk must
  // read as "unfiltered", never as a filter nobody can clear.
  const fakeStore = (initial = {}) => {
    const data = { ...initial }
    return {
      getItem: key => (key in data ? data[key] : null),
      setItem: (key, value) => { data[key] = String(value) },
      removeItem: key => { delete data[key] },
    }
  }
  const withStore = store => { globalThis.window = store === null ? {} : { localStorage: store } }
  const SESSION = 'session-a'
  const OTHER = 'session-b'
  const KEY = `dsh-model-picker.provider.v1:${SESSION}`
  const LEGACY_KEY = 'dsh-model-picker.provider.v1'

  withStore(fakeStore())
  equal('prefs: nothing remembered reads as unfiltered', readProviderFilter(SESSION), null)
  rememberProviderFilter(SESSION, 'opencode-go')
  equal('prefs: a chosen provider is remembered', globalThis.window.localStorage.getItem(KEY), 'opencode-go')
  equal('prefs: the remembered provider reads back', readProviderFilter(SESSION), 'opencode-go')
  rememberProviderFilter(SESSION, null)
  equal('prefs: "all providers" forgets the choice', globalThis.window.localStorage.getItem(KEY), null)
  equal('prefs: forgetting reads back as unfiltered', readProviderFilter(SESSION), null)

  withStore(fakeStore({ [KEY]: '' }))
  equal('prefs: an empty record reads as unfiltered', readProviderFilter(SESSION), null)
  withStore(fakeStore({ [KEY]: 'commandcode' }))
  equal('prefs: the value stored is the bare id, not an encoded shape', readProviderFilter(SESSION), 'commandcode')

  // The regression this plugin was fixed for: one window's narrowing must not
  // become another's. A global key made every session read the first choice.
  withStore(fakeStore())
  rememberProviderFilter(SESSION, 'opencode-go')
  rememberProviderFilter(OTHER, 'commandcode')
  equal('prefs: a second session starts unfiltered', readProviderFilter(OTHER + '-x'), null)
  equal('prefs: two sessions keep two narrowings', `${readProviderFilter(SESSION)}/${readProviderFilter(OTHER)}`, 'opencode-go/commandcode')
  equal('prefs: the key is the session, not a constant', providerKeyOf(SESSION), KEY)
  check('prefs: a session key differs from the other\'s', providerKeyOf(SESSION) !== providerKeyOf(OTHER))
  // …and the single-key era's entry is dropped on mount rather than orphaned.
  withStore(fakeStore({ [LEGACY_KEY]: 'opencode-go', [`${LEGACY_KEY}:${SESSION}`]: 'commandcode' }))
  retireLegacyProviderFilter()
  equal('prefs: the legacy global key is retired', globalThis.window.localStorage.getItem(LEGACY_KEY), null)
  equal('prefs: retiring the legacy key keeps this session\'s own', readProviderFilter(SESSION), 'commandcode')

  withStore(null)
  equal('prefs: with no storage at all nothing is remembered', readProviderFilter(SESSION), null)
  check('prefs: writing with no storage does not throw', (() => {
    try { rememberProviderFilter(SESSION, 'x'); return true } catch { return false }
  })(), {})
  withStore({ getItem: () => { throw new Error('denied') }, setItem: () => { throw new Error('denied') }, removeItem: () => { throw new Error('denied') } })
  equal('prefs: a denied store reads as unfiltered', readProviderFilter(SESSION), null)
  check('prefs: a denied store does not throw on write', (() => {
    try { rememberProviderFilter(SESSION, 'x'); return true } catch { return false }
  })(), {})
  check('prefs: a denied store does not throw on the legacy cleanup', (() => {
    try { retireLegacyProviderFilter(); return true } catch { return false }
  })(), {})
  delete globalThis.window

  // --- "recently used" as a provider-menu option ------------------------------
  // The list it produces must keep the catalog's own provider headings, so no
  // row repeats its provider — and it must keep EVERY remembered route, not the
  // newest one per provider.
  const catalog = [
    { id: 'deepseek-account', name: 'DeepSeek Account' },
    { id: 'opencode-go', name: 'opencode-go' },
    { id: 'commandcode', name: 'commandcode' },
  ]
  /** One resolved row: the shape `recentGroupsFor` reads. */
  const route = (provider, model) => ({ key: `${provider}/${model}`, provider, model: { id: model, name: model } })
  const labelOf = (providerId, fallback) => (providerId === 'deepseek-account' ? 'DeepSeek 账号' : fallback)
  const idsOf = groups => groups.map(group => `${group.id}:${group.rows.map(row => row.model.id).join('+')}`)
  const labelsOf = groups => groups.map(group => group.label)

  // Most recent first: opencode, then DeepSeek, then opencode again, then commandcode.
  const walk = [route('opencode-go', 'qwen3-max'), route('deepseek-account', 'v4.1'), route('opencode-go', 'glm-5'), route('commandcode', 'kimi-k3')]
  const bucketed = recentGroupsFor(walk, catalog, labelOf)
  equal(
    'recent: routes group by provider and keep all of them, newest provider first',
    idsOf(bucketed),
    ['opencode-go:qwen3-max+glm-5', 'deepseek-account:v4.1', 'commandcode:kimi-k3'],
  )
  equal(
    'recent: each group takes its heading from the provider, localized',
    labelsOf(bucketed),
    ['opencode-go', 'DeepSeek 账号', 'commandcode'],
  )
  equal(
    'recent: provider order is recency, not the catalog order',
    // Reversed input reverses the group order, and a provider keeps the slot
    // where its FIRST row appeared (opencode is opened by glm-5, so qwen3-max
    // joins it rather than moving it down past the account provider). A
    // catalog-ordered implementation would answer `deepseek-account` first.
    idsOf(recentGroupsFor([...walk].reverse(), catalog, labelOf)),
    ['commandcode:kimi-k3', 'opencode-go:glm-5+qwen3-max', 'deepseek-account:v4.1'],
  )
  check(
    'recent: the newest route decides which provider floats up',
    recentGroupsFor(walk, catalog, labelOf)[0].id === 'opencode-go'
      // Catalog order would have put the account provider first — `catalog` lists
      // it first, so this assertion is about ordering and not about luck.
      && catalog[0].id === 'deepseek-account',
  )
  equal('recent: no routes means no groups', recentGroupsFor([], catalog, labelOf), [])
  equal(
    'recent: a route whose provider is absent from the catalog is skipped, not crashed on',
    idsOf(recentGroupsFor([route('gone', 'x'), route('opencode-go', 'qwen3-max')], catalog, labelOf)),
    ['opencode-go:qwen3-max'],
  )
  check('recent: the pseudo id cannot be a catalog provider', !catalog.some(group => group.id === RECENT_ID))

  // The store behind it: most-recent-first, de-duplicated, capped.
  withStore(fakeStore())
  remember('opencode-go', 'qwen3-max', 100)
  remember('deepseek-account', 'v4.1', 200)
  remember('opencode-go', 'glm-5', 300)
  remember('opencode-go', 'qwen3-max', 400)
  equal(
    'recent: the store keeps the newest use first and de-duplicates',
    readRecent().map(entry => `${entry.provider}/${entry.model}`),
    ['opencode-go/qwen3-max', 'opencode-go/glm-5', 'deepseek-account/v4.1'],
  )
  equal(
    'recent: one provider keeps several routes, so the list is not one row per provider',
    idsOf(recentGroupsFor(
      readRecent().map(entry => route(entry.provider, entry.model)),
      catalog,
      labelOf,
    )),
    ['opencode-go:qwen3-max+glm-5', 'deepseek-account:v4.1'],
  )
  delete globalThis.window

  // --- a provider-keyed declaration (llm-pi-ai) -----------------------------
  const piAi = {
    status: 'ready',
    error: null,
    writable: true,
    providers: [
      { provider: 'opencode-go', displayName: 'opencode', settingsNs: 'llm-pi-ai', settingsPath: ['providers', 'opencode-go'] },
    ],
    namespaces: {
      'llm-pi-ai': {
        ns: 'llm-pi-ai',
        revision: 7,
        value: {
          providers: {
            'opencode-go': {
              defaultContextWindow: 1000000,
              defaultInput: ['text', 'image'],
              models: [
                { id: 'first' },
                { id: 'second', contextWindow: 800000, input: ['text'], maxTokens: 384000 },
              ],
            },
          },
        },
        user: {
          providers: {
            'opencode-go': {
              models: [{ id: 'first' }, { id: 'second', contextWindow: 800000, input: ['text'] }],
            },
          },
        },
      },
    },
  }

  const second = resolveRoute(piAi, { provider: 'opencode-go', model: 'second' })
  equal('pi-ai: addresses the matching entry by index', second?.entryPath, ['providers', 'opencode-go', 'models', '1'])
  equal('pi-ai: reads the modality field the entry declares', second?.inputField, 'input')
  equal('pi-ai: reads the declared modalities', second?.input, ['text'])
  equal('pi-ai: reads the declared window', second?.contextWindow, 800000)
  equal('pi-ai: reads the declared output cap', second?.maxTokens, 384000)
  equal('pi-ai: reads the adapter default window', second?.defaultContextWindow, 1000000)
  equal('pi-ai: reads the adapter default modalities', second?.defaultInput, ['text', 'image'])
  equal('pi-ai: marks a route the profile patch declares', second?.declared, true)
  equal('pi-ai: carries the namespace revision', second?.revision, 7)

  const first = resolveRoute(piAi, { provider: 'opencode-go', model: 'first' })
  equal('pi-ai: an undeclared entry still resolves', first?.entryPath, ['providers', 'opencode-go', 'models', '0'])
  equal('pi-ai: an undeclared entry declares no modalities', first?.input, [])
  equal('pi-ai: an undeclared entry declares no window', first?.contextWindow, undefined)
  equal('pi-ai: an undeclared entry is not marked as the patch\'s own', first?.declared, false)

  // --- a root-keyed declaration (llm-deepseek) ------------------------------
  const deepseek = {
    status: 'ready',
    error: null,
    writable: true,
    providers: [{ provider: 'deepseek-official', displayName: 'DeepSeek', settingsNs: 'llm-deepseek', settingsPath: [] }],
    namespaces: {
      'llm-deepseek': {
        ns: 'llm-deepseek',
        revision: 2,
        value: { models: [{ id: 'official-flash', contextWindow: 65536, inputModalities: ['text'] }] },
        user: {},
      },
    },
  }
  const official = resolveRoute(deepseek, { provider: 'deepseek-official', model: 'official-flash' })
  equal('deepseek: addresses the namespace root list', official?.entryPath, ['models', '0'])
  equal('deepseek: picks the field this adapter uses', official?.inputField, 'inputModalities')
  equal('deepseek: reads the declared modalities', official?.input, ['text'])
  equal('deepseek: reads the declared window', official?.contextWindow, 65536)

  // --- the modelOverrides shape (pi-ai, no models list) ---------------------
  const overrides = {
    status: 'ready',
    error: null,
    writable: true,
    providers: [
      { provider: 'staryears', displayName: 'StarYears', settingsNs: 'llm-pi-ai', settingsPath: ['providers', 'staryears'] },
    ],
    namespaces: {
      'llm-pi-ai': {
        ns: 'llm-pi-ai',
        revision: 3,
        value: { providers: { staryears: { modelOverrides: { 'gpt-x': { contextWindow: 123456 } } } } },
      },
    },
  }
  const overridden = resolveRoute(overrides, { provider: 'staryears', model: 'gpt-x' })
  equal('modelOverrides: addressed by model id', overridden?.entryPath, ['providers', 'staryears', 'modelOverrides', 'gpt-x'])
  equal('modelOverrides: reads the window', overridden?.contextWindow, 123456)

  // --- what stays unaddressable --------------------------------------------
  equal('unknown provider: no address', resolveRoute(piAi, { provider: 'nope', model: 'second' }), null)
  equal('unlisted model: no address', resolveRoute(piAi, { provider: 'opencode-go', model: 'third' }), null)
  equal('no selection: no address', resolveRoute(piAi, null), null)
  equal(
    'missing namespace: no address',
    resolveRoute({ ...piAi, namespaces: {} }, { provider: 'opencode-go', model: 'second' }),
    null,
  )
  equal(
    'a path-less, model-less namespace: no address',
    resolveRoute({ ...deepseek, namespaces: { 'llm-deepseek': { ns: 'llm-deepseek', revision: 1, value: {} } } },
      { provider: 'deepseek-official', model: 'official-flash' }),
    null,
  )

  // --- addressing a route whose provider path is nested twice ---------------
  const nested = {
    status: 'ready',
    error: null,
    writable: true,
    providers: [{ provider: 'x', displayName: 'x', settingsNs: 'ns', settingsPath: ['a', 'b'] }],
    namespaces: { ns: { ns: 'ns', revision: 1, value: { a: { b: { models: [{ id: 'm', contextWindow: 4096 }] } } } } },
  }
  equal('nested settings path: addressed in full',
    resolveRoute(nested, { provider: 'x', model: 'm' })?.entryPath, ['a', 'b', 'models', '0'])

  // --- row facts (the badge strip) -----------------------------------------
  // `second` declares input ['text'] and a window; the provider's defaults are
  // ['text','image'] and 1M; `first` declares neither.
  const reasoning = { efforts: [{ id: 'off', name: 'Off' }, { id: 'high', name: 'High' }], defaultEffort: 'high' }
  const factsOf = (snapshot, route, extra = {}) => shapeOf(badgeSpecsOf({
    address: resolveRoute(snapshot, route),
    // An explicit `reasoning: undefined` must mean "no metadata", which is why
    // presence of the key — not its value — picks the fixture.
    reasoning: 'reasoning' in extra ? extra.reasoning : reasoning,
    effort: extra.effort,
    t,
  }))

  equal('facts: a declared list is stated as-is',
    factsOf(piAi, { provider: 'opencode-go', model: 'second' }, { effort: 'high' }),
    [['text', false, ''], ['image', true, ''], ['effort', false, 'High'], ['context', false, '800K']])
  equal('facts: an undeclared entry falls back to the adapter default list',
    factsOf(piAi, { provider: 'opencode-go', model: 'first' }, { effort: 'off' }),
    [['text', false, ''], ['image', false, ''], ['effort', false, 'Off'], ['context', false, '1M']])
  equal('facts: order is text, image, effort, context',
    factsOf(piAi, { provider: 'opencode-go', model: 'second' }).map(spec => spec[0]),
    ['text', 'image', 'effort', 'context'])
  equal('facts: the canonical order is published once', [...BADGE_FACTS],
    ['text', 'image', 'effort', 'context'])
  equal('facts: the strip never repeats a fact',
    new Set(badgeSpecsOf({
      address: resolveRoute(piAi, { provider: 'opencode-go', model: 'first' }),
      reasoning,
      effort: 'high',
      t,
    }).map(spec => spec.fact)).size, 4)
  equal('facts: no effort in force renders the provider default caption',
    factsOf(piAi, { provider: 'opencode-go', model: 'first' }, { effort: undefined })[2],
    ['effort', false, 'Default'])
  equal('facts: no reasoning metadata states an absent level, slashed',
    factsOf(piAi, { provider: 'opencode-go', model: 'second' }, { reasoning: undefined })[2],
    ['effort', true, ''])
  equal('facts: an unaddressable route claims no modality and no capacity',
    factsOf(piAi, { provider: 'nope', model: 'second' }, { effort: 'high' }),
    [['effort', false, 'High']])
  equal('facts: nothing declared and no default → no modality claim at all',
    factsOf(nested, { provider: 'x', model: 'm' }, { effort: 'high' }),
    [['effort', false, 'High'], ['context', false, '4K']])

  // The copy itself is asserted, not just the shape: a badge whose sentence is
  // wrong is worse than a missing badge, because it is a claim.
  const sentences = badgeSpecsOf({
    address: resolveRoute(piAi, { provider: 'opencode-go', model: 'second' }),
    reasoning,
    effort: 'high',
    t,
  }).map(spec => spec.sentence)
  equal('facts: every badge sentence is localized', sentences,
    ['文字输入', '不支持图片输入', '思考强度 High', '上下文窗口 800K'])
  equal('facts: the row name carries them all', t('badge.rowAria', { model: 'M', facts: sentences.join(t('settings.listJoin')) }),
    'M，文字输入、不支持图片输入、思考强度 High、上下文窗口 800K')

  // --- what the parameter panel says in each state --------------------------
  // The panel's copy is a decision per state, not a paragraph: which single line
  // explains an inert control, and which line states where a value comes from.
  // Getting that wrong is invisible in a screenshot (three sentences saying the
  // same thing still look fine) and the busy state — where the user's own click
  // disables the card — had no sentence at all. So the DECISION is asserted here
  // against the real dictionary, and the panel only renders the result.
  const ready = { status: 'ready', error: null, writable: true }
  const copyState = (address, extra = {}) => ({ address, snapshot: ready, busy: false, capacityError: false, ...extra })
  /** The resolved copy line, as the panel would paint it. */
  const line = (copy) => copy === null ? null : t(copy.key, copy.params)
  const notice = (state) => line(noticeOf(state, t))
  const inputHint = (state) => line(inputHintOf(state, t))
  const contextHint = (state) => line(contextHintOf(state, t))

  // An editable route that declares both fields: no notice at all.
  equal('panel copy: an editable declared route needs no notice', notice(copyState(second)), null)
  equal('panel copy: its input hint cites the declared list',
    inputHint(copyState(second)), '已声明：文字')
  equal('panel copy: its capacity hint says declared',
    contextHint(copyState(second)), '已声明；留空并回车 = 恢复适配器默认')

  // An editable route that declares neither: the hints cite the adapter defaults.
  equal('panel copy: an undeclared route needs no notice', notice(copyState(first)), null)
  equal('panel copy: its input hint cites the adapter default list',
    inputHint(copyState(first)), '尚未声明，当前按适配器默认：文字、图片')
  equal('panel copy: its capacity hint names that fallback as a fallback, not as the value in force',
    contextHint(copyState(first)), '尚未声明；适配器声明的兜底值是 1M，实际容量由它内部决定')
  equal('panel copy: its field holds nothing and shows the provider default',
    contextFieldOf(first), { value: '', placeholder: '1M' })
  equal('panel copy: its switches show the adapter default list',
    [...shownInputOf(first)], ['text', 'image'])

  // The unaddressable route: ONE explanation, and nothing below repeats it.
  const unaddressable = copyState(resolveRoute(piAi, { provider: 'nope', model: 'second' }))
  equal('panel copy: an unaddressable route states why, once',
    notice(unaddressable), '这个模型来自适配器内置目录，没有可编辑的声明，只能查看。')
  equal('panel copy: its input hint says nothing at all', inputHint(unaddressable), null)
  equal('panel copy: its capacity section is not rendered at all',
    contextHint(unaddressable), null)
  equal('panel copy: so the field has no place on screen',
    showsContextField(resolveRoute(piAi, { provider: 'nope', model: 'second' })), false)
  equal('panel copy: an addressable route does render the field',
    showsContextField(second), true)

  // The read-only profile: same rule, different reason, and still no repetition.
  const readOnly = copyState(second, { snapshot: { status: 'ready', error: null, writable: false } })
  equal('panel copy: a read-only configuration states why',
    notice(readOnly), '当前配置不接受表单修改，参数面板只能查看。')
  equal('panel copy: its hints stay quiet too', inputHint(readOnly), null)
  equal('panel copy: including the capacity hint when the field is addressable',
    contextHint(readOnly), null)

  // A selection in flight disables every control, and says so: this is the state
  // the panel used to leave unexplained while the user was looking at it.
  equal('panel copy: a selection in flight is explained',
    notice(copyState(second, { busy: true })), '正在应用这次选择，参数暂时不能改…')
  equal('panel copy: busy is explained even while the settings load',
    notice(copyState(null, { busy: true, snapshot: { status: 'idle', error: null, writable: true } })),
    '正在应用这次选择，参数暂时不能改…')

  // The settings service being absent, loading, and failing each have their own
  // line, and a refusal outranks them all.
  equal('panel copy: a missing settings service is explained',
    notice(copyState(second, { snapshot: { status: 'unavailable', error: null, writable: false } })),
    '这个部署没有挂载设置服务，参数面板只能查看（思考强度仍可用）。')
  equal('panel copy: loading is stated',
    notice(copyState(second, { snapshot: { status: 'loading', error: null, writable: true } })),
    '正在读取当前参数…')
  equal('panel copy: a read failure shows the service message',
    notice(copyState(second, { snapshot: { status: 'error', error: 'boom', writable: true } })),
    '读不到当前设置：boom')

  // A declared route whose adapter states a fallback: the hint names it as a
  // fallback, not as the value in force, because the installed catalog may
  // override it and this plugin cannot see the catalog.
  const fallbackOnly = {
    ...piAi,
    namespaces: {
      'llm-pi-ai': {
        ...piAi.namespaces['llm-pi-ai'],
        value: {
          providers: {
            'opencode-go': {
              defaultContextWindow: 1000000,
              defaultInput: ['text', 'image'],
              models: [{ id: 'first' }],
            },
          },
        },
      },
    },
  }
  const fallbackState = copyState(resolveRoute(fallbackOnly, { provider: 'opencode-go', model: 'first' }))
  equal('panel copy: an undeclared window names the fallback as a fallback',
    contextHint(fallbackState), '尚未声明；适配器声明的兜底值是 1M，实际容量由它内部决定')
  equal('panel copy: an undeclared modality list names the adapter default',
    inputHint(fallbackState), '尚未声明，当前按适配器默认：文字、图片')

  // An unreadable capacity names the range it enforces, not just a format. The
  // bounds are the exact integers `parseContext` enforces: the floor is not a
  // round token count, and rounding the ceiling up would overstate it.
  equal('panel copy: an unreadable capacity states the accepted range',
    contextHint(copyState(second, { capacityError: true })),
    '读不出这个数值：请写 128K、1M 或 131072，范围 1024–10485760')
  equal('panel copy: a rejected value outranks every other hint reason',
    contextHint(copyState(unaddressable, { capacityError: true })),
    '读不出这个数值：请写 128K、1M 或 131072，范围 1024–10485760')

  // Every line above is a real dictionary entry, not a raw key leaking through.
  const panelLines = [
    notice(copyState(second, { busy: true })),
    notice(copyState(second, { snapshot: { status: 'unavailable', error: null, writable: false } })),
    notice(unaddressable),
    notice(readOnly),
    inputHint(copyState(second)),
    inputHint(copyState(first)),
    contextHint(copyState(second)),
    contextHint(fallbackState),
    contextHint(copyState(second, { capacityError: true })),
  ]
  const leaked = panelLines.filter(text => text !== null && /^settings\./.test(text))
  equal('panel copy: no line renders a raw dictionary key', leaked, [])

  // Every key the copy table can emit has to exist in BOTH dictionaries. The
  // static selfcheck sees the `key:` literals but cannot tell a typo'd key from a
  // real one; this resolves each key through both dictionaries and demands a hit.
  const everyKey = [
    noticeOf(copyState(null, { busy: true }), t)?.key,
    noticeOf(copyState(second, { snapshot: { status: 'idle', error: null, writable: true } }), t)?.key,
    noticeOf(copyState(second, { snapshot: { status: 'loading', error: null, writable: true } }), t)?.key,
    noticeOf(copyState(second, { snapshot: { status: 'unavailable', error: null, writable: false } }), t)?.key,
    noticeOf(copyState(second, { snapshot: { status: 'error', error: 'x', writable: true } }), t)?.key,
    noticeOf(unaddressable, t)?.key,
    noticeOf(readOnly, t)?.key,
    inputHintOf(copyState(first), t)?.key,
    inputHintOf(copyState(second), t)?.key,
    contextHintOf(copyState(second), t)?.key,
    contextHintOf(fallbackState, t)?.key,
    contextHintOf(copyState(second, { capacityError: true }), t)?.key,
  ].filter(key => key !== undefined)
  const missingInZh = everyKey.filter(key => zh[key] === undefined)
  const missingInEn = everyKey.filter(key => en[key] === undefined)
  equal('panel copy: every emittable key exists in zh', missingInZh, [])
  equal('panel copy: every emittable key exists in en', missingInEn, [])
  equal('panel copy: the busy state is a real entry, not a placeholder',
    typeof zh['settings.busy'] === 'string' && zh['settings.busy'].length > 0, true)

  // --- the RULES, not just today's strings ----------------------------------
  // The assertions above are snapshots: they catch a change to any of these
  // sentences, but nothing stops someone from writing the duplicate explanation
  // back in AND updating the snapshot to match. These assertions are the rules
  // the snapshots are examples of, swept over a grid of states, so the decision
  // cannot be inverted without a red gate.
  const states = []
  for (const address of [second, first, resolveRoute(piAi, { provider: 'nope', model: 'second' }), null]) {
    for (const status of ['ready', 'loading', 'idle', 'unavailable', 'error']) {
      for (const writable of [true, false]) {
        for (const busy of [true, false]) {
          for (const capacityError of [true, false]) {
            states.push({
              address,
              snapshot: { status, error: status === 'error' ? 'x' : null, writable },
              busy,
              capacityError,
            })
          }
        }
      }
    }
  }
  check('panel copy: the state grid is broad enough to be worth sweeping', states.length >= 100, {
    states: states.length,
  })

  // Rule 1: the notice is the ONLY place an unusable state is explained. When it
  // is present, no section repeats it — the one exception is a value the user
  // just typed that could not be read, which is their own immediate problem and
  // outranks the notice.
  const repeated = states.filter((state) => {
    if (noticeOf(state, t) === null || state.capacityError) return false
    return inputHintOf(state, t) !== null || contextHintOf(state, t) !== null
  })
  equal('panel copy rule: a state with a notice emits no section hint', repeated.length, 0)
  const rejectedOutranks = states.filter(state =>
    state.capacityError && contextHintOf(state, t)?.key !== 'settings.context.invalid')
  equal('panel copy rule: a rejected value is always the capacity hint', rejectedOutranks.length, 0)

  // Rule 2: busy is always explained, whatever else is going on — it is the
  // state the user caused themselves, and it had no sentence before.
  const unexplainedBusy = states.filter(state => state.busy && noticeOf(state, t) === null)
  equal('panel copy rule: every busy state states why', unexplainedBusy.length, 0)

  // Rule 3: no two rendered lines of one state are the same SENTENCE. Compared
  // as rendered text, not as keys: two distinct keys could still resolve to the
  // same words, and that is the duplication this rule is named after.
  const duplicated = states.filter((state) => {
    const lines = [
      line(noticeOf(state, t)),
      line(inputHintOf(state, t)),
      line(contextHintOf(state, t)),
    ].filter(text => text !== null)
    return new Set(lines).size !== lines.length
  })
  equal('panel copy rule: one state never says the same thing twice', duplicated.length, 0)

  // Rule 4: when nothing outranks it, the capacity hint agrees with the field —
  // "declared" never appears over an empty box, and an undeclared window is never
  // called declared. A notice clears the hint entirely (rule 1), and a rejected
  // value replaces it (the rule above), so both of those are checked first.
  const mismatched = states.filter((state) => {
    if (state.address === null) return false
    if (state.capacityError) return false
    if (noticeOf(state, t) !== null) return contextHintOf(state, t) !== null
    const declared = state.address.contextWindow !== undefined
    return declared
      ? contextHintOf(state, t)?.key !== 'settings.context.declared'
      : contextHintOf(state, t)?.key === 'settings.context.declared'
  })
  equal('panel copy rule: the capacity hint always matches the field', mismatched.length, 0)

  // Rule 5: the input hint, when it says "declared", lists exactly what the two
  // switches show as on — a hint that names a modality the switches do not offer
  // is the kind of untruth no screenshot catches.
  const wrongSwitchReport = states.filter((state) => {
    const line = inputHintOf(state, t)
    if (line === null || line.key !== 'settings.input.declared') return false
    const shown = shownInputOf(state.address)
      .map(item => (item === 'text' ? t('settings.input.text') : item === 'image' ? t('settings.input.image') : item))
      .join(t('settings.listJoin'))
    return line.params.list !== shown
  })
  equal('panel copy rule: a "declared" input hint matches what the switches show',
    wrongSwitchReport.length, 0)

  // --- the one disabled control with no notice -------------------------------
  // "恢复默认" is disabled when the route declares nothing. That state has no
  // notice, so the reason rides on the section hint instead of the button's
  // `title` (which a disabled button cannot be focused to reveal).
  equal('panel copy: an empty declaration states why nothing can be restored',
    restoreIsEmpty(copyState(first)), true)
  equal('panel copy: a declared route has something to restore',
    restoreIsEmpty(copyState(second)), false)
  equal('panel copy: an unaddressable route explains itself through the notice instead',
    restoreIsEmpty(unaddressable), false)
  equal('panel copy: a busy panel does not also claim an empty declaration',
    restoreIsEmpty(copyState(first, { busy: true })), false)
  equal('panel copy: a read-only panel explains itself through the notice instead',
    restoreIsEmpty(copyState(first, { snapshot: { status: 'ready', error: null, writable: false } })), false)
  // The sentence itself is real copy in both dictionaries.
  equal('panel copy: the restore explanation is a real entry',
    typeof zh['settings.resetNothing'] === 'string' && typeof en['settings.resetNothing'] === 'string', true)
  // Swept: whenever the button is disabled for THIS reason, the panel says so.
  const silentRestore = states.filter(state =>
    restoreIsEmpty(state) && inputHintOf(state, t) === null)
  equal('panel copy rule: an empty declaration is never a silent dead button',
    silentRestore.length, 0)

  // --- committing the capacity field ----------------------------------------
  // The decision is pure (`capacityAction`), and two of its branches exist only
  // because an adversarial review found them broken in the component: an
  // untouched field that wrote anyway, and a rejected value whose warning a mere
  // blur dismissed. Both are asserted here so they cannot come back.
  equal('capacity commit: an untouched field writes nothing',
    capacityAction(null, '1M', 1_000_000, parseContext), { kind: 'skip' })
  equal('capacity commit: a draft equal to the declared value writes nothing',
    capacityAction('1M', '1M', 1_000_000, parseContext), { kind: 'skip' })
  equal('capacity commit: whitespace around the declared value only normalizes',
    capacityAction('  1M  ', '1M', 1_000_000, parseContext), { kind: 'normalize', text: '1M' })
  equal('capacity commit: a new value is declared',
    capacityAction('800K', '1M', 1_000_000, parseContext), { kind: 'set', value: 800_000 })
  equal('capacity commit: another spelling of the declared value only normalizes',
    capacityAction('1m', '1M', 1_000_000, parseContext), { kind: 'normalize', text: '1M' })
  equal('capacity commit: the same count in K normalizes too',
    capacityAction('1000K', '1M', 1_000_000, parseContext), { kind: 'normalize', text: '1M' })
  equal('capacity commit: empty on a declared route un-declares',
    capacityAction('', '1M', 1_000_000, parseContext), { kind: 'unset' })
  equal('capacity commit: empty on an undeclared route writes nothing',
    capacityAction('', '', undefined, parseContext), { kind: 'skip' })
  // Sticky, by construction: the same unreadable text always reports `reject`, so
  // the warning cannot be cleared by looking away.
  for (const bad of ['abc', 'two fifty six', '0', '11M', '-1']) {
    equal(`capacity commit: ${JSON.stringify(bad)} is rejected and stays rejected`,
      capacityAction(bad, '1M', 1_000_000, parseContext), { kind: 'reject' })
  }

  // The copy that reaches a user must not name internals they cannot act on.
  const jargon = panelLines.filter(text => text !== null && /Host|适配器内置目录的模型|走会话选择/.test(text))
  equal('panel copy: no line talks about internals instead of the user\'s options', jargon, [])
} finally {
  rmSync(work, { recursive: true, force: true })
}

console.log(failures === 0 ? 'params unit: all good' : `params unit: ${failures} failure(s)`)
process.exitCode = failures > 0 ? 1 : 0
