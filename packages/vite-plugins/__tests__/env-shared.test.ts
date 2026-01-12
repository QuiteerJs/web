import { describe, expect, it } from 'vitest'
import {
  fromEnvKey,
  generateEnvDtsFromTypeMap,
  inferPrimitiveType,
  toEnvKey
} from '../src/shared/env-shared'

describe('env Shared', () => {
  describe('toEnvKey', () => {
    it('should convert camelCase to SCREAMING_SNAKE_CASE with prefix', () => {
      expect(toEnvKey(['VITE_'], 'apiBaseUrl')).toBe('VITE_API_BASE_URL')
    })

    it('should handle special characters', () => {
      expect(toEnvKey(['VITE_'], 'app-title')).toBe('VITE_APP_TITLE')
      expect(toEnvKey(['VITE_'], 'user.name')).toBe('VITE_USER_NAME')
    })

    it('should use default prefix if list is empty or undefined', () => {
      // Implementation uses prefixes[0] ?? 'VITE_'
      expect(toEnvKey([], 'port')).toBe('VITE_PORT')
    })
  })

  describe('fromEnvKey', () => {
    it('should restore original key from env var', () => {
      expect(fromEnvKey(['VITE_'], 'VITE_API_BASE_URL')).toBe('apiBaseUrl')
    })

    it('should return null if prefix does not match', () => {
      expect(fromEnvKey(['VITE_'], 'APP_TITLE')).toBeNull()
    })

    it('should handle multiple prefixes', () => {
      // implementation finds first match
      const prefixes = ['VITE_', 'APP_']
      expect(fromEnvKey(prefixes, 'APP_TITLE')).toBe('title')
    })

    it('should handle complex snake case', () => {
      expect(fromEnvKey(['VITE_'], 'VITE_USER_NAME_FIRST')).toBe('userNameFirst')
    })
  })

  describe('inferPrimitiveType', () => {
    it('should infer boolean', () => {
      expect(inferPrimitiveType(['true', 'false'])).toBe('boolean')
      expect(inferPrimitiveType(['true'])).toBe('boolean')
    })

    it('should infer number', () => {
      expect(inferPrimitiveType(['123', '0', '-1', '3.14'])).toBe('number')
    })

    it('should infer string for mixed or other values', () => {
      expect(inferPrimitiveType(['abc', '123'])).toBe('string')
      expect(inferPrimitiveType(['true', '1'])).toBe('string')
      expect(inferPrimitiveType([])).toBe('string')
    })
  })

  describe('generateEnvDtsFromTypeMap', () => {
    it('should generate interface definition', () => {
      const map = new Map<string, string>([
        ['VITE_APP_TITLE', 'string'],
        ['VITE_PORT', 'number']
      ])
      const dts = generateEnvDtsFromTypeMap(map)
      expect(dts).toContain('interface ImportMetaEnv {')
      expect(dts).toContain('readonly VITE_APP_TITLE: string')
      expect(dts).toContain('readonly VITE_PORT: number')
      expect(dts).toContain('interface ImportMeta {')
      expect(dts).toContain('readonly env: ImportMetaEnv')
    })
  })
})
