/**
 * 函数：首字母大写
 * 作用：将字符串首字符转为大写
 */
export function capitalize(input: string): string {
  if (!input)
    return ''
  return input.charAt(0).toUpperCase() + input.slice(1)
}

/**
 * 函数：转为 kebab-case
 * 作用：将驼峰或空格分隔字符串转为短横线分隔
 */
export function kebabCase(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/\s+/g, '-')
    .toLowerCase()
}

/**
 * 函数：转为 snake_case
 * 作用：将驼峰或空格分隔字符串转为下划线分隔
 */
export function snakeCase(input: string): string {
  return input
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .replace(/\s+/g, '_')
    .toLowerCase()
}

/**
 * 函数：去除首尾空白
 * 作用：安全地移除字符串首尾空白字符
 */
export function trim(input: string): string {
  return input.trim()
}

/**
 * 函数：截断字符串
 * 作用：超出长度时以省略号结尾
 */
export function truncate(input: string, maxLength: number, suffix = '...'): string {
  if (input.length <= maxLength)
    return input
  return input.slice(0, Math.max(0, maxLength - suffix.length)) + suffix
}

/**
 * 函数：判断是否为字符串
 * 作用：返回布尔值表示传入参数是否为字符串类型
 */
export function isString(value: unknown): value is string {
  return typeof value === 'string'
}
