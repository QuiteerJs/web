import { describe, expect, it, vi } from 'vitest'
import { assert, debounce, once, throttle } from '../function'

describe('function module', () => {
  describe('debounce', () => {
    it('should debounce function execution', async () => {
      vi.useFakeTimers()
      const fn = vi.fn()
      const debounced = debounce(fn, 100)

      debounced()
      debounced()
      debounced()

      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      expect(fn).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
    })

    it('should support immediate execution', () => {
      vi.useFakeTimers()
      const fn = vi.fn()
      const debounced = debounce(fn, 100, true)

      debounced()
      expect(fn).toHaveBeenCalledTimes(1)

      debounced()
      expect(fn).toHaveBeenCalledTimes(1) // Should wait

      vi.advanceTimersByTime(100)
      debounced()
      expect(fn).toHaveBeenCalledTimes(3)
      vi.useRealTimers()
    })

    it('should support cancel', () => {
      vi.useFakeTimers()
      const fn = vi.fn()
      const debounced = debounce(fn, 100)

      debounced()
      debounced.cancel()
      vi.advanceTimersByTime(100)
      expect(fn).not.toHaveBeenCalled()
      vi.useRealTimers()
    })
  })

  describe('throttle', () => {
    it('should throttle function execution', () => {
      vi.useFakeTimers()
      const fn = vi.fn()
      const throttled = throttle(fn, 100)

      throttled()
      throttled()
      throttled()

      expect(fn).toHaveBeenCalledTimes(1) // Leading edge

      vi.advanceTimersByTime(100)
      expect(fn).toHaveBeenCalledTimes(2) // Trailing edge
      vi.useRealTimers()
    })

    it('should respect leading: false', () => {
      vi.useFakeTimers()
      const fn = vi.fn()
      const throttled = throttle(fn, 100, false)

      throttled()
      throttled() // Call twice to trigger trailing
      expect(fn).not.toHaveBeenCalled()

      vi.advanceTimersByTime(100)
      expect(fn).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
    })

    it('should respect trailing: false', () => {
      vi.useFakeTimers()
      const fn = vi.fn()
      const throttled = throttle(fn, 100, true, false)

      throttled()
      expect(fn).toHaveBeenCalledTimes(1)

      throttled()
      vi.advanceTimersByTime(100)
      expect(fn).toHaveBeenCalledTimes(1)
      vi.useRealTimers()
    })
  })

  describe('once', () => {
    it('should execute function only once', () => {
      const fn = vi.fn(() => 1)
      const onced = once(fn)

      expect(onced()).toBe(1)
      expect(onced()).toBe(1)
      expect(fn).toHaveBeenCalledTimes(1)
    })
  })

  describe('assert', () => {
    it('should throw error if condition is false', () => {
      expect(() => assert(false, 'error')).toThrow('error')
    })

    it('should not throw if condition is true', () => {
      expect(() => assert(true)).not.toThrow()
    })
  })
})
