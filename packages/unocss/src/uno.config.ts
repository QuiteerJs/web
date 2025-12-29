import { defineConfig } from 'unocss'
import QuiteerPreset from './preset'

export { defineConfig }

export const unoConfig = defineConfig({
  presets: [
    QuiteerPreset()
  ]
})
