/**
 * Build script for an EXTERNAL DSH plugin (no published `clientBundle` preset).
 *
 * Produces two artifacts:
 *   lib/index.js   — host half, plain node ESM with every bare import external
 *   lib/client.js  — browser half, the lazy-CJS factory the loader expects:
 *                    window.__ModuleLoader__.load({ id, factory: (require) => { ... } })
 *
 * The external list is deliberately the set this client half ACTUALLY imports
 * from the DSH baseline (`packages/client/web/src/platform.ts`), not the whole
 * baseline: it doubles as a gate. Baseline externals are implicit for a dynamic
 * bundle (packages/client/AGENTS.md), so nothing here belongs in
 * `dsh.client.external` — and anything outside this list is a real defect that
 * must fail the build instead of failing at runtime inside the module table.
 *
 * @module dsh-model-picker/build-client
 */

import { build } from 'esbuild'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { pathToFileURL, fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

/** The baseline specifiers this client half imports (see the module note). */
const BASELINE_EXTERNALS = [
  'react',
  'react/jsx-runtime',
  'react-dom',
  '@deepseek-ai/dsh-client-ui-primitives',
]

/** The seat this plugin shadows, and the rank that wins it (lowest renders). */
const SEAT = 'conversation.input.model'
const SEAT_PRIORITY = -10

const pkg = JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8'))
// The client entry id must equal the package name: client-modules requests the
// entry by package name through `exports["./client"]`.
const CLIENT_ID = String(pkg.name)

async function main() {
  mkdirSync(resolve(root, 'lib'), { recursive: true })

  // 1) Host half: node ESM, bare imports left external.
  await build({
    entryPoints: [resolve(root, 'src/index.ts')],
    outfile: resolve(root, 'lib/index.js'),
    bundle: true,
    platform: 'node',
    format: 'esm',
    target: 'es2022',
    packages: 'external',
  })

  // 2) Browser half: bundle to CJS (write:false), then wrap into the loader factory.
  const client = await build({
    entryPoints: [resolve(root, 'src/client/index.ts')],
    bundle: true,
    platform: 'browser',
    format: 'cjs',
    target: 'es2022',
    // Keep CJK as literal UTF-8 so the shipped browser bundle stays readable.
    charset: 'utf8',
    external: BASELINE_EXTERNALS,
    write: false,
  })
  const bundled = client.outputFiles[0].text
  const factory = [
    // The loader injects `require`; the plugin bundle uses it for baseline externals.
    'var module = { exports: {} }; var exports = module.exports;',
    bundled,
    'return module.exports;',
  ].join('\n')
  const wrapped =
    `window.__ModuleLoader__.load({\n` +
    `  id: ${JSON.stringify(CLIENT_ID)},\n` +
    `  factory: (require) => {\n` +
    factory.split('\n').map((line) => `    ${line}`).join('\n') +
    `\n  },\n` +
    `});\n`
  writeFileSync(resolve(root, 'lib/client.js'), wrapped)
  verifyClientBundle(wrapped)
  await verifyHostBundle()

  console.log('built lib/index.js (host) and lib/client.js (lazy-CJS browser bundle)')
}

/**
 * Check the browser artifact against the wiring contract. None of these
 * mistakes fails the build on its own; each one only shows up as "the seat is
 * still the old one" or "the button does nothing", which has no other discovery
 * path:
 *   1. every `require(specifier)` in the bundle is in {@link BASELINE_EXTERNALS};
 *   2. the wrapper shape and entry id match the package name;
 *   3. the entry exports `apply` + `inject` and NO `default` (the Loader reads
 *      `exports.default ?? exports`, so a default export would hide `.inject`);
 *   4. the shadowing contract is present: the seat name and `priority: -10`.
 * A Proxy that returns only itself impersonates the baseline module table; the
 * bundle only requires and reads properties at module scope.
 * @param code - the written `lib/client.js`.
 */
function verifyClientBundle(code) {
  const problems = []
  if (!code.startsWith('window.__ModuleLoader__.load(')) problems.push('wrapper is not window.__ModuleLoader__.load(...)')
  if (!code.includes(`id: ${JSON.stringify(CLIENT_ID)}`)) problems.push(`entry id is not the package name ${CLIENT_ID}`)
  if (!code.includes(SEAT)) problems.push(`bundle does not carry the seat key "${SEAT}"`)
  if (!new RegExp(`priority:\\s*${SEAT_PRIORITY}\\b`).test(code)) {
    problems.push(`bundle does not register the seat at priority ${SEAT_PRIORITY} (shadowing rank)`)
  }
  const stub = new Proxy(function () {}, {
    get: (_target, key) => (key === '__esModule' ? false : stub),
    apply: () => stub,
    construct: () => stub,
  })
  const requireStub = (name) => {
    if (!BASELINE_EXTERNALS.includes(name)) problems.push(`client bundle requires "${name}", which is not in the DSH baseline list`)
    return stub
  }
  try {
    let entry
    new Function('window', 'require', code)({ __ModuleLoader__: { load: (value) => { entry = value } } }, requireStub)
    const exported = entry.factory(requireStub)
    if (typeof exported.apply !== 'function') problems.push('client entry has no named export.apply')
    if (!Array.isArray(exported.inject)) problems.push('client entry has no named export.inject (array)')
    if (exported.default !== undefined) problems.push('client entry must not export default: it would hide .inject')
  } catch (error) {
    problems.push(`client bundle cannot self-check: ${error instanceof Error ? error.message : String(error)}`)
  }
  if (problems.length > 0) {
    throw new Error(`lib/client.js does not satisfy the DSH wiring contract:\n  - ${problems.join('\n  - ')}`)
  }
}

/** Check the host artifact actually resolves and exports an `apply`. */
async function verifyHostBundle() {
  const module = await import(pathToFileURL(resolve(root, 'lib/index.js')).href)
  if (typeof module.apply !== 'function') {
    throw new Error('lib/index.js does not export a host `apply`')
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
