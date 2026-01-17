import { describe, expect, it } from 'vitest'
import { clamp, inRange } from './number'

describe('number module', () => {
  describe('clamp', () => {
    it('should clamp value within range', () => {
      expect(clamp(10, 0, 5)).toBe(5)
      expect(clamp(-1, 0, 5)).toBe(0)
      expect(clamp(3, 0, 5)).toBe(3)
    })
  })

  describe('inRange', () => {
    it('should check if value is in range [start, end)', () => {
      expect(inRange(3, 1, 5)).toBe(true)
      expect(inRange(1, 1, 5)).toBe(true)
      expect(inRange(5, 1, 5)).toBe(false)
      expect(inRange(0, 1, 5)).toBe(false)
    })

    it('should handle start > end', () => {
      expect(inRange(3, 5, 1)).toBe(true)
    })
  })
})
