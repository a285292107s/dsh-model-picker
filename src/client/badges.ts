/**
 * The read-only facts a model row states: whether it takes text, whether it
 * takes images, the reasoning effort in force, and the context window.
 *
 * WHAT THIS REPLACES. The row used to carry an interactive effort pill: clicking
 * it opened a small anchored menu that submitted a whole
 * `{ provider, model, reasoningEffort }` selection. Effort is edited in the model
 * parameters panel now, so the row states facts instead of offering a control —
 * and this module is the single place that decides *which* facts are known.
 *
 * WHERE THE FACTS COME FROM. The composer catalog publishes only
 * `{ provider, model, reasoning }`, so effort is read from the catalog entry
 * while modalities and capacity are read from the settings snapshot the panel
 * uses (`resolveRoute` over `describe`). Nothing is guessed: a fact the snapshot
 * cannot answer is left out rather than rendered as "unsupported", which is the
 * same rule the panel follows when it refuses to offer a switch that would do
 * nothing. `off` therefore always means "a declaration (or the adapter default
 * behind it) really does not list this" — never "we could not find out".
 *
 * ONE FACT = ONE BADGE. The four facts used to be four differently shaped
 * chips: the two boolean ones were icon-only capsules and the two valued ones
 * were icon + text, so a row stated the same kind of thing in two weights and
 * the strip read as a bag of parts. Every fact is now the same capsule — one
 * square icon cell plus a text cell — which is what lets `.dmp-badges` line the
 * four up on one baseline and what makes "a badge is a fact" true by shape
 * rather than by convention. The two facts that are true/false state whose
 * truth (`text`, `image`), the two that name a value print it (`Default`, `1M`).
 *
 * THE WINDOW VALUE IS ROUNDED FOR READING, NEVER FOR WRITING: the row prints
 * `1M` / `128K`, while `parseContext` (the parameter panel's own reader) keeps
 * accepting exactly what it always did and the stored token count is untouched.
 *
 * @module dsh-rabbit-model-picker/client/badges
 */

import type { ModelReasoning, RouteAddress, Translate } from './contract.ts'
import { effortLabelOf } from './effort.ts'
import type { BadgeFact } from './facts.ts'
import { formatWindow } from './format.ts'

export type { BadgeFact }

/**
 * Canonical reading order of the four facts. The row renders them in this order
 * and the offline gates publish it, so the order is stated once.
 */
export const BADGE_FACTS: readonly BadgeFact[] = ['text', 'image', 'effort', 'context']

/** One badge to render, and the copy that explains it. */
export interface BadgeSpec {
  /** Which fact this badge states (also the icon's identity). */
  readonly fact: BadgeFact
  /** The fact is unsupported or absent: slashed glyph, quiet tone. */
  readonly off: boolean
  /** Text after the icon; '' renders the icon alone (nothing to name). */
  readonly value: string
  /** One localized sentence: the badge's tooltip and its share of the row's name. */
  readonly sentence: string
}

/** Everything the badges of one row are derived from. */
export interface BadgeInput {
  /** This route's declaration, or null when the route cannot be addressed at all. */
  readonly address: RouteAddress | null
  /** The catalog entry's reasoning metadata, when the adapter declares any. */
  readonly reasoning: ModelReasoning | undefined
  /** The effort in force for this row (Host-accepted on the selected row, else the adapter default). */
  readonly effort: string | undefined
  /** Translator for the plugin namespace. */
  readonly t: Translate
}

/**
 * The modality list in force for one route.
 * @param address - the route's declaration, or null when it has none.
 * @returns the declared list, else the adapter default; undefined when neither is readable.
 */
function modalitiesOf(address: RouteAddress | null): readonly string[] | undefined {
  if (address === null) return undefined
  if (address.input.length > 0) return address.input
  if (address.defaultInput.length > 0) return address.defaultInput
  return undefined
}

/**
 * The context window in force for one route.
 * @param address - the route's declaration, or null when it has none.
 * @returns the declared window, else the adapter default; undefined when neither is declared.
 */
function capacityOf(address: RouteAddress | null): number | undefined {
  if (address === null) return undefined
  return address.contextWindow ?? address.defaultContextWindow
}

/**
 * Derive the facts of one model row, in {@link BADGE_FACTS} order.
 * @param input - see {@link BadgeInput}.
 * @returns 1–4 badges; the sections whose facts are not readable are omitted.
 */
export function badgeSpecsOf({ address, reasoning, effort, t }: BadgeInput): BadgeSpec[] {
  const specs: BadgeSpec[] = []

  const modalities = modalitiesOf(address)
  if (modalities !== undefined) {
    const text = modalities.includes('text')
    specs.push({
      fact: 'text',
      off: !text,
      value: '',
      sentence: t(text ? 'badge.text.on' : 'badge.text.off'),
    })
    const image = modalities.includes('image')
    specs.push({
      fact: 'image',
      off: !image,
      value: '',
      sentence: t(image ? 'badge.image.on' : 'badge.image.off'),
    })
  }

  if (reasoning === undefined) {
    // No levels are declared, so there is no level name to state.
    specs.push({ fact: 'effort', off: true, value: '', sentence: t('badge.effort.none') })
  } else {
    const label = effortLabelOf(reasoning, effort, t)
    specs.push({ fact: 'effort', off: false, value: label, sentence: t('badge.effort', { level: label }) })
  }

  const capacity = capacityOf(address)
  if (capacity !== undefined) {
    const value = formatWindow(capacity)
    // A capacity the formatter cannot spell as a whole number is not stated at
    // all: an icon with no figure would read as "this model declares a window,
    // we just will not say how big", which is worse than the badge being absent.
    if (value !== '') {
      specs.push({ fact: 'context', off: false, value, sentence: t('badge.context', { value }) })
    }
  }

  return specs
}
