import { defineConfig } from 'tsdown'

export default defineConfig({
  name: '@quiteer/directives',
  entry: ['index.ts'],
  dts: true,
  outDir: 'dist',
  clean: true,
  minify: true,
  treeshake: true,
  external: ['vue']
})
