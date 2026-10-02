/**
 * The row's window figure: how a stored token count is written down when it is
 * only being stated, never typed back.
 *
 * It lives apart from `params.ts` on purpose. `params.ts` owns the parameter
 * panel, whose text has to round-trip through {@link parseContext} exactly
 * ("262144" stays "262144"); a row's badge is a statement, so it may round —
 * and rounding is the whole point of this format. Keeping the two formats in one
 * module is how they get "unified" by accident, and that accident writes a wrong
 * number into the Host's config.
 *
 * THE FIGURE IS A WHOLE NUMBER IN ITS UNIT. A window is read while scanning a
 * list of seventy rows, so what a row must not do is print a fraction: `1.5M`,
 * `0.75M` and `786.43K` are all the same length as the capacity they came from
 * while being harder to compare at a glance, and a decimal in an 11px capsule is
 * the first thing to turn to mush. The unit is therefore chosen from the
 * capacity's own magnitude, the value inside it is rounded to a whole number,
 * and the one rounding that would reach the next unit (999.5K → 1000K) is
 * re-spelled `1M` rather than printed as `1000K`.
 *
 * THE UNIT IS K OR M, AS ASKED, so a declared window past a thousand million
 * tokens reads `1000M` rather than inventing a `G`: the panel's own ceiling is
 * 10,485,760, and an adapter default that far out is better stated in the units
 * the reader was promised than silently downgraded to a wrong `1M`.
 *
 * WHAT IS LOST, AND WHY THAT IS FINE. The row is a fact strip next to a model
 * name, not a configuration field: it answers "how big is this one, roughly,
 * next to its neighbours", and the exact declared count stays available in the
 * parameter panel, which prints the stored number verbatim.
 *
 * @module dsh-model-picker/client/format
 */

/**
 * Write a window down to read it: one whole number, one `K`/`M` unit
 * (`1048576` → `1M`, `786432` → `786K`, `700000` → `700K`, `4096` → `4K`).
 * Below 1000 tokens there is no unit to round inside and the count is printed
 * as it stands; a value that rounds up to the next unit is spelled that way.
 *
 * A value that is not a finite positive count is reported as absent rather than
 * spelled: the caller reads a capacity out of a Host snapshot, and an empty
 * string makes the badge drop its value cell instead of printing `NaN`/`∞`,
 * which is a claim no declaration backs.
 * @param tokens - the stored token count.
 * @returns the display text (`1M`, `128K`), or '' when the count is unusable.
 */
export function formatWindow(tokens: number): string {
  if (!Number.isFinite(tokens) || tokens <= 0) return ''
  if (tokens < 1_000) return String(Math.round(tokens))
  // Under a million the figure is stated in K, and rounding can push it onto
  // 1000K — a megabyte spelled wrong — so that one case is re-spelled.
  if (tokens < 1_000_000) {
    const thousands = Math.round(tokens / 1_000)
    return thousands >= 1_000 ? '1M' : `${thousands}K`
  }
  return `${Math.round(tokens / 1_000_000)}M`
}
