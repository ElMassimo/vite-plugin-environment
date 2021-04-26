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
    EnvironmentPlugin({
      APP_VERSION: 'v2',
      APP_RELEASE: null,
      API_KEY: undefined,
    }),
  ],
})
