/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { setupRem } from './rem'

describe('rem module', () => {
  const docEl = document.documentElement

  beforeEach(() => {
    vi.useFakeTimers() // for requestAnimationFrame
    // Reset styles
    docEl.style.fontSize = ''
    if (document.body)
      document.body.style.fontSize = ''

    // Mock clientWidth
    Object.defineProperty(docEl, 'clientWidth', {
      value: 1920,
      writable: true,
      configurable: true
    })
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('should set initial font size', () => {
    const cleanup = setupRem(1920, 100, 16)
    // 1920 / 1920 * 100 = 100px
    expect(docEl.style.fontSize).toBe('100px')
    expect(document.body.style.fontSize).toBe('16px')
    cleanup()
  })

  it('should update on resize', () => {
    const cleanup = setupRem(1920, 100, 16)

    // Change width
    Object.defineProperty(docEl, 'clientWidth', { value: 960 })

    // Trigger resize
    window.dispatchEvent(new Event('resize'))

    // Wait for RAF
    vi.advanceTimersByTime(20)

    // 960 / 1920 * 100 = 50px
    expect(docEl.style.fontSize).toBe('50px')

    cleanup()
  })

  it('should throw on invalid arguments', () => {
    expect(() => setupRem(0)).toThrow()
    expect(() => setupRem(1920, 0)).toThrow()
    expect(() => setupRem(1920, 100, -1)).toThrow()
  })
})
