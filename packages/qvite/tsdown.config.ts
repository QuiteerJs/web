import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    name: 'qvite-api',
    outDir: 'dist',
    entry: ['index.ts'],
    platform: 'node',
    minify: false,
    dts: true,
    external: ['fsevents']
  },
  {
    name: 'qvite-cli',
    outDir: 'dist/bin',
    platform: 'node',
    dts: false,
    minify: false,
    entry: { qvite: 'cli.ts' },
    external: ['fsevents']
  }
])
