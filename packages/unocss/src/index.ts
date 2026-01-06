import UnoCSS, { defineConfig } from '@unocss/vite'

import QuiteerPreset from './perset/default'
import NaiveUIPreset from './perset/naive-ui'

export default () => {
  return UnoCSS()
}

export {
  defineConfig,
  NaiveUIPreset,
  QuiteerPreset
}
