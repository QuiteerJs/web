<script setup lang="ts">
definePage({
  meta: { title: 'unocss 与 Naive UI 主题', icon: 'pixel:themes-solid', order: 20 }
})

// 1. 品牌色阶梯 (静态列出以支持 UnoCSS 扫描)
const themeColors = [
  {
    name: 'primary',
    scales: ['bg-primary-50', 'bg-primary-100', 'bg-primary-200', 'bg-primary-300', 'bg-primary-400', 'bg-primary-500', 'bg-primary-600', 'bg-primary-700', 'bg-primary-800', 'bg-primary-900', 'bg-primary-950'],
    states: [
      { bg: 'bg-primary', text: 'text-primary' },
      { bg: 'bg-primary-hover', text: 'text-primary-hover' },
      { bg: 'bg-primary-pressed', text: 'text-primary-pressed' },
      { bg: 'bg-primary-suppl', text: 'text-primary-suppl' },
      { bg: 'bg-primary-active', text: 'text-primary-active' }
    ]
  },
  {
    name: 'info',
    scales: ['bg-info-50', 'bg-info-100', 'bg-info-200', 'bg-info-300', 'bg-info-400', 'bg-info-500', 'bg-info-600', 'bg-info-700', 'bg-info-800', 'bg-info-900', 'bg-info-950'],
    states: [
      { bg: 'bg-info', text: 'text-info' },
      { bg: 'bg-info-hover', text: 'text-info-hover' },
      { bg: 'bg-info-pressed', text: 'text-info-pressed' },
      { bg: 'bg-info-suppl', text: 'text-info-suppl' },
      { bg: 'bg-info-active', text: 'text-info-active' }
    ]
  },
  {
    name: 'success',
    scales: ['bg-success-50', 'bg-success-100', 'bg-success-200', 'bg-success-300', 'bg-success-400', 'bg-success-500', 'bg-success-600', 'bg-success-700', 'bg-success-800', 'bg-success-900', 'bg-success-950'],
    states: [
      { bg: 'bg-success', text: 'text-success' },
      { bg: 'bg-success-hover', text: 'text-success-hover' },
      { bg: 'bg-success-pressed', text: 'text-success-pressed' },
      { bg: 'bg-success-suppl', text: 'text-success-suppl' },
      { bg: 'bg-success-active', text: 'text-success-active' }
    ]
  },
  {
    name: 'warning',
    scales: ['bg-warning-50', 'bg-warning-100', 'bg-warning-200', 'bg-warning-300', 'bg-warning-400', 'bg-warning-500', 'bg-warning-600', 'bg-warning-700', 'bg-warning-800', 'bg-warning-900', 'bg-warning-950'],
    states: [
      { bg: 'bg-warning', text: 'text-warning' },
      { bg: 'bg-warning-hover', text: 'text-warning-hover' },
      { bg: 'bg-warning-pressed', text: 'text-warning-pressed' },
      { bg: 'bg-warning-suppl', text: 'text-warning-suppl' },
      { bg: 'bg-warning-active', text: 'text-warning-active' }
    ]
  },
  {
    name: 'error',
    scales: ['bg-error-50', 'bg-error-100', 'bg-error-200', 'bg-error-300', 'bg-error-400', 'bg-error-500', 'bg-error-600', 'bg-error-700', 'bg-error-800', 'bg-error-900', 'bg-error-950'],
    states: [
      { bg: 'bg-error', text: 'text-error' },
      { bg: 'bg-error-hover', text: 'text-error-hover' },
      { bg: 'bg-error-pressed', text: 'text-error-pressed' },
      { bg: 'bg-error-suppl', text: 'text-error-suppl' },
      { bg: 'bg-error-active', text: 'text-error-active' }
    ]
  }
]

// 2. 文本颜色
const textColors = [
  'text-text-1',
  'text-text-2',
  'text-text-3',
  'text-text-base',
  'text-text-disabled',
  'text-text-placeholder',
  'text-icon',
  'text-icon-hover',
  'text-icon-pressed',
  'text-icon-disabled'
]

// 3. 背景颜色
const bgColors = [
  'bg-base',
  'bg-card',
  'bg-modal',
  'bg-body',
  'bg-popover',
  'bg-hover',
  'bg-pressed',
  'bg-table',
  'bg-table-header',
  'bg-input',
  'bg-code',
  'bg-tag',
  'bg-avatar',
  'bg-inverted',
  'bg-action'
]

// 4. 边框和分割线
const borderColors = [
  'border-border',
  'border-divider',
  'border-scrollbar'
]

// 5. 阴影
const shadows = [
  'shadow-1',
  'shadow-2',
  'shadow-3'
]

// 6. 字体大小
const fontSizes = [
  'text-n-base',
  'text-mini',
  'text-tiny',
  'text-small',
  'text-medium',
  'text-large',
  'text-huge'
]

// 7. 高度与间距
const heights = [
  'h-mini',
  'h-tiny',
  'h-sm',
  'h-md',
  'h-lg',
  'h-xl',
  'h-huge'
]

// 8. 圆角
const rounded = [
  'b-radius',
  'b-radius-sm'
]

// 9. 透明度
const opacities = [
  'opacity-1',
  'opacity-2',
  'opacity-3',
  'opacity-4',
  'opacity-5',
  'opacity-disabled'
]
// 10. 缓动函数
const easings = [
  'ease-naive-in-out',
  'ease-naive-out',
  'ease-naive-in'
]
</script>

