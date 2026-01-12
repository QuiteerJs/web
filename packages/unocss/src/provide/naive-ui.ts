import { generateColorScale } from '@quiteer/color'
import { commonLight, lightTheme } from 'naive-ui'
import { camelToKebab, toCssVarName } from '../preset/naive-ui/vars'

/**
 * 内部状态管理：记录所有注入的 CSS 变量及其引用计数
 * 结构: Map<Selector, Map<VarName, { value: string, count: number }>>
 */
const activeStyleState = new Map<string, Map<string, { value: string, count: number }>>()
const STYLE_ID = 'quiteer-naive-ui-vars'

/**
 * 更新样式标签内容
 */
function updateStyleElement() {
  if (typeof document === 'undefined')
    return

  let css = ''
  for (const [selector, vars] of activeStyleState.entries()) {
    if (vars.size === 0)
      continue
    css += `${selector} {\n`
    for (const [key, { value }] of vars.entries()) {
      css += `  ${key}: ${value};\n`
    }
    css += '}\n'
  }

  let style = document.getElementById(STYLE_ID) as HTMLStyleElement
  if (!style) {
    style = document.createElement('style')
    style.id = STYLE_ID
    document.head.appendChild(style)
  }

  if (!css) {
    if (style.parentNode)
      style.parentNode.removeChild(style)
  }
  else {
    style.innerHTML = css
  }
}

/**
 * 注册变量并更新 DOM
 */
function registerVars(selector: string, vars: Record<string, string>) {
  let selectorMap = activeStyleState.get(selector)
  if (!selectorMap) {
    selectorMap = new Map()
    activeStyleState.set(selector, selectorMap)
  }

  const keys = Object.keys(vars)
  keys.forEach((key) => {
    const val = vars[key]
    const state = selectorMap!.get(key)
    if (state) {
      state.count++
      // 如果值发生变化，更新为新值（以最新注入的为准）
      if (state.value !== val)
        state.value = val
    }
    else {
      selectorMap!.set(key, { value: val, count: 1 })
    }
  })

  updateStyleElement()

  return () => {
    keys.forEach((key) => {
      const state = selectorMap!.get(key)
      if (state) {
        state.count--
        if (state.count <= 0)
          selectorMap!.delete(key)
      }
    })
    if (selectorMap!.size === 0)
      activeStyleState.delete(selector)

    updateStyleElement()
  }
}

/**
 * 注入配置选项接口
 */
export interface ProvideNaiveThemeOptions {
  /** 注入的目标选择器，默认为 ':root' */
  selector?: string
  /** 需要额外注入变量的组件列表 */
  components?: (keyof typeof lightTheme)[]
  /** Naive UI 的 common 变量对象，默认为 commonLight */
  theme?: typeof commonLight
}

/**
 * 获取 Naive UI 的通用 CSS 变量映射
 *
 * 将 common 变量中的键转换为 --kebab-case 格式的 CSS 变量名。
 *
 * @param theme - Naive UI 的 common 变量对象
 * @returns CSS 变量名与值的映射对象
 *
 * @example
 * ```ts
 * const vars = getCommonCssVars()
 * // { '--primary-color': '#18a058', ... }
 * ```
 */
export function getCommonCssVars(theme = commonLight) {
  const vars: Record<string, string> = {}
  Object.entries(theme).forEach(([key, value]) => {
    vars[toCssVarName(key)] = value as string
  })
  return vars
}

/**
 * 获取颜色阶梯的 CSS 变量映射
 *
 * 为 primary, info, success, warning, error 生成 50-950 的颜色阶梯变量。
 *
 * @param theme - Naive UI 的 common 变量对象
 * @returns 颜色阶梯 CSS 变量映射
 *
 * @remarks
 * 使用 @quiteer/color 库生成标准的 50-950 色阶。
 */
