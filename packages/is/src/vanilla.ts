import { isString } from './type'

/** @description: 是否为 JSON 字符串 */
export function isJSON(val: unknown): val is string {
  if (!isString(val))
    return false
  try {
    JSON.parse(val)
    return true
  }
  catch (_) {
    return false
  }
}

/** @description: 是否为 Base64 字符串 */
export function isBase64(val: unknown): val is string {
  if (!isString(val))
    return false
  try {
    return btoa(atob(val)) === val
  }
  catch (_) {
    return false
  }
}
