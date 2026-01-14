import type { VitePluginConfig } from '@unocss/vite'
import { defineConfig, NaiveUIPreset, QuiteerPreset } from '@quiteer/unocss'

export default (userConfig: VitePluginConfig) => {
  return defineConfig({
    content: {
      pipeline: {
        exclude: ['node_modules', 'dist']
      }
    },
    presets: [
      QuiteerPreset(),
      NaiveUIPreset()
    ],
    ...userConfig
  })
}
