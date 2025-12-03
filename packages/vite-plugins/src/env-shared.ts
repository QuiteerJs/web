import { promises as fs } from 'node:fs'
import path from 'node:path'
import { loadConfig } from 'c12'

export type EnvConfigShape = Record<string, Record<string, unknown>> & { default?: Record<string, unknown> }

export function toEnvKey(prefixes: string[], key: string): string {
  const norm = key
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/[^a-z0-9]+/gi, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toUpperCase()
  return `${prefixes[0] ?? 'VITE_'}${norm}`
}

export async function writeIfChanged(file: string, content: string): Promise<void> {
  try {
    const prev = await fs.readFile(file, 'utf8')
    if (prev === content)
      return
  }
  catch {}
  await fs.mkdir(path.dirname(file), { recursive: true })
  await fs.writeFile(file, content, 'utf8')
}

export async function resolveEnvConfigPath(root: string, explicit?: string): Promise<string | null> {
  if (explicit) {
    const abs = path.isAbsolute(explicit) ? explicit : path.join(root, explicit)
    try {
      await fs.access(abs)
      return abs
    }
    catch {}
  }
  const direct = path.join(root, 'env.config.ts')
  try {
    await fs.access(direct)
    return direct
  }
  catch {}
  const { configFile } = await loadConfig({ name: 'env', cwd: root, configFile: direct }) as any
  if (configFile)
    return configFile as string
  return null
}

export async function parseConfigModule(file: string): Promise<EnvConfigShape> {
  const { config } = await loadConfig<EnvConfigShape>({
    name: 'env',
    cwd: path.dirname(file),
    configFile: file,
    rcFile: false,
    dotenv: false,
    packageJson: false,
    globalRc: false
  })
  if (!config || typeof config !== 'object')
    throw new Error('env.config.ts 格式错误：默认导出必须为对象')
  return config
}

export function mergeByMode(cfg: EnvConfigShape, mode: string): Record<string, unknown> {
  const base = { ...cfg.default }
  const specific = { ...cfg[mode] }
  return { ...base, ...specific }
}
