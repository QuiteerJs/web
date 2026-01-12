import { promises as fs } from 'node:fs'
import path from 'node:path'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { mockRouterPlugin } from '../src/mock-router'

// Mock fs module
vi.mock('node:fs', () => ({
  promises: {
    access: vi.fn(),
    readFile: vi.fn()
  }
}))

describe('mock Router Plugin', () => {
  const root = '/project/root'
  const mockDir = path.join(root, 'mock')

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should create plugin with default options', () => {
    const plugin = mockRouterPlugin()
    expect(plugin.name).toBe('quiteer-mock-router')
    expect(plugin.apply).toBeDefined()
    expect(plugin.configResolved).toBeDefined()
    expect(plugin.configureServer).toBeDefined()
  })

  it('should resolve mock directory correctly', () => {
    const plugin = mockRouterPlugin({ mockDir: 'custom-mock' })
    const config = { root } as any
    // @ts-expect-error test
    plugin.configResolved(config)

    // We can't easily access the internal variable mockAbsDir directly,
    // but we can verify it via the middleware behavior or if we could inspect closure state.
    // Since we can't inspect closure state, we will rely on middleware tests.
  })

  describe('middleware', () => {
    let middleware: any
    let req: any
    let res: any
    let next: any

    const setupPlugin = (options = {}) => {
      const plugin = mockRouterPlugin(options)
      const config = { root } as any
      // @ts-expect-error test
      plugin.configResolved(config)

      const server = {
        middlewares: {
          use: (fn: any) => { middleware = fn }
        }
      } as any
      // @ts-expect-error test
      plugin.configureServer(server)
    }

    beforeEach(() => {
      req = { url: '/api/user' }
      res = {
        statusCode: 200,
        setHeader: vi.fn(),
        end: vi.fn()
      }
      next = vi.fn()
    })

    it('should pass if path does not start with apiPrefix', async () => {
      setupPlugin()
      req.url = '/other/path'
      await middleware(req, res, next)
      expect(next).toHaveBeenCalled()
      expect(res.end).not.toHaveBeenCalled()
    })

    it('should serve mock file if exists', async () => {
      setupPlugin()
      // Mock file exists
      // @ts-expect-error test
      fs.access.mockResolvedValue(undefined)
      // @ts-expect-error test
      fs.readFile.mockResolvedValue(JSON.stringify({ name: 'test' }))

      await middleware(req, res, next)

      const expectedPath = path.join(mockDir, 'user.json')
      expect(fs.access).toHaveBeenCalledWith(expectedPath)
      expect(fs.readFile).toHaveBeenCalledWith(expectedPath, 'utf8')

      expect(res.statusCode).toBe(200)
      expect(res.setHeader).toHaveBeenCalledWith('Content-Type', 'application/json; charset=utf-8')
      expect(JSON.parse(res.end.mock.calls[0][0])).toEqual({ name: 'test' })
      expect(next).not.toHaveBeenCalled()
    })

    it('should pass if mock file does not exist (default onMiss="pass")', async () => {
      setupPlugin()
      // Mock file missing
      // @ts-expect-error test
      fs.access.mockRejectedValue(new Error('ENOENT'))

      await middleware(req, res, next)

      expect(next).toHaveBeenCalled()
      expect(res.end).not.toHaveBeenCalled()
    })

    it('should return 404 if onMiss="404"', async () => {
      setupPlugin({ onMiss: '404' })
      // Mock file missing
      // @ts-expect-error test
      fs.access.mockRejectedValue(new Error('ENOENT'))

      await middleware(req, res, next)

      expect(next).not.toHaveBeenCalled()
      expect(res.statusCode).toBe(404)
      expect(res.end).toHaveBeenCalled()
    })

    it('should handle errors during read', async () => {
      setupPlugin()
      // File exists but read fails
      // @ts-expect-error test
      fs.access.mockResolvedValue(undefined)
      // @ts-expect-error test
      fs.readFile.mockRejectedValue(new Error('Read Error'))

      await middleware(req, res, next)

      expect(res.statusCode).toBe(500)
      expect(JSON.parse(res.end.mock.calls[0][0]).message).toBe('Mock Error')
    })

    it('should support delay', async () => {
      vi.useFakeTimers()
      setupPlugin({ delay: 1000 })
      // @ts-expect-error test
      fs.access.mockResolvedValue(undefined)
      // @ts-expect-error test
      fs.readFile.mockResolvedValue('{}')

      const promise = middleware(req, res, next)

      // Wait for middleware to finish setting up the timer
      await promise

      expect(res.end).not.toHaveBeenCalled()
      vi.advanceTimersByTime(1000)

      expect(res.end).toHaveBeenCalled()
      vi.useRealTimers()
    })
  })
})
