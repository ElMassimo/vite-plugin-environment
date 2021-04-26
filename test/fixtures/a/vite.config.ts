import { resolve } from 'path'
import { defineConfig } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'

export default defineConfig({
  build: {
    rollupOptions: {
      input: [resolve(__dirname, './app.js')],
    },
  },
  plugins: [
    EnvironmentPlugin(['API_KEY', 'APP_VERSION']),
  ],
})
