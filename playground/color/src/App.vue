<script setup lang="ts">
import { generateColorScale } from '@quiteer/color'
import { computed, ref } from 'vue'

const baseColor = ref('#18a058')

const scale = computed(() => {
  try {
    return generateColorScale(baseColor.value)
  }
  catch (_e) {
    return null
  }
})

const scaleKeys = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const

/**
 * 判断颜色是否为深色，用于决定文字显示白色还是黑色
 *
 * @param hex - 十六进制颜色值
 * @returns 是否为深色
 */
function isDark(hex: string) {
  const r = Number.parseInt(hex.slice(1, 3), 16)
  const g = Number.parseInt(hex.slice(3, 5), 16)
  const b = Number.parseInt(hex.slice(5, 7), 16)
  const brightness = (r * 299 + g * 587 + b * 114) / 1000
  return brightness < 128
}
</script>

<template>
  <div class="p-8 font-sans">
    <h1 class="text-2xl font-bold mb-8">
      Color Scale Generator
    </h1>

    <div class="mb-12 flex items-center gap-4">
      <div class="flex flex-col gap-2">
        <label class="text-sm font-medium text-gray-700">Primary Color</label>
        <div class="flex items-center gap-3">
          <input
            v-model="baseColor"
            type="color"
            class="w-12 h-12 rounded cursor-pointer border-none p-0"
          >
          <input
            v-model="baseColor"
            type="text"
            class="px-3 py-2 border rounded-md text-sm uppercase font-mono w-32 focus:outline-none focus:ring-2 focus:ring-green-500"
            placeholder="#000000"
          >
        </div>
      </div>
    </div>

    <div v-if="scale" class="space-y-4">
      <h2 class="text-lg font-semibold text-gray-600">
        Avocado Palette
      </h2>
      <div class="flex flex-wrap gap-2">
        <div
          v-for="key in scaleKeys"
          :key="key"
          class="flex flex-col items-center gap-1"
        >
          <div
            :style="{ backgroundColor: scale[key] }"
            class="w-24 h-24 rounded-lg shadow-sm flex flex-col items-center justify-center p-2 transition-all duration-200"
            :class="[isDark(scale[key]) ? 'text-white' : 'text-gray-800']"
          >
            <span class="text-xs font-bold">{{ key }}</span>
            <span class="text-[10px] uppercase font-mono">{{ scale[key] }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-red-500">
      Invalid color value. Please enter a valid hex color.
    </div>
  </div>
</template>

<style>
body {
  margin: 0;
  background-color: #f9fafb;
}
</style>
