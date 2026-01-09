import { describe, expect, it } from 'vitest'
import { randomColor, randomInt, randomLetter } from '../random'

describe('random module', () => {
  describe('randomInt', () => {
    it('should generate random integer within range', () => {
      const min = 1
      const max = 10
      for (let i = 0; i < 100; i++) {
        const result = randomInt(min, max)
        expect(result).toBeGreaterThanOrEqual(min)
        expect(result).toBeLessThanOrEqual(max)
        expect(Number.isInteger(result)).toBe(true)
      }
    })

    it('should handle same min and max', () => {
      expect(randomInt(5, 5)).toBe(5)
    })
  })

  describe('randomColor', () => {
    it('should generate valid hex color', () => {
      for (let i = 0; i < 10; i++) {
        const color = randomColor()
        expect(color).toMatch(/^#[0-9a-f]{6}$/)
      }
    })
  })

  describe('randomLetter', () => {
    it('should generate a random letter', () => {
      for (let i = 0; i < 100; i++) {
        const letter = randomLetter()
        expect(letter).toMatch(/^[a-z]$/i)
      }
    })
  })
})
