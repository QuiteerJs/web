import UnoCSS, { defineConfig } from '@unocss/vite'

import QuiteerPreset from './preset/default'
import NaiveUIPreset from './preset/naive-ui'

export default () => {
  return UnoCSS()
}

export {
  defineConfig,
  NaiveUIPreset,
  QuiteerPreset
}
