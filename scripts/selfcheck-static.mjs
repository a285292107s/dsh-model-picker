/**
 * Static gates for the parts of "would a reviewer call this wrong?" that a
 * machine can decide without taste. No build, no server, no browser.
 *
 *   1. colors: the sheet may not hardcode any color — only host `--dsw-*`
 *      semantic tokens (the whole surface has to follow the host skin);
 *   2. no dashed/dotted borders, and `border-radius` only `0` / `50%` / `var()`;
 *   3. the two composer narrow-row display variables are consumed, and the
 *      `:focus-visible`, `prefers-reduced-motion` and narrow-width branches exist;
 *   4. dead classes both ways: every `dmp-*` rule is used by the TSX, and every
 *      `dmp-*` class in the TSX has a rule;
 *   5. literal/template ARIA id references resolve to a declared id (a dangling
 *      `aria-controls` is a silent accessibility failure);
 *   6. the shadowing contract still holds: seat name, `priority: -10`, the
 *      service inject list, and the client manifest that makes the bundle loadable;
 *   7. the row badge contract: the model row states facts and offers no control,
 *      and the facts come from one place;
 *   8. the parameter panel's Host contract (provider directory join, `settings/
 *      mutate`, optional settings faces);
 *   9. copy: every `t(...)` key is defined, every dictionary entry is used, and
 *      zh/en define the same key set;
 *  10. the badge capsule stays COMPACT (the width budget was fought over twice:
 *      first for icons drawn too narrow, then for capsules that left the model
 *      name ~two characters) and the icon family draws one on-screen weight
 *      across its two viewBox grids;
 *  11. the provider narrowing is remembered PER SESSION, re-read on the session
 *      boundary, and the chip inherits the session model's own provider;
 *  12. the component acts on every verdict the pure layer hands it;
 *  12b. the parameter panel's focus: where opening it lands, and the order `Tab`
 *      walks the controls in (which must be the order they are rendered in).
 *
 * Run: node scripts/selfcheck-static.mjs
 *
 * @module dsh-model-picker/selfcheck-static
 */

import { readFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
let failures = 0

/**
 * Record one check.
 * @param label - what is being asserted.
 * @param ok - whether it held.
 * @param detail - evidence printed on failure.
 */
function check(label, ok, detail) {
  console.log(`  ${ok ? 'ok  ' : 'FAIL'} ${label}${ok ? '' : ` — ${JSON.stringify(detail)}`}`)
  if (!ok) failures += 1
}

/** Read one project file. */
function read(relative) {
  return readFileSync(resolve(root, relative), 'utf8')
}

/** Remove block and line comments so prose never satisfies a check. */
function stripComments(text) {
  return text.replace(/\/\*[\s\S]*?\*\//g, '').replace(/(^|[^:])\/\/.*$/gm, '$1')
}

const CLASS_NAME = /dmp-[a-z0-9]+(?:-[a-z0-9]+)*/g

const stylesSource = read('src/client/styles.ts')
const stylesCode = stripComments(stylesSource)
const tsxFiles = [
  'src/client/Picker.tsx',
  'src/client/BadgeIcons.tsx',
  'src/client/ProviderMenu.tsx',
  'src/client/SettingsMenu.tsx',
]
// The non-TSX modules are scanned too, for the copy keys they ask for and the
// row contract they implement; only the TSX half can carry a `dmp-*` class.
const contractFiles = [
  ...tsxFiles,
  'src/client/badges.ts',
  'src/client/effort.ts',
  'src/client/panelCopy.ts',
]
const tsxCode = stripComments(tsxFiles.map(read).join('\n'))
const contractCode = stripComments(contractFiles.map(read).join('\n'))
// The TSX is also read RAW (comments intact) for the inline-style and
// component-consumption assertions below: `stripComments` would happily delete
// the very line a mutation lives on if it sat next to a trailing comment, and
// those two checks exist precisely to see what the TSX writes.
const tsxSource = tsxFiles.map(read).join('\n')

// --- 1. colors -------------------------------------------------------------
const hardcoded = [...stylesCode.matchAll(/#[0-9a-fA-F]{3,8}\b|\b(?:rgba?|hsla?)\(/g)].map(m => m[0])
check('colors: no hardcoded color values in the sheet', hardcoded.length === 0, { hardcoded })
check(
  'colors: the sheet uses host --dsw-* semantic tokens',
  (stylesCode.match(/--dsw-/g) ?? []).length >= 10,
)

// --- 2. borders and radii --------------------------------------------------
check('borders: no dashed/dotted', !/dashed|dotted/.test(stylesCode))
const badRadius = [...stylesCode.matchAll(/border-radius:\s*([^;]+);/g)]
  .map(m => m[1].trim())
  .filter(value => !(value === '0' || value === '0px' || value === '50%' || value.startsWith('var(')))
check('border-radius: only 0 / 50% / var(...)', badRadius.length === 0, { badRadius })

// --- 2b. nothing may dim text behind the colour's back ----------------------
// `scripts/check-contrast.mjs` proves each style's own ink clears AA, but it
// measures the TOKEN: `opacity: 0.55` on the same rule renders the same token at
// 2.28:1 and leaves that gate green. Any property that fades or recolours the
// painted result has to be caught here instead, where every value is literal.
// (An ancestor's opacity has the same effect; the sheet sets none anywhere.)
const dimming = [...stylesCode.matchAll(/(?:^|[{;])\s*(opacity|filter|text-shadow|mix-blend-mode)\s*:\s*([^;}]+)/g)]
  .map(m => `${m[1]}: ${m[2].trim()}`)
check('contrast: no rule fades or blends its own text', dimming.length === 0, { dimming })

// The same prohibition has to cover INLINE styles, because the sheet is not the
// only place a paint can be changed: `style={{ opacity: 0.5 }}` on a text node
// renders 2.28:1 while every gate stays green (the sheet scan never sees it, and
// the contrast gate measures tokens, not pixels). Found by adversarial review.
const inlineStyles = [...tsxCode.matchAll(/style=\{\{([^}]*)\}\}/g)].map(m => m[1].trim())
const dimmingInline = inlineStyles.filter(body =>
  /(opacity|filter|textShadow|mixBlendMode|color|background)\s*:/.test(body))
check('contrast: no inline style on a TSX element dims or recolors text',
  dimmingInline.length === 0, { dimmingInline })

// And the inline styles that DO exist have to be the measured-placement object:
// anything else is a paint change nobody is auditing. Listing them by name keeps
// a new one from arriving unexamined.
const ALLOWED_INLINE = new Set(['visibility: \'hidden\', left: 0, top: 0'])
const unexplainedInline = inlineStyles.filter(body => !ALLOWED_INLINE.has(body))
check('contrast: every inline style is the placement object, and nothing else',
  unexplainedInline.length === 0, { unexplainedInline })

// Copy cannot be taken away from sighted users either. `role="img"` (or
// `aria-hidden`) on a node that renders a `t(...)` string removes the words from
// view while every other gate stays green: the dead-class check only asks whether
// a class appears SOMEWHERE in the TSX, and no gate otherwise owns the
// visual-vs-AT contract. Two things are hidden on purpose and named here rather
// than exempted by pattern: the badge FACE (`dmp-badges`), whose facts are
// restated in the row's `aria-label`, and the failure dot, which carries no text.
const HIDDEN_COPY_ALLOWED = new Set(['dmp-badges', 'dmp-provider-failed-dot'])
const hiddenCopy = []
for (const element of tsxSource.matchAll(/<(?:span|div|p|li|button)\b[^>]*>/g)) {
  const tag = element[0]
  if (!/role="img"|aria-hidden="true"/.test(tag)) continue
  const names = (/className=(?:"([^"]*)"|\{`([^`]*)`\})/.exec(tag)?.slice(1).find(Boolean) ?? '')
    .split(/\s+/).filter(Boolean)
  if (names.length === 0 || names.every(name => HIDDEN_COPY_ALLOWED.has(name))) continue
  hiddenCopy.push({ tag: tag.replace(/\s+/g, ' ').slice(0, 130), classes: names })
}
check('a11y: no dmp-* element hides its own copy from sighted users',
  hiddenCopy.length === 0, { hiddenCopy })

// --- 3. required branches and the composer contract ------------------------
check(
  'composer: consumes --dsh-composer-model-text-display',
  stylesCode.includes('--dsh-composer-model-text-display'),
)
check(
  'composer: consumes --dsh-composer-model-icon-display',
  stylesCode.includes('--dsh-composer-model-icon-display'),
)
check('a11y: :focus-visible branch exists', stylesCode.includes(':focus-visible'))
check('motion: prefers-reduced-motion branch exists', stylesCode.includes('prefers-reduced-motion'))
check('narrow: @media (max-width) branch exists', /@media[^{]*max-width\s*:/.test(stylesCode))

// --- 4. dead classes, both directions --------------------------------------
const cssClasses = new Set([...stylesCode.matchAll(new RegExp(`\\.(${CLASS_NAME.source})`, 'g'))].map(m => m[1]))
const tsxClasses = new Set([...tsxCode.matchAll(new RegExp(`\\b(${CLASS_NAME.source})`, 'g'))].map(m => m[1]))
const deadInCss = [...cssClasses].filter(name => !tsxClasses.has(name)).sort()
const unstyledInTsx = [...tsxClasses].filter(name => !cssClasses.has(name)).sort()
check('classes: no dmp-* rule is unused', deadInCss.length === 0, { deadInCss })
check('classes: every dmp-* class in the TSX has a rule', unstyledInTsx.length === 0, { unstyledInTsx })

// --- 5. ARIA id references -------------------------------------------------
const declaredIds = [...tsxCode.matchAll(/\bid=\{`([^`]*)`\}/g)].map(m => m[1])
const referencedIds = [...tsxCode.matchAll(/aria-(?:controls|activedescendant|labelledby|describedby)=[^>]*?`([^`]*)`/g)]
  .map(m => m[1])
const shape = value => value.replace(/\$\{[^}]*\}/g, '*')
const declaredShapes = new Set(declaredIds.map(shape))
const dangling = [...new Set(referencedIds.map(shape))].filter(shapeOf => !declaredShapes.has(shapeOf)).sort()
check('a11y: every templated aria id reference has a declared id', dangling.length === 0, { dangling, declaredIds })

// --- 6. shadowing contract -------------------------------------------------
const entry = stripComments(read('src/client/index.ts'))
check(
  'seat: registers conversation.input.model',
  entry.includes("name: 'conversation.input.model'"),
)
check('seat: registers at priority -10 (shadows the shipped seat at 0)', /priority:\s*-10\b/.test(entry))
check(
  'seat: claims the target through slots.inject',
  entry.includes("slots.inject('conversation.input.model'"),
)
// `remote` / `remote.session` are required because the shared resolver reads
// them against the CALLER's fiber (caller-context tracking); omitting them makes
// the seat's inject face throw and the entry abdicate to the shipped seat.
for (const service of ['slots', 'sessions', 'modelDirectories', 'remote', 'remote.session']) {
  check(`inject: requires the "${service}" service`, entry.includes(`'${service}'`))
}

// --- 7. the parameter panel's Host contract ---------------------------------
const params = stripComments(read('src/client/params.ts'))
check(
  'params: reads the provider directory (settingsNs/settingsPath come from it)',
  params.includes('listConfigurableProviders'),
)
check('params: writes through settings/mutate', params.includes('settings.mutate('))
check('params: understands settings/conflict', params.includes('settings/conflict'))
check(
  'params: addresses the user layer by the same path as the effective value',
  params.includes('getPath(view.user, entryPath)'),
)
// The settings faces are read with `ctx.get(...)`, never listed in the required
// inject array: a deployment that mounts no settings controller must still get
// the picker (its panel reports the Host settings as unavailable), whereas a
// missing injectable would make the seat abdicate to the shipped one.
check(
  'params: the settings faces are optional, read via ctx.get',
  entry.includes("scope.get('remote.settings')") && entry.includes("scope.get('remote.llm')"),
)
check(
  'params: the seat inject list stays unchanged (the settings faces stay optional)',
  entry.includes("export const inject = ['slots', 'sessions', 'modelDirectories', 'remote', 'remote.session'] as const")
    && entry.includes("ctx.inject(['slots', 'sessions', 'modelDirectories', 'remote', 'remote.session']"),
)
check(
  'panel: renders the declaration it writes (namespace + path)',
  read('src/client/SettingsMenu.tsx').includes('settings.target'),
)

// --- 8. copy: every key used exists, every key defined is used --------------
// A stale `t('settings.openEdited')` after a rename renders the raw key, and a
// leftover dictionary entry is dead copy; neither is visible in a screenshot.
const dictionary = read('src/client/dictionary.ts')
const dictionaryKeys = new Set([...dictionary.matchAll(/^ {2}'([^']+)':/gm)].map(m => m[1]))
const zhKeys = new Set([...dictionary.slice(0, dictionary.indexOf('/** English dictionary')).matchAll(/^ {2}'([^']+)':/gm)].map(m => m[1]))
const enKeys = new Set([...dictionary.slice(dictionary.indexOf('/** English dictionary')).matchAll(/^ {2}'([^']+)':/gm)].map(m => m[1]))

/**
 * Every string literal passed to a `t(...)` call, following nested ternaries.
 * Literals inside a NESTED call are skipped: `join('.')` in a parameter is not a
 * copy key, and a separator would otherwise look like a missing dictionary entry.
 *
 * A `key:` property is collected too. `panelCopy.ts` returns copy as data
 * (`{ key: 'settings.busy' }`) so the per-state DECISION can be unit-tested, and
 * a table like that names its dictionary entries without calling `t` itself; the
 * `settings.` prefix is what keeps the two spellings apart from an unrelated
 * object field.
 * @param code - comment-stripped source.
 * @returns the keys the surfaces ask for.
 */
function usedTranslateKeys(code) {
  const keys = new Set()
  for (const match of code.matchAll(/\bkey:\s*'((?:settings|badge|provider|trigger|menu|search|group|effort|status|error|action|warning|empty|panel)\.[A-Za-z0-9.]+)'/g)) {
    keys.add(match[1])
  }
  for (const match of code.matchAll(/(?<![\w.])t\(/g)) {
    let depth = 0
    let index = match.index + match[0].length - 1
    const start = index
    for (; index < code.length; index += 1) {
      const character = code[index]
      if (character === '(') depth += 1
      else if (character === ')') {
        depth -= 1
        if (depth === 0) break
      }
    }
    let level = 0
    let direct = ''
    for (const character of code.slice(start + 1, index)) {
      if (character === '(') level += 1
      else if (character === ')') level -= 1
      if (level === 0) direct += character
    }
    for (const literal of direct.matchAll(/'([^']+)'/g)) keys.add(literal[1])
  }
  return keys
}

const usedKeys = usedTranslateKeys(contractCode)
const missingCopy = [...usedKeys].filter(key => !dictionaryKeys.has(key)).sort()
const deadCopy = [...dictionaryKeys].filter(key => !usedKeys.has(key)).sort()
check('copy: every t(...) key is defined', missingCopy.length === 0, { missingCopy })
check('copy: no dictionary entry is unused', deadCopy.length === 0, { deadCopy })
check(
  'copy: zh and en define the same keys',
  zhKeys.size === enKeys.size && [...zhKeys].every(key => enKeys.has(key)),
  { zhOnly: [...zhKeys].filter(key => !enKeys.has(key)), enOnly: [...enKeys].filter(key => !zhKeys.has(key)) },
)
check('copy: a literal join separator exists for modality lists', dictionaryKeys.has('settings.listJoin'))

// --- 9. the row badge contract ----------------------------------------------
// The row used to carry an interactive effort pill; effort is edited in the
// parameter panel now, and a row only STATES facts. These three assertions are
// what keeps that decision from silently coming back:
//   1. no effort control (or its class) is left in the row;
//   2. the strip is the read-only Tag primitive — a span, never a button;
//   3. every fact comes from `badgeSpecsOf`, so the badge copy has one owner.
const picker = stripComments(read('src/client/Picker.tsx'))
check(
  'badges: the model row renders no effort control',
  !/\bEffortMenu\b/.test(contractCode) && !/dmp-pill/.test(contractCode + stylesCode),
  { effortMenu: /\bEffortMenu\b/.test(contractCode), pillClass: /dmp-pill/.test(contractCode + stylesCode) },
)
check(
  'badges: the fact strip is built from the read-only Tag primitive',
  picker.includes('<Tag') && /import[\s\S]*?\bTag\b[\s\S]*?from '@deepseek-ai\/dsh-client-ui-primitives'/.test(picker),
)
check(
  'badges: every row fact resolves through badgeSpecsOf',
  picker.includes('badgeSpecsOf(') && read('src/client/badges.ts').includes('export function badgeSpecsOf'),
)

// --- 10. the badge capsule stays compact, and the family draws one weight ----
// Width is the scarce resource in a 320px card: the row must show a model name
// AND four fact capsules. These two assertions encode the budget that two
// rounds of feedback settled, so a later edit cannot quietly re-inflate the
// strip (or shrink the icon back into the sliver that started this).
const capsule = (selector, property) => {
  const block = new RegExp(`\\${selector}\\s*\\{([^}]*)\\}`).exec(stylesCode)
  return block === null ? null : new RegExp(`${property}\\s*:\\s*([^;]+);`).exec(block[1])?.[1].trim() ?? null
}
const cellWidth = capsule('.dmp-badge-fact', 'width')
const badgePadding = capsule('.dmp-badges .dmp-badge', 'padding')
const iconSize = /size = (\d+)/.exec(stripComments(read('src/client/BadgeIcons.tsx')))?.[1]
const cellPx = cellWidth === null ? NaN : Number.parseFloat(cellWidth)
const padPx = badgePadding === null ? NaN : Number.parseFloat(badgePadding.replace(/^0\s+/, ''))
check(
  'badges: the icon cell is no wider than the glyph it holds',
  Number.isFinite(cellPx) && Number.isFinite(Number(iconSize)) && cellPx <= Number(iconSize),
  { cellWidth, iconSize },
)
check(
  'badges: the capsule padding stays inside the compact budget',
  Number.isFinite(padPx) && padPx <= 5,
  { badgePadding },
)

// The glyphs live on two different grids (16 units for the three drawn here, 24
// for the host's brain), so the stroke width is per-grid and only comparable
// after the render scale. Reading both constants and checking their on-screen
// result is the only way this stays true: a brain ships thinner than its
// neighbours exactly when someone edits one constant and forgets the other.
const icons = stripComments(read('src/client/BadgeIcons.tsx'))
const gridStroke = /BADGE_STROKE\s*=\s*([\d.]+)/.exec(icons)
const brainStroke = /BRAIN_STROKE\s*=\s*([\d.]+)/.exec(icons)
const brainView = /viewBox=\{brain \? '([^']+)'/.exec(icons)
check(
  'badges: each grid declares its own stroke and the render size',
  gridStroke !== null && brainStroke !== null && brainView !== null && iconSize !== undefined,
  {
    gridStroke: gridStroke?.[1], brainStroke: brainStroke?.[1],
    brainViewBox: brainView?.[1], renderSize: iconSize,
  },
)
if (gridStroke !== null && brainStroke !== null && brainView !== null && iconSize !== undefined) {
  const size = Number(iconSize)
  const brainUnits = Number(brainView[1].split(/\s+/).pop())
  const drawn16 = Number(gridStroke[1]) * (size / 16)
  const drawn24 = Number(brainStroke[1]) * (size / brainUnits)
  check(
    'badges: all four glyphs draw the same weight on screen',
    Math.abs(drawn16 - drawn24) < 0.05,
    { drawn16: drawn16.toFixed(3), drawn24: drawn24.toFixed(3), size, brainUnits },
  )
}
// The slash is per-grid for the same reason the stroke is: a path is written in
// its own viewBox's units, so one shared string would render a stub parked in
// the corner of whichever grid it was not written for.
const slashBlock = /const SLASH[^=]*=\s*\{([\s\S]*?)\n\}/.exec(icons)
check(
  'badges: the slash is stated once per grid',
  slashBlock !== null && /16:/.test(slashBlock[1]) && /24:/.test(slashBlock[1]),
  { slash: slashBlock?.[1]?.replace(/\s+/g, ' ').trim() ?? null },
)

// --- 11. the three 2026-10-02 follow-ups, each as an anti-regression gate ----
// a. The panel's scroll role. `MenuSurface` paints the card's fill as an
//    absolutely positioned `.material` child anchored to the surface's padding
//    box, so a SURFACE that scrolls drags that layer up with the content: the
//    lower part of the card loses its fill (the page shows through the panel's
//    own footer) and the layer's rounded corners appear mid-card. Measured on
//    the real GUI. Scrolling belongs to an inner body.
check(
  'panel: the settings surface itself never scrolls',
  /\.dmp-settings\s*\{[^}]*overflow:\s*hidden/.test(stylesCode)
    && !/\.dmp-settings\s*\{[^}]*overflow(-y)?\s*:\s*(auto|scroll)/.test(stylesCode),
  { settings: /\.dmp-settings\s*\{[^}]*\}/.exec(stylesCode)?.[0]?.replace(/\s+/g, ' ').trim() ?? null },
)
check(
  'panel: the scroll viewport is the inner body',
  /\.dmp-settings-body\s*\{[^}]*overflow-y:\s*auto/.test(stylesCode)
    && read('src/client/SettingsMenu.tsx').includes('className="dmp-settings-body"'),
)
// b. The trigger labels the model alone. The effort in force is a parameter:
//    the row states it and the panel edits it, so the chip must not repeat it
//    beside the name (that was the feedback), and the two classes that used to
//    render the " · effort" tail must stay gone.
check(
  'trigger: the chip states the model, not the effort',
  !/dmp-trigger-effort|dmp-trigger-sep/.test(picker + stylesCode),
  { classes: [...(picker + stylesCode).matchAll(/dmp-trigger-(?:effort|sep)/g)].map(m => m[0]) },
)
// c. The provider narrowing is a remembered preference, not component state: it
//    is read per session and written on every change (the same storage the recent
//    list uses); the catalog decides whether a remembered id is still real.
check(
  'filter: the provider narrowing is persisted',
  /readProviderFilter\(sessionId\)/.test(picker) && /rememberProviderFilter\(filterSession, providerFilter\)/.test(picker),
  {
    read: /readProviderFilter\([^)]*\)/.exec(picker)?.[0] ?? null,
    write: /rememberProviderFilter\([^)]*\)/.exec(picker)?.[0] ?? null,
  },
)
// d. …and it is remembered PER SESSION. A single unscoped key made every
//    window inherit the first one's narrowing. The key must be composed with the
//    session id rather than being a constant, and the seat must re-read it on
//    the session boundary — the seat is not remounted when the conversation
//    changes, so a `useState` initializer alone would never run again.
const prefsCode = stripComments(read('src/client/prefs.ts'))
check(
  'filter: the narrowing key is composed per session, not one global key',
  /`\$\{PROVIDER_KEY_PREFIX\}\$\{sessionId\}`/.test(prefsCode)
    && /removeItem\(LEGACY_PROVIDER_KEY\)/.test(prefsCode),
  { prefix: /PROVIDER_KEY_PREFIX = '([^']+)'/.exec(prefsCode)?.[1] ?? null },
)
check(
  'filter: the seat re-reads the narrowing when the session changes',
  /if \(filterSession !== sessionId\)/.test(picker) && /setProviderFilter\(readProviderFilter\(sessionId\)\)/.test(picker),
  { boundary: /if \(filterSession !== sessionId\)[\s\S]{0,160}/.exec(picker)?.[0]?.replace(/\s+/g, ' ').trim() ?? null },
)
// e. The chip names the LIST'S SCOPE and nothing else. It once also claimed to
//    know the session's provider, which made the chip contradict its own menu —
//    "全部 ✓" beside a chip reading "commandcode", a pair with no true reading.
//    A chip that can represent the menu's radio group must be able to say every
//    member of it, including the two that are not providers; and it must not
//    read the session, whose provider is marked on the menu row instead.
check(
  'filter: the chip names the list scope, never the session',
  /const activeProviderId = providerFilter\s*$/m.test(picker)
    && /const activeProviderLabel = activeProviderId === null/.test(picker)
    && !/activeProviderId = providerFilter[^\n]*state\.current/.test(picker),
  { label: /const activeProviderId[\s\S]{0,400}/.exec(picker)?.[0]?.replace(/\s+/g, ' ').trim() ?? null },
)
// e2. …and the session's provider is still answered, on the menu row that names
//     it. Dropping the chip's second job without moving the fact would have
//     answered §5.15 by deleting the answer.
const providerMenu = stripComments(read('src/client/ProviderMenu.tsx'))
check(
  'filter: the session\'s provider is marked on its own menu row',
  /session: group\.id === state\.current\?\.provider/.test(picker)
    && /option\.session && <span className="dmp-provider-session">/.test(providerMenu)
    && dictionaryKeys.has('provider.sessionHere'),
  { mark: /option\.session &&[\s\S]{0,120}/.exec(providerMenu)?.[0]?.replace(/\s+/g, ' ').trim() ?? null },
)
// f. …while narrowing the LIST is still only ever the user's own choice. If the
//    session-derived provider also narrowed the list, the chip would silently
//    hide models the user never asked to hide, and "show all" would be a lie.
const groupsMemo = /const groups = useMemo<DisplayGroup\[\]>\(\(\) => \{[\s\S]*?\n  \}, \[[^\]]*\]\)/.exec(picker)?.[0] ?? ''
check(
  'filter: only an explicit narrowing scopes the model list',
  groupsMemo.includes('providerFilter === null')
    && !/state\.current\?\.provider/.test(groupsMemo),
  { groups: groupsMemo.replace(/\s+/g, ' ').trim() },
)
// g. "Recently used" is a choice in the PROVIDER MENU, not a group bolted onto
//    the top of the list. Prepending a `recent` group is what it replaced, and
//    it must not creep back: the catalog branch may not mention a recent group
//    at all, and the only route into `recentGroupsFor` is the RECENT_ID test.
const recentCode = stripComments(read('src/client/recent.ts'))
check(
  'recent: it is a provider-menu option, not a group in the list',
  groupsMemo.includes('providerFilter === RECENT_ID')
    && !/id: 'recent'/.test(groupsMemo)
    && (groupsMemo.match(/recentGroupsFor\(/g) ?? []).length === 1,
  { groups: groupsMemo.replace(/\s+/g, ' ').trim() },
)
// h. …listed directly under "all providers", and the list it produces is still
//    grouped by the catalog's own providers AND keeps every remembered route.
//    All three halves matter: an option anywhere but second buries the one row
//    that is not a provider; flat rows would make every row repeat its provider;
//    and bucketing that keeps only the newest route per provider would quietly
//    shrink the very list the user asked to walk back through.
const optionsMemo = /const providerOptions = useMemo<ProviderOption\[\]>\(\(\) => \[[\s\S]*?\n  \], \[[^\]]*\]\)/.exec(picker)?.[0] ?? ''
const optionRows = [...optionsMemo.matchAll(/\{ id: ([^,]+), label: ([^,]+), count: ([^,]+), failed: ([^}]+)\}/g)]
  .map(m => m[1].trim())
check(
  'recent: the provider menu lists it right below "all providers"',
  optionRows[0] === 'null' && optionRows[1] === 'RECENT_ID' && optionRows.length >= 2,
  { order: optionRows },
)
// h2. The count next to "recently used" must be what the list will actually
//     show. The store keeps more routes than the list shows on purpose (so a
//     model leaving the catalog still leaves the list full), and reading that
//     surplus into the menu produced "最近使用 8" over a list of 5 — the only
//     row in the menu whose number was not the number of rows you get.
check(
  'recent: the menu counts what opens, not what is remembered',
  /recentRowsFor\(catalogRows, recent, '', RECENT_VISIBLE\)\.length/.test(picker)
    && /const groups = useMemo[\s\S]*?recentRowsFor\(catalogRows, recent, trimmedQuery\)/.test(picker),
  { count: /presentRecentCount = useMemo\([\s\S]{0,140}/.exec(picker)?.[0]?.replace(/\s+/g, ' ').trim() ?? null },
)
const bucketFn = /export function recentGroupsFor\([\s\S]*?\n\}/.exec(recentCode)?.[0] ?? ''
check(
  'recent: its rows keep the provider headings and every remembered route',
  bucketFn.includes('label: label(group.id, group.name)')
    // The accumulate step: without it each provider keeps only its newest route.
    && /rows: existing === undefined \? \[row\] : \[\.\.\.existing\.rows, row\]/.test(bucketFn)
    // Order comes from the Map's insertion order, never a sort — this is the
    // function that promises recency.
    && bucketFn.includes('[...groups.values()]')
    && !/\.sort\(/.test(bucketFn),
  { bucket: bucketFn.replace(/\s+/g, ' ').trim() },
)
// i. The id is reserved. The stale-filter cleanup judges a remembered id against
//    the catalog's provider list, so a pseudo-provider that collided with a real
//    one would make "recently used" and that provider the same menu row.
check(
  'recent: the pseudo-provider id cannot collide with a catalog provider',
  /export const RECENT_ID = '__[^']*__'/.test(recentCode),
  { id: /RECENT_ID = '([^']+)'/.exec(recentCode)?.[1] ?? null },
)
// j. Two ways to reach an empty recent list — nothing was ever used, and every
//    remembered route has left the catalog — get one sentence that covers both.
//    "This provider has no models" would blame the wrong thing for either.
check(
  'recent: an empty recent list says so, without blaming a provider',
  /providerFilter === RECENT_ID[\s\S]{0,160}empty\.recent/.test(picker)
    && dictionaryKeys.has('empty.recent'),
  { empty: /providerFilter === RECENT_ID[\s\S]{0,160}/.exec(picker)?.[0]?.replace(/\s+/g, ' ').trim() ?? null },
)

// --- 12. the component has to CONSUME the decisions the pure layer makes -----
// `panelCopy.ts` is meticulously gated, and `test-params.mjs` drives it directly —
// which means a mutation in the COMPONENT's switch is invisible to every test:
// flipping `case 'reject': setCapacityError(true)` to `setCapacityError(false)`
// deletes the sticky-flag behaviour the unit gate was written for, and the whole
// suite still passes (adversarial review, round 2). These assertions close that
// gap from the other side: the pure layer decides, and the component is required
// to act on the verdict.
const settings = stripComments(read('src/client/SettingsMenu.tsx'))
/** The body of one `case 'x':` arm in a switch. */
function switchArm(source, label) {
  const start = source.indexOf(`case '${label}':`)
  if (start < 0) return null
  const rest = source.slice(start)
  const next = rest.slice(1).search(/\n\s*case '/)
  return next < 0 ? rest : rest.slice(0, next + 1)
}
const rejectArm = switchArm(settings, 'reject')
check(
  'panel: the component flags a rejected capacity (consumes capacityAction)',
  rejectArm !== null && /setCapacityError\(true\)/.test(rejectArm) && !/setCapacityError\(false\)/.test(rejectArm),
  { arm: rejectArm?.replace(/\s+/g, ' ').trim() ?? null },
)
const skipArm = switchArm(settings, 'skip')
check(
  'panel: the component writes nothing for a skipped capacity',
  skipArm !== null && !/write\(/.test(skipArm),
  { arm: skipArm?.replace(/\s+/g, ' ').trim() ?? null },
)
const unsetArm = switchArm(settings, 'unset')
check(
  'panel: an empty capacity un-declares through mutate',
  unsetArm !== null && /op: 'unset'/.test(unsetArm),
  { arm: unsetArm?.replace(/\s+/g, ' ').trim() ?? null },
)
const setArm = switchArm(settings, 'set')
check(
  'panel: a new capacity is declared through mutate',
  setArm !== null && /op: 'set'/.test(setArm) && /contextWindow/.test(setArm),
  { arm: setArm?.replace(/\s+/g, ' ').trim() ?? null },
)
// The field's own draft state must not be re-derived from the snapshot: the
// component reads `capacityDraft ?? contextField.value`, and the reset effect is
// keyed on the address and the committed value.
check(
  'panel: the capacity field derives its value and stores only a draft',
  /capacityDraft \?\? contextField\.value/.test(settings),
  { fallback: /capacityDraft \?\? [A-Za-z.]+/.exec(settings)?.[0] ?? null },
)
// The failure signal for text must not come from an ink the contrast gate has
// rejected: `.dmp-settings-alert` and the two error cards paint neutral text and
// carry the state in their fill and icons.
const alertBlock = /\.dmp-settings-alert\s*\{([^}]*)\}/.exec(stylesCode)
check(
  'panel: the refusal line uses readable ink, not the sub-AA error color',
  alertBlock !== null
    && /color:\s*var\(--dsw-alias-label-secondary\)/.test(alertBlock[1]),
  { block: alertBlock?.[1]?.replace(/\s+/g, ' ').trim() ?? null },
)

// --- 12b. §5.10 focus: where the panel puts focus, and in what order --------
// This defect survives every other gate here and survives a screenshot: opening
// the parameter panel put the caret in the context field, AND the `Tab` chain
// started there, while the card renders the two modality switches ABOVE it. So
// `Tab` walked backwards up the card (WCAG 2.4.3), and on touch that field's
// `inputMode="numeric"` summoned the keypad over a card anchored to the
// composer. Both halves are decidable from one file by comparing two orders:
// the selectors inside `chain()` and the order the JSX renders them in.
const chainBlock = /const chain = \(\): HTMLElement\[\] => \{([\s\S]*?)\.filter\(/.exec(settings)?.[1] ?? null
const CHAIN_SELECTOR = /'(\[[^\]]+\]|\.[a-z0-9-]+(?: input)?)'/g
const chainOrder = chainBlock === null ? [] : [...chainBlock.matchAll(CHAIN_SELECTOR)].map(match => match[1])
const rendered = settings.slice(settings.indexOf('return createPortal('))
/** Each chain selector, with where its control first appears in the returned JSX. */
const RENDERED_AT = [
  ['[role="switch"]', rendered.indexOf('<Switch')],
  ['.dmp-settings-input input', rendered.indexOf('dmp-settings-input')],
  ['.dmp-effort-item', rendered.indexOf('dmp-effort-item')],
  ['.dmp-settings-reset', rendered.indexOf('dmp-settings-reset')],
]
const renderOrder = RENDERED_AT
  .filter(([, at]) => at >= 0)
  .sort((left, right) => left[1] - right[1])
  .map(([selector]) => selector)
// The one documented exception to "chain == render order": 「恢复默认」 is painted
// in the card header, top right, and is walked LAST anyway. A destructive action
// must not be what the first `Tab` lands on, and the panel's initial focus is the
// card itself — so the first `Tab` off the card reaches a switch, not the reset.
const expectedChain = [...renderOrder.filter(selector => selector !== '.dmp-settings-reset'), '.dmp-settings-reset']
check(
  '§5.10: the focus chain is in the order the panel renders its controls',
  renderOrder.length === RENDERED_AT.length
    && chainOrder.length === expectedChain.length
    && chainOrder.every((selector, index) => selector === expectedChain[index]),
  { chain: chainOrder, rendered: renderOrder },
)
// The panel takes initial focus, not a control: a text field here summons the
// keypad, arms a blur-commit, and is announced in place of the card's own name.
// Read-only needs no special case for it either — the card can always focus,
// where every control is disabled.
check(
  '§5.10: opening the panel focuses the panel itself, not its first control',
  /tabIndex=\{-1\}/.test(settings)
    && /panelRef\.current\?\.focus\(\)/.test(settings)
    && !/chain\(\)\[0\]/.test(settings),
  { tabIndex: /tabIndex=\{-1\}/.test(settings), focusesCard: /panelRef\.current\?\.focus\(\)/.test(settings) },
)
// `position` is re-measured on scroll and resize; re-running the focus effect
// there would drag focus out of whatever the seat was using — mid-edit in the
// capacity field, mid-arrow in the effort list.
check(
  '§5.10: re-measuring the card does not take focus back',
  /tookFocus\.current/.test(settings) && /if \(position === null \|\| tookFocus\.current\) return/.test(settings),
  { guard: /tookFocus\.current/.test(settings) },
)
// Focus on the card is only acceptable if it is visible (WCAG 2.4.7): the UA's
// default outline reads as a selection border on a floating card, so the ring is
// drawn in the same token the capacity field paints on `:focus-within`.
check(
  '§5.10: the focused panel paints a ring of its own',
  /\.dmp-settings:focus-visible\s*\{[^}]*outline:/.test(stylesCode),
  { rule: /\.dmp-settings:focus-visible\s*\{[^}]*\}/.exec(stylesCode)?.[0].replace(/\s+/g, ' ') ?? null },
)

// --- 13. §5.18 anchor loss: the popovers must CLOSE, not drift --------------
// The bug this gates is invisible to every other check. The parameter panel is
// placed from a `position: fixed` anchor rect and portaled to the body, so when
// the Host elects a question card into `conversation.composer` and switches the
// composer bar to `display: none`, the panel does not fail — it SUCCEEDS at
// being placed, from a rect that is all zeros, and lands in the viewport corner
// (measured 265,787 → 12,12). Only a live GUI can see that, so these gates hold
// the parts that are decidable statically: the rule exists, it is wired to the
// seat root rather than to one anchor, and the wait it uses is one that still
// fires when the seat is off the page.
//
// The last of those is the one worth having a gate for. The obvious
// implementation waits with `requestAnimationFrame`, and it does not work: a
// `display: none` subtree stops the browser servicing the frame callback, so
// the confirmation is scheduled and never runs and the popover stays open
// forever — the original bug, unchanged. That was measured on the GUI, not
// reasoned about, and it would be trivially easy to reintroduce.
const anchorLoss = stripComments(read('src/client/anchorLoss.ts'))
check(
  '§5.18: a popover is dismissed when the seat root stops occupying the page',
  /export function seatLeftThePage/.test(anchorLoss)
    && /isConnected/.test(anchorLoss)
    && /getClientRects\(\)\.length/.test(anchorLoss),
  { hasRootProbe: /getClientRects\(\)\.length/.test(anchorLoss) },
)
// The wait must be a task-queue timer. A `requestAnimationFrame` confirmation is
// the exact defect described above, so its presence is itself the regression.
const lossConfirm = /const confirm = \(\): void => \{[\s\S]*?\n  \}/.exec(anchorLoss)?.[0] ?? ''
check(
  '§5.18: the second look waits on a timer, not on a frame callback',
  /setTimeout\(confirm/.test(lossConfirm) && !/requestAnimationFrame/.test(lossConfirm),
  { confirm: lossConfirm.replace(/\s+/g, ' ').trim().slice(0, 160) || null },
)
// The root is the subject, not an anchor: `closest('[data-composer-seat]')` or a
// per-anchor ref would be measuring one symptom, and a narrow composer squeezes
// the trigger to 12px without taking the seat off the page.
check(
  '§5.18: the seat root is the observed node',
  /=> rootRef\.current/.test(picker) && !/observeSeatLoss\(\s*\(\)\s*=>\s*triggerRef/.test(picker),
  { probe: /observeSeatLoss\(\s*\(\)\s*=>\s*(\w+)/.exec(picker)?.[1] ?? null },
)
// All three surfaces are one unit: they already share the one-at-a-time
// contract, and a model list left floating over a vanished composer is the same
// defect as a parameter panel over one.
// The `useEffect(` is pinned with a backreference so the capture cannot start at
// an earlier effect and run to the first matching dependency list — which, with
// the outside-click effect sharing this exact guard and dependency list, is
// exactly what a greedy capture does. The span is then CUT at `observeSeatLoss`,
// so what is checked is the anchor-loss effect's own body and not the two
// effects concatenated; otherwise `closeOutside`'s `setSettingsAt(false)` masks
// a deletion from the other one. Each closing call is checked on its own, so
// dropping exactly one of the three is caught.
const lossSpan = /useEffect\(\(\) => \{\s*if \(!open && !providerAt && !settingsAt\) return[\s\S]*?observeSeatLoss\([\s\S]*?\}, \[open, providerAt, settingsAt\]\)/.exec(picker)?.[0] ?? ''
const lossCall = lossSpan.slice(lossSpan.indexOf('return observeSeatLoss(') === -1
  ? 0
  : lossSpan.lastIndexOf('useEffect('))
const closes = ['setOpen(false)', 'setProviderAt(false)', 'setSettingsAt(false)']
check(
  '§5.18: all three popovers are dismissed together, with no focus restore',
  closes.every(call => lossCall.includes(call))
    && !/triggerRef\.current\?\.focus\(\)|lastActionRef/.test(lossCall),
  { missing: closes.filter(call => !lossCall.includes(call)), call: lossCall.replace(/\s+/g, ' ').trim().slice(0, 200) || null },
)
// The observer has to be armed while a popover is open — a guard that watches
// the seat all the time would make every one of these surfaces hostage to
// layout noise, which is the failure mode the negative half of the GUI check
// exists to catch.
check(
  '§5.18: the observer is armed only while a popover is open',
  /useEffect\(\(\) => \{\s*if \(!open && !providerAt && !settingsAt\) return\s*return observeSeatLoss/.test(picker),
  null,
)
check(
  '§5.18: the observer is disconnected on teardown',
  /observer\.disconnect\(\)/.test(anchorLoss) && /clearTimeout/.test(anchorLoss),
  null,
)

const pkg = JSON.parse(read('package.json'))
check('manifest: exports["./client"] is declared', typeof pkg.exports?.['./client'] === 'object')
check('manifest: dsh.client.platform is "web"', pkg.dsh?.client?.platform === 'web')

console.log(failures === 0 ? 'static selfcheck: all good' : `static selfcheck: ${failures} failure(s)`)
process.exitCode = failures > 0 ? 1 : 0
