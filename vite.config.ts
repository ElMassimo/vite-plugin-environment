import { defineConfig } from 'vite-plus'

export default defineConfig({
  pack: {
    entry: ['src/index.ts'],
    dts: true,
    clean: true,
  },
  staged: {
    '*.{js,ts}': 'vp check --fix',
  },
})
