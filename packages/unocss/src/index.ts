import type { PluginOption } from 'vite'
import UnoCSS from '@unocss/vite'
import { unoConfig } from './uno.config'

function use(): PluginOption {
  return UnoCSS(unoConfig)
}

export default use
