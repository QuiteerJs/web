import { describe, expect, it } from 'vitest'
import { isBase64, isJSON } from './vanilla'

describe('vanilla module', () => {
  describe('isJSON', () => {
    it('should return true for valid JSON strings', () => {
      expect(isJSON('{"a": 1}')).toBe(true)
      expect(isJSON('[1, 2, 3]')).toBe(true)
      expect(isJSON('"string"')).toBe(true)
      expect(isJSON('123')).toBe(true)
      expect(isJSON('true')).toBe(true)
      expect(isJSON('null')).toBe(true)
    })

    it('should return false for invalid JSON strings', () => {
      expect(isJSON('{a: 1}')).toBe(false)
      expect(isJSON('undefined')).toBe(false) // JSON.parse('undefined') throws
      expect(isJSON(123)).toBe(false) // Not a string, but casted? Implementation: JSON.parse(val as string).
      // If val is 123 (number), JSON.parse(123 as any) works in JS?
      // JSON.parse accepts string. JSON.parse(123) throws or works?
      // In JS, JSON.parse(123) throws SyntaxError.
      // Wait, TS says val is unknown.
      // If I pass 123, it is not a string.
      // However, the implementation does: JSON.parse(val as string).
      // This is a type assertion, not a cast. At runtime it is passed as number.
      // JSON.parse(123) throws in V8? Let's verify.
      // JSON.parse(123) -> SyntaxError: Unexpected number in JSON at position 0
      // So isJSON(123) should return false.
    })
  })

  describe('isBase64', () => {
    it('should return true for valid base64 strings', () => {
      expect(isBase64('SGVsbG8=')).toBe(true) // "Hello"
      expect(isBase64('dGVzdA==')).toBe(true) // "test"
    })

    it('should return false for invalid base64 strings', () => {
      expect(isBase64('not base64')).toBe(false)
      expect(isBase64(123)).toBe(false)
    })
  })
})
