import './assets/main.css'
import "@authing/guard-vue3/dist/esm/guard.min.css";

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import userAnthing from '@/authingConfig'
import App from './App.vue'
import router from './router'

const app = createApp(App)
userAnthing(app)
app.use(createPinia())
app.use(router)
app.mount('#app')