<template>
  <NFlex vertical size="large">
    <NCard title="UnoCSS 与 Naive UI 主题集成示例">
      <NFlex vertical size="large">
        <!-- 品牌色阶梯 -->
        <div v-for="color in themeColors" :key="color.name">
          <n-divider title-placement="left">
            {{ color.name }}
          </n-divider>
          <NFlex vertical>
            <div class="text-sm text-gray-400 mb-2">
              色阶 (50-950)
            </div>
            <NFlex>
              <div
                v-for="c in color.scales"
                :key="c"
                class="w-24 h-12 flex items-center justify-center text-xs rounded shadow-sm transition-transform hover:scale-105 cursor-pointer" :class="[c]"
                :title="c"
              >
                {{ c.split('-').pop() }}
              </div>
            </NFlex>

            <div class="text-sm text-gray-400 mt-4 mb-2">
              交互状态
            </div>
            <NFlex>
              <div
                v-for="s in color.states"
                :key="s.bg"
                class="px-4 py-2 rounded shadow-sm text-sm font-medium border border-transparent" :class="[s.bg]"
              >
                {{ s.bg }}
              </div>
            </NFlex>
          </NFlex>
        </div>

        <!-- 基础颜色 -->
        <n-divider title-placement="left">
          基础与组件颜色
        </n-divider>
        <NFlex vertical>
          <div class="text-sm text-gray-400 mb-2">
            背景色 (Backgrounds)
          </div>
          <NFlex>
            <div v-for="c in bgColors" :key="c" class="px-4 py-2 rounded border border-gray-200 shadow-sm text-sm" :class="[c]">
              {{ c }}
            </div>
          </NFlex>

          <div class="text-sm text-gray-400 mt-4 mb-2">
            文本色 (Texts)
          </div>
          <NFlex>
            <div v-for="c in textColors" :key="c" class="text-lg font-medium" :class="[c]">
              {{ c.split('-').pop() }}
            </div>
          </NFlex>

          <div class="text-sm text-gray-400 mt-4 mb-2">
            边框与分割线 (Borders)
          </div>
          <NFlex>
            <div v-for="c in borderColors" :key="c" class="px-4 py-2 border-2 rounded text-sm" :class="[c]">
              {{ c }}
            </div>
          </NFlex>
        </NFlex>

        <!-- 阴影 -->
        <n-divider title-placement="left">
          阴影 (Box Shadows)
        </n-divider>
        <NFlex>
          <div v-for="s in shadows" :key="s" class="w-32 h-20 bg-white flex items-center justify-center rounded border border-gray-100" :class="[s]">
            {{ s }}
          </div>
        </NFlex>

        <!-- 排版与尺寸 -->
        <n-divider title-placement="left">
          排版与尺寸 (Typography & Sizes)
        </n-divider>
        <NFlex vertical>
          <div class="text-sm text-gray-400 mb-2">
            字体大小 (Font Sizes)
          </div>
          <NFlex align="center">
            <div v-for="s in fontSizes" :key="s" :class="[s]">
              {{ s.split('-').pop() }}
            </div>
          </NFlex>

          <div class="text-sm text-gray-400 mt-4 mb-2">
            高度 (Heights)
          </div>
          <NFlex align="end">
            <div v-for="h in heights" :key="h" class="w-16 bg-primary/20 flex items-center justify-center rounded text-xs" :class="[h]">
              {{ h.split('-').pop() }}
            </div>
          </NFlex>

          <div class="text-sm text-gray-400 mt-4 mb-2">
            圆角 (Border Radius)
          </div>
          <NFlex>
            <div v-for="r in rounded" :key="r" class="w-20 h-20 bg-gray-100 border border-gray-300 flex items-center justify-center text-xs" :class="[r]">
              {{ r }}
            </div>
          </NFlex>

          <div class="text-sm text-gray-400 mt-4 mb-2">
            透明度 (Opacities)
          </div>
          <NFlex>
            <div v-for="o in opacities" :key="o" class="w-20 h-20 bg-primary flex items-center justify-center text-xs text-white rounded" :class="[o]">
              {{ o }}
            </div>
          </NFlex>

          <div class="text-sm text-gray-400 mt-4 mb-2">
            缓动函数 (Easings - Hover to test)
          </div>
          <NFlex>
            <div
              v-for="e in easings"
              :key="e"
              class="w-40 h-10 bg-primary/10 border border-primary/20 flex items-center justify-center text-xs rounded transition-all duration-500 hover:translate-x-10"
              :class="[e]"
            >
              {{ e }}
            </div>
          </NFlex>
        </NFlex>
      </NFlex>
    </NCard>
  </NFlex>
</template>

<style lang="scss" scoped>
// 确保文字在深色背景下可见
.bg-primary-600, .bg-primary-700, .bg-primary-800, .bg-primary-900, .bg-primary-950,
.bg-info-600, .bg-info-700, .bg-info-800, .bg-info-900, .bg-info-950,
.bg-success-600, .bg-success-700, .bg-success-800, .bg-success-900, .bg-success-950,
.bg-warning-600, .bg-warning-700, .bg-warning-800, .bg-warning-900, .bg-warning-950,
.bg-error-600, .bg-error-700, .bg-error-800, .bg-error-900, .bg-error-950,
.bg-primary, .bg-info, .bg-success, .bg-warning, .bg-error,
.bg-primary-pressed, .bg-info-pressed, .bg-success-pressed, .bg-warning-pressed, .bg-error-pressed {
  color: #fff;
}

// hover 状态通常也是深色
.bg-primary-hover, .bg-info-hover, .bg-success-hover, .bg-warning-hover, .bg-error-hover {
  color: #fff;
}
</style>
