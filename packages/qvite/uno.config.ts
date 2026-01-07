import { defineConfig, NaiveUIPreset, QuiteerPreset } from '@quiteer/unocss'

export default defineConfig({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist']
    }
  },
  presets: [
    QuiteerPreset(),
    NaiveUIPreset()
  ]
})
