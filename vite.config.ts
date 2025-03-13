import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'
import transformJsonPlugin from './data'

export default defineConfig({
  base: "/mh-app/",
  plugins: [
    vue(),
    tailwindcss(),
    transformJsonPlugin(),
  ],
})
