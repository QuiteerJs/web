import Directives from '@quiteer/directives'
import { createPinia } from 'pinia'

import { createApp } from 'vue'
import App from './App.vue'

import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.use(Directives, {
  permission: []
})

app.mount('#app')
