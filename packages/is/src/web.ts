/** @description: Web 环境相关判断方法集合 */

import { is } from './type'

/** @description: 判断当前浏览器是否为 WebKit 内核 */
export function isWebkitBrowser(): boolean {
  return /webkit/i.test(navigator.userAgent)
}

/** @description: 判断当前浏览器是否为移动端 */
export function isMobileBrowser(): boolean {
  return /mobile/i.test(navigator.userAgent)
}

/** @description: 判断当前浏览器是否为 Chrome 浏览器 */
export function isChromeBrowser(): boolean {
  return /chrome/i.test(navigator.userAgent)
}

/** @description: 判断当前浏览器是否为 Firefox 浏览器 */
export function isFirefoxBrowser(): boolean {
  return /firefox/i.test(navigator.userAgent)
}

/** @description: 判断当前浏览器是否为 Safari 浏览器 */
export function isSafariBrowser(): boolean {
  return /safari/i.test(navigator.userAgent)
}

/** @description: 判断当前浏览器是否为 Opera 浏览器 */
export function isOperaBrowser(): boolean {
  return /opera/i.test(navigator.userAgent)
}

/** @description: 判断当前浏览器是否为 Edge 浏览器 */
export function isEdgeBrowser(): boolean {
  return /edge/i.test(navigator.userAgent)
}

/** @description: 判断当前浏览器是否为 IE 浏览器 */
export function isIEBrowser(): boolean {
  return /msie|trident/i.test(navigator.userAgent)
}

/** @description: 判断当前系统是否为 macOS */
export function isMacBrowser(): boolean {
  return /macintosh/i.test(navigator.userAgent)
}

/** @description: 判断当前系统是否为 Windows */
export function isWindowsBrowser(): boolean {
  return /windows/i.test(navigator.userAgent)
}

/** @description: 判断当前系统是否为 Linux */
export function isLinuxBrowser(): boolean {
  return /linux/i.test(navigator.userAgent)
}

/** @description: 判断当前系统是否为 Android */
export function isAndroidBrowser(): boolean {
  return /android/i.test(navigator.userAgent)
}

/** @description: 判断当前系统是否为 iOS */
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

/** @description: 是否为微信小程序环境 */
export function isWechatMiniProgram(): boolean {
  return /miniProgram/i.test(navigator.userAgent)
}

/** @description: 是否为支付宝小程序环境 */
export function isAlipayMiniProgram(): boolean {
  return /alipay/i.test(navigator.userAgent)
}

/** @description: 是否为百度小程序环境 */
export function isBaiduMiniProgram(): boolean {
  return /baiduminiProgram/i.test(navigator.userAgent)
}

/** @description: 是否为字节跳动小程序环境 */
export function isByteDanceMiniProgram(): boolean {
  return /bytedance/i.test(navigator.userAgent)
}

/** @description: 是否为 QQ 小程序环境 */
export function isQQMiniProgram(): boolean {
  return /qqminiProgram/i.test(navigator.userAgent)
}
