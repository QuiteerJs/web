/**
 * @vitest-environment jsdom
 */
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { downloadByBase64, downloadByBlob, downloadByUrl } from '../../windows/download'

describe('download module', () => {
  const originalURL = window.URL
  const originalFetch = window.fetch

  beforeEach(() => {
    window.URL.createObjectURL = vi.fn(() => 'blob:url')
    window.URL.revokeObjectURL = vi.fn()

    // Mock fetch
    window.fetch = vi.fn().mockResolvedValue({
      blob: () => Promise.resolve(new Blob(['content']))
    })

    // Mock document.body.appendChild/removeChild/click
    vi.spyOn(document.body, 'appendChild')
    vi.spyOn(document.body, 'removeChild')
  })

  afterEach(() => {
    window.URL = originalURL
    window.fetch = originalFetch
    vi.restoreAllMocks()
  })

  describe('downloadByBlob', () => {
    it('should create link and trigger download', () => {
      const blob = new Blob(['test'])
      downloadByBlob(blob, 'test.txt')

      expect(window.URL.createObjectURL).toHaveBeenCalledWith(blob)
      expect(document.body.appendChild).toHaveBeenCalled()
      // We can't easily verify click() in JSDOM on unattached elements without more setup,
      // but we can check if removeChild was called which happens after click
      expect(document.body.removeChild).toHaveBeenCalled()
      expect(window.URL.revokeObjectURL).toHaveBeenCalledWith('blob:url')
    })
  })

  describe('downloadByBase64', () => {
    it('should convert base64 to blob and download', () => {
      const base64 = 'data:text/plain;base64,SGVsbG8=' // Hello
      downloadByBase64(base64, 'test.txt')

      expect(window.URL.createObjectURL).toHaveBeenCalled()
    })

    it('should handle base64 without prefix', () => {
      const base64 = 'SGVsbG8='
      downloadByBase64(base64, 'test.txt', 'text/plain')
      expect(window.URL.createObjectURL).toHaveBeenCalled()
    })
  })

  describe('downloadByUrl', () => {
    it('should download by href (default)', async () => {
      const result = await downloadByUrl('http://example.com/file.pdf')
      expect(result).toBe(true)
      expect(document.body.appendChild).toHaveBeenCalled()
    })

    it('should download by blob when target is blob', async () => {
      const result = await downloadByUrl('http://example.com/image.png', {
        target: 'blob',
        fileName: 'image.png'
      })

      expect(window.fetch).toHaveBeenCalledWith('http://example.com/image.png')
      expect(window.URL.createObjectURL).toHaveBeenCalled()
      expect(result).toBe(true)
    })

    it('should return false if fetch fails in blob mode', async () => {
      (window.fetch as any).mockRejectedValue(new Error('Fetch failed'))
      const result = await downloadByUrl('http://example.com/fail', { target: 'blob' })
      expect(result).toBe(false)
    })
  })
})
