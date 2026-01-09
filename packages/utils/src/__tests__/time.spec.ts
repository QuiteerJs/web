import { describe, expect, it } from 'vitest'
import { formatTimestamp } from '../time'

describe('time module', () => {
  describe('formatTimestamp', () => {
    it('should format date to YYYY-MM-DD HH:mm:ss', () => {
      // Create a date with fixed components to test formatting
      // Note: formatTimestamp uses local time.
      // We can construct a date and verify the components match.
      const d = new Date(2023, 0, 15, 12, 30, 45) // Jan 15 2023 12:30:45
      const result = formatTimestamp(d)

      // Expected format: 2023-01-15 12:30:45
      // Since we created the date using local time components (by default new Date(y,m,d...) uses local),
      // the output should match exactly.
      expect(result).toBe('2023-01-15 12:30:45')
    })

    it('should pad single digits', () => {
      const d = new Date(2023, 0, 1, 1, 1, 1) // Jan 1 2023 01:01:01
      const result = formatTimestamp(d)
      expect(result).toBe('2023-01-01 01:01:01')
    })
  })
})
