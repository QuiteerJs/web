import { describe, expect, it } from 'vitest'
import { decode, safeDecode } from '../extra/obfuscation'

describe('obfuscation', () => {
  const PREFIX = '__ENC__'
  const SUFFIX = '__END__'
  const plain = 'Hello World'
  // "Hello World" in Base64 is "SGVsbG8gV29ybGQ="
  const encoded = `${PREFIX}SGVsbG8gV29ybGQ=${SUFFIX}`

  describe('decode', () => {
    it('should decode a valid encoded string', () => {
      expect(decode(encoded)).toBe(plain)
    })

    it('should throw error for invalid format', () => {
      expect(() => decode('invalid')).toThrow('Invalid encoded string')
      expect(() => decode(`${PREFIX}content`)).toThrow('Invalid encoded string')
      expect(() => decode(`content${SUFFIX}`)).toThrow('Invalid encoded string')
    })

    it('should handle special characters', () => {
      // "你好" -> "5L2g5aW9"
      const special = '你好'
      const specialEncoded = `${PREFIX}5L2g5aW9${SUFFIX}`
      expect(decode(specialEncoded)).toBe(special)
    })
  })

  describe('safeDecode', () => {
    it('should decode a valid encoded string', () => {
      expect(safeDecode(encoded)).toBe(plain)
    })

    it('should return original string if not encoded', () => {
      expect(safeDecode('plain text')).toBe('plain text')
    })
  })
})
