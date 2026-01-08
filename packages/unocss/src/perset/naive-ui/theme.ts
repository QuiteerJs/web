import type { PresetUnoTheme, Rule } from 'unocss'
import { createColorScale, toCssVarValue } from './vars'

/**
 * 获取 Naive UI 基础主题配置
 *
 * 基于 Naive UI 的 common 变量生成 UnoCSS 主题配置。
 *
 * @returns 包含主题 (theme) 和规则 (rules) 的配置对象
 */
export function getNaiveTheme(): { theme: PresetUnoTheme, rules: Rule[] } {
  return {
    theme: {
      // 颜色
      colors: {
        primary: createColorScale('primary'),
        info: createColorScale('info'),
        success: createColorScale('success'),
        warning: createColorScale('warning'),
        error: createColorScale('error'),

        // 其他通用色
        base: toCssVarValue('baseColor'),
        text: {
          base: toCssVarValue('textColorBase'),
          1: toCssVarValue('textColor1'),
          2: toCssVarValue('textColor2'),
          3: toCssVarValue('textColor3'),
          disabled: toCssVarValue('textColorDisabled'),
          placeholder: toCssVarValue('placeholderColor'),
          placeholderDisabled: toCssVarValue('placeholderColorDisabled')
        },
        icon: {
          DEFAULT: toCssVarValue('iconColor'),
          hover: toCssVarValue('iconColorHover'),
          pressed: toCssVarValue('iconColorPressed'),
          disabled: toCssVarValue('iconColorDisabled')
        },
        close: {
          icon: toCssVarValue('closeIconColor'),
          iconHover: toCssVarValue('closeIconColorHover'),
          iconPressed: toCssVarValue('closeIconColorPressed'),
          hover: toCssVarValue('closeColorHover'),
          pressed: toCssVarValue('closeColorPressed')
        },
        clear: {
          DEFAULT: toCssVarValue('clearColor'),
          hover: toCssVarValue('clearColorHover'),
          pressed: toCssVarValue('clearColorPressed')
        },
        scrollbar: {
          DEFAULT: toCssVarValue('scrollbarColor'),
          hover: toCssVarValue('scrollbarColorHover')
        },
        progress: {
          rail: toCssVarValue('progressRailColor')
        },
        rail: toCssVarValue('railColor'),
        border: toCssVarValue('borderColor'),
        divider: toCssVarValue('dividerColor'),
        card: toCssVarValue('cardColor'),
        modal: toCssVarValue('modalColor'),
        body: toCssVarValue('bodyColor'),
        popover: toCssVarValue('popoverColor'),
        hover: toCssVarValue('hoverColor'),
        pressed: toCssVarValue('pressedColor'),
        table: {
          DEFAULT: toCssVarValue('tableColor'),
          hover: toCssVarValue('tableColorHover'),
          striped: toCssVarValue('tableColorStriped'),
          header: toCssVarValue('tableHeaderColor')
        },
        tag: toCssVarValue('tagColor'),
        avatar: toCssVarValue('avatarColor'),
        inverted: toCssVarValue('invertedColor'),
        input: {
          DEFAULT: toCssVarValue('inputColor'),
          disabled: toCssVarValue('inputColorDisabled')
        },
        code: toCssVarValue('codeColor'),
        tab: toCssVarValue('tabColor'),
        action: toCssVarValue('actionColor'),
        opacity: {
          1: toCssVarValue('opacity1'),
          2: toCssVarValue('opacity2'),
          3: toCssVarValue('opacity3'),
          4: toCssVarValue('opacity4'),
          5: toCssVarValue('opacity5'),
          disabled: toCssVarValue('opacityDisabled')
        }
      },
      // 字体族
      fontFamily: {
        sans: toCssVarValue('fontFamily'),
        mono: toCssVarValue('fontFamilyMono')
      },

      // 字重
      fontWeight: {
        normal: toCssVarValue('fontWeight'),
        strong: toCssVarValue('fontWeightStrong'),
        DEFAULT: toCssVarValue('fontWeight')
      },

      // 圆角
      borderRadius: {
        DEFAULT: toCssVarValue('borderRadius'),
        sm: toCssVarValue('borderRadiusSmall'),
        scrollbar: toCssVarValue('scrollbarBorderRadius')
      },

      // 字号
      fontSize: {
        'mini': toCssVarValue('fontSizeMini'),
        'tiny': toCssVarValue('fontSizeTiny'),
        'small': toCssVarValue('fontSizeSmall'),
        'n-base': toCssVarValue('fontSize'),
        'medium': toCssVarValue('fontSizeMedium'),
        'large': toCssVarValue('fontSizeLarge'),
        'huge': toCssVarValue('fontSizeHuge')
      },

      // 行高
      lineHeight: {
        normal: toCssVarValue('lineHeight'),
        DEFAULT: toCssVarValue('lineHeight')
      },

      // 间距/高度
      height: {
        mini: toCssVarValue('heightMini'),
        tiny: toCssVarValue('heightTiny'),
        sm: toCssVarValue('heightSmall'),
        md: toCssVarValue('heightMedium'),
        lg: toCssVarValue('heightLarge'),
        xl: toCssVarValue('heightHuge'),
        scrollbar: toCssVarValue('scrollbarHeight')
      },

      // 宽度
      width: {
        scrollbar: toCssVarValue('scrollbarWidth')
      },

      // 阴影
      boxShadow: {
        1: toCssVarValue('boxShadow1'),
        2: toCssVarValue('boxShadow2'),
        3: toCssVarValue('boxShadow3')
      }
    },
    rules: [
      // 缓动函数
      ['ease-naive-in-out', { 'transition-timing-function': toCssVarValue('cubicBezierEaseInOut') }],
      ['ease-naive-out', { 'transition-timing-function': toCssVarValue('cubicBezierEaseOut') }],
      ['ease-naive-in', { 'transition-timing-function': toCssVarValue('cubicBezierEaseIn') }],

      // 阴影
      ['shadow-1', { 'box-shadow': toCssVarValue('boxShadow1') }],
      ['shadow-2', { 'box-shadow': toCssVarValue('boxShadow2') }],
      ['shadow-3', { 'box-shadow': toCssVarValue('boxShadow3') }],

      // 字体
      ['font-sans', { 'font-family': toCssVarValue('fontFamily') }],
      ['font-mono', { 'font-family': toCssVarValue('fontFamilyMono') }],

      ['font-normal', { 'font-weight': toCssVarValue('fontWeight') }],
      ['font-bold', { 'font-weight': toCssVarValue('fontWeightStrong') }],
      ['font-strong', { 'font-weight': toCssVarValue('fontWeightStrong') }],

      // 字体大小
      ['text-n-base', { 'font-size': toCssVarValue('fontSize') }],
      ['text-mini', { 'font-size': toCssVarValue('fontSizeMini') }],
      ['text-tiny', { 'font-size': toCssVarValue('fontSizeTiny') }],
      ['text-small', { 'font-size': toCssVarValue('fontSizeSmall') }],
      ['text-medium', { 'font-size': toCssVarValue('fontSizeMedium') }],
      ['text-large', { 'font-size': toCssVarValue('fontSizeLarge') }],
      ['text-huge', { 'font-size': toCssVarValue('fontSizeHuge') }],

      // 圆角
      ['b-radius', { 'border-radius': toCssVarValue('borderRadius') }],
      ['b-radius-sm', { 'border-radius': toCssVarValue('borderRadiusSmall') }],

      // 高度
      ['h-mini', { height: toCssVarValue('heightMini') }],
      ['h-tiny', { height: toCssVarValue('heightTiny') }],
      ['h-sm', { height: toCssVarValue('heightSmall') }],
      ['h-md', { height: toCssVarValue('heightMedium') }],
      ['h-lg', { height: toCssVarValue('heightLarge') }],
      ['h-xl', { height: toCssVarValue('heightHuge') }],
      ['h-huge', { height: toCssVarValue('heightHuge') }],

      // 滚动条
      ['scrollbar-w', { width: toCssVarValue('scrollbarWidth') }],
      ['scrollbar-h', { height: toCssVarValue('scrollbarHeight') }],
      ['scrollbar-rounded', { 'border-radius': toCssVarValue('scrollbarBorderRadius') }],

      // 按钮禁用状态
      ['opacity-disabled', { opacity: toCssVarValue('opacityDisabled') }]
    ]
  }
}
