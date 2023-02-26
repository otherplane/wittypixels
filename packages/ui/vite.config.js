import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import Components from 'unplugin-vue-components/vite'
import { fileURLToPath, URL } from 'url'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    emptyOutDir: true,
    minify: false,
  },
  plugins: [vue(), Components()],
  test: {
    minThreads: 0,
    maxThreads: 1,
  },
  css: {
    preprocessorOptions: {
      scss: {
        // and local and vuetify variables globally
        additionalData: `
              @import '@/assets/style/main.scss';
              @import '@/assets/style/index.scss';
            `,
      },
      sass: {
        // override vuetify variables by local variables
        additionalData: `
              @import '@/assets/style/main.scss';
              @import '@/assets/style/index.scss';
            `,
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
