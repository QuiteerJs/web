/** @description: 是否为 JSON 字符串 */
export function isJSON(val: unknown): val is string {
  try {
    JSON.parse(val as string)
    return true
  }
  catch (_) {
    return false
  }
}
