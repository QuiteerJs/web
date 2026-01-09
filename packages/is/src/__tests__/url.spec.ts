import { describe, expect, it } from 'vitest'
import {
  isFileUrl,
  isHttpsUrl,
  isHttpUrl,
  isImageUrl,
  isUrlString,
  isVideoUrl,
  isWebsocketUrl
} from '../url'

describe('url module', () => {
  describe('isUrlString', () => {
    it('should return true for valid URLs', () => {
      expect(isUrlString('http://example.com')).toBe(true)
      expect(isUrlString('https://example.com')).toBe(true)
      expect(isUrlString('ftp://example.com')).toBe(true)
    })

    it('should return false for invalid URLs', () => {
      expect(isUrlString('not a url')).toBe(false)
      expect(isUrlString(123)).toBe(false)
      expect(isUrlString(null)).toBe(false)
    })
  })

  describe('isHttpUrl', () => {
    it('should return true for http URLs', () => {
      expect(isHttpUrl('http://example.com')).toBe(true)
    })

    it('should return false for non-http URLs', () => {
      expect(isHttpUrl('https://example.com')).toBe(false)
      expect(isHttpUrl('ftp://example.com')).toBe(false)
    })
  })

  describe('isHttpsUrl', () => {
    it('should return true for https URLs', () => {
      expect(isHttpsUrl('https://example.com')).toBe(true)
    })

    it('should return false for non-https URLs', () => {
      expect(isHttpsUrl('http://example.com')).toBe(false)
    })
  })

  describe('isWebsocketUrl', () => {
    it('should return true for ws/wss URLs', () => {
      expect(isWebsocketUrl('ws://example.com')).toBe(true)
      expect(isWebsocketUrl('wss://example.com')).toBe(true)
    })

    it('should return false for non-websocket URLs', () => {
      expect(isWebsocketUrl('http://example.com')).toBe(false)
    })
  })

  describe('isImageUrl', () => {
    it('should return true for image URLs', () => {
      expect(isImageUrl('http://example.com/image.png')).toBe(true)
      expect(isImageUrl('image.jpg')).toBe(true)
      expect(isImageUrl('/path/to/image.svg')).toBe(true)
    })

    it('should return false for non-image URLs', () => {
      expect(isImageUrl('http://example.com/file.txt')).toBe(false)
      expect(isImageUrl('video.mp4')).toBe(false)
    })
  })

  describe('isVideoUrl', () => {
    it('should return true for video URLs', () => {
      expect(isVideoUrl('http://example.com/video.mp4')).toBe(true)
      expect(isVideoUrl('movie.mov')).toBe(true)
    })

    it('should return false for non-video URLs', () => {
      expect(isVideoUrl('image.png')).toBe(false)
    })
  })

  describe('isFileUrl', () => {
    it('should return true for file protocol URLs', () => {
      expect(isFileUrl('file:///path/to/file.txt')).toBe(true)
    })

    it('should return true for file extensions', () => {
      expect(isFileUrl('document.pdf')).toBe(true)
      expect(isFileUrl('archive.zip')).toBe(true)
    })

    it('should return false for non-file URLs', () => {
      expect(isFileUrl('http://example.com')).toBe(false)
      expect(isFileUrl('image.png')).toBe(false) // Assuming png is not in the file extension list in implementation
    })
  })
})