export function getColorScaleCssVars(theme = commonLight) {
  const vars: Record<string, string> = {}
  const colorKeys = ['primary', 'info', 'success', 'warning', 'error'] as const

  colorKeys.forEach((key) => {
    const baseColor = theme[`${key}Color` as keyof typeof commonLight] as string
    if (baseColor) {
      try {
        const scale = generateColorScale(baseColor)
        // 1. 注入 50-950 色阶
        Object.entries(scale).forEach(([num, color]) => {
          // 只注入数字色阶，状态变量在后面统一注入
          if (!Number.isNaN(Number(num))) {
            vars[toCssVarName(num, key)] = color
          }
        })

        // 2. 注入状态变量 (覆盖 Naive UI 默认映射，并增加 active)
        const { DEFAULT: base, hover, pressed, active } = scale
        vars[toCssVarName(`${key}Color`)] = base
        vars[toCssVarName(`${key}ColorHover`)] = hover
        vars[toCssVarName(`${key}ColorPressed`)] = pressed
        vars[toCssVarName(`${key}ColorSuppl`)] = active
        vars[toCssVarName(`${key}ColorActive`)] = active
      }
      catch (e) {
        console.warn(`[provideNaiveTheme] Failed to generate color scale for ${key}:`, e)
      }
    }
  })

  return vars
}

/**
 * 获取指定 Naive UI 组件的 CSS 变量映射
 *
 * @param componentName - 组件名称
 * @param theme - Naive UI 的 common 变量对象
 * @returns 组件特有的 CSS 变量映射
 */
export function getComponentCssVars(componentName: keyof typeof lightTheme, theme = commonLight) {
  const componentTheme = lightTheme[componentName] as any
  const vars: Record<string, string> = {}
  if (componentTheme && componentTheme.self) {
    const selfVars = componentTheme.self(theme)
    const prefix = camelToKebab(componentName as string)
    Object.entries(selfVars).forEach(([key, value]) => {
      vars[toCssVarName(key, prefix)] = value as string
    })
  }
  return vars
}

/**
 * 生成 Naive UI CSS 变量的样式表内容
 *
 * @param options - 配置选项
 * @returns CSS 样式字符串
 */
export function generateNaiveCssVars(options: ProvideNaiveThemeOptions = {}) {
  const { selector = ':root', components = [], theme = commonLight } = options

  const commonVars = getCommonCssVars(theme)
  const colorScaleVars = getColorScaleCssVars(theme)

  let css = `${selector} {\n`

  // 1. 注入通用变量
  Object.entries(commonVars).forEach(([key, value]) => {
    css += `  ${key}: ${value};\n`
  })

  // 2. 注入颜色阶梯变量
  Object.entries(colorScaleVars).forEach(([key, value]) => {
    css += `  ${key}: ${value};\n`
  })

  // 3. 注入组件变量
  components.forEach((comp) => {
    const compVars = getComponentCssVars(comp, theme)
    Object.entries(compVars).forEach(([key, value]) => {
      css += `  ${key}: ${value};\n`
    })
  })

  css += '}\n'
  return css
}

/**
 * 注入 Naive UI CSS 变量到文档中
 *
 * 在浏览器环境下创建一个 <style> 标签并插入到 <head> 中。
 * 该函数支持增量更新，多次调用会合并变量，引用计数为 0 时自动移除。
 *
 * @param options - 配置选项
 * @returns 一个清理函数，执行后将减少引用计数，若计数归零则移除相应变量
 *
 * @example
 * ```ts
 * const cleanup = provideNaiveTheme({
 *   components: ['Button', 'Input']
 * })
 * // 在组件卸载时调用 cleanup()
 * ```
 */
export function provideNaiveTheme(options: ProvideNaiveThemeOptions = {}) {
  if (typeof document === 'undefined') {
    return () => {}
  }

  const { selector = ':root', components = [], theme = commonLight } = options
  const vars: Record<string, string> = {}

  // 1. 注入通用变量
  Object.assign(vars, getCommonCssVars(theme))

  // 2. 注入颜色阶梯变量
  Object.assign(vars, getColorScaleCssVars(theme))

  // 3. 注入组件变量
  components.forEach((comp) => {
    Object.assign(vars, getComponentCssVars(comp, theme))
  })

  return registerVars(selector, vars)
}

/**
 * 初始化 Naive UI 通用样式变量
 *
 * 这是一个辅助函数，用于在应用启动时一次性注入基础样式（common 和 color scale）。
 * 内部调用 provideNaiveTheme，但语义上用于全局初始化。
 *
 * @param theme - Naive UI 的 common 变量对象
 * @returns 清理函数
 *
 * @example
 * ```ts
 * // 在 main.ts 中
 * initNaiveTheme()
 * ```
 */
export function initNaiveTheme(theme = commonLight) {
  return provideNaiveTheme({ theme, components: [] })
}
