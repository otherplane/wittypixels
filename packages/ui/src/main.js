import { createApp } from 'vue'
import { pinia } from './stores'
import App from './App.vue'
import router from './router'
import VueKonva from 'vue-konva'
import InfiniteLoading from 'v3-infinite-loading'

createApp(App)
  .component('InfiniteLoading', InfiniteLoading)
  .use(pinia)
  .use(VueKonva)
  .use(router)
  .mount('#app')
