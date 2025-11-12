// 是否是JSON
export function isJSON(val: unknown): val is string {
  try {
    JSON.parse(val as string)
    return true
  }
  catch (_) {
    return false
  }
}
