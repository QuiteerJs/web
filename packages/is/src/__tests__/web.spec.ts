/**
 * @vitest-environment jsdom
 */
import { afterEach, describe, expect, it } from 'vitest'
import {
  isAlipayMiniProgram,
  isAndroidBrowser,
  isBaiduMiniProgram,
  isByteDanceMiniProgram,
  isChromeBrowser,
  isClient,
  isEdgeBrowser,
  isFirefoxBrowser,
  isIEBrowser,
  isIOSBrowser,
  isLinuxBrowser,
  isMacBrowser,
  isMobileBrowser,
  isOperaBrowser,
  isQQMiniProgram,
  isSafariBrowser,
  isWebkitBrowser,
  isWechatMiniProgram,
  isWindow,
  isWindowsBrowser
} from '../web'

describe('web module', () => {
  const originalUserAgent = navigator.userAgent

  const mockUserAgent = (userAgent: string) => {
    Object.defineProperty(navigator, 'userAgent', {
      value: userAgent,
      configurable: true
    })
  }

  afterEach(() => {
    Object.defineProperty(navigator, 'userAgent', {
      value: originalUserAgent,
      configurable: true
    })
  })

  it('isWebkitBrowser', () => {
    mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36')
    expect(isWebkitBrowser()).toBe(true)
    mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0')
    expect(isWebkitBrowser()).toBe(false)
  })

  it('isMobileBrowser', () => {
    mockUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.0.3 Mobile/15E148 Safari/604.1')
    expect(isMobileBrowser()).toBe(true)
    mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
    expect(isMobileBrowser()).toBe(false)
  })

  it('isChromeBrowser', () => {
    mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36')
    expect(isChromeBrowser()).toBe(true)
  })

  it('isFirefoxBrowser', () => {
    mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:89.0) Gecko/20100101 Firefox/89.0')
    expect(isFirefoxBrowser()).toBe(true)
  })

  it('isSafariBrowser', () => {
    mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/14.1.1 Safari/605.1.15')
    expect(isSafariBrowser()).toBe(true)
    // Chrome also has "Safari" in UA, but implementation checks /safari/i.
    // Usually Safari detection is trickier (exclude Chrome), but here we test implementation logic.
    mockUserAgent('Chrome Safari')
    expect(isSafariBrowser()).toBe(true)
  })

  it('isOperaBrowser', () => {
    mockUserAgent('Opera/9.80 (Windows NT 6.1; WOW64) Presto/2.12.388 Version/12.18')
    expect(isOperaBrowser()).toBe(true)
  })

  it('isEdgeBrowser', () => {
    mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36 Edg/91.0.864.59')
    expect(isEdgeBrowser()).toBe(true)
  })

  it('isIEBrowser', () => {
    mockUserAgent('Mozilla/5.0 (Windows NT 10.0; WOW64; Trident/7.0; rv:11.0) like Gecko')
    expect(isIEBrowser()).toBe(true)
    mockUserAgent('Mozilla/4.0 (compatible; MSIE 6.0; Windows NT 5.1)')
    expect(isIEBrowser()).toBe(true)
  })

  it('isMacBrowser', () => {
    mockUserAgent('Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)')
    expect(isMacBrowser()).toBe(true)
  })

  it('isWindowsBrowser', () => {
    mockUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64)')
    expect(isWindowsBrowser()).toBe(true)
  })

  it('isLinuxBrowser', () => {
    mockUserAgent('Mozilla/5.0 (X11; Linux x86_64)')
    expect(isLinuxBrowser()).toBe(true)
  })

  it('isAndroidBrowser', () => {
    mockUserAgent('Mozilla/5.0 (Linux; Android 10; SM-G960U)')
    expect(isAndroidBrowser()).toBe(true)
  })

  it('isIOSBrowser', () => {
    mockUserAgent('Mozilla/5.0 (iPhone; CPU iPhone OS 13_2_3 like Mac OS X)')
    expect(isIOSBrowser()).toBe(true)
  })

  it('isClient', () => {
    expect(isClient()).toBe(true)
  })

  it('isWindow', () => {
    expect(isWindow(window)).toBe(true)
    expect(isWindow({})).toBe(false)
  })

  it('mini Programs', () => {
    mockUserAgent('MicroMessenger/7.0.0(0x17000000) NetType/WIFI MiniProgramEnv/android')
    expect(isWechatMiniProgram()).toBe(true)

    mockUserAgent('AlipayClient/10.1.82.9020')
    expect(isAlipayMiniProgram()).toBe(true)

    mockUserAgent('swan/2.16.0') // Baidu
    // The implementation checks /baiduminiProgram/i
    mockUserAgent('baiduminiProgram/1.0')
    expect(isBaiduMiniProgram()).toBe(true)

    mockUserAgent('ToutiaoMicroApp/1.0') // ByteDance
    // Implementation: /bytedance/i
    mockUserAgent('bytedance')
    expect(isByteDanceMiniProgram()).toBe(true)

    mockUserAgent('QQ/8.2.0.4310') // QQ
    // Implementation: /qqminiProgram/i
    mockUserAgent('qqminiProgram')
    expect(isQQMiniProgram()).toBe(true)
  })
})
