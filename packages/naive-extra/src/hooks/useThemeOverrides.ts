import { lightTheme } from 'naive-ui'
import { ref } from 'vue'

/**
 * 获取 Naive UI 特定组件的主题覆盖配置
 * 核心价值在于提供完整的 TypeScript 类型提示，方便用户在业务代码中访问或动态计算样式。
 *
 */
export function useThemeOverrides(
  componentName: keyof typeof lightTheme
) {
  const theme = lightTheme

  const overrides = ref(theme[componentName])

  return overrides
}
