import { defineConfig } from '@unocss/vite'

import QuiteerPreset from './preset/default'
import NaiveUIPreset from './preset/naive-ui'

export default defineConfig({
  presets: [
    QuiteerPreset(),
    NaiveUIPreset()
  ]
})
