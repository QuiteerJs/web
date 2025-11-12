import naive from 'naive-ui'
import { createApp } from 'vue'
import App from './App.vue'
import '@quiteer/naive-extra/index.css'

const app = createApp(App)

app.use(naive)

app.mount('#app')
