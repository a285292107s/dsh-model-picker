/**
 * The vocabulary of the row's badge strip: which facts a model row can state.
 *
 * Its own module because the renderer and the derivation are different jobs that
 * must not import each other: `badges.ts` decides *which* facts are known, the
 * icon family draws them, and this is the one list both read.
 *
 * @module dsh-rabbit-model-picker/client/facts
 */

/** The four facts a row can badge, in canonical reading order. */
export type BadgeFact = 'text' | 'image' | 'effort' | 'context'
