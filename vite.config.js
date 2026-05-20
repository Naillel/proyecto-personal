import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/proyecto-personal/',   // ← nombre exacto de tu repo
})