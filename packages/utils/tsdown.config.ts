import { defineConfig } from 'tsdown'

export default defineConfig({
  name: '@quiteer/utils',
  entry: ['src/index.ts'],
  platform: 'node',
  clean: true,
  dts: true,
  sourcemap: false,
  minify: false
})
