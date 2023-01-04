import { createApp } from 'vue'
import { pinia } from './stores'
import App from './App.vue'
import './index.css'
import './main.scss'
import router from './router'

createApp(App).use(pinia).use(router).mount('#app')
