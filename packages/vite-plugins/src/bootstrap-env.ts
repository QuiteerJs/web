import { promises as fs } from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import { loadConfig } from 'c12'

export interface BootstrapEnvOptions {
  root?: string
  mode?: string
  includePrefixes?: string[]
  envFileTemplate?: string
  defaultEnvFile?: string
  typesOutput?: string
  disableTypes?: boolean
}

function toEnvKey(prefixes: string[], key: string): string {
  const norm = key
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase()
  return `${prefixes[0] ?? 'VITE_'}${norm}`
}

async function writeIfChanged(file: string, content: string): Promise<void> {
  try {
    const prev = await fs.readFile(file, 'utf8')
    if (prev === content)
      return
  }
  catch {}
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, content, 'utf8')
}

export async function bootstrapEnv(opts: BootstrapEnvOptions = {}): Promise<void> {
  const root = opts.root ?? process.cwd()
  const mode = opts.mode ?? process.env.MODE ?? process.env.NODE_ENV ?? 'development'
  const envFileTemplate = opts.envFileTemplate ?? '.env.{mode}.local'
  const defaultEnvFile = opts.defaultEnvFile ?? '.env.local'
  const typesOut = opts.typesOutput
  const disableTypes = opts.disableTypes ?? false
  const prefixes = opts.includePrefixes ?? ['VITE_']

  const direct = path.join(root, 'env.config.ts')
  let cfgPath = direct
  try {
    await fs.access(direct)
  }
  catch {
    const { configFile } = await loadConfig({ name: 'env', cwd: root, configFile: direct })
    if (!configFile)
      return
    cfgPath = configFile
  }

  const { config } = await loadConfig<Record<string, any>>({ name: 'env', cwd: path.dirname(cfgPath), configFile: cfgPath, dotenv: false })
  if (!config || typeof config !== 'object')
    return

  const merged = { ...config.default, ...config[mode] }
  const baseOnly = { ...config.default }

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
