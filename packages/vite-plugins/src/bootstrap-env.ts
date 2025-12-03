import path from 'node:path'
import process from 'node:process'
import { mergeByMode, parseConfigModule, resolveEnvConfigPath, toEnvKey, writeIfChanged } from './env-shared'

export interface BootstrapEnvOptions {
  root?: string
  mode?: string
  includePrefixes?: string[]
  envFileTemplate?: string
  defaultEnvFile?: string
  typesOutput?: string
  disableTypes?: boolean
}

export async function bootstrapEnv(opts: BootstrapEnvOptions = {}): Promise<void> {
  const root = opts.root ?? process.cwd()
  const mode = opts.mode ?? process.env.MODE ?? process.env.NODE_ENV ?? 'development'
  const envFileTemplate = opts.envFileTemplate ?? '.env.{mode}.local'
  const defaultEnvFile = opts.defaultEnvFile ?? '.env.local'
  const typesOut = opts.typesOutput
  const disableTypes = opts.disableTypes ?? false
  const prefixes = opts.includePrefixes ?? ['VITE_']

  const cfgPath = await resolveEnvConfigPath(root)
  if (!cfgPath)
    return

  const cfg = await parseConfigModule(cfgPath)
  const merged = mergeByMode(cfg, mode)
  const baseOnly = { ...cfg.default }

  const toLines = (obj: Record<string, any>) => {
    const lines: string[] = []
    for (const [k, v] of Object.entries(obj)) {
      const key = toEnvKey(prefixes, k)
      const raw = typeof v === 'object' && v !== null ? String((v as any).value ?? '') : String(v ?? '')
      lines.push(`${key}=${raw}`)
    }
    return `${lines.join('\n')}\n`
  }

  await writeIfChanged(path.join(root, envFileTemplate.replace('{mode}', mode)), toLines(merged))
  await writeIfChanged(path.join(root, defaultEnvFile), toLines(baseOnly))

  if (!disableTypes && typesOut) {
    const entries = Object.entries(merged).sort(([a], [b]) => a.localeCompare(b))
    const dts = [
      'interface ImportMetaEnv {',
      ...entries.map(([k]) => `  readonly ${toEnvKey(prefixes, k)}: string`),
      '}',
      'interface ImportMeta {',
      '  readonly env: ImportMetaEnv',
      '}',
      ''
    ].join('\n')
    await writeIfChanged(path.join(root, typesOut), dts)
  }
}
