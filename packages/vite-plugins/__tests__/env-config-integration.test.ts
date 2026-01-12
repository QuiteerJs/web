import { beforeEach, describe, expect, it, vi } from 'vitest'
import { envConfigPlugin } from '../src/env-config'
import { parseConfigModule, resolveEnvConfigPath, writeIfChanged } from '../src/shared/env-shared'

// Mock shared module to avoid file system reads and config parsing
vi.mock('../src/shared/env-shared', async (importOriginal) => {
  const actual = await importOriginal<typeof import('../src/shared/env-shared')>()
  return {
    ...actual,
    resolveEnvConfigPath: vi.fn(),
    parseConfigModule: vi.fn(),
    writeIfChanged: vi.fn()
  }
})

describe('envConfigPlugin integration', () => {
  const root = '/app'

  beforeEach(() => {
    vi.clearAllMocks()
    // Default mocks
    vi.mocked(resolveEnvConfigPath).mockResolvedValue('/app/env.config.ts')
  })

  it('should generate .env file with JSON stringified values for objects and arrays', async () => {
    // Setup mock config
    const mockConfig = {
      default: {
        APP_CONFIG: {
          value: { api: 'https://api.example.com', timeout: 5000 },
          desc: 'App configuration'
        },
        TAGS: {
          value: ['v1', 'stable'],
          desc: 'Tags'
        },
        SIMPLE: 'simple-value'
      },
      development: {}
    }

    vi.mocked(parseConfigModule).mockResolvedValue(mockConfig as any)

    const plugin = envConfigPlugin({
      root,
      targetEnv: 'development',
      envFileTemplate: '.env' // Simplify output
    })

    // Trigger generation via config hook
    // The plugin calls runGenerate inside config()
    // @ts-expect-error test
    await plugin.config({ root }, { mode: 'development' })

    // Verify writeIfChanged was called
    expect(writeIfChanged).toHaveBeenCalled()

    // Find the call that writes to .env
    const writeCalls = vi.mocked(writeIfChanged).mock.calls
    // It might write multiple files (defaultEnvFile, merged env file, d.ts)
    // In our case:
    // .env (merged)
    // .env.local (defaultEnvFile default)
    // env.d.ts

    const envWrite = writeCalls.find(call => call[0].endsWith('/.env'))

    expect(envWrite).toBeDefined()
    const content = envWrite![1]

    // Check content
    // VITE_APP_CONFIG={"api":"https://api.example.com","timeout":5000}
    // VITE_TAGS=["v1","stable"]

    expect(content).toContain('VITE_APP_CONFIG={"api":"https://api.example.com","timeout":5000}')
    expect(content).toContain('VITE_TAGS=["v1","stable"]')
    expect(content).toContain('VITE_SIMPLE=simple-value')
  })
})
