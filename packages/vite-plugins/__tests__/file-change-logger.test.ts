import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { fileChangeLoggerPlugin } from '../src/file-change-logger'

// Mock utils
vi.mock('@quiteer/utils', () => ({
  formatTimestamp: () => '12:00:00'
}))

describe('file Change Logger Plugin', () => {
  let consoleSpy: any

  beforeEach(() => {
    consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  afterEach(() => {
    consoleSpy.mockRestore()
  })

  it('should create plugin with default options', () => {
    const plugin = fileChangeLoggerPlugin()
    expect(plugin.name).toBe('quiteer-file-change-logger')
    expect(plugin.apply).toBeDefined()
    expect(plugin.configureServer).toBeDefined()
  })

  it('should only apply in serve mode by default', () => {
    const plugin = fileChangeLoggerPlugin()
    // @ts-expect-error test
    expect(plugin.apply({}, { command: 'serve' })).toBe(true)
    // @ts-expect-error test
    expect(plugin.apply({}, { command: 'build' })).toBe(false)
  })

  it('should apply in build mode if devOnly is false', () => {
    const plugin = fileChangeLoggerPlugin({ devOnly: false })
    // @ts-expect-error test
    expect(plugin.apply({}, { command: 'build' })).toBe(true)
  })

  it('should log change events', () => {
    const plugin = fileChangeLoggerPlugin()
    const onFn = vi.fn()
    const server = {
      watcher: {
        on: onFn
      }
    } as any
    // @ts-expect-error test
    plugin.configureServer(server)

    // Check if watcher listeners are registered
    expect(onFn).toHaveBeenCalledWith('change', expect.any(Function))
    expect(onFn).toHaveBeenCalledWith('add', expect.any(Function))
    expect(onFn).toHaveBeenCalledWith('unlink', expect.any(Function))

    // Trigger change callback
    const changeCallback = onFn.mock.calls.find((call: any) => call[0] === 'change')![1]
    changeCallback('/path/to/file.ts')

    expect(consoleSpy).toHaveBeenCalled()
    const logArgs = consoleSpy.mock.calls[0][0]
    expect(logArgs).toContain('[file]')
    expect(logArgs).toContain('修改')
    expect(logArgs).toContain('12:00:00')
    expect(logArgs).toContain('/path/to/file.ts')
  })

  it('should respect events option', () => {
    const plugin = fileChangeLoggerPlugin({ events: ['add'] })
    const onFn = vi.fn()
    const server = { watcher: { on: onFn } } as any
    // @ts-expect-error test
    plugin.configureServer(server)

    expect(onFn).toHaveBeenCalledWith('add', expect.any(Function))
    expect(onFn).not.toHaveBeenCalledWith('change', expect.any(Function))
    expect(onFn).not.toHaveBeenCalledWith('unlink', expect.any(Function))
  })
})
