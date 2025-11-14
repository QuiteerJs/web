/**
 * 函数：格式化时间戳
 * 作用：返回 YYYY-MM-DD HH:mm:ss 格式的时间字符串
 */
export function formatTimestamp(d: Date): string {
  const pad = (n: number) => n.toString().padStart(2, '0')
  const y = d.getFullYear()
  const m = pad(d.getMonth() + 1)
  const day = pad(d.getDate())
  const h = pad(d.getHours())
  const min = pad(d.getMinutes())
  const s = pad(d.getSeconds())
  return `${y}-${m}-${day} ${h}:${min}:${s}`
}
