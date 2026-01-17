/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { copyText, readText } from './clipboard'

describe('clipboard module', () => {
  const originalClipboard = navigator.clipboard
  const originalExecCommand = document.execCommand

  beforeEach(() => {
    // Reset mocks
    vi.clearAllMocks()

    // Mock clipboard API
    Object.defineProperty(navigator, 'clipboard', {
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
        readText: vi.fn().mockResolvedValue('clipboard content')
      },
      writable: true,
      configurable: true
    })

    // Mock document.execCommand
    document.execCommand = vi.fn().mockReturnValue(true)
  })

  afterEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      value: originalClipboard,
      writable: true,
      configurable: true
    })
    document.execCommand = originalExecCommand
  })

  describe('copyText', () => {
    it('should use navigator.clipboard.writeText if available', async () => {
      const result = await copyText('test')
      expect(navigator.clipboard.writeText).toHaveBeenCalledWith('test')
      expect(result).toBe(true)
    })

    it('should fallback to execCommand if clipboard API fails', async () => {
      // Mock writeText to fail
      (navigator.clipboard.writeText as any).mockRejectedValue(new Error('Failed'))

      const result = await copyText('fallback test')
      expect(document.execCommand).toHaveBeenCalledWith('copy')
      expect(result).toBe(true)
    })

    it('should return false if both methods fail', async () => {
      // Mock both to fail
      (navigator.clipboard.writeText as any).mockRejectedValue(new Error('Failed'));
      (document.execCommand as any).mockImplementation(() => {
        throw new Error('Exec failed')
      })

      const result = await copyText('fail test')
      expect(result).toBe(false)
    })
  })

  describe('readText', () => {
    it('should use navigator.clipboard.readText', async () => {
      const text = await readText()
      expect(navigator.clipboard.readText).toHaveBeenCalled()
      expect(text).toBe('clipboard content')
    })

    it('should return null if clipboard API unavailable', async () => {
      Object.defineProperty(navigator, 'clipboard', { value: undefined })
      const text = await readText()
      expect(text).toBeNull()
    })

    it('should return null if readText fails', async () => {
      (navigator.clipboard.readText as any).mockRejectedValue(new Error('Failed'))
      const text = await readText()
      expect(text).toBeNull()
    })
  })
})
