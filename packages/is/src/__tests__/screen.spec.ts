/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import {
  isBetweenWidth,
  isHoverCapable,
  isLandscape,
  isLg,
  isMaxWidth,
  isMd,
  isMinWidth,
  isPointerCoarse,
  isPortrait,
  isRetina,
  isSm,
  isXl,
  isXs,
  matchesMedia,
  prefersColorSchemeDark,
  prefersColorSchemeLight,
  prefersReducedMotion,
  supportsMatchMedia
} from '../screen'

describe('screen module', () => {
  const originalMatchMedia = window.matchMedia

  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: vi.fn(),
        removeListener: vi.fn(),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn(),
        dispatchEvent: vi.fn()
      }))
    })
  })

  afterEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: originalMatchMedia
    })
  })

  it('supportsMatchMedia', () => {
    expect(supportsMatchMedia()).toBe(true)
  })

  it('matchesMedia', () => {
    (window.matchMedia as any).mockReturnValue({ matches: true })
    expect(matchesMedia('(min-width: 100px)')).toBe(true)
    expect(window.matchMedia).toHaveBeenCalledWith('(min-width: 100px)')
  })

  it('isPortrait', () => {
    (window.matchMedia as any).mockImplementation((query: string) => ({
      matches: query === '(orientation: portrait)'
    }))
    expect(isPortrait()).toBe(true)
  })

  it('isLandscape', () => {
    (window.matchMedia as any).mockImplementation((query: string) => ({
      matches: query === '(orientation: landscape)'
    }))
    expect(isLandscape()).toBe(true)
  })

  it('prefersColorSchemeDark', () => {
    (window.matchMedia as any).mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: dark)'
    }))
    expect(prefersColorSchemeDark()).toBe(true)
  })

  it('prefersColorSchemeLight', () => {
    (window.matchMedia as any).mockImplementation((query: string) => ({
      matches: query === '(prefers-color-scheme: light)'
    }))
    expect(prefersColorSchemeLight()).toBe(true)
  })

  it('prefersReducedMotion', () => {
    (window.matchMedia as any).mockImplementation((query: string) => ({
      matches: query === '(prefers-reduced-motion: reduce)'
    }))
    expect(prefersReducedMotion()).toBe(true)
  })

  it('isRetina resolution', () => {
    // Case 1: matchesMedia returns true
    (window.matchMedia as any).mockImplementation((query: string) => ({
      matches: query === '(min-resolution: 2dppx)'
    }))
    const result = isRetina()
    expect(result).toBe(true)
  })

  it('isRetina dpr', () => {
    // Case 2: devicePixelRatio
    (window.matchMedia as any).mockReturnValue({ matches: false })
    const originalDPR = window.devicePixelRatio

    // Mocking devicePixelRatio
    Object.defineProperty(window, 'devicePixelRatio', {
      writable: true,
      value: 2
    })

    expect(isRetina()).toBe(true)

    window.devicePixelRatio = 1
    expect(isRetina()).toBe(false)

    // Restore
    if (originalDPR !== undefined) {
      window.devicePixelRatio = originalDPR
    }
  })

  it('isHoverCapable', () => {
    (window.matchMedia as any).mockImplementation((query: string) => ({
      matches: query === '(hover: hover)'
    }))
    expect(isHoverCapable()).toBe(true)
  })

  it('isPointerCoarse', () => {
    (window.matchMedia as any).mockImplementation((query: string) => ({
      matches: query === '(pointer: coarse)'
    }))
    expect(isPointerCoarse()).toBe(true)
  })

  it('isMinWidth', () => {
    (window.matchMedia as any).mockImplementation((query: string) => ({
      matches: query === '(min-width: 100px)'
    }))
    expect(isMinWidth(100)).toBe(true)
  })

  it('isMaxWidth', () => {
    (window.matchMedia as any).mockImplementation((query: string) => ({
      matches: query === '(max-width: 100px)'
    }))
    expect(isMaxWidth(100)).toBe(true)
  })

  it('isBetweenWidth', () => {
    (window.matchMedia as any).mockImplementation((query: string) => ({
      matches: query === '(min-width: 100px) and (max-width: 200px)'
    }))
    expect(isBetweenWidth(100, 200)).toBe(true)
    expect(() => isBetweenWidth(200, 100)).toThrow()
  })

  it('breakpoints (isXs, isSm, isMd, isLg, isXl)', () => {
    (window.matchMedia as any).mockImplementation((query: string) => {
      const mapping: Record<string, boolean> = {
        '(max-width: 639px)': true, // xs
        '(min-width: 640px) and (max-width: 767px)': true, // sm
        '(min-width: 768px) and (max-width: 1023px)': true, // md
        '(min-width: 1024px) and (max-width: 1279px)': true, // lg
        '(min-width: 1280px)': true // xl
      }
      return { matches: !!mapping[query] }
    })

    expect(isXs()).toBe(true)
    expect(isSm()).toBe(true)
    expect(isMd()).toBe(true)
    expect(isLg()).toBe(true)
    expect(isXl()).toBe(true)
  })
})
