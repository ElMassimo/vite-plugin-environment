import { resolve } from 'path'
import { defineConfig } from 'vite'
import EnvironmentPlugin from 'vite-plugin-environment'

export default defineConfig({
  build: {
    rolldownOptions: {
      input: [resolve(__dirname, './app.js')],
    },
  },
  plugins: [
    EnvironmentPlugin('all'),
  ],
})
