// 写一些判断web环境的方法
// 写一些判断web下的一些api的方法

import { is } from './type'

// 判断当前浏览器内核
export function isWebkitBrowser(): boolean {
  return /webkit/i.test(navigator.userAgent)
}

// 判断当前浏览器是否是移动端
export function isMobileBrowser(): boolean {
  return /mobile/i.test(navigator.userAgent)
}

// 判断当前浏览器是否是chrome浏览器
export function isChromeBrowser(): boolean {
  return /chrome/i.test(navigator.userAgent)
}

// 判断当前浏览器是否是firefox浏览器
export function isFirefoxBrowser(): boolean {
  return /firefox/i.test(navigator.userAgent)
}

// 判断当前浏览器是否是safari浏览器
export function isSafariBrowser(): boolean {
  return /safari/i.test(navigator.userAgent)
}

// 判断当前浏览器是否是opera浏览器
export function isOperaBrowser(): boolean {
  return /opera/i.test(navigator.userAgent)
}

// 判断当前浏览器是否是edge浏览器
export function isEdgeBrowser(): boolean {
  return /edge/i.test(navigator.userAgent)
}

// 判断当前浏览器是否是ie浏览器
export function isIEBrowser(): boolean {
  return /msie|trident/i.test(navigator.userAgent)
}

// 判断当前浏览器是否是mac浏览器
export function isMacBrowser(): boolean {
  return /macintosh/i.test(navigator.userAgent)
}

// 判断当前浏览器是否是windows浏览器
export function isWindowsBrowser(): boolean {
  return /windows/i.test(navigator.userAgent)
}

// 判断当前浏览器是否是linux浏览器
export function isLinuxBrowser(): boolean {
  return /linux/i.test(navigator.userAgent)
}

// 判断当前浏览器是否是android浏览器
export function isAndroidBrowser(): boolean {
  return /android/i.test(navigator.userAgent)
}

// 判断当前浏览器是否是ios浏览器
export function isIOSBrowser(): boolean {
  return /ios/i.test(navigator.userAgent)
}

/** @description: 是否客户端 */
export function isClient() {
  return typeof window !== 'undefined'
}

/** @description: 是否为浏览器 */
export function isWindow(val: any): val is Window {
  return typeof window !== 'undefined' && is(val, 'Window')
}

// 是否微信小程序
export function isWechatMiniProgram(): boolean {
  return /miniProgram/i.test(navigator.userAgent)
}

// 是否支付宝小程序
export function isAlipayMiniProgram(): boolean {
  return /alipay/i.test(navigator.userAgent)
}

// 是否百度小程序
export function isBaiduMiniProgram(): boolean {
  return /baiduminiProgram/i.test(navigator.userAgent)
}

// 是否字节跳动小程序
export function isByteDanceMiniProgram(): boolean {
  return /bytedance/i.test(navigator.userAgent)
}

// 是否QQ小程序
export function isQQMiniProgram(): boolean {
  return /qqminiProgram/i.test(navigator.userAgent)
}
