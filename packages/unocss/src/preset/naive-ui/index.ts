import type { Preset } from 'unocss'
import { getNaiveTheme } from './theme'

/**
 * Naive UI 专用 UnoCSS 预设
 *
 * 该预设集成了 Naive UI 的通用主题变量映射（theme）和专用规则（rules）。
 * 通过将 Naive UI 的 Design Tokens 转换为 UnoCSS 可用的工具类，
 * 实现 UI 框架与原子化 CSS 的深度对齐。
 *
 * @returns UnoCSS 预设对象
 *
 * @example
 * ```ts
 * // uno.config.ts
 * import { NaiveUIPreset } from '@quiteer/unocss'
 * export default defineConfig({
 *   presets: [
 *     NaiveUIPreset()
 *   ]
 * })
 * ```
 *
 * @remarks
 * - 基于 Naive UI common 变量动态生成
 * - 自动处理 camelCase 到 kebab-case 的转换
 */
export function NaiveUIPreset(): Preset<any> {
  const { theme, rules: componentRules } = getNaiveTheme()

  return {
    name: 'quiteer-preset-naive-ui',
    theme,
    rules: componentRules
  }
}

export default NaiveUIPreset
