import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    name: '@quiteer/unocss',
    entry: ['src/index.ts'],
    dts: true,
    outDir: 'dist',
    clean: true,
    minify: false,
    treeshake: true
  },
  {
    entry: {
      provide: 'src/provide/index.ts'
    },
    outDir: 'dist',
    dts: true,
    minify: false,
    treeshake: true
  },
  {
    entry: {
      cli: 'src/cli.ts'
    },
    platform: 'node',
    outDir: 'dist',
    dts: false,
    minify: false,
    treeshake: true
  }
])
