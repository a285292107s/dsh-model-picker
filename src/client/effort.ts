/**
 * Reasoning-effort metadata as copy: the name of one level and the full list a
 * model offers.
 *
 * These two helpers used to live in `EffortMenu.tsx`, the in-row menu that let a
 * row switch its own effort. That menu is gone — effort is edited in the model
 * parameters panel, and a model row only *states* the effort in force — but the
 * naming rules are still shared by the panel's radiogroup and the row's
 * read-only badge, so both surfaces always call a level the same thing.
 *
 * @module dsh-rabbit-model-picker/client/effort
 */

import type { ModelReasoning, Translate } from './contract.ts'

/** One selectable effort level; `effort: undefined` means "the provider default". */
export interface EffortChoice {
  readonly key: string
  readonly effort: string | undefined
  readonly label: string
}

/**
 * Resolve one effort's display name, falling back to the raw id and then to the
 * provider-default caption (the same chain the incumbent seat uses).
 * @param reasoning - the model's adapter-owned reasoning metadata.
 * @param effort - the effort id in use, or undefined for the provider default.
 * @param t - translator for the plugin namespace.
 * @returns the display label.
 */
export function effortLabelOf(reasoning: ModelReasoning, effort: string | undefined, t: Translate): string {
  if (effort === undefined) return t('effort.providerDefault')
  return reasoning.efforts.find(level => level.id === effort)?.name ?? effort
}

/**
 * Build the levels offered for one model: a provider-default row only when the
 * adapter names no default (otherwise one of the listed levels already is it).
 * @param reasoning - the model's reasoning metadata.
 * @param t - translator for the plugin namespace.
 * @returns the levels in adapter order.
 */
export function effortChoicesOf(reasoning: ModelReasoning, t: Translate): EffortChoice[] {
  return [
    ...reasoning.defaultEffort === undefined
      ? [{ key: 'provider-default', effort: undefined, label: t('effort.providerDefault') }]
      : [],
    ...reasoning.efforts.map(level => ({ key: `effort:${level.id}`, effort: level.id, label: level.name })),
  ]
}
