import { describe, expect, it } from 'vitest'
import { loadCliOptions } from '../index'

describe('loadCliOptions', () => {
  it('should load default options', async () => {
    const config = await loadCliOptions()
    expect(config.cwd).toBe(process.cwd())
    expect(config.lang).toBe('zh-cn')
  })

  it('should accept overrides', async () => {
    const config = await loadCliOptions({ lang: 'en-us' })
    expect(config.lang).toBe('en-us')
  })
})
