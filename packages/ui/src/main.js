import { createApp } from 'vue'
import { pinia } from './stores'
import App from './App.vue'
import router from './router'
import VueKonva from 'vue-konva'
import InfiniteLoading from 'v3-infinite-loading'
import Vue3TouchEvents from 'vue3-touch-events'

createApp(App)
  .component('InfiniteLoading', InfiniteLoading)
  .use(pinia)
  .use(VueKonva)
  .use(Vue3TouchEvents)
  .use(router)
  .mount('#app')
