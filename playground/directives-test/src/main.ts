import type { Directive } from 'vue'
import Directives from '@quiteer/directives'
import { createApp } from 'vue'
import App from './App.vue'

export type HighlightDirective = Directive<HTMLElement, string, 'test'>

declare module 'vue' {
  export interface ComponentCustomProperties {
    // 使用 v 作为前缀 (v-highlight)
    vHighlight: HighlightDirective
  }
}

const highlight = {
  mounted: (el, binding) => {
    el.style.backgroundColor = binding.value
  }
} satisfies HighlightDirective

const app = createApp(App)
app.directive('highlight', highlight)

app.use(Directives).mount('#app')
