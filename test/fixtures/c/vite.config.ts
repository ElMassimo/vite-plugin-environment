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
    EnvironmentPlugin('all', { prefix: 'VUE_APP', defineOn: 'import.meta.env' }),
    EnvironmentPlugin({ API_KEY: undefined }),
  ],
})
