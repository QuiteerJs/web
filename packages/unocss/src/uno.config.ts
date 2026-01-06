import { defineConfig } from '@unocss/vite'

import QuiteerPreset from './perset/default'
import NaiveUIPreset from './perset/naive-ui'

export default defineConfig({
  presets: [
    QuiteerPreset(),
    NaiveUIPreset()
  ]
})
