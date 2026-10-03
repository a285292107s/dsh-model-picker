/**
 * Host half of `dsh-rabbit-model-picker`.
 *
 * The plugin has no Host-side work: the composer model seat is pure browser UI
 * over services another plugin already provides (`modelDirectories` owns the
 * catalog and the selection RPC). The row must still exist and resolve to a
 * plugin with an `apply`, so this stays an intentionally empty body rather than
 * a missing entry point.
 *
 * @module dsh-rabbit-model-picker
 */

/**
 * Host plugin body: intentionally empty (see the module note).
 */
export function apply(): void {
  // No Host services to register: the browser half reads the shared
  // `modelDirectories` service and the `conversation.input.model` slot.
}
