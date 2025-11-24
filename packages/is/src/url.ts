import { isString } from './type'

function tryParseUrl(str: string): URL | null {
  try {
    return new URL(str)
  }
  catch {
    return null
  }
}

function getPathname(input: string): string {
  const u = tryParseUrl(input)
  const p = u ? u.pathname : input
  return p.split(/[?#]/)[0]
}

/** @description: 判断是否是 URL 字符串 */
export function isUrlString(val: unknown): val is string {
  if (!isString(val))
    return false
  return tryParseUrl(val) !== null
}

/** @description: 判断是否是 http 链接 */
export function isHttpUrl(val: unknown): val is string {
  if (!isString(val))
    return false
  const u = tryParseUrl(val)
  return !!u && u.protocol === 'http:'
}

/** @description: 判断是否是 https 链接 */
export function isHttpsUrl(val: unknown): val is string {
  if (!isString(val))
    return false
  const u = tryParseUrl(val)
  return !!u && u.protocol === 'https:'
}

/** @description: 判断是否是 websocket 链接 */
export function isWebsocketUrl(val: unknown): val is string {
  if (!isString(val))
    return false
  const u = tryParseUrl(val)
  return !!u && (u.protocol === 'ws:' || u.protocol === 'wss:')
}

/** @description: 判断是否是图片链接 */
export function isImageUrl(val: unknown): boolean {
  if (!isString(val))
    return false
  const path = getPathname(val).toLowerCase()
  return /\.(?:png|jpg|jpeg|gif|webp|bmp|svg)$/.test(path)
}

/** @description: 判断是否是视频链接 */
export function isVideoUrl(val: unknown): boolean {
  if (!isString(val))
    return false
  const path = getPathname(val).toLowerCase()
  return /\.(?:mp4|webm|ogg|mov|m3u8)$/.test(path)
}

/** @description: 判断是否是文件链接 */
export function isFileUrl(val: unknown): boolean {
  if (!isString(val))
    return false
  const u = tryParseUrl(val)
  if (u && u.protocol === 'file:')
    return true
  const path = getPathname(val).toLowerCase()
  return /\.(?:pdf|doc|docx|xls|xlsx|ppt|pptx|csv|txt|zip|rar|7z|tar|gz|bz2|apk|dmg|exe)$/.test(path)
}
