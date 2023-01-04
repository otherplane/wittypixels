import { createPinia } from 'pinia'

export function myPiniaPlugin(context) {
  context.pinia // the pinia created with `createPinia()`
  context.app // the current app created with `createApp()` (Vue 3 only)
  context.store // the store the plugin is augmenting
  context.options // the options object defining the store passed to `defineStore()`
  // ...
  return { app: context.app }
}

export const pinia = createPinia()

pinia.use(myPiniaPlugin)
