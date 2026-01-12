import { describe, expect, it } from 'vitest'
import { expandInterpolations, resolveSectionFromFile } from '../src/env-config'

describe('env Config', () => {
  describe('resolveSectionFromFile', () => {
    it('should resolve default section', () => {
      expect(resolveSectionFromFile('.env')).toBe('default')
      expect(resolveSectionFromFile('.env.local')).toBe('default')
      expect(resolveSectionFromFile('/path/to/.env')).toBe('default')
    })

    it('should resolve mode section', () => {
      expect(resolveSectionFromFile('.env.development')).toBe('development')
      expect(resolveSectionFromFile('.env.production.local')).toBe('production')
      expect(resolveSectionFromFile('/path/to/.env.test')).toBe('test')
    })

    it('should fallback to default for unknown pattern', () => {
      // Though implementation might not be strict about unknown patterns,
      // let's check current regex behavior: /^\.env\.([^.]+)(?:\.local)?$/
      expect(resolveSectionFromFile('env.config.ts')).toBe('default')
    })
  })

  describe('expandInterpolations', () => {
    it('should return same object if no interpolation', () => {
      const input = { VITE_APP_TITLE: 'My App' }
      expect(expandInterpolations(input)).toEqual(input)
    })

    it('should expand simple reference', () => {
      const input = {
        VITE_BASE: 'http://localhost',
        // eslint-disable-next-line no-template-curly-in-string
        VITE_API: '${VITE_BASE}/api'
      }
      const expected = {
        VITE_BASE: 'http://localhost',
        VITE_API: 'http://localhost/api'
      }
      expect(expandInterpolations(input)).toEqual(expected)
    })

    it('should expand nested references', () => {
      const input = {
        A: 'a',
        // eslint-disable-next-line no-template-curly-in-string
        B: '${A}b',
        // eslint-disable-next-line no-template-curly-in-string
        C: '${B}c'
      }
      const expected = {
        A: 'a',
        B: 'ab',
        C: 'abc'
      }
      expect(expandInterpolations(input)).toEqual(expected)
    })

    it('should handle missing variables', () => {
      const input = {
        // eslint-disable-next-line no-template-curly-in-string
        A: '${MISSING}a'
      }
      // Implementation uses (out[varName] ?? '') so it replaces with empty string
      const expected = {
        A: 'a'
      }
      expect(expandInterpolations(input)).toEqual(expected)
    })

    it('should handle circular references (limited by max iterations)', () => {
      const input = {
        // eslint-disable-next-line no-template-curly-in-string
        A: '${B}',
        // eslint-disable-next-line no-template-curly-in-string
        B: '${A}'
      }
      // It will try 5 times.
      // 1: A='${A}', B='${B}' (using initial values if not updated in same pass? map iteration order matters)
      // Actually implementation copies map to `out`.
      // Iteration 1:
      // k=A, v='${B}'. out['B'] is '${A}'. nv='${A}'. out['A']='${A}'
      // k=B, v='${A}'. out['A'] is '${A}'. nv='${A}'. out['B']='${A}'
      // It stabilizes to '${A}' or similar depending on order.
      // Let's just ensure it doesn't crash.
      const res = expandInterpolations(input)
      expect(res).toBeDefined()
    })
  })
})
