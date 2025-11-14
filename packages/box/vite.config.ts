import { resolve } from 'node:path'
import UnoCSS from '@unocss/vite'
import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

/**
 * 函数：创建 Vite 构建配置（库模式）
 * 作用：产出 ES 模块与类型声明，集成 UnoCSS 与图标插件
 */
export default defineConfig({
  plugins: [
    vue(),
    UnoCSS(),
    dts({
      entryRoot: 'src',
      outDir: 'dist',
      staticImport: true,
      pathsToAliases: true,
      rollupTypes: false,
      include: ['src', 'global.d.ts'],
      exclude: ['node_modules', '**/*.test.ts', '**/*.spec.ts'],
      compilerOptions: { skipLibCheck: true }
    })
  ],
  build: {
    emptyOutDir: true,
    lib: {
      entry: resolve(__dirname, 'src', 'index.ts'),
      name: 'Box',
      formats: ['es']
    },
    minify: false,
    cssCodeSplit: true,
    rollupOptions: {
      external: [
        'vue',
        'vuedraggable',
        /^vue(\/.*)?$/
      ],
      output: { preserveModules: false }
    },
    reportCompressedSize: false,
    commonjsOptions: { ignoreTryCatch: false }
  }
})
